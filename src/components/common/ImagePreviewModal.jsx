import { X } from "lucide-react";

export default function ImagePreviewModal({ imageUrl, onClose, isOpen }) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="relative max-w-full max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors z-10 p-2 rounded-full bg-black/50 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Preview"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
