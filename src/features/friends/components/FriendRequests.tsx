import { BaseUserCard } from "@/components/shared/BaseUserCard";
import { formatDistanceToNow } from "@/utils/formatDistanceToNow";
import { useFriendRequests } from "../hooks/useFriendRequests";
import { FriendshipActions } from "./FriendshipActions";

const FriendRequests = () => {
  const { data, isPending, error } = useFriendRequests();

  console.log({ data, isPending, error });

  if (isPending) return <p>loading........</p>;

  if (error) return <div>{error.message}</div>;

  const requests = data?.data?.requests || [];

  if (requests.length === 0) return <p>No requests</p>;

  return (
    <div>
      <p>Requests: {requests.length}</p>
      <div className="flex flex-col">
        {requests.map((request) => (
          <BaseUserCard
            key={request._id}
            user={request.requester}
            subtitle={`Requested ${formatDistanceToNow(request.createdAt)}`}
          >
            <FriendshipActions userId={request.requester._id} />
          </BaseUserCard>
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;

