import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreatePostForm } from "./CreatePostForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-[700px] p-0 border-none bg-transparent shadow-none outline-none flex justify-center items-center">
        <div className="relative w-full">
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="absolute top-3 right-3 z-[60] h-8 w-8 rounded-full bg-neutral-100/50 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <CreatePostForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
