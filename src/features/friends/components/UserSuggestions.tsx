import { useUserSuggestions } from "../hooks/useUserSuggestions";
import { SuggestedUserCard } from "./SuggestedUserCard";

const UserSuggestions = () => {
  const { data, isPending, error } = useUserSuggestions();

  console.log({ data, isPending, error });

  if (isPending) return <p>loading........</p>;

  if (error) return <div>{error.message}</div>;

  const suggestions = data?.data.suggestions || [];

  if (suggestions.length === 0) return <p>No suggestions</p>;

  return (
    <div>
      <p>suggestions: {suggestions.length}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((user) => (
          <SuggestedUserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserSuggestions;
