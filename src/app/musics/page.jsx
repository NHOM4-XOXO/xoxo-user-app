"use client";

import MusicPlayer from "./components/MusicPlayer";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      

      {/* <div className="max-w-4xl mx-auto py-10 px-4"> */}
      {/* <h1 className="text-3xl font-bold mb-6">🎵 My Music Player</h1> */}
      {/* <p className="mb-10 text-gray-300">
          Enjoy your favorite tunes with shuffle, repeat and dark mode support. */}
      {/* </p> */}
      {/* Add more layout here in the future, if team wanna scale project */}
      {/* </div> */}
      <MusicPlayer />
    </main>
  );
}
