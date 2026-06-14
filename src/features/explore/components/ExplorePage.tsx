import { useExplore } from "../hooks/useExplore";
import { ExploreHero } from "./ExploreHero";
import { ExploreTabBar } from "./ExploreTabBar";
import { ExplorePostsList } from "./ExplorePostsList";
import { ExploreUsersList } from "./ExploreUsersList";

export function ExplorePage() {
  const {
    activeTab,
    inputValue,
    debouncedQuery,
    isFocused,
    placeholder,
    setInputValue,
    setIsFocused,
    handleTabChange,
    handleTagClick,
    clearSearch,
  } = useExplore();

  return (
    <div className="h-full animate-fade-in  rounded-xl">
      {/* Hero: search bar + trending tags */}
      <ExploreHero
        inputValue={inputValue}
        isFocused={isFocused}
        placeholder={placeholder}
        showTrending={!inputValue && activeTab === "posts"}
        onChange={setInputValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClear={clearSearch}
        onTagClick={handleTagClick}
      />

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Tab switcher */}
        <ExploreTabBar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab content */}
        {activeTab === "posts" ? (
          <ExplorePostsList query={debouncedQuery} />
        ) : (
          <ExploreUsersList query={debouncedQuery} />
        )}
      </div>
    </div>
  );
}
