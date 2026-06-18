import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquarePlus, Search, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchUsers } from "../services/searchUsers";
import { getOrCreateConversation } from "../services/getOrCreateConversation";
import { CHAT_QUERY_KEYS } from "../constants/chat-query-keys";
import { toast } from "sonner";

export function NewChatButton() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", "search", searchQuery],
    queryFn: () => searchUsers(searchQuery),
    staleTime: 5000,
  });

  const handleStartChat = async (userId: string) => {
    setIsStartingChat(true);
    try {
      const conv = await getOrCreateConversation(userId);

      // Instantly cache the new conversation to avoid "Loading User" headers in ChatWindow
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.conversations(),
        (old: any) => {
          if (!old) return [conv];
          if (old.some((c: any) => c._id === conv._id)) return old;
          return [conv, ...old];
        }
      );

      setOpen(false);
      navigate(`/chat/${conv._id}`);
    } catch (error) {
      console.error(error);
      toast.error(t("chat.failedToStart", "Failed to start conversation"));
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="icon"
            className="bg-primary hover:bg-primary/95 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        }
      />
      <DialogContent className="bg-card rounded-xl border p-6 shadow-lg sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="font-heading text-neutral-850 text-lg font-bold dark:text-neutral-100">
            {t("chat.newChat", "New Conversation")}
          </DialogTitle>
          <DialogDescription className="font-sans text-xs text-neutral-500">
            {t(
              "chat.searchPrompt",
              "Search by name or username to start a direct message thread.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-4">
          <Search className="absolute top-3.5 h-4 w-4 text-neutral-400 ltr:left-3 rtl:right-3" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("chat.searchPlaceholder", "Search users...")}
            className="border-border bg-background focus:border-primary focus:ring-primary/30 w-full rounded-lg border py-2.5 text-sm transition-all outline-none focus:ring-1 ltr:pr-4 ltr:pl-9 rtl:pr-9 rtl:pl-4"
          />
        </div>

        <div className="max-h-62.5 space-y-2 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-neutral-400">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
              <span className="text-sm">{t("loading", "Loading...")}</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-6 text-center font-sans text-sm text-neutral-500 dark:text-neutral-400">
              {t("chat.noUsersFound", "No users found.")}
            </div>
          ) : (
            users.map((user: any) => (
              <div
                key={user._id}
                onClick={() => !isStartingChat && handleStartChat(user._id)}
                className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-neutral-100 dark:border-neutral-700">
                    <AvatarImage src={user.profileImage || user.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {(user.name || user.displayName || user.username || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-start">
                    <div className="text-neutral-850 text-sm font-semibold dark:text-neutral-100">
                      {user.displayName || user.name || user.username}
                    </div>
                    <div className="text-xs text-neutral-500">
                      @{user.username}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-full p-0"
                  disabled={isStartingChat}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default NewChatButton;
