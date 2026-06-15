import { UserAvatar } from "@/components/shared/UserAvatar";
import { FriendshipActions } from "@/features/friends/components/FriendshipActions";
import type { SearchUser } from "../types/explore";

interface ExploreUserCardProps {
  user: SearchUser;
}

export function ExploreUserCard({ user }: ExploreUserCardProps) {
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-5 text-center transition-all duration-200 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700">

      {/* Avatar */}
      <div className="relative mb-3">
        <UserAvatar
          src={user.avatar}
          username={user.username}
          size={72}
          className="ring-2 ring-white ring-offset-2 dark:ring-neutral-950 dark:ring-offset-neutral-950"
        />
      </div>

      {/* Username */}
      <h3 className="max-w-full truncate text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
        {user.username}
      </h3>

      {/* Handle */}
      <p className="mt-0.5 text-xs text-neutral-400">
        @{user.username.toLowerCase()}
      </p>

      {/* Action */}
      <div className="mt-4 flex w-full gap-2">
        <FriendshipActions userId={user._id} />
      </div>
    </div>
  );
}
