"use client";
import Image from "next/image";

export default function LoadingOverlay({
  visible,
  logoSrc = "/logo_xoxo_500px-removebg-preview.png", // đổi sang logo của bạn
  dimBackground = true,
}) {
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] ${
        dimBackground ? "bg-black/35 backdrop-blur-[1px]" : ""
      } 
                  flex items-center justify-center`}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      {/* Container */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32">
        {/* Vòng tròn xoay */}
        <div className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white/90 animate-spin" />

        {/* Vòng tròn glow nhẹ */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_50px_8px_rgba(255,255,255,0.2)]" />

        {/* Logo ở giữa – nhấp nháy mờ→rõ→mờ */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden animate-fadePulse">
            {/* Bạn có thể thay Image bằng <img> nếu không dùng Next/Image */}
            <Image
              src={logoSrc}
              alt="XoXo AI"
              width={128}
              height={128}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Text nhỏ (tùy chọn) */}
      <span className="sr-only">Đang xử lý…</span>
    </div>
  );
}
