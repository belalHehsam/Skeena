import { useUserSuggestions } from "../hooks/useUserSuggestions";
import { SuggestedUserCard } from "./SuggestedUserCard";
import { UserCardSkeleton } from "@/components/shared/UserCardSkeleton";
import { useTranslation } from "react-i18next";
import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserSuggestions = () => {
  const { t } = useTranslation("friends");
  const { data, isPending, isError, refetch } = useUserSuggestions();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center text-sm">
        <p className="mb-3">{t("error.title")}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="me-2 size-4" />
          {t("error.retry")}
        </Button>
      </div>
    );
  }

  const suggestions = data?.data.suggestions || [];

  if (suggestions.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-center">
        <Search className="mb-4 size-10 opacity-20" />
        <p className="text-base">{t("empty.suggestions")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {suggestions.map((user) => (
        <SuggestedUserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default UserSuggestions;
