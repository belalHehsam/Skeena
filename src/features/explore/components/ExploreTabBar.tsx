import { LayoutList, Users } from "lucide-react";
import type { ExploreTab } from "../hooks/useExplore";

const TABS: { id: ExploreTab; label: string; icon: typeof LayoutList }[] = [
  { id: "posts", label: "Posts", icon: LayoutList },
  { id: "users", label: "People", icon: Users },
];

interface ExploreTabBarProps {
  activeTab: ExploreTab;
  onTabChange: (tab: ExploreTab) => void;
}

export function ExploreTabBar({ activeTab, onTabChange }: ExploreTabBarProps) {
  return (
    <div className="mb-6 inline-flex rounded-xl border border-neutral-200  p-1 dark:border-neutral-800 ">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            id={`explore-tab-${id}`}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-primary-500 text-white shadow-sm ring-1 ring-neutral-200/80 dark:bg-neutral-800 dark:text-primary-400 dark:ring-neutral-700"
                : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-white dark:text-primary-400" : ""}`} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
