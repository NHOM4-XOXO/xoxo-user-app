import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect, useState } from "react";


const PostMediaGrid = ({ media }) => {
    const [currentIndex, setCurrentIndex] = useState(null);

    const openMedia = (index) => setCurrentIndex(index);
    const closeMedia = () => setCurrentIndex(null);

    const showPrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
    const showNext = () => setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (currentIndex !== null) {
                if (e.key === "ArrowLeft") showPrev();
                if (e.key === "ArrowRight") showNext();
                if (e.key === "Escape") closeMedia();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex]);
    const renderMedia = (item, index) => {
        if (item.type === "image") {
            return (
                <img
                    key={index}
                    src={item.url}
                    alt=""
                    onClick={() => openMedia(index)}
                    className="w-full h-full object-cover rounded-md cursor-pointer"
                />
            );
        } else if (item.type === "video") {
            return (
                <div
                    key={index}
                    className="w-full h-full rounded-md overflow-hidden"
                >
                    <video
                        onClick={() => openMedia(index)}
                        controls
                        className="w-full h-auto object-cover cursor-pointer"
                        poster={item.thumbnail || undefined}
                    >
                        <source src={item.url} type="video/mp4" />
                    </video>
                </div>
            );
        }
    };

    const length = media.length;

    // Grid layout
    if (length === 1) {
        return <div className="rounded-lg overflow-hidden">{renderMedia(media[0], 0)}</div>;
    }

    if (length === 2) {
        return (
            <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                {media.map(renderMedia)}
            </div>
        );
    }

    if (length === 3) {
        return (
            <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                <div className="col-span-2">{renderMedia(media[0], 0)}</div>
                {media.slice(1).map(renderMedia)}
            </div>
        );
    }
    if (length === 4) {
        return (
            <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                <div className="col-span-3">{renderMedia(media[0], 0)}</div>
                {media.slice(1).map(renderMedia)}
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                <div className="col-span-3">{renderMedia(media[0], 0)}</div>
                {media.slice(1, 4).map((item, index) => (
                    <div key={index} className="relative">
                        {renderMedia(item, index + 1)}
                        {index === 2 && length > 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold">
                                +{length - 4}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal xem ảnh/video */}
            {
                currentIndex !== null && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                        {/* Đóng modal */}
                        <button
                            className="absolute top-4 right-6 text-white text-3xl"
                            onClick={closeMedia}
                            aria-label="Close"
                        >
                            <X size={32} />
                        </button>

                        {/* Prev */}
                        <button
                            onClick={showPrev}
                            className="absolute left-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full"
                            aria-label="Previous"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        {/* Media hiển thị */}
                        <div className="max-w-[90vw] max-h-[90vh]">
                            {media[currentIndex].type === "image" ? (
                                <img
                                    src={media[currentIndex].url}
                                    alt=""
                                    className="max-w-full max-h-full rounded-lg shadow-xl"
                                />
                            ) : (
                                <video
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-full rounded-lg shadow-xl"
                                >
                                    <source src={media[currentIndex].url} type="video/mp4" />
                                </video>
                            )}
                        </div>

                        {/* Next */}
                        <button
                            onClick={showNext}
                            className="absolute right-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full"
                            aria-label="Next"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Số lượng */}
                        <div className="absolute bottom-6 text-white text-sm">
                            {currentIndex + 1} / {media.length}
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default PostMediaGrid;
