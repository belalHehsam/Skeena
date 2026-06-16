import { Button } from "@/components/ui/button";
import { useFriendshipStatus } from "../hooks/useFriendshipStatus";
import { useSendFriendRequest } from "../hooks/useSendFriendRequests";
import { useCancelFriendRequest } from "../hooks/useCancelFriendRequest";
import { useAcceptRequest } from "../hooks/useAcceptRequest";
import { useRejectRequest } from "../hooks/useRejectRequest";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

interface FriendshipActionsProps {
  userId: string;
  showRemove?: boolean;
  className?: string;
  allowFriendRequests?: boolean;
  initialStatus?:
    | "none"
    | "pending_sent"
    | "pending_received"
    | "accepted"
    | "friends";
  initialRequestId?: string | null;
}

export const FriendshipActions = ({
  userId,
  showRemove,
  className,
  initialRequestId,
  allowFriendRequests,

  initialStatus,
}: FriendshipActionsProps) => {
  const { t } = useTranslation("friends");
  const { data, isLoading, isError } = useFriendshipStatus(
    userId,
    initialStatus
      ? {
          status: initialStatus,
          requestId: initialRequestId || null,
        }
      : undefined,
  );
  const sendRequestMutation = useSendFriendRequest();
  const cancelRequestMutation = useCancelFriendRequest();
  const acceptRequestMutation = useAcceptRequest();
  const rejectRequestMutation = useRejectRequest();

  const queryStatus = data?.data?.status;
  const queryRequestId = data?.data?.requestId;
  const status = queryStatus ?? initialStatus;
  const requestId = queryRequestId ?? null;
  const allowRequests = allowFriendRequests !== false;

  if (isLoading && status === undefined) {
    return (
      <Button className={cn("w-full", className)} disabled>
        {t("actions.loading")}
      </Button>
    );
  }

  if (isError && status === undefined) {
    return (
      <Button className={cn("w-full", className)} variant="outline" disabled>
        {t("actions.unavailable")}
      </Button>
    );
  }

  if (status === "none" || (status === undefined && allowRequests)) {
    if (allowFriendRequests === false) {
      return (
        <Button className={cn("w-full", className)} variant="outline" disabled>
          {t("actions.disabled")}
        </Button>
      );
    }

    return (
      <Button
        className={cn("w-full bg-[#1B5E4F] hover:bg-[#2E8B72] text-white font-medium text-sm px-5 py-2 h-auto rounded-full border-none", className)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          sendRequestMutation.mutate(userId);
        }}
        disabled={sendRequestMutation.isPending}
      >
        {t("actions.addFriend")}
      </Button>
    );
  }

  if (status === "pending_sent") {
    return (
      <Button
        className={cn("w-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full", className)}
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (requestId) {
            cancelRequestMutation.mutate({ requestId, userId });
          }
        }}
        disabled={cancelRequestMutation.isPending}
      >
        {t("actions.cancelRequest")}
      </Button>
    );
  }

  if (status === "pending_received") {
    return (
      <>
        <Button
          className={cn("flex-1 bg-[#1B5E4F] hover:bg-[#2E8B72] text-white font-medium text-sm px-5 py-2 h-auto rounded-full border-none", className)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (requestId) {
              acceptRequestMutation.mutate({ requestId, userId });
            }
          }}
          disabled={acceptRequestMutation.isPending}
        >
          {t("actions.accept")}
        </Button>
        <Button
          className={cn("flex-1 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full", className)}
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (requestId) {
              rejectRequestMutation.mutate({ requestId, userId });
            }
          }}
          disabled={rejectRequestMutation.isPending}
        >
          {t("actions.reject")}
        </Button>
      </>
    );
  }

  if (status === "accepted" || status === "friends") {
    if (showRemove) {
      return (
        <Button
          className={cn("w-full", className)}
          variant="destructive"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Hook up useRemoveFriend when implemented
            console.log("Remove friend clicked");
          }}
        >
          {t("actions.remove")}
        </Button>
      );
    }
    return (
      <Button className={cn("w-full", className)} variant="outline" disabled>
        {t("actions.friends")}
      </Button>
    );
  }

  return (
    <Button className={cn("w-full", className)} variant="outline" disabled>
      {t("actions.unavailable")}
    </Button>
  );
};
