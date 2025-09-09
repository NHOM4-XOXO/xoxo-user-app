"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const PostMediaGrid = ({ media, postId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    const prevMedia = () => {
        setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    };

    const nextMedia = () => {
        setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    };

    const renderMediaItem = (item, index) => {
        if (item.mediaType === "IMAGE") {
            return (
                <img
                    key={index}
                    src={item.mediaUrl}
                    alt={item.originalFilename || ""}
                    onClick={() => openModal(index)}
                    className="w-full max-h-[500px] object-cover rounded-md cursor-pointer"
                />
            );
        } else if (item.mediaType === "VIDEO") {
            return (
                <video
                    key={index}
                    onClick={() => openModal(index)}
                    controls
                    className="w-full h-auto object-cover rounded-md cursor-pointer"
                    poster={item.thumbnail || undefined}
                >
                    <source src={item.mediaUrl} type="video/mp4" />
                </video>
            );
        }
    };

    const length = media.length;

    // Grid layout
    const renderGrid = () => {
        if (length === 1) {
            return <div className="rounded-lg overflow-hidden">{renderMediaItem(media[0], 0)}</div>;
        }
        if (length === 2) {
            return (
                <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                    {media.map(renderMediaItem)}
                </div>
            );
        }
        if (length === 3) {
            return (
                <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                    <div className="col-span-2">{renderMediaItem(media[0], 0)}</div>
                    {media.slice(1).map(renderMediaItem)}
                </div>
            );
        }
        if (length === 4) {
            return (
                <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                    <div className="col-span-3">{renderMediaItem(media[0], 0)}</div>
                    {media.slice(1).map(renderMediaItem)}
                </div>
            );
        }
        // 5+ media
        return (
            <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                <div className="col-span-3">{renderMediaItem(media[0], 0)}</div>
                {media.slice(1, 4).map((item, index) => (
                    <div key={index} className="relative">
                        {renderMediaItem(item, index + 1)}
                        {index === 2 && length > 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold">
                                +{length - 4}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            {renderGrid()}

            {/* Modal full screen */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center mb-0">
                    <button
                        className="absolute top-5 right-5 text-white p-2 rounded-full hover:bg-white/20"
                        onClick={closeModal}
                    >
                        <X size={24} />
                    </button>

                    <button
                        className="absolute left-5 text-white p-2 rounded-full hover:bg-white/20"
                        onClick={prevMedia}
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <div className="max-h-[90vh] max-w-[90vw] flex items-center justify-center">
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

                    <button
                        className="absolute right-5 text-white p-2 rounded-full hover:bg-white/20"
                        onClick={nextMedia}
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            )}
        </>
    );
};

export default PostMediaGrid;
