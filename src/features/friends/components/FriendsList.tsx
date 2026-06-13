import { BaseUserCard } from "@/components/shared/BaseUserCard";
import { useFriendsList } from "../hooks/useFriendsList";

const FriendsList = () => {
  const { data, isPending, error } = useFriendsList();
  console.log({ data, isPending, error });

  if (isPending) return <p>loading........</p>;

  if (error) return <div>{error.message}</div>;

  const friends = data?.data?.friends || [];

  if (friends.length === 0) return <p>No friends</p>;

  return (
    <div>
      <p>friends: {friends.length}</p>
      <div className="flex flex-col">
        {friends.map((friend) => (
          <BaseUserCard
            key={friend._id}
            user={friend}
            subtitle="Friend"
          />
        ))}
      </div>
    </div>
  );
};

export default FriendsList;

