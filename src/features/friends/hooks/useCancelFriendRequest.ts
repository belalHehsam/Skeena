import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelFriendRequest } from "../services/cancelFriendRequest";
import { FRIENDS_QUERY_KEYS } from "../constants/friends-query-keys";
import { toast } from "sonner";

interface CancelRequestArgs {
  requestId: string;
  userId: string;
}

export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId }: CancelRequestArgs) => cancelFriendRequest(requestId),
    onSuccess(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEYS.status(variables.userId),
      });
      // queryClient.invalidateQueries({
      //   queryKey: FRIENDS_QUERY_KEYS.suggestions,
      // });
      toast.success("Request cancelled successfully");
    },
    onError(error) {
      console.log(error);
      toast.error("Failed to cancel request");
    },
  });
};
