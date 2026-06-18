import { useTranslation } from "react-i18next";
import type { FilterType } from "../hooks/useGroupedNotifications";

interface NotificationFilterTabsProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
}

const filterTabs: { value: FilterType }[] = [
  { value: "all" },
  { value: "like" },
  { value: "comment" },
  { value: "friend_request" },
];

export const NotificationFilterTabs = ({
  activeFilter,
  setActiveFilter,
}: NotificationFilterTabsProps) => {
  const { t } = useTranslation("notifications");

  return (
    <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto pb-2">
      {filterTabs.map((tab) => (
        <button
          type="button"
          key={tab.value}
          onClick={() => setActiveFilter(tab.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
            activeFilter === tab.value
              ? "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800/60 dark:bg-primary-950/40 dark:text-primary-300"
              : "bg-transparent border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900/50"
          }`}
        >
          {t(`filters.${tab.value}`)}
        </button>
      ))}
    </div>
  );
};
