import { FilterTabs } from "@/features/friends/components/FilterTabs";
import FriendRequests from "@/features/friends/components/FriendRequests";
import FriendsList from "@/features/friends/components/FriendsList";
import UserSuggestions from "@/features/friends/components/UserSuggestions";
import type { FriendsTabs } from "@/features/friends/types/friends";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Friends = () => {
  const { t } = useTranslation("friends");
  const [activeTab, setActiveTab] = useState<FriendsTabs>("list");

  return (
    <div className="flex animate-fade-right flex-col gap-6 pt-8 px-4 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
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
