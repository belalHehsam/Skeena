import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./useDebounce";
import { useTranslation } from "react-i18next";

export type ExploreTab = "posts" | "users";

export function useExplore() {
  const { t } = useTranslation("explore");
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ExploreTab>("posts");
  const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "");
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(inputValue, 300);

  // Keep URL in sync with debounced query
  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, { replace: true });
  }, [debouncedQuery, setSearchParams]);

  const handleTabChange = useCallback((tab: ExploreTab) => {
    setActiveTab(tab);
    setInputValue("");
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setActiveTab("posts");
    setInputValue(tag);
  }, []);

  const clearSearch = useCallback(() => setInputValue(""), []);

  const placeholder =
    activeTab === "posts" ? t("searchPlaceholderPosts") : t("searchPlaceholderPeople");

  return {
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
  };
}
