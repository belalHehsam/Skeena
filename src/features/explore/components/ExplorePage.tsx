import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, LayoutList, Users } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { ExplorePostsList } from "./ExplorePostsList";
import { ExploreUsersList } from "./ExploreUsersList";

type Tab = "posts" | "users";

const TABS: { id: Tab; label: string; icon: typeof LayoutList }[] = [
  { id: "posts", label: "Posts", icon: LayoutList },
  { id: "users", label: "Users", icon: Users },
];


export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "");

  const debouncedQuery = useDebounce(inputValue, 300);

  // Keep URL in sync with debounced query
  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, {
      replace: true,
    });
  }, [debouncedQuery, setSearchParams]);

  // Switch tab AND reset search
  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setInputValue("");
  }, []);

  const clearSearch = () => setInputValue("");

  const placeholder =
    activeTab === "posts"
      ? "Search posts, topics, keywords…"
      : "Search people by username…";

  return (
    <div className="mx-auto container p-5 md:p-8   h-full bg-background rounded-2xl">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Explore
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Discover posts and people on Majlis
        </p>
      </div>

      {/* ── Search bar ─────────────────────────────────────────────────── */}
      <div className="relative mb-1">
        <Search className="absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 pointer-events-none text-neutral-400" />
        <input
          id="explore-search-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-11 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-primary/40 focus:ring-2 focus:ring-primary/15 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Tab bar (underline style) ───────────────────────────────────── */}
      <div className="mb-6 flex border-b border-neutral-200 dark:border-neutral-800">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              id={`explore-tab-${id}`}
              onClick={() => handleTabChange(id)}
              className={`relative flex flex-1 items-center justify-center gap-2 pb-3 pt-3 text-sm font-semibold transition-colors duration-150 ${
                isActive
                  ? "text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}

              {/* Animated underline indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ────────────────────────────────────────────────── */}
      {activeTab === "posts" ? (
        <ExplorePostsList query={debouncedQuery} />
      ) : (
        <ExploreUsersList query={debouncedQuery} />
      )}
    </div>
  );
}
