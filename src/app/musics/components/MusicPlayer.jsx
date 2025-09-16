"use client";

import { useRef, useEffect } from "react";
import {
  BsMusicPlayerFill,
  BsPlayFill,
  BsPauseFill,
  BsSkipStartFill,
  BsSkipEndFill,
  BsVolumeUpFill,
  BsVolumeMuteFill,
  BsShuffle,
  BsRepeat,
  BsHeart,
  BsHeartFill,
} from "react-icons/bs";
import { HiOutlineQueueList } from "react-icons/hi2";
import YouTube from "react-youtube";
import VinylDisc from "./VinylDisc";
import { useMergeState } from "../hooks/useMergeState";

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const ytRef = useRef(null); 

  const [state, setState] = useMergeState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    currentSong: 0,
    isShuffled: false,
    isRepeated: false,
    showPlaylist: false,
    favorites: new Set(),
    customSongs: [],
    durationsBySrc: new Map(), 
  });

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    currentSong,
    isShuffled,
    isRepeated,
    showPlaylist,
    favorites,
    customSongs,
    durationsBySrc,
  } = state;

  // Playlist mặc định
  const playlist = [
    {
      id: 1,
      title: "Bonjours Việt Nam",
      artist: "Thuỳ Dung",
      album: "France",
      duration: "3:20",
      cover: "/image/BonjourVN.jpg",
      src: "/musics/bonjoursVn.mp3",
    },
    {
      id: 2,
      title: "Boom Shake",
      artist: "Flo-Rida & Pitpull",
      album: "US-UK",
      duration: "2:54",
      cover: "/image/boom-shake.jpg",
      src: "/musics/boom-shake.mp3",
    },
    {
      id: 3,
      title: "Relax",
      artist: "WindyHill",
      album: "Springtime",
      duration: "2:58",
      cover: "/image/chillout.jpeg",
      src: "/musics/relax.mp3",
    },
    // {
    //   id: 4,
    //   title: "Buzz",
    //   artist: "PLI - MAKER",
    //   album: "플리메이커",
    //   duration: "2:58",
    //   cover: "/image/korean.jpg",
    //   src: "/musics/BurningSong.mp3",
    // },
    
  ];

  // ===== Helpers thời lượng =====
  const formatDurationSec = (sec) => {
    if (!Number.isFinite(sec) || sec <= 0) return "0:00";
    const total = Math.floor(sec);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const parseDurationString = (str) => {
    if (typeof str !== "string") return null;
    const parts = str.split(":").map((x) => Number.parseInt(x, 10));
    if (parts.some((n) => Number.isNaN(n))) return null;
    if (parts.length === 3) {
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    }
    if (parts.length === 2) {
      const [m, s] = parts;
      return m * 60 + s;
    }
    return null;
  };

  const normalizeSong = (s, i) => ({
    id: s?.id ?? `c-${i}`,
    title: s?.title ?? "Untitled",
    artist: s?.artist ?? "",
    cover: s?.cover ?? s?.coverUrl ?? "/image/default.jpg",
    src: s?.src ?? s?.audioUrl ?? "", 
    youtubeId: s?.youtubeId ?? null, 
    durationSec:
      Number.isFinite(s?.durationSec) ? s.durationSec : parseDurationString(s?.duration) ?? null,
  });

  const normalizedDefault = playlist.map((p, i) => normalizeSong(p, i));
  const normalizedCustom = (customSongs ?? []).map(normalizeSong);
  const fullPlaylist = [...normalizedDefault, ...normalizedCustom].filter((x) => x && (x.src || x.youtubeId));

  const listLen = fullPlaylist.length;
  const fallbackTrack = { id: "fallback", title: "No track", artist: "", cover: "/image/default.jpg", src: "", youtubeId: null, durationSec: 0 };
  const currentTrack = fullPlaylist[currentSong] ?? fullPlaylist[0] ?? fallbackTrack;
  const isYT = !!currentTrack?.youtubeId;

  // ===== Probe duration cho audio file (không dùng cho YouTube) =====
  const probeDuration = (src) =>
    new Promise((resolve) => {
      if (!src) return resolve(null);
      const cached = durationsBySrc.get(src);
      if (Number.isFinite(cached)) return resolve(cached);
      const a = new Audio();
      a.preload = "metadata";
      a.src = src;

      const cleanup = () => {
        a.removeEventListener("loadedmetadata", onMeta);
        a.removeEventListener("error", onErr);
      };
      const onMeta = () => {
        const d = Number.isFinite(a.duration) ? a.duration : null;
        cleanup();
        resolve(d);
      };
      const onErr = () => {
        cleanup();
        resolve(null);
      };
      a.addEventListener("loadedmetadata", onMeta, { once: true });
      a.addEventListener("error", onErr, { once: true });
      setTimeout(() => {
        cleanup();
        resolve(null);
      }, 7000);
    });

  useEffect(() => {
    let alive = true;
    (async () => {
      const next = new Map(durationsBySrc);
      for (const s of fullPlaylist) {
        if (!s?.src) continue; // chỉ audio file
        if (!Number.isFinite(next.get(s.src))) {
          const d = await probeDuration(s.src);
          if (!alive) return;
          if (Number.isFinite(d)) {
            next.set(s.src, d);
            setState({ durationsBySrc: new Map(next) });
          }
        }
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullPlaylist.map((s) => s.src || "").join("|")]);

  useEffect(() => {
    if (isYT) return; 
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setState({ currentTime: audio.currentTime });
    const updateDurationFromMeta = () => {
      setState({ duration: audio.duration });
      if (currentTrack?.src && Number.isFinite(audio.duration)) {
        const m = new Map(durationsBySrc);
        m.set(currentTrack.src, audio.duration);
        setState({ durationsBySrc: m });
      }
    };
    const onEnded = () => {
      if (isRepeated) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDurationFromMeta);
    audio.addEventListener("ended", onEnded);

    // Auto play khi đổi bài (audio)
    audio.play().then(() => setState({ isPlaying: true })).catch(() => {});

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDurationFromMeta);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong, isRepeated, isYT]);

  // ===== YouTube bindings =====
  useEffect(() => {
    if (!isYT || !ytRef.current) return;
    let alive = true;
    const id = setInterval(() => {
      if (!alive) return;
      const cur = ytRef.current.getCurrentTime?.();
      const dur = ytRef.current.getDuration?.();
      if (Number.isFinite(cur)) setState({ currentTime: cur });
      if (Number.isFinite(dur)) setState({ duration: dur });
    }, 500);
    return () => { alive = false; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYT, currentSong, ytRef.current]);

  const togglePlay = () => {
    if (isYT) {
      if (isPlaying) ytRef.current?.pauseVideo();
      else ytRef.current?.playVideo();
      setState({ isPlaying: !isPlaying });
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setState({ isPlaying: false });
    } else {
      audio.play().then(() => setState({ isPlaying: true })).catch(() => {});
    }
  };

  const handleNext = () => {
    if (!listLen) return;
    setState({
      currentSong: isShuffled
        ? Math.floor(Math.random() * listLen)
        : (currentSong + 1) % listLen,
    });
  };

  const handlePrevious = () => {
    if (!listLen) return;
    setState({
      currentSong: (currentSong - 1 + listLen) % listLen,
    });
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * (duration || 0);

    if (isYT) {
      ytRef.current?.seekTo(newTime, true);
      setState({ currentTime: newTime });
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setState({ currentTime: newTime });
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value);

    if (isYT) {
      // YouTube volume range 0–100
      ytRef.current?.setVolume?.(Math.round(newVolume * 100));
      setState({ volume: newVolume, isMuted: newVolume === 0 });
      return;
    }

    if (audioRef.current) audioRef.current.volume = newVolume;
    setState({ volume: newVolume, isMuted: newVolume === 0 });
  };

  const toggleMute = () => {
    if (isYT) {
      if (isMuted) ytRef.current?.unMute?.(); else ytRef.current?.mute?.();
      setState({ isMuted: !isMuted });
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) audio.volume = volume; else audio.volume = 0;
    setState({ isMuted: !isMuted });
  };

  const toggleFavorite = (id) => {
    const updated = new Set(favorites);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setState({ favorites: updated });
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAddCustomSong = (song) => {
    if (customSongs.length >= 10) {
      // giới hạn demo
      return;
    }
    setState({ customSongs: [...customSongs, song] });
  };

  return (
    <>
      <VinylDisc
        isPlaying={isPlaying}
        currentCover={currentTrack?.cover}
        onAddMusic={handleAddCustomSong}
      />

      {isYT && (
        <div className="fixed bottom-28 right-4 w-64 h-36 bg-black/70 rounded overflow-hidden z-40">
          <YouTube
            videoId={currentTrack.youtubeId}
            opts={{
              width: "256",
              height: "144",
              playerVars: { autoplay: 1, controls: 1 },
            }}
            onReady={(e) => {
              ytRef.current = e.target;
              const d = e.target.getDuration?.();
              if (Number.isFinite(d)) setState({ duration: d, isPlaying: true });
              // đồng bộ âm lượng
              ytRef.current?.setVolume?.(Math.round((isMuted ? 0 : volume) * 100));
              if (isMuted) ytRef.current?.mute?.(); else ytRef.current?.unMute?.();
            }}
            onStateChange={(e) => {
              // 1 PLAYING, 2 PAUSED, 0 ENDED
              if (e.data === 1) setState({ isPlaying: true });
              if (e.data === 2) setState({ isPlaying: false });
              if (e.data === 0) {
                if (isRepeated) {
                  ytRef.current?.seekTo(0, true);
                  ytRef.current?.playVideo();
                } else {
                  handleNext();
                }
              }
            }}
          />
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-neutral-900 border-t border-white/20 dark:border-white/10 shadow-2xl text-black dark:text-white">
          {/* Audio element (chỉ dùng cho file audio) */}
          {!isYT && <audio ref={audioRef} src={currentTrack?.src || ""} />}

          <div className="px-4 py-3 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-7xl mx-auto">
              {/* LEFT: Song Info */}
              <div className="flex items-center space-x-3 flex-1 min-w-0 md:max-w-sm">
                <img
                  src={currentTrack?.cover || "/image/default.jpg"}
                  alt={currentTrack?.title ?? "cover"}
                  className="w-14 h-14 rounded-lg object-cover shadow-lg"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate text-white dark:text-white">
                    {currentTrack?.title || "No track"}
                  </h3>
                  <p className="text-sm truncate text-gray-300 dark:text-gray-300">
                    {currentTrack?.artist || (isYT ? "YouTube" : "")}
                  </p>
                </div>
                <button
                  onClick={() => currentTrack?.id && toggleFavorite(currentTrack.id)}
                  className="text-xl hover:text-red-500 cursor-pointer text-red-700 hover:text-red-100"
                >
                  {currentTrack?.id && favorites.has(currentTrack.id) ? <BsHeartFill /> : <BsHeart />}
                </button>
              </div>

              {/* CENTER: Controls */}
              <div className="flex flex-col items-center space-y-2 flex-1 max-w-md mx-auto">
                <div className="flex items-center space-x-4 ">
                  <button onClick={() => setState({ isShuffled: !isShuffled })}>
                    <BsShuffle className={`text-white cursor-pointer w-5 h-5 ${isShuffled ? "text-blue-400" : "opacity-70"}`} />
                  </button>
                  <button onClick={handlePrevious} className="cursor-pointer text-white">
                    <BsSkipStartFill className="w-6 h-6" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-gray-100 dark:bg-gray-200 text-black rounded-full hover:bg-gray-200 dark:hover:bg-white cursor-pointer"
                  >
                    {isPlaying ? <BsPauseFill className="w-6 h-6" /> : <BsPlayFill className="w-6 h-6" />}
                  </button>
                  <button onClick={handleNext} className="cursor-pointer text-white ">
                    <BsSkipEndFill className="w-6 h-6" />
                  </button>
                  <button onClick={() => setState({ isRepeated: !isRepeated })}>
                    <BsRepeat className={`text-white cursor-pointer w-5 h-5 ${isRepeated ? "text-blue-400" : "opacity-70"}`} />
                  </button>
                </div>

                {/* Progress */}
                <div className="flex items-center space-x-2 w-full">
                  <span className="text-xs opacity-70 min-w-[35px] text-white">{formatTime(currentTime)}</span>
                  <div
                    className="flex-1 h-1 bg-white/30 dark:bg-white/10 rounded-full cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-black dark:bg-blue-400 rounded-full "
                      style={{ width: `${(currentTime / (duration || 1)) * 100 || 0}%` }}
                    />
                  </div>
                  <span className="text-xs opacity-70 min-w-[35px] text-white">
                    {formatDurationSec(
                      isYT
                        ? duration
                        : durationsBySrc.get(currentTrack?.src) ?? currentTrack?.durationSec ?? duration
                    )}
                  </span>
                </div>
              </div>

              {/* RIGHT: Volume + Playlist */}
              <div className="text-white flex items-center justify-end space-x-3 flex-1 min-w-[150px] md:max-w-sm">
                <button onClick={toggleMute} className="cursor-pointer">
                  {isMuted || volume === 0 ? <BsVolumeMuteFill /> : <BsVolumeUpFill />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 cursor-pointer"
                />
                <button onClick={() => setState({ showPlaylist: !showPlaylist })}>
                  <HiOutlineQueueList className="cursor-pointer w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Playlist */}
          {showPlaylist && (
  <div
    className="border-t border-white/10 dark:border-white/20
      max-h-[50vh] md:max-h-[60vh] overflow-y-auto
      transition-all duration-300 ease-in-out rounded-t-xl
      backdrop-blur-md backdrop-saturate-150
      bg-white/80 dark:bg-black/80
      md:bg-neutral-900/40 md:dark:bg-neutral-900/40"
  >
    <div className="max-w-7xl mx-auto px-4 py-4 pt-4">
      <h3 className="font-semibold mb-3 flex items-center text-neutral-900 dark:text-neutral-100 md:text-white md:dark:text-white">
        <BsMusicPlayerFill className="w-5 h-5 mr-2" /> Now Playing
      </h3>

      <div className="space-y-2">
        {fullPlaylist.map((song, index) => (
          <div
            key={song?.id ?? `custom-${index}`}
            onClick={() => setState({ currentSong: index })}
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition
              ${index === currentSong
                ? "bg-black/5 dark:bg-white/10 md:bg-white/15"
                : "hover:bg-black/5 dark:hover:bg-white/5 md:hover:bg-white/10"}`}
          >
            <img
              src={song?.cover || "/image/default.jpg"}
              alt={song?.title || "cover"}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-neutral-900 dark:text-neutral-100 md:text-white md:dark:text-white">
                {song?.title || "Untitled"}
              </p>
              <p className="text-sm opacity-70 truncate text-neutral-800 dark:text-neutral-300 md:text-gray-200">
                {song?.artist || (song?.youtubeId ? "YouTube" : "")}
              </p>
            </div>
            <span className="text-sm opacity-70 text-neutral-800 dark:text-neutral-300">
              {song?.youtubeId
                ? (index === currentSong ? formatDurationSec(duration) : "—")
                : formatDurationSec(durationsBySrc.get(song?.src) ?? song?.durationSec ?? 0)}
            </span>
            {song?.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(song.id);
                }}
                className="text-neutral-900 dark:text-neutral-100"
              >
                {favorites.has(song.id) ? <BsHeartFill /> : <BsHeart />}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
