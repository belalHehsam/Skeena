import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { Post } from "../types/post";

export default function CopyUrlButton({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation("postAction");
  const handleCopy = async () => {
    const postUrl = `${window.location.origin}/posts/${post._id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast.success(t("toast.copySuccess"));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t("toast.copyError"));
      console.log(err);
    }
  };
  return (
    <>
      <DropdownMenuItem
        onClick={handleCopy}
        className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm text-gray-600 focus:bg-neutral-50"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
        <span>
          {copied ? t("post.actions.copied") : t("post.actions.copyUrl")}
        </span>
      </DropdownMenuItem>
    </>
  );
}
