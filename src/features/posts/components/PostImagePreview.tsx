import { X } from "lucide-react";

interface PostImagePreviewProps {
  imagePreview: string | null;
  removeImage?: () => void;
}

export function PostImagePreview({ imagePreview, removeImage }: PostImagePreviewProps) {
  if (!imagePreview) return null;

  return (
    <div className="group relative mt-4 inline-block overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
      <img
        src={imagePreview}
        alt="Upload preview"
        className="h-32 w-auto object-cover"
      />
      {removeImage && (
        <button
          type="button"
          onClick={removeImage}
          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
