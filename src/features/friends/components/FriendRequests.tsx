import { BaseUserCard } from "@/components/shared/BaseUserCard";
import { UserCardSkeleton } from "@/components/shared/UserCardSkeleton";
import { formatDistanceToNow } from "@/utils/formatDistanceToNow";
import { useFriendRequests } from "../hooks/useFriendRequests";
import { FriendshipActions } from "./FriendshipActions";
import { useTranslation } from "react-i18next";
import { UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const FriendRequests = () => {
  const { t } = useTranslation("friends");
  const { data, isPending, isError, refetch } = useFriendRequests();

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

  const requests = data?.data?.requests || [];

  if (requests.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-center">
        <UserPlus className="mb-4 size-10 opacity-20" />
        <p className="text-base">{t("empty.requests")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {requests.map((request) => (
        <BaseUserCard
          key={request._id}
          user={request.requester}
          subtitle={`${t("subtitles.requested")} ${formatDistanceToNow(request.createdAt)}`}
        >
          <FriendshipActions
            userId={request.requester._id}
            initialStatus={request.requester.friendshipStatus}
            initialRequestId={request.requester.friendshipRequestId}
          />
        </BaseUserCard>
      ))}
    </div>
  );
};

export default FriendRequests;
