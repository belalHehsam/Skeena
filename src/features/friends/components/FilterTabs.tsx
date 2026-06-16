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
          className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
            activeValue === tab.id
              ? "bg-primary text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          }`}
        >
          {t(`tabs.${tab.id}`)}
        </button>
      ))}
    </div>
  );
};
