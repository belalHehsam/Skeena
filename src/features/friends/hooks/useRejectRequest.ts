import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FRIENDS_QUERY_KEYS } from "../constants/friends-query-keys";
import { toast } from "sonner";
import { rejectFriendRequest } from "../services/rejectFriendRequest";

interface RejectRequestArgs {
  requestId: string;
  userId: string;
}

export const useRejectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId }: RejectRequestArgs) => rejectFriendRequest(requestId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEYS.status(variables.userId),
      });

      queryClient.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEYS.pendingRequests,
      });

      toast.success("Friend request rejected successfully");
    },
    onError: (error) => {
      console.log("failed to reject request: ", error);

      toast.error("Failed to reject friend request");
    },
  });
};