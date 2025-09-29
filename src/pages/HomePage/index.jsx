"use client";
import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import {
  useGetNewsFeedQuery,
  useMarkSeenMutation,
  useInteractMutation,
  useClearCacheMutation,
  newsfeedApi,
  useUpdateprioritiesMutation,
  useRefreshFeedMutation,
} from "@/features/newsfeedApi";

import Post from "@/components/main/Post/PostItem";
import PostCreation from "@/components/main/PostCreation";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import Sidebar from "@/components/main/LeftSidebar-Home/Sidebar";
import RightSideBar from "@/components/main/RightSidebar-Home/RightSideBar";
import SettingsDropdown from "@/components/main/RightSidebar-Home/SettingsDropdown";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { RootContext } from "@/app/ClientProviders";

const PAGE_SIZE_DEFAULT = 5;
const SEEN_FLUSH_MS = 1500; // sau 1.5s mới gửi markSeen
const STALE_TIME_MS = 2 * 60 * 1000; // TTL Redis 30 phút

function PostWithVisibility({ item, onLike, onVisible }) {
  const visRef = useVisibilityRef(item.id, onVisible);
  return (
    <div ref={visRef} key={item.id}>
      <Post data={item?.post} onLike={onLike} />
    </div>
  );
}

function useVisibilityRef(itemId, onVisible) {
  const nodeRef = useRef(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onVisible(itemId);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [itemId, onVisible]);
  return nodeRef;
}

export default function HomePage() {
  const { setIsLoading } = useContext(RootContext);
  const dispatch = useDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [pages, setPages] = useState([]);
  const pageSizeRef = useRef(PAGE_SIZE_DEFAULT);
  const loadingRef = useRef(false);
  const nextPageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const lastFetchTimeRef = useRef(0);

  const seenSetRef = useRef(new Set());
  const seenTimerRef = useRef(null);

  const [markSeen] = useMarkSeenMutation();
  const [interact] = useInteractMutation();
  const [clearCache] = useClearCacheMutation();

  const {
    data: firstData,
    isFetching: firstFetching,
    error: firstError,
    refetch: refetchPage0,
  } = useGetNewsFeedQuery({ page: 0, size: pageSizeRef.current });
  const [updatepriorities] = useUpdateprioritiesMutation();
  const [refreshFeed] = useRefreshFeedMutation();

  // Loading toàn trang lần đầu
  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    setIsLoading(firstFetching);
  }, [firstFetching, setIsLoading]);

  useEffect(() => {
    if (firstData) setIsLoading(false);
  }, [firstData, setIsLoading]);


  // Load trang đầu tiên
  useEffect(() => {
    if (firstData) {
      setPages((prev) => {
        const exists = prev.some((p) => p.page === firstData.page);
        const newPages = exists
          ? prev.map((p) => (p.page === firstData.page ? firstData : p))
          : [...prev, firstData].sort(
            (a, b) => parseInt(a.page ?? 0, 10) - parseInt(b.page ?? 0, 10)
          );
        nextPageRef.current =
          newPages.length > 0
            ? Math.max(...newPages.map((p) => parseInt(p.page ?? 0, 10))) + 1
            : 1;
        lastFetchTimeRef.current = Date.now();
        return newPages;
      });
    }
  }, [firstData]);

  useEffect(() => {
    if (firstError) {
      toast.error("Tải bảng tin thất bại. Nhấn để thử lại.", { duration: 6000 });
    }
  }, [firstError]);

  // Prefetch page
  const prefetchPage = useCallback(
    (page) => {
      dispatch(
        newsfeedApi.endpoints.getNewsFeed.initiate(
          { page, size: pageSizeRef.current },
          { forceRefetch: false }
        )
      );
    },
    [dispatch]
  );

  // Load page
  const loadPage = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    const currentPage = nextPageRef.current;
    nextPageRef.current += 1;
    try {
      const resultAction = await dispatch(
        newsfeedApi.endpoints.getNewsFeed.initiate(
          { page: currentPage, size: pageSizeRef.current },
          { forceRefetch: false }
        )
      );
      const payload = resultAction.data ?? resultAction.payload;
      if (!payload?.items || payload.items.length === 0) {
        hasMoreRef.current = false;
        return;
      }
      setPages((prev) => {
        const pageIndex = prev.findIndex((p) => p.page === payload.page);
        if (pageIndex === -1) {
          // loại bỏ trùng trong payload.items vs prev.flatItems
          const existingIds = new Set(prev.flatMap(p => p.items.map(i => i.id)));
          const uniqueItems = payload.items.filter(i => !existingIds.has(i.id));
          return [...prev, { ...payload, items: uniqueItems }].sort(
            (a, b) => (a.page ?? 0) - (b.page ?? 0)
          );
        } else {
          const oldItems = prev[pageIndex].items ?? [];
          // lọc trùng giữa oldItems + payload.items
          const oldIds = new Set(oldItems.map(i => i.id));
          const newItems = payload.items.filter(i => !oldIds.has(i.id));
          const mergedPage = { ...payload, items: [...oldItems, ...newItems] };
          const newPages = [...prev];
          newPages[pageIndex] = mergedPage;
          return newPages.sort((a, b) => (a.page ?? 0) - (b.page ?? 0));
        }
      });

    } catch (e) {
      console.error("loadPage error", e);
      nextPageRef.current = Math.max(0, nextPageRef.current - 1);
    } finally {
      loadingRef.current = false;
    }
  }, [dispatch]);

  // Khi user tạo bài mới
  const onPostCreated = async (newPost) => {
    try {
      await clearCache();
    } catch (e) {
      console.warn("Clear cache page 0 failed", e);
    }
  };

  // Infinite scroll observer
  const loadMoreRef = useRef(null);
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (pages.length === 0) return;
          loadPage();
        });
      },
      { threshold: 0.7 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pages, loadPage]);

  // Prefetch khi scroll gần cuối
  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight;
      const full = document.documentElement.scrollHeight;
      if ((scrollTop + vh) / full >= 0.7) {
        prefetchPage(nextPageRef.current);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefetchPage]);

  // Mark seen batching
  const markSeenFlush = useCallback(async () => {
    if (seenTimerRef.current) clearTimeout(seenTimerRef.current);
    const ids = Array.from(seenSetRef.current);
    if (!ids.length) return;
    seenSetRef.current.clear();
    try {
      await markSeen(ids).unwrap();
    } catch (e) {
      console.warn("markSeen failed", e);
    }
  }, [markSeen]);

  function scheduleSeenFlush() {
    if (seenTimerRef.current) clearTimeout(seenTimerRef.current);
    seenTimerRef.current = setTimeout(markSeenFlush, SEEN_FLUSH_MS);
  }
  function onItemVisible(itemId) {
    seenSetRef.current.add(itemId);
    scheduleSeenFlush();
  }

  // Optimistic interact
  const optimisticInteract = async (itemId) => {
    try {
      setPages((prev) =>
        prev.map((pg) => ({
          ...pg,
          items: pg.items.map((it) =>
            it.id === itemId
              ? { ...it, liked: true, likeCount: (it.likeCount || 0) + 1 }
              : it
          ),
        }))
      );
      await interact({ itemId }).unwrap();
      await updatepriorities();
    } catch (e) {
      toast.error("Tương tác thất bại, đã hoàn tác");
      refetchPage0();
    }
  };

  // Pull-to-refresh
  const handleRefresh = async () => {
    try {
      await refetchPage0();
      lastFetchTimeRef.current = Date.now();
      toast.success("Đã làm mới bảng tin");
    } catch (e) {
      toast.error("Làm mới thất bại");
    }
  };

  // TTL stale check
  const toastRef = useRef(false);

  const tryRefreshIfStale = useCallback(async () => {
    if (Date.now() - lastFetchTimeRef.current > STALE_TIME_MS) {
      try {
        await refetchPage0();
        lastFetchTimeRef.current = Date.now();
        if (!toastRef.current) {
          toast.success("Bảng tin đã được làm mới");
          toastRef.current = true;
        }
      } catch (e) {
        toast.error("Làm mới bảng tin thất bại");
      }
    }
  }, [refetchPage0, lastFetchTimeRef]);


  useEffect(() => {
    tryRefreshIfStale(); // check khi mount
  }, [tryRefreshIfStale]);

  const flatItems = pages
    .slice()
    .sort((a, b) => parseInt(a.page ?? 0, 10) - parseInt(b.page ?? 0, 10))
    .flatMap((p) => p.items ?? []);

  return (
    <main className="flex h-[calc(100vh-56px)] bg-fb-light-secondary dark:bg-fb-dark-primary overflow-hidden">
      <ScrollableContainer className="flex-shrink-0 h-full hidden xl:block">
        <Sidebar />
      </ScrollableContainer>

      <ScrollableContainer className="flex-1 h-full">
        <div className="p-2 px-10 bg-fb-light-secondary dark:bg-fb-dark-primary">
          <div className="max-w-xl mx-auto">
            {/* <div className="flex justify-between mb-4">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleRefresh}
              >
                Làm mới
              </button>
            </div> */}

            <PostCreation onPosted={onPostCreated} />

            <div className="space-y-4">
              {flatItems.map((item) => (
                <PostWithVisibility
                  key={item.id}
                  item={item}
                  onLike={() => optimisticInteract(item.id)}
                  onVisible={onItemVisible}
                />
              ))}
            </div>

            <div ref={loadMoreRef} className="mt-6 mb-10 text-center">
              {(firstFetching || loadingRef.current) && <div>Đang tải bài viết...</div>}
              {!hasMoreRef.current && <div>Không còn bài viết</div>}
            </div>
          </div>
        </div>
      </ScrollableContainer>

      <ScrollableContainer className="flex-shrink-0 h-full">
        <RightSideBar
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          onContactClick={(contact) => {
            window.dispatchEvent(new CustomEvent("openChat", { detail: contact }));
          }}
        />
        <SettingsDropdown
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </ScrollableContainer>
    </main>
  );
}
