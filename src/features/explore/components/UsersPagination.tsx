import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

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
  const { t } = useTranslation("explore");

  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        <Trans
          t={t}
          i18nKey="results.peopleFound"
          count={total}
          components={{
            bold: (
              <span className="font-semibold text-neutral-800 dark:text-neutral-200" />
            ),
          }}
        />
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1 || isFetching}
          className="hover:border-primary/40 hover:bg-primary-50 hover:text-primary dark:hover:border-primary/30 dark:hover:bg-primary-950/30 dark:hover:text-primary-400 flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-all disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800"
          aria-label={t("pagination.prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="min-w-12 text-center text-sm text-neutral-600 tabular-nums dark:text-neutral-400">
          {page} / {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={page >= totalPages || isFetching}
          className="hover:border-primary/40 hover:bg-primary-50 hover:text-primary dark:hover:border-primary/30 dark:hover:bg-primary-950/30 dark:hover:text-primary-400 flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-all disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800"
          aria-label={t("pagination.next")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
