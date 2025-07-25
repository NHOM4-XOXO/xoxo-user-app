import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


const PostMediaGrid = ({ media, postId }) => {
    const [currentIndex, setCurrentIndex] = useState(null);

    const router = useRouter();

    const openMedia = () => {
        router.push(`/post/${postId}`);
    };

    const renderMedia = (item, index) => {
        if (item.type === "image") {
            return (
                <img
                    key={index}
                    src={item.url}
                    alt=""
                    onClick={openMedia}
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
                        onClick={openMedia}
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

        </>
    );
};

export default PostMediaGrid;
