import { useState } from "react";
import { ChevronLeft, ChevronRight, UsersIcon } from "lucide-react";
import { useSearchUsers } from "../hooks/useSearchUsers";
import { ExploreUserCard } from "./ExploreUserCard";
import Spinner from "@/components/feedbacks/Spinner";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";

interface ExploreUsersListProps {
  query: string;
}


function UserSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col items-center rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
        >
          <div className="mb-3 h-[72px] w-[72px] rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="mb-1 h-3.5 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="mb-4 h-3 w-16 rounded-full bg-neutral-100 dark:bg-neutral-900" />
          <div className="h-8 w-full rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </div>
      ))}
    </div>
  );
}


function EmptyPrompt({ query }: { query: string }) {
  const isShort = !query || query.trim().length < 2;
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
       <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">
        <UsersIcon className="h-7 w-7 text-neutral-400" />
      </div>
     <div>
        <p className="font-semibold text-neutral-700 dark:text-neutral-300">
          {isShort ? "Search for users" : `No results for "${query}"`}
        </p>
        <p className="mt-1 text-sm text-neutral-400">
          {isShort
            ? "Type at least 2 characters to find users"
            : "Try different keywords or check spelling"}
        </p>
      </div>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  isFetching: boolean;
  onPrev: () => void;
  onNext: () => void;
}

function Pagination({ page, totalPages, total, isFetching, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-neutral-400">
        {total} user{total !== 1 ? "s" : ""} found
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1 || isFetching}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:hover:bg-neutral-900"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm tabular-nums text-neutral-500">
          {page} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page >= totalPages || isFetching}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:hover:bg-neutral-900"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ExploreUsersList({ query }: ExploreUsersListProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useSearchUsers(query, page);

  const users = data?.data.users ?? [];
  const pagination = data?.data.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  if (isError) return <ErrorMessage onRetry={refetch} />;
  if (isLoading) return <UserSkeletonGrid />;
  if (users.length === 0) return <EmptyPrompt query={query} />;

  return (
    <div className="space-y-4">
      {/* Grid */}
      <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 transition-opacity duration-150 ${isFetching ? "opacity-60" : "opacity-100"}`}>
        {users.map((user) => (
          <ExploreUserCard key={user._id} user={user} />
        ))}
      </div>

      {/* Fetching spinner overlay */}
      {isFetching && (
        <div className="flex justify-center py-1">
          <Spinner />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          isFetching={isFetching}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      )}
    </div>
  );
}
