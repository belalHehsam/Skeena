import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { CreatePostForm } from "./CreatePostForm";
import useDeletePost from "../hooks/useDeletePost";
import useGetCurrentUser from "../hooks/useGetCurrentUser";
import type { Post } from "../types/post";
import CopyUrlButton from "./CopyUrlButton";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function PostAction({
  post,
  activeCategory,
}: {
  post: Post;
  activeCategory: string;
}) {
  const { mutate: handleDelete } = useDeletePost(post, activeCategory);
  const { data } = useGetCurrentUser();
  const { t } = useTranslation("postAction");

  function deleteFun() {
    handleDelete();
    toast.success("Post Delted Succssfully");
  }
  return (
    <Dialog>
      <AlertDialog>
        <div className="absolute end-4 top-1 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-foreground block cursor-pointer rounded-full p-1.5 text-gray-500 transition-colors outline-none hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <MoreHorizontal className="h-5 w-5" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-44 rounded-xl border border-neutral-100 bg-white p-1 shadow-md"
            >
              {data?.data.user.id === post.author._id ? (
                <>
                  <DialogTrigger className="block w-full text-start outline-none">
                    <DropdownMenuItem className="focus:text-foreground flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm text-gray-600">
                      <Edit2 className="h-4 w-4" />
                      <span>{t("post.actions.edit")}</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <AlertDialogTrigger className="block w-full text-start outline-none">
                    <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      <span>{t("post.actions.delete")}</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm text-gray-600">
                    <span>{t("post.actions.copyUrl")}</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <CopyUrlButton post={post} />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AlertDialogContent className="max-w-[400px] rounded-2xl bg-white p-6">
          <AlertDialogHeader className="text-start">
            <AlertDialogTitle className="text-lg font-bold text-gray-900">
              {t("post.deleteModal.title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-sm text-gray-500">
              {t("post.deleteModal.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex items-center justify-end gap-3">
            <AlertDialogCancel className="cursor-pointer rounded-full border-none bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200">
              {t("post.deleteModal.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteFun}
              className="cursor-pointer rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700"
            >
              {t("post.deleteModal.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DialogContent className="overflow-hidden rounded-2xl border-none bg-white p-0 shadow-xl sm:max-w-[550px]">
        <CreatePostForm post={""} />
      </DialogContent>
    </Dialog>
  );
}
