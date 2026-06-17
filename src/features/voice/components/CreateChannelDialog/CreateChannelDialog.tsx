import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import type { Category } from "@/types/category";
import { CreateChannelForm } from "./CreateChannelForm";

interface CreateChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
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
  const { t } = useTranslation("common");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold text-neutral-900 dark:text-neutral-100">
            {t("voice.startRoomTitle")}
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
