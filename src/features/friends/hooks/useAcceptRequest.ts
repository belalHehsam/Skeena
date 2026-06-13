import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest } from "../services/AcceptFriendRequest";
import { FRIENDS_QUERY_KEYS } from "../constants/friends-query-keys";
import { toast } from "sonner";

interface AcceptRequestArgs {
  requestId: string;
  userId: string;
}

export const useAcceptRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId }: AcceptRequestArgs) => acceptFriendRequest(requestId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEYS.status(variables.userId),
      });

      queryClient.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEYS.pendingRequests,
      });

      queryClient.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEYS.listBase,
      });

      toast.success("Friend request accepted successfully");
    },
    onError: (error) => {
      console.log("failed to accept request: ", error);

      toast.error("Failed to accept friend request");
    },
  });
};
