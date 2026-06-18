import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { Button } from "@/components/ui/button";

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
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onPrev}
          disabled={page <= 1 || isFetching}
          className="rounded-lg text-neutral-500"
          aria-label={t("pagination.prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="min-w-12 text-center text-sm text-neutral-600 tabular-nums dark:text-neutral-400">
          {page} / {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onNext}
          disabled={page >= totalPages || isFetching}
          className="rounded-lg text-neutral-500"
          aria-label={t("pagination.next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
