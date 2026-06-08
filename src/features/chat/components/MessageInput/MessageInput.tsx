import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Paperclip, Send, Loader2 } from "lucide-react";
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
    if (sendMutation.isPending) return;
    
    sendMutation.mutate(
      {
        recipientId,
        content: data.content,
        media: data.media,
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="border-t border-border p-3 bg-background flex flex-col gap-2">
      {/* Media file preview */}
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
        className="flex items-end gap-2 max-w-full"
      >
        {/* Attachment button */}
        <input
          type="file"
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
          disabled={sendMutation.isPending}
          onClick={() => fileInputRef.current?.click()}
          className="h-10 w-10 shrink-0 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-full cursor-pointer flex items-center justify-center"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Input box */}
        <div className="flex-1 relative">
          <textarea
            {...register("content")}
            rows={1}
            disabled={sendMutation.isPending}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              register("content").onChange(e);
              emitTyping();
            }}
            placeholder={t("chat.typeMessage", "Type a message...")}
            className="w-full rounded-2xl border border-border bg-neutral-50/50 dark:bg-neutral-900/50 py-2.5 px-4 text-sm outline-none resize-none max-h-32 transition-all focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary/20 font-sans"
          />
        </div>

        {/* Send button */}
        <Button
          type="submit"
          disabled={sendMutation.isPending}
          className="h-10 w-10 shrink-0 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          {sendMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
export default MessageInput;
