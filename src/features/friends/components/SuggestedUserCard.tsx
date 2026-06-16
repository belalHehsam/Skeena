import { BaseUserCard } from "@/components/shared/BaseUserCard";
import { formatDistanceToNow } from "@/utils/formatDistanceToNow";
import { FriendshipActions } from "./FriendshipActions";
import type { RequestUser } from "../types/friends";
import { useTranslation } from "react-i18next";

interface Props {
  user: RequestUser;
}

export const SuggestedUserCard = ({ user }: Props) => {
  const { t } = useTranslation("friends");

  return (
    <BaseUserCard
      user={{
        _id: user._id,
        username: user.username,
        avatar: undefined,
      }}
      subtitle={t("subtitles.joined", { time: formatDistanceToNow(user.createdAt) })}
    >
      <FriendshipActions
        userId={user._id}
        initialStatus={user.friendshipStatus}
        initialRequestId={user.friendshipRequestId}
      />
    </BaseUserCard>
  );
};

