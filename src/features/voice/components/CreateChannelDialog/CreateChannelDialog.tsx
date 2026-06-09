import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VoiceCategory } from "../../types/voice";
import { CreateChannelForm } from "./CreateChannelForm";

interface CreateChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: VoiceCategory[];
  onSubmit: (values: { title: string; categoryId: string }) => void;
  isPending: boolean;
}

export function CreateChannelDialog({
  isOpen,
  onClose,
  categories,
  onSubmit,
  isPending,
}: CreateChannelDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Start a Voice Room
          </DialogTitle>
        </DialogHeader>
        <CreateChannelForm
          categories={categories}
          onSubmit={onSubmit}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
