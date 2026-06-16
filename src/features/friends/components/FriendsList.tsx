import { BaseUserCard } from "@/components/shared/BaseUserCard";
import { UserCardSkeleton } from "@/components/shared/UserCardSkeleton";
import { useFriendsList } from "../hooks/useFriendsList";
import { FriendshipActions } from "./FriendshipActions";
import { useTranslation } from "react-i18next";
import { Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const FriendsList = () => {
  const { t } = useTranslation("friends");
  const { data, isPending, isError, refetch } = useFriendsList();

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

  const friends = data?.data?.friends || [];

  if (friends.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-center">
        <Users className="mb-4 size-10 opacity-20" />
        <p className="text-base">{t("empty.list")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {friends.map((friend) => (
        <BaseUserCard
          key={friend._id}
          user={friend}
          subtitle={t("subtitles.friend")}
        >
          <FriendshipActions
            userId={friend._id}
            initialStatus={friend.friendshipStatus}
            initialRequestId={friend.friendshipRequestId}
            // showRemove
          />
        </BaseUserCard>
      ))}
    </div>
  );
};

export default FriendsList;
