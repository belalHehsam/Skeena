import { Button } from "@/components/ui/button";
import { useMarkAllNotificationsRead } from "../hooks/useMarkAllNotificationsRead";
import { useNotificationStore } from "@/store/notificationStore";
import { useTranslation } from "react-i18next";
import { customFetch } from "@/services/customFetch";
import { toast } from "sonner";
import { Bug } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { NOTIFICATION_QUERY_KEYS } from "@/features/notifications/constants/notification-query-keys";

export const NotificationHeader = () => {
  const { t } = useTranslation(["notifications", "errors"]);
  const queryClient = useQueryClient();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const { mutate: markAllRead, isPending: isMarkingRead } =
    useMarkAllNotificationsRead();
  const [isTesting, setIsTesting] = useState(false);

  const handleTestTrigger = async () => {
    try {
      setIsTesting(true);
      await customFetch("/notifications/test", { method: "POST" });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
      toast.success(t("errors:notifications.testTriggerSuccess"));
    } catch {
      toast.error(t("errors:notifications.testTriggerFailed"));
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        {import.meta.env.DEV && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestTrigger}
            disabled={isTesting}
            className="flex items-center gap-2 border-dashed border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:bg-amber-950/20 dark:text-amber-400"
          >
            <Bug className="size-4" />
            {t("testRealtime", { defaultValue: "Test Realtime" })}
          </Button>
        )}
      </div>

      {unreadCount > 0 && (
        <Button
          variant="outline"
          onClick={() => markAllRead()}
          disabled={isMarkingRead}
          className="rounded-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 px-4 py-1.5 h-auto"
        >
          {isMarkingRead ? t("markingRead") : t("markAllRead")}
        </Button>
      )}
    </div>
  );
};
