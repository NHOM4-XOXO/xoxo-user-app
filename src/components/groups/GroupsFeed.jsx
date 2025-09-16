"use client";

import { useGetAllGroupQuery } from "@/features/groupManageMentApi";
import { Skeleton } from "antd"; // nếu muốn loading đẹp
import GroupCard from "./GroupCard";

export default function GroupsFeed() {
  const { data: groups, isLoading, isError } = useGetAllGroupQuery();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Lỗi tải danh sách nhóm</p>;
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}
