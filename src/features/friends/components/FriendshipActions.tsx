import { Button } from "@/components/ui/button";
import { useFriendshipStatus } from "../hooks/useFriendshipStatus";
import { useSendFriendRequest } from "../hooks/useSendFriendRequests";
import { useCancelFriendRequest } from "../hooks/useCancelFriendRequest";
import { useAcceptRequest } from "../hooks/useAcceptRequest";
import { useRejectRequest } from "../hooks/useRejectRequest";

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
}

export const FriendshipActions = ({
  userId,
  showRemove,
  className,
  allowFriendRequests,
  initialStatus,
}: FriendshipActionsProps) => {
  const { data, isLoading, isError } = useFriendshipStatus(userId);
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
        loading...
      </Button>
    );
  }

  if (isError && status === undefined) {
    return (
      <Button className={cn("w-full", className)} variant="outline" disabled>
        Friend actions unavailable
      </Button>
    );
  }

  if (status === "none" || (status === undefined && allowRequests)) {
    if (allowFriendRequests === false) {
      return (
        <Button className={cn("w-full", className)} variant="outline" disabled>
          Friend requests disabled
        </Button>
      );
    }

    return (
      <Button
        className={cn("w-full", className)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          sendRequestMutation.mutate(userId);
        }}
        disabled={sendRequestMutation.isPending}
      >
        Add Friend
      </Button>
    );
  }

  if (status === "pending_sent") {
    return (
      <Button
        className={cn("w-full", className)}
        variant="secondary"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (requestId) {
            cancelRequestMutation.mutate({ requestId, userId });
          }
        }}
        disabled={cancelRequestMutation.isPending}
      >
        Cancel Request
      </Button>
    );
  }

  if (status === "pending_received") {
    return (
      <>
        <Button
          className={cn("flex-1", className)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (requestId) {
              acceptRequestMutation.mutate({ requestId, userId });
            }
          }}
          disabled={acceptRequestMutation.isPending}
        >
          Accept
        </Button>
        <Button
          className={cn("flex-1", className)}
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
          Reject
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
          Remove
        </Button>
      );
    }
    return (
      <Button className={cn("w-full", className)} variant="outline" disabled>
        Friends ✓
      </Button>
    );
  }

  return (
    <Button className={cn("w-full", className)} variant="outline" disabled>
      Friend actions unavailable
    </Button>
  );
};
