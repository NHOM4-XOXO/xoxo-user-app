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
import VinylDisc from "./VinylDisc";
import { useMergeState } from "../hooks/useMergeState";

const MusicPlayer = () => {
  const audioRef = useRef(null);
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
  } = state;

  const playlist = [
    {
      id: 1,
      title: "Bonjours Việt Nam",
      artist: "Thuỳ Dung",
      album: "France",
      duration: "3:20",
      cover: "/image/georgina.jpg",
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
  ];

  // const currentTrack = playlist[currentSong];
  const fullPlaylist = [...playlist, ...customSongs];
  const currentTrack = fullPlaylist[currentSong];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setState({ currentTime: audio.currentTime });
    const updateDuration = () => setState({ duration: audio.duration });
    const onEnded = () => {
      if (isRepeated) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener("timeupdate", updateTime);
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
    });
  };

  const handlePrevious = () => {
    setState({
      currentSong: (currentSong - 1 + playlist.length) % playlist.length,
    });
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setState({ currentTime: newTime });
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value);
    setState({ volume: newVolume, isMuted: newVolume === 0 });
    audioRef.current.volume = newVolume;
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) audio.volume = volume;
    else audio.volume = 0;
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
      // setShowUpgradePopup(true);
      return;
    }
    setState({ customSongs: [...customSongs, song] });
  };

  return (
    <>
      <VinylDisc
        isPlaying={isPlaying}
        currentCover={currentTrack.cover}
        showPlaylist={showPlaylist}
        onAddMusic={handleAddCustomSong}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-neutral-900 border-t border-white/20 dark:border-white/10 shadow-2xl text-black dark:text-white">
          <audio ref={audioRef} src={currentTrack.src} />

          <div className="px-4 py-3 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-7xl mx-auto">
              {/* LEFT: Song Info */}
              <div className="flex items-center space-x-3 flex-1 min-w-0 md:max-w-sm">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-14 h-14 rounded-lg object-cover shadow-lg"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate text-white dark:text-white">
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
                </button>
              </div>

              {/* CENTER: Controls */}
              <div className="flex flex-col items-center space-y-2 flex-1 max-w-md mx-auto">
                <div className="flex items-center space-x-4 ">
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
                    <BsSkipStartFill className="w-6 h-6" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-gray-100 dark:bg-gray-200 text-black rounded-full hover:bg-gray-200 dark:hover:bg-white cursor-pointer"
                  >
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
                  <div
                    className="flex-1 h-1 bg-white/30 dark:bg-white/10 rounded-full cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-black dark:bg-blue-400 rounded-full "
                      style={{
                        width: `${(currentTime / duration) * 100 || 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs opacity-70 min-w-[35px] text-white">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* RIGHT: Volume + Playlist */}
              <div className="text-white flex items-center justify-end space-x-3 flex-1 min-w-[150px] md:max-w-sm">
                <button onClick={toggleMute} className="cursor-pointer">
                  {isMuted || volume === 0 ? (
                    <BsVolumeMuteFill />
                  ) : (
                    <BsVolumeUpFill />
                  )}
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
                <button onClick={() => setShowPlaylist(!showPlaylist)}>
                  <HiOutlineQueueList className="cursor-pointer w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Playlist */}
          {showPlaylist && (
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
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
