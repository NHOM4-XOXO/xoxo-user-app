"use client";

<<<<<<< HEAD
import { useState } from "react";

const VinylDisc = ({ isPlaying, currentCover }) => {
  const [userImage, setUserImage] = useState(null);
  const [discColor, setDiscColor] = useState("#222222");
  const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
=======
import { useState, useMemo } from "react";

const VinylDisc = ({ isPlaying, currentCover, onAddMusic }) => {
  const [userImage, setUserImage] = useState(null);
  const [discColor, setDiscColor] = useState("#222222");
  const [isHovered, setIsHovered] = useState(false);

  // Modal Add Music (demo)
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    artist: "",
    audioUrl: "", // chấp nhận .mp3/.ogg, blob:, hoặc URL YouTube
    coverUrl: "",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [error, setError] = useState("");

  const previewCover = useMemo(
    () =>
      coverFile
        ? URL.createObjectURL(coverFile)
        : form.coverUrl || userImage || currentCover || "/placeholder.svg",
    [coverFile, form.coverUrl, userImage, currentCover]
  );

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
>>>>>>> e831905428471ab851098df54886f2b232d48738
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUserImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

<<<<<<< HEAD
=======
  const handleAudioFile = (e) => {
    const file = e.target.files?.[0];
    setAudioFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((f) => ({ ...f, audioUrl: url }));
    }
  };

  const handleCoverFile = (e) => {
    const file = e.target.files?.[0];
    setCoverFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((f) => ({ ...f, coverUrl: url }));
      setUserImage(url); // đồng bộ tâm đĩa cho đẹp
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setError("");
    setForm({ title: "", artist: "", audioUrl: "", coverUrl: "" });
    setAudioFile(null);
    setCoverFile(null);
  };

  const getYouTubeId = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    } catch {}
    return null;
  };

  const submitAdd = () => {
    setError("");
    const title = form.title.trim();
    const artist = form.artist.trim();
    const audio = form.audioUrl.trim();
    const cover = form.coverUrl.trim();

    if (!title) return setError("Vui lòng nhập tiêu đề bài nhạc.");

    const yid = getYouTubeId(audio);
    if (yid) {
      onAddMusic?.({ title, artist, youtubeId: yid, coverUrl: cover });
      return resetModal();
    }

    if (!audio) return setError("Dán URL audio hoặc chọn file audio.");
    onAddMusic?.({ title, artist, audioUrl: audio, coverUrl: cover });
    resetModal();
  };

>>>>>>> e831905428471ab851098df54886f2b232d48738
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
<<<<<<< HEAD
          animation:
            isPlaying && !isHovered ? "spin 6s linear infinite" : "none",
        }}
      >
        {/* Disc center image */}
        <div className="absolute top-1/2 left-1/2 w-14 h-14 md:w-20 md:h-20 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden shadow-md border-2 border-white ">
=======
          animation: isPlaying && !isHovered ? "spin 6s linear infinite" : "none",
        }}
      >
        {/* Disc center image */}
        <div className="absolute top-1/2 left-1/2 w-14 h-14 md:w-20 md:h-20 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden shadow-md border-2 border-white">
>>>>>>> e831905428471ab851098df54886f2b232d48738
          <img
            src={userImage || currentCover || "/placeholder.svg"}
            alt="Disc center"
            className="w-full h-full object-cover"
          />
        </div>

<<<<<<< HEAD
        {/* Add Music Button - inside vinyl, not rotating */}
        <div className="absolute inset-0 flex items-center z-30 pointer-events-none">
          <button
            onClick={() => setShowPopup(true)}
=======
        {/* Add Music Button */}
        <div className="absolute inset-0 flex items-center z-30 pointer-events-none">
          <button
            onClick={() => setShowAddModal(true)}
>>>>>>> e831905428471ab851098df54886f2b232d48738
            className="text-xs px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 backdrop-blur-md text-white pointer-events-auto z-40 cursor-pointer"
          >
            + Add Music
          </button>
        </div>
      </div>

<<<<<<< HEAD
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
=======
      {/* Color Picker */}
>>>>>>> e831905428471ab851098df54886f2b232d48738
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

<<<<<<< HEAD
      {/* Upload Image*/}
=======
      {/* Upload center image */}
>>>>>>> e831905428471ab851098df54886f2b232d48738
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

<<<<<<< HEAD
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
=======
      {/* Add Music Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg w-[520px] max-w-[92vw] animate-fade-in">
            <div className="flex items-start gap-4">
              {/* Cover preview */}
              <img
                src={previewCover}
                alt="cover"
                className="w-24 h-24 rounded object-cover border"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-3">Add a Track</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Ví dụ: My awesome song"
                      className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm mb-1">Artist</label>
                    <input
                      value={form.artist}
                      onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
                      placeholder="Tên nghệ sĩ (tuỳ chọn)"
                      className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm mb-1">Audio / YouTube URL *</label>
                    <input
                      value={form.audioUrl}
                      onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
                      placeholder="https://... (.mp3/.ogg), blob:, hoặc https://youtu.be/..."
                      className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                    />
                    <div className="mt-2">
                      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                        <span className="px-3 py-1 rounded bg-black text-white">Choose audio file</span>
                        <input type="file" accept="audio/*" onChange={handleAudioFile} className="hidden" />
                        {audioFile && <span className="opacity-70">{audioFile.name}</span>}
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm mb-1">Cover URL</label>
                    <input
                      value={form.coverUrl}
                      onChange={(e) => setForm((f) => ({ ...f, coverUrl: e.target.value }))}
                      placeholder="https://... hoặc chọn ảnh bên dưới"
                      className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                    />
                    <div className="mt-2">
                      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                        <span className="px-3 py-1 rounded bg-black text-white">Choose cover image</span>
                        <input type="file" accept="image/*" onChange={handleCoverFile} className="hidden" />
                        {coverFile && <span className="opacity-70">{coverFile.name}</span>}
                      </label>
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={resetModal} className="px-4 py-2 rounded border hover:bg-black/5 transition">
                    Cancel
                  </button>
                  <button onClick={submitAdd} className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs opacity-60 mt-3">
              * Demo only: file chọn từ máy sẽ dùng <code>blob:</code> URL và sẽ mất khi refresh.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
>>>>>>> e831905428471ab851098df54886f2b232d48738
      `}</style>
    </div>
  );
};

export default VinylDisc;
