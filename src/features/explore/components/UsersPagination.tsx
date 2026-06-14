import { ChevronLeft, ChevronRight } from "lucide-react";

interface UsersPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  isFetching: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function UsersPagination({
  page,
  totalPages,
  total,
  isFetching,
  onPrev,
  onNext,
}: UsersPaginationProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{total}</span>{" "}
        {total === 1 ? "person" : "people"} found
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1 || isFetching}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-all hover:border-primary/40 hover:bg-primary-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:hover:border-primary/30 dark:hover:bg-primary-950/30 dark:hover:text-primary-400"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="min-w-[3rem] text-center text-sm tabular-nums text-neutral-600 dark:text-neutral-400">
          {page} / {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={page >= totalPages || isFetching}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-all hover:border-primary/40 hover:bg-primary-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:hover:border-primary/30 dark:hover:bg-primary-950/30 dark:hover:text-primary-400"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
