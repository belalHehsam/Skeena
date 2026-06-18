import type { Dispatch, FC, SetStateAction } from "react";
import { FRIENDS_PAGE_FILTERS } from "../constants/friendsFilters";
import type { FriendsTabs } from "../types/friends";
import { useTranslation } from "react-i18next";

interface Props {
  activeValue: FriendsTabs;
  setActiveValue: Dispatch<SetStateAction<FriendsTabs>>;
}

export const FilterTabs: FC<Props> = ({ activeValue, setActiveValue }) => {
  const { t } = useTranslation("friends");

  return (
    <div className="flex gap-2">
      {FRIENDS_PAGE_FILTERS.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => setActiveValue(tab.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
            activeValue === tab.id
              ? "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800/60 dark:bg-primary-950/40 dark:text-primary-300"
              : "bg-transparent border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900/50"
          }`}
        >
          {t(`tabs.${tab.id}`)}
        </button>
      ))}
    </div>
  );
};
