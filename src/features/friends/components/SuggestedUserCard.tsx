import { BaseUserCard } from "@/components/shared/BaseUserCard";
import { formatDistanceToNow } from "@/utils/formatDistanceToNow";
import { FriendshipActions } from "./FriendshipActions";
import type { RequestUser } from "../types/friends";

interface Props {
  user: RequestUser;
}

export const SuggestedUserCard = ({ user }: Props) => {
  return (
    <BaseUserCard
      user={{
        _id: user._id,
        username: user.username,
        avatar: undefined,
      }}
      subtitle={`Joined ${formatDistanceToNow(user.createdAt)}`}
    >
      <FriendshipActions
        userId={user._id}
        initialStatus={user.friendshipStatus}
        initialRequestId={user.friendshipRequestId}
      />
    </BaseUserCard>
  );
};

