import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

export default function MediaViewer({ media, currentIndex }) {
    const minZoom = 1;
    const maxZoom = 3;
    const step = 0.2;

    const [zoomLevel, setZoomLevel] = useState(1);

    const zoomIn = () => setZoomLevel((z) => Math.min(z + step, maxZoom));
    const zoomOut = () => setZoomLevel((z) => Math.max(z - step, minZoom));

    return (
        <div className="h-[90vh] w-[90vw] flex items-center justify-center relative bg-black overflow-hidden">
            <div
                className="transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
            >
                {media[currentIndex].mediaType === "IMAGE" ? (
                    <img
                        src={media[currentIndex].mediaUrl}
                        alt={media[currentIndex].originalFilename || ""}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                    />
                ) : (
                    <video
                        src={media[currentIndex].mediaUrl}
                        controls
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                        poster={media[currentIndex].thumbnail || undefined}
                    />
                )}
            </div>

            {/* Nút Zoom In */}
            <button
                onClick={zoomIn}
                disabled={zoomLevel >= maxZoom}
                className={`absolute top-3 right-14 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white ${zoomLevel >= maxZoom ? "cursor-not-allowed" : ""
                    }`}
            >
                <ZoomIn size={20} />
            </button>

            {/* Nút Zoom Out */}
            <button
                onClick={zoomOut}
                disabled={zoomLevel <= minZoom}
                className={`absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white ${zoomLevel <= minZoom ? "cursor-not-allowed" : ""
                    }`}
            >
                <ZoomOut size={20} />
            </button>

        </div>
    );
}
