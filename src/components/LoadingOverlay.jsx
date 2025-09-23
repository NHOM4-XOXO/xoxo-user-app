"use client"
import Image from "next/image"

export default function LoadingOverlay({
  visible,
  logoSrc = "/logo_xoxo_500px-removebg-preview.png",
  dimBackground = true,
}) {
  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[60] ${
        dimBackground ? "bg-black/40 backdrop-blur-sm" : ""
      } flex items-center justify-center animate-in fade-in duration-300`}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        {/* Outer spinning ring with gradient */}
        <div
          className="absolute inset-0 rounded-full border-3 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-spin [animation-duration:2s]"
          style={{
            background: "conic-gradient(from 0deg, transparent, #3b82f6, transparent)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
          }}
        />

        {/* Inner glow effect */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/20 dark:to-purple-900/20 animate-pulse" />

        {/* Logo container with smooth fade animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white dark:bg-gray-800 shadow-lg animate-[fadeScale_2s_ease-in-out_infinite]">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt="XoXo AI"
              width={64}
              height={64}
              className="w-full h-full object-contain p-1"
              
            />
          </div>
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Đang xử lý, vui lòng đợi...</span>

      <style jsx>{`
        @keyframes fadeScale {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}
