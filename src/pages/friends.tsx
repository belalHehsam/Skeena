import { FilterTabs } from "@/features/friends/components/FilterTabs";
import FriendRequests from "@/features/friends/components/FriendRequests";
import FriendsList from "@/features/friends/components/FriendsList";
import UserSuggestions from "@/features/friends/components/UserSuggestions";
import type { FriendsTabs } from "@/features/friends/types/friends";
import { useState } from "react";

const Friends = () => {
  const [activeTab, setActiveTab] = useState<FriendsTabs>("list");

  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-4 text-3xl font-bold">Friends</h1>
      <FilterTabs activeValue={activeTab} setActiveValue={setActiveTab} />
      <div>
        {activeTab === "list" && <FriendsList />}
        {activeTab === "requests" && <FriendRequests />}
        {activeTab === "suggestions" && <UserSuggestions />}
      </div>
    </div>
  );
};

export default Friends;
