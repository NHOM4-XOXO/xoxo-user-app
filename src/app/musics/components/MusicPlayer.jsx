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
<<<<<<< HEAD
=======
import YouTube from "react-youtube";
>>>>>>> e831905428471ab851098df54886f2b232d48738
import VinylDisc from "./VinylDisc";
import { useMergeState } from "../hooks/useMergeState";

const MusicPlayer = () => {
  const audioRef = useRef(null);
<<<<<<< HEAD
=======
  const ytRef = useRef(null); 

>>>>>>> e831905428471ab851098df54886f2b232d48738
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
<<<<<<< HEAD
=======
    durationsBySrc: new Map(), 
>>>>>>> e831905428471ab851098df54886f2b232d48738
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
<<<<<<< HEAD
  } = state;

=======
    durationsBySrc,
  } = state;

  // Playlist mặc định
>>>>>>> e831905428471ab851098df54886f2b232d48738
  const playlist = [
    {
      id: 1,
      title: "Bonjours Việt Nam",
      artist: "Thuỳ Dung",
      album: "France",
      duration: "3:20",
<<<<<<< HEAD
      cover: "/image/georgina.jpg",
=======
      cover: "/image/BonjourVN.jpg",
>>>>>>> e831905428471ab851098df54886f2b232d48738
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
<<<<<<< HEAD
  ];

  // const currentTrack = playlist[currentSong];
  const fullPlaylist = [...playlist, ...customSongs];
  const currentTrack = fullPlaylist[currentSong];

  useEffect(() => {
=======
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

  // ===== Audio element bindings (cho file audio) =====
  useEffect(() => {
    if (isYT) return; // YouTube dùng effect riêng
>>>>>>> e831905428471ab851098df54886f2b232d48738
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setState({ currentTime: audio.currentTime });
<<<<<<< HEAD
    const updateDuration = () => setState({ duration: audio.duration });
    const onEnded = () => {
      if (isRepeated) {
        audio.currentTime = 0;
        audio.play();
=======
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
>>>>>>> e831905428471ab851098df54886f2b232d48738
      } else {
        handleNext();
      }
    };

    audio.addEventListener("timeupdate", updateTime);
<<<<<<< HEAD
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", onEnded);

    // Tự động phát khi chuyển bài
    audio.play().catch(() => {});
    setState({ isPlaying: true });

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSong, isRepeated]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});
    setState({ isPlaying: !isPlaying });
  };

  const handleNext = () => {
    setState({
      currentSong: isShuffled
        ? Math.floor(Math.random() * playlist.length)
        : (currentSong + 1) % playlist.length,
=======
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
>>>>>>> e831905428471ab851098df54886f2b232d48738
    });
  };

  const handlePrevious = () => {
<<<<<<< HEAD
    setState({
      currentSong: (currentSong - 1 + playlist.length) % playlist.length,
=======
    if (!listLen) return;
    setState({
      currentSong: (currentSong - 1 + listLen) % listLen,
>>>>>>> e831905428471ab851098df54886f2b232d48738
    });
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
<<<<<<< HEAD
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
=======
    const newTime = percent * (duration || 0);

    if (isYT) {
      ytRef.current?.seekTo(newTime, true);
      setState({ currentTime: newTime });
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
>>>>>>> e831905428471ab851098df54886f2b232d48738
    setState({ currentTime: newTime });
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value);
<<<<<<< HEAD
    setState({ volume: newVolume, isMuted: newVolume === 0 });
    audioRef.current.volume = newVolume;
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) audio.volume = volume;
    else audio.volume = 0;
=======

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
>>>>>>> e831905428471ab851098df54886f2b232d48738
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
<<<<<<< HEAD
      // setShowUpgradePopup(true);
=======
      // giới hạn demo
>>>>>>> e831905428471ab851098df54886f2b232d48738
      return;
    }
    setState({ customSongs: [...customSongs, song] });
  };

  return (
    <>
      <VinylDisc
        isPlaying={isPlaying}
<<<<<<< HEAD
        currentCover={currentTrack.cover}
        showPlaylist={showPlaylist}
        onAddMusic={handleAddCustomSong}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-neutral-900 border-t border-white/20 dark:border-white/10 shadow-2xl text-black dark:text-white">
          <audio ref={audioRef} src={currentTrack.src} />
=======
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
>>>>>>> e831905428471ab851098df54886f2b232d48738

          <div className="px-4 py-3 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-7xl mx-auto">
              {/* LEFT: Song Info */}
              <div className="flex items-center space-x-3 flex-1 min-w-0 md:max-w-sm">
                <img
<<<<<<< HEAD
                  src={currentTrack.cover}
                  alt={currentTrack.title}
=======
                  src={currentTrack?.cover || "/image/default.jpg"}
                  alt={currentTrack?.title ?? "cover"}
>>>>>>> e831905428471ab851098df54886f2b232d48738
                  className="w-14 h-14 rounded-lg object-cover shadow-lg"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate text-white dark:text-white">
<<<<<<< HEAD
                    {currentTrack.title}
                  </h3>
                  <p className="text-sm truncate text-gray-300 dark:text-gray-300">
                    {currentTrack.artist}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(currentTrack.id)}
                  className="text-xl hover:text-red-500 cursor-pointer text-red-700 hover:text-red-100"
                >
                  {favorites.has(currentTrack.id) ? (
                    <BsHeartFill />
                  ) : (
                    <BsHeart />
                  )}
=======
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
>>>>>>> e831905428471ab851098df54886f2b232d48738
                </button>
              </div>

              {/* CENTER: Controls */}
              <div className="flex flex-col items-center space-y-2 flex-1 max-w-md mx-auto">
                <div className="flex items-center space-x-4 ">
<<<<<<< HEAD
                  <button onClick={() => setIsShuffled(!isShuffled)}>
                    <BsShuffle
                      className={`text-white cursor-pointer w-5 h-5 ${
                        isShuffled ? "text-blue-400" : "opacity-70"
                      }`}
                    />
                  </button>
                  <button
                    onClick={handlePrevious}
                    className="cursor-pointer text-white"
                  >
=======
                  <button onClick={() => setState({ isShuffled: !isShuffled })}>
                    <BsShuffle className={`text-white cursor-pointer w-5 h-5 ${isShuffled ? "text-blue-400" : "opacity-70"}`} />
                  </button>
                  <button onClick={handlePrevious} className="cursor-pointer text-white">
>>>>>>> e831905428471ab851098df54886f2b232d48738
                    <BsSkipStartFill className="w-6 h-6" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-gray-100 dark:bg-gray-200 text-black rounded-full hover:bg-gray-200 dark:hover:bg-white cursor-pointer"
                  >
<<<<<<< HEAD
                    {isPlaying ? (
                      <BsPauseFill className="w-6 h-6" />
                    ) : (
                      <BsPlayFill className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={handleNext}
                    className="cursor-pointer text-white "
                  >
                    <BsSkipEndFill className="w-6 h-6" />
                  </button>
                  <button onClick={() => setIsRepeated(!isRepeated)}>
                    <BsRepeat
                      className={`text-white cursor-pointer w-5 h-5 ${
                        isRepeated ? "text-blue-400" : "opacity-70"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center space-x-2 w-full">
                  <span className="text-xs opacity-70 min-w-[35px] text-white">
                    {formatTime(currentTime)}
                  </span>
=======
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
>>>>>>> e831905428471ab851098df54886f2b232d48738
                  <div
                    className="flex-1 h-1 bg-white/30 dark:bg-white/10 rounded-full cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-black dark:bg-blue-400 rounded-full "
<<<<<<< HEAD
                      style={{
                        width: `${(currentTime / duration) * 100 || 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs opacity-70 min-w-[35px] text-white">
                    {formatTime(duration)}
=======
                      style={{ width: `${(currentTime / (duration || 1)) * 100 || 0}%` }}
                    />
                  </div>
                  <span className="text-xs opacity-70 min-w-[35px] text-white">
                    {formatDurationSec(
                      isYT
                        ? duration
                        : durationsBySrc.get(currentTrack?.src) ?? currentTrack?.durationSec ?? duration
                    )}
>>>>>>> e831905428471ab851098df54886f2b232d48738
                  </span>
                </div>
              </div>

              {/* RIGHT: Volume + Playlist */}
              <div className="text-white flex items-center justify-end space-x-3 flex-1 min-w-[150px] md:max-w-sm">
                <button onClick={toggleMute} className="cursor-pointer">
<<<<<<< HEAD
                  {isMuted || volume === 0 ? (
                    <BsVolumeMuteFill />
                  ) : (
                    <BsVolumeUpFill />
                  )}
=======
                  {isMuted || volume === 0 ? <BsVolumeMuteFill /> : <BsVolumeUpFill />}
>>>>>>> e831905428471ab851098df54886f2b232d48738
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
<<<<<<< HEAD
                <button onClick={() => setShowPlaylist(!showPlaylist)}>
=======
                <button onClick={() => setState({ showPlaylist: !showPlaylist })}>
>>>>>>> e831905428471ab851098df54886f2b232d48738
                  <HiOutlineQueueList className="cursor-pointer w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Playlist */}
          {showPlaylist && (
<<<<<<< HEAD
            <div className="border-t border-white/10 dark:border-white/20 max-h-[40vh] md:max-h-[60vh] overflow-y-auto transition-all duration-300 ease-in-out rounded-t-xl backdrop-blur-md bg-white/10 dark:bg-white/5">
              <div className="max-w-7xl mx-auto px-4 py-4 pt-4">
                <h3 className="font-semibold mb-3 flex items-center text-black dark:text-gray-200">
                  <BsMusicPlayerFill className="w-5 h-5 mr-2" /> Now Playing
                </h3>
                <div className="space-y-2">
                  {playlist.map((song, index) => (
                    <div
                      key={song.id}
                      onClick={() => setCurrentSong(index)}
                      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition ${
                        index === currentSong
                          ? "bg-white/20 dark:bg-white/10"
                          : "hover:bg-white/10 dark:hover:bg-white/5"
                      }`}
                    >
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-black dark:text-white">
                          {song.title}
                        </p>
                        <p className="text-sm opacity-70 truncate text-black dark:text-white">
                          {song.artist}
                        </p>
                      </div>
                      <span className="text-sm opacity-70 text-black dark:text-white">
                        {song.duration}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(song.id);
                        }}
                        className="text-black dark:text-white"
                      >
                        {favorites.has(song.id) ? <BsHeartFill /> : <BsHeart />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
=======
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

>>>>>>> e831905428471ab851098df54886f2b232d48738
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
