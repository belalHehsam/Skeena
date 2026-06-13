import type { Dispatch, FC, SetStateAction } from "react";
import { FRIENDS_PAGE_FILTERS } from "../constants/friendsFilters";
import type { FriendsTabs } from "../types/friends";

interface Props {
  activeValue: FriendsTabs;
  setActiveValue: Dispatch<SetStateAction<FriendsTabs>>;
}

export const FilterTabs: FC<Props> = ({ activeValue, setActiveValue }) => {
  return (
    <div className="flex gap-2">
      {FRIENDS_PAGE_FILTERS.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => setActiveValue(tab.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
            activeValue === tab.id
              ? "bg-emerald-500 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          }`}
        >
          {/* {t(`filters.${tab}`)} */}
          {tab.label}
        </button>
      ))}
    </div>
  );
};
