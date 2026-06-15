import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostForm } from "./PostForm";
import { usePostModal } from "../context/PostModalContext";

export function PostModal() {
  const { isOpen, closeModal, editingPost } = usePostModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl p-0 border-none bg-transparent shadow-none outline-none ring-0 ring-transparent flex justify-center items-center">
        {/* We use key to force unmount/remount when switching between create/edit so states reset completely */}
        <PostForm key={editingPost ? `edit-${editingPost._id}` : "create"} post={editingPost} />
      </DialogContent>
    </Dialog>
  );
}
