import { useRef, useState, useEffect, useCallback } from "react";
import { Search, X, FileText, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchPosts } from "../hooks/useSearchPosts";
import DOMPurify from "dompurify";

const FETCH_MIN_LENGTH = 2;   
const OVERLAY_MIN_LENGTH = 1; 
const MAX_DROPDOWN_RESULTS = 5;


export function GlobalSearch() {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(inputValue, 300);
  const isFetchEnabled = debouncedQuery.trim().length >= FETCH_MIN_LENGTH;
  const showDropdown = isOpen && inputValue.trim().length >= OVERLAY_MIN_LENGTH;

  const { data, isFetching } = useSearchPosts(debouncedQuery);

  const posts =
    data?.pages
      .flatMap((page) => page.data.posts)
      .slice(0, MAX_DROPDOWN_RESULTS) ?? [];

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = showDropdown ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showDropdown]);

  const openDropdown = useCallback(() => setIsOpen(true), []);
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setInputValue("");
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      closeDropdown();
      inputRef.current?.blur();
    }
  }

  function handlePostClick(postId: string) {
    closeDropdown();
    navigate(`/posts/${postId}`);
  }

  function handleSeeAll() {
    const q = debouncedQuery || inputValue;
    closeDropdown();
    navigate(`/explore?q=${encodeURIComponent(q.trim())}`);
  }

  // State helpers
  const isWaiting = inputValue.trim().length < FETCH_MIN_LENGTH;
  const showSkeleton = !isWaiting && isFetching;
  const showResults = !isWaiting && !isFetching && posts.length > 0;
  const showEmpty = !isWaiting && !isFetching && posts.length === 0 && isFetchEnabled;

  return (
    <>
      {/* ── Overlay backdrop ─────────────────────────────────────────────── */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
          onClick={closeDropdown}
        />
      )}

      <div
        ref={containerRef}
        className="relative hidden w-full max-w-sm sm:block"
        style={{ zIndex: showDropdown ? 40 : "auto" }}
      >
        {/* ── Input ──────────────────────────────────────────────────────── */}
        <div className="relative">
          <Search
            className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
              showDropdown ? "text-primary" : "text-neutral-400"
            }`}
          />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={openDropdown}
            onKeyDown={handleKeyDown}
            placeholder="Search posts..."
            autoComplete="off"
            className={`h-9 w-full rounded-full border bg-neutral-100 px-9 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500 ${
              showDropdown
                ? "border-primary/40 bg-white ring-2 ring-primary/15 dark:bg-neutral-950"
                : "border-transparent hover:bg-neutral-200/70 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            }`}
          />
          {inputValue && (
            <button
              onClick={() => { setInputValue(""); inputRef.current?.focus(); }}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* ── Dropdown ───────────────────────────────────────────────────── */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">

            {/* Hint when only 1 char typed */}
            {isWaiting && (
              <div className="flex items-center gap-2.5 px-4 py-4 text-sm text-neutral-400">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Keep typing to search posts…</span>
              </div>
            )}

            {/* Skeleton loader */}
            {showSkeleton && (
              <div className="space-y-px p-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-3">
                    <div className="h-4 w-4 flex-shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-900" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {showEmpty && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  No posts found
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  for &ldquo;{debouncedQuery}&rdquo;
                </p>
              </div>
            )}

            {/* Results */}
            {showResults && (
              <>
                <div className="px-3 pb-1 pt-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Posts
                  </p>
                </div>
                <ul>
                  {posts.map((post) => {
                    const text = DOMPurify.sanitize(post.content, { ALLOWED_TAGS: [] });
                    const excerpt = text.length > 75 ? `${text.slice(0, 75)}…` : text;

                    return (
                      <li key={post._id}>
                        <button
                          onClick={() => handlePostClick(post._id)}
                          className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                        >
                          <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-neutral-800 dark:text-neutral-200">
                              {excerpt}
                            </p>
                            <p className="mt-0.5 text-xs text-neutral-400">
                              {post.author.username}
                              {post.tags.length > 0 && (
                                <span className="ml-1.5 font-medium text-primary">
                                  #{post.tags[0]}
                                </span>
                              )}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* See all */}
                <div className="m-2 mt-1">
                  <button
                    onClick={handleSeeAll}
                    className="flex w-full items-center justify-between rounded-xl border border-neutral-100 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5 dark:border-neutral-800"
                  >
                    <span>See all results for &ldquo;{debouncedQuery}&rdquo;</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
