"use client";

import { useState, useRef, useEffect } from "react";
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

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const playlist = [
    {
      id: 1,
      title: "Bonjours Việt Nam",
      artist: "Thuỳ Dung",
      album: "France",
      duration: "3:20",
      // cover: "/placeholder.svg?height=300&width=300",
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

  const currentTrack = playlist[currentSong];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleNext);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleNext);
    };
  }, [currentSong]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (isShuffled) {
      setCurrentSong(Math.floor(Math.random() * playlist.length));
    } else {
      setCurrentSong((prev) => (prev + 1) % playlist.length);
    }
  };

  const handlePrevious = () => {
    setCurrentSong((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFavorite = (songId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(songId)) {
      newFavorites.delete(songId);
    } else {
      newFavorites.add(songId);
    }
    setFavorites(newFavorites);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 ">
      {/* Glassmorphism Background */}
      <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 shadow-2xl">
        <audio
          ref={audioRef}
          src={currentTrack?.src}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        />

        {/* Main Player */}
        <div className="px-4 py-3 md:px-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto ">
            {/* Song Info - Left Side */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative group">
                <img
                  src={currentTrack?.cover || "/placeholder.svg"}
                  alt={currentTrack?.title}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shadow-lg "
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              <div className="min-w-0 flex-1 ">
                <h3 className="text-white font-semibold text-sm md:text-base truncate ">
                  {currentTrack?.title}
                </h3>
                <p className="text-white/70 text-xs md:text-sm truncate">
                  {currentTrack?.artist}
                </p>
              </div>

              <button
                onClick={() => toggleFavorite(currentTrack?.id)}
                className="text-white/70 hover:text-red-400 transition-colors duration-200 hidden sm:block cursor-pointer "
              >
                {favorites.has(currentTrack?.id) ? (
                  <BsHeartFill className="w-5 h-5" />
                ) : (
                  <BsHeart className="w-5 h-5 text-red-900" />
                )}
              </button>
            </div>

            {/* Controls - Center */}
            <div className="flex flex-col items-center space-y-2 flex-1 max-w-md mx-4">
              {/* Control Buttons */}
              <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-2 cursor-pointer text-black rounded-full hover:scale-105 transition-transform duration-200 bg-white transition-all duration-200 ${
                    isShuffled
                      ? "text-blue-400 bg-blue-400/20"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <BsShuffle className="w-4 h-4 text-black" />
                </button>

                <button
                  onClick={handlePrevious}
                  className="text-white/70 transition-colors cursor-pointer duration-200 p-2 bg-white rounded-full hover:scale-105 transition-transform duration-200 "
                >
                  <BsSkipStartFill className="w-5 h-5 text-black" />
                </button>

                <button
                  onClick={togglePlay}
                  className="bg-white cursor-pointer text-black p-3 rounded-full hover:scale-105 transition-transform duration-200 shadow-lg "
                >
                  {isPlaying ? (
                    <BsPauseFill className="w-6 h-6 " />
                  ) : (
                    <BsPlayFill className="w-6 h-6 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="text-white/70 cursor-pointer hover:text-white bg-white transition-colors duration-200 p-2 hover:scale-105 transition-transform duration-200 rounded-full"
                >
                  <BsSkipEndFill className="w-5 h-5 text-black" />
                </button>

                <button
                  onClick={() => setIsRepeated(!isRepeated)}
                  className={`p-2 cursor-pointer rounded-full transition-all hover:scale-105 transition-transform duration-200 bg-white duration-200 ${
                    isRepeated
                      ? "text-blue-400 bg-blue-400/20"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <BsRepeat className="w-4 h-4 text-black" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-2 w-full">
                <span className="text-white/70 text-xs min-w-[35px]">
                  {formatTime(currentTime)}
                </span>
                <div
                  className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer group"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-white rounded-full relative group-hover:bg-blue-400 transition-colors duration-200"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <span className="text-white/70 text-xs min-w-[35px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume & Playlist - Right Side */}
            <div className="flex items-center space-x-3 flex-1 justify-end">
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer duration-200 p-2 hover:bg-white/10 rounded-full"
                >
                  {isMuted || volume === 0 ? (
                    <BsVolumeMuteFill className="w-5 h-5" />
                  ) : (
                    <BsVolumeUpFill className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                />
              </div>

              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="text-white/70 cursor-pointer hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-full"
              >
                <HiOutlineQueueList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Playlist Dropdown */}
        {showPlaylist && (
          <div className="border-t border-white/20 backdrop-blur-xl bg-white/5">
            <div className="max-w-7xl mx-auto px-4 py-4 max-h-64 overflow-y-auto">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <BsMusicPlayerFill className="w-5 h-5 mr-2" />
                Now Playing
              </h3>
              <div className="space-y-2">
                {playlist.map((song, index) => (
                  <div
                    key={song.id}
                    onClick={() => setCurrentSong(index)}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      index === currentSong
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{song.title}</p>
                      <p className="text-sm opacity-70 truncate">
                        {song.artist}
                      </p>
                    </div>
                    <span className="text-sm opacity-70">{song.duration}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(song.id);
                      }}
                      className="opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer "
                    >
                      {favorites.has(song.id) ? (
                        <BsHeartFill className="w-4 h-4" />
                      ) : (
                        <BsHeart className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: #60a5fa;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          background: #60a5fa;
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
