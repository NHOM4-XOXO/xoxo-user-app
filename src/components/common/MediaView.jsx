import { useState } from "react";
import ImagePreviewModal from "@/components/main/Chat/ImagePreviewModal"; // Reusing existing modal

export default function MediaView({ media }) {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const openImagePreview = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setIsPreviewModalOpen(true);
  };

  const closeImagePreview = () => {
    setIsPreviewModalOpen(false);
    setPreviewImageUrl("");
  };

  if (!media || media.length === 0) {
    return null;
  }

  // Handle single media item
  if (media.length === 1) {
    const item = media[0];
    if (item.type === "image") {
      return (
        <>
          <img
            src={item.url || "/placeholder.svg"}
            alt="Post image"
            className="w-full h-auto max-h-[500px] object-contain rounded-lg cursor-pointer"
            onClick={() => openImagePreview(item.url)}
          />
          <ImagePreviewModal
            isOpen={isPreviewModalOpen}
            onClose={closeImagePreview}
            imageUrl={previewImageUrl}
          />
        </>
      );
    } else if (item.type === "video") {
      return (
        <video
          src={item.url}
          poster={item.thumbnail || "/placeholder.svg?height=400&width=600"}
          controls
          preload="metadata"
          playsInline
          className="w-full h-auto max-h-[500px] object-contain rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
      );
    }
  }

  // Handle multiple media items (simple grid layout for now)
  const gridClass =
    media.length === 2
      ? "grid-cols-2"
      : media.length === 3
      ? "grid-cols-3"
      : media.length === 4
      ? "grid-cols-2"
      : "grid-cols-3"; // Default for more than 4 or odd numbers

  return (
    <>
      <div
        className={`grid ${gridClass} gap-2 w-full rounded-lg overflow-hidden`}
      >
        {media.slice(0, 6).map((item, index) => (
          <div
            key={index}
            className="relative w-full aspect-square bg-black flex items-center justify-center"
          >
            {item.type === "image" ? (
              <img
                src={item.url || "/placeholder.svg"}
                alt={`Post image ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openImagePreview(item.url)}
              />
            ) : (
              <video
                src={item.url}
                poster={
                  item.thumbnail || "/placeholder.svg?height=200&width=200"
                }
                controls
                preload="metadata"
                playsInline
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            )}
            {media.length > 5 && index === 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
                +{media.length - 5}
              </div>
            )}
          </div>
        ))}
      </div>
      <ImagePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={closeImagePreview}
        imageUrl={previewImageUrl}
      />
    </>
  );
}
