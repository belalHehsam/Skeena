import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { toast } from "sonner";

export function NewChatButton() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
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
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/95 text-white shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-xl border bg-card p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold text-neutral-850 dark:text-neutral-100">
            {t("chat.newChat", "New Conversation")}
          </DialogTitle>
          <DialogDescription className="font-sans text-xs text-neutral-500">
            {t("chat.searchPrompt", "Search by name or username to start a direct message thread.")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("chat.searchPlaceholder", "Search users...")}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-neutral-400">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span className="text-sm">{t("loading", "Loading...")}</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-6 text-sm text-neutral-500 dark:text-neutral-400 font-sans">
              {t("chat.noUsersFound", "No users found.")}
            </div>
          ) : (
            users.map((user: any) => (
              <div
                key={user._id}
                onClick={() => !isStartingChat && handleStartChat(user._id)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-neutral-100 dark:border-neutral-700">
                    <AvatarImage src={user.profileImage || user.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {(user.name || user.displayName || user.username || "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-neutral-850 dark:text-neutral-100">
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
                  className="h-8 w-8 p-0 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
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
