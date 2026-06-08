import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaPreviewProps {
  file: File;
  onClear: () => void;
}

export function MediaPreview({ file, onClear }: MediaPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) return null;

  return (
    <div className="relative inline-block m-2">
      <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-border bg-neutral-100 shadow-sm animate-scale-in">
        {file.type.startsWith("image/") ? (
          <img src={previewUrl} alt="Upload preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-neutral-250 dark:bg-neutral-800 text-[10px] font-medium text-neutral-500 truncate p-1">
            {file.name}
          </div>
        )}
      </div>
      <Button
        type="button"
        size="icon"
        onClick={onClear}
        className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white shadow-md cursor-pointer border border-white/20 flex items-center justify-center"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
export default MediaPreview;
