import React from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";

const TrackCard = ({
  song,
  isActive,
  onClick,
  onToggleFavorite,
  isFavorite,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center soace-x-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-white/20 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <img
        src="song.cover"
        alt="song.title"
        className="w-10 h-10 rounded object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{song.title}</p>
        <p className="text-sm opacity-70 truncate">{song.artist}</p>
      </div>
      <span className="text-sm opacity-70">{song.duration}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(song.id);
        }}
        className="opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
      >
        {isFavorite ? (
          <BsHeartFill className="w-4 h-4" />
        ) : (
          <BsHeart className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default TrackCard;
