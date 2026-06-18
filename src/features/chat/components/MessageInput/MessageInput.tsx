import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaPreview } from "./MediaPreview";
import { useSendMessage } from "../../hooks/useSendMessage";
import { useTypingIndicator } from "../../hooks/useTypingIndicator";

const schema = z
  .object({
    content: z.string().max(2000).optional(),
    media: z.instanceof(File).optional(),
  })
  .refine((data) => data.content?.trim() || data.media, {
    message: "Send a message or attach a file",
  });

type FormValues = z.infer<typeof schema>;

interface MessageInputProps {
  conversationId: string;
  recipientId: string;
}

export function MessageInput({ conversationId, recipientId }: MessageInputProps) {
  const { t } = useTranslation("common");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendMutation = useSendMessage(conversationId, recipientId);
  const { emitTyping } = useTypingIndicator(conversationId);

  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      media: undefined,
    },
  });

  const selectedMedia = watch("media");

  const onSubmit = (data: FormValues) => {
    sendMutation.mutate({
      recipientId,
      content: data.content,
      media: data.media,
    });
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="border-t border-border p-4 bg-background flex flex-col gap-2.5 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
      {selectedMedia && (
        <div className="flex justify-start">
          <MediaPreview
            file={selectedMedia}
            onClear={() => setValue("media", undefined)}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-3 max-w-full"
      >
        <input
          type="file"
          title="Attachment"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setValue("media", file);
            }
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-10 w-10 shrink-0 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="flex-1 relative">
          <textarea
            {...register("content")}
            rows={1}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              register("content").onChange(e);
              emitTyping();
            }}
            placeholder={t("chat.typeMessage", "Type a message...")}
            className="w-full rounded-[20px] border border-border bg-neutral-50/40 dark:bg-neutral-900/30 py-2.5 px-4 text-sm outline-none resize-none max-h-32 transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 dark:focus:ring-primary/20 font-sans"
          />
        </div>

        <Button
          type="submit"
          className="h-10 w-10 shrink-0 rounded-full bg-primary hover:bg-primary-600 text-white flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          <Send className="h-5 w-5 rtl:rotate-y-180" />
        </Button>
      </form>
    </div>
  );
}
export default MessageInput;
