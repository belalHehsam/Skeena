import { useState } from "react";
import { BaseUserCard } from "@/components/shared/BaseUserCard";
import { FriendshipActions } from "@/features/friends/components/FriendshipActions";
import { useSearchUsers } from "../hooks/useSearchUsers";
import Spinner from "@/components/feedbacks/Spinner";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { UsersEmptyPrompt } from "./UsersEmptyPrompt";
import { UsersPagination } from "./UsersPagination";

interface ExploreUsersListProps {
  query: string;
}

/** Pulse skeleton grid displayed while user results are loading. */
function UserSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
        >
          <div className="h-16 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="w-full space-y-2 text-center">
            <div className="mx-auto h-3.5 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="mx-auto h-3 w-16 rounded-full bg-neutral-100 dark:bg-neutral-900" />
          </div>
          <div className="h-9 w-full rounded-xl bg-neutral-100 dark:bg-neutral-900" />
        </div>
      ))}
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
  if (users.length === 0) return <UsersEmptyPrompt query={query} />;

  return (
    <div className="space-y-4">
      {/* Results count */}
      {query.trim().length >= 2 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Found{" "}
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">{total}</span>{" "}
          {total === 1 ? "person" : "people"} matching &ldquo;{query}&rdquo;
        </p>
      )}

      {/* User grid */}
      <div
        className={`grid grid-cols-2 gap-4 sm:grid-cols-3 transition-opacity duration-150 ${
          isFetching ? "pointer-events-none opacity-60" : "opacity-100"
        }`}
      >
        {users.map((user) => (
          <BaseUserCard key={user._id} user={user} subtitle={`@${user.username}`}>
            <FriendshipActions userId={user._id} />
          </BaseUserCard>
        ))}
      </div>

      {/* Inline loading indicator */}
      {isFetching && (
        <div className="flex justify-center py-2">
          <Spinner />
        </div>
      )}

      {/* Pagination bar */}
      {totalPages > 1 && (
        <UsersPagination
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
