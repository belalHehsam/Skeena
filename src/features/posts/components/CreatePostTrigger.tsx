import useGetCurrentUser from "../hooks/useGetCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePostModal } from "../context/PostModalContext";
import { useTranslation } from "react-i18next";
export default function CreatePostTrigger() {
  const { data } = useGetCurrentUser();
  const { t, i18n } = useTranslation("common");
  const userInitial = data?.data.user.username.slice(0, 2).toLocaleUpperCase();

  const { openCreate } = usePostModal();

  return (
    <div>
        <div className="bg-card border-border flex w-full flex-col rounded-none sm:rounded-xl border-y sm:border-x p-4 shadow-sm">
          {/* Top row: avatar + trigger */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar className="border-background h-10 w-10 border-2">
                <AvatarImage src={data?.data.user.avatar} alt={data?.data.user.username} />
                <AvatarFallback className="bg-emerald-600 text-sm font-medium text-white">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <span className="border-background absolute right-0.5 bottom-0.5 h-2.5 w-2.5 rounded-full border-2 bg-green-500" />
            </div>

            <div onClick={openCreate} className="flex-1">
              <div className="bg-muted hover:bg-muted/80 text-muted-foreground w-full cursor-pointer rounded-full px-4 py-2.5 text-start text-sm transition-colors">
                {t("DialogTrigger.title")}
                <span dir="auto" className="text-foreground/70 font-medium">
                  {data?.data.user.username || " "}
                </span>
                {i18n.language === "ar" ? "؟" : "?"}
              </div>
            </div>
          </div>

          {/* Action bar */}
          {/* <div className="border-border mt-3 flex items-center gap-1 border-t pt-3">
            <button className="text-muted-foreground hover:bg-muted flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors">
              <ImageIcon className="h-4 w-4 text-blue-500" />
              {t("actions.photo")}
            </button>
            <button className="text-muted-foreground hover:bg-muted flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors">
              <Video className="h-4 w-4 text-green-500" />
              {t("actions.video")}
            </button>
            <button className="text-muted-foreground hover:bg-muted flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors">
              <SmilePlus className="h-4 w-4 text-amber-500" />
              {t("actions.feeling")}
            </button>
            <div className="flex-1" />
            <div onClick={openCreate}>
              <div className="cursor-pointer rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                {t("actions.post")}
              </div>
            </div>
          </div> */}
        </div>
    </div>
  );
}
