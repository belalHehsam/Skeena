import { UsersIcon, UserSearch } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UsersEmptyPromptProps {
  query: string;
}

export function UsersEmptyPrompt({ query }: UsersEmptyPromptProps) {
  const { t } = useTranslation("explore");
  const isShort = !query || query.trim().length < 2;

  return (
    <div className="flex flex-col items-center gap-5 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/40 dark:to-primary-900/20">
        {isShort ? (
          <UsersIcon className="h-9 w-9 text-primary" />
        ) : (
          <UserSearch className="h-9 w-9 text-primary" />
        )}
      </div>

      <div>
        <p className="font-heading text-base font-semibold text-neutral-700 dark:text-neutral-300">
          {isShort ? t("empty.findPeople") : t("empty.noUsersMatching", { query })}
        </p>
        <p className="mt-1.5 text-sm text-neutral-400 dark:text-neutral-500">
          {isShort
            ? t("empty.typeMinCharsPeople")
            : t("empty.tryDifferentName")}
        </p>
      </div>
    </div>
  );
}
