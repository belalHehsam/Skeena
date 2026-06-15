import { useNotificationStore } from "@/store/notificationStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function useTabTitle() {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const { t } = useTranslation("common");

  useEffect(() => {
    const appName = t("layout.appName");
    const notificationTitle = `(${unreadCount}) ${appName}`;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        document.title = appName;
      } else if (unreadCount > 0) {
        document.title = notificationTitle;
      }
    };

    if (unreadCount > 0 && document.hidden) {
      document.title = notificationTitle;
    } else {
      document.title = appName;
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [unreadCount, t]);
}

export default useTabTitle;
