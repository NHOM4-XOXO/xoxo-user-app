"use client";

import { useState } from "react";

const VinylDisc = ({ isPlaying, currentCover }) => {
  const [userImage, setUserImage] = useState(null);
  const [discColor, setDiscColor] = useState("#222222");
  const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUserImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 relative">
      {/* Vinyl Disc */}
      <div
        className="relative rounded-full border-[10px] border-gray-700 shadow-inner cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "clamp(160px, 40vw, 280px)",
          height: "clamp(160px, 40vw, 280px)",
          backgroundColor: discColor,
          animation:
            isPlaying && !isHovered ? "spin 6s linear infinite" : "none",
        }}
      >
        {/* Disc center image */}
        <div className="absolute top-1/2 left-1/2 w-14 h-14 md:w-20 md:h-20 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden shadow-md border-2 border-white ">
          <img
            src={userImage || currentCover || "/placeholder.svg"}
            alt="Disc center"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Add Music Button - inside vinyl, not rotating */}
        <div className="absolute inset-0 flex items-center z-30 pointer-events-none">
          <button
            onClick={() => setShowPopup(true)}
            className="text-xs px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 backdrop-blur-md text-white pointer-events-auto z-40 cursor-pointer"
          >
            + Add Music
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg w-80 text-center animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Upgrade Required</h2>
            <p className="text-sm mb-6">
              Please upgrade your plan to add and store more than 10,000 songs.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Color Picker (trái) */}
      <div className="fixed top-1/2 left-2 -translate-y-1/2 z-40 rotate-[90deg]">
        <label
          htmlFor="vinylColorInput"
          className="relative cursor-pointer text-sm bg-white/20 dark:bg-white/10 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md hover:bg-black/30 transition text-white"
        >
          Vinyl Color
        </label>
        <input
          id="vinylColorInput"
          type="color"
          value={discColor}
          onChange={(e) => setDiscColor(e.target.value)}
          className="absolute w-0 h-0 opacity-0"
        />
      </div>

      {/* Upload Image*/}
      <div className="fixed top-1/2 right-2 -translate-y-1/2 z-40 rotate-[-90deg]">
        <label className="relative cursor-pointer text-sm bg-white/20 dark:bg-white/10 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md hover:bg-black/30 transition text-white">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VinylDisc;
