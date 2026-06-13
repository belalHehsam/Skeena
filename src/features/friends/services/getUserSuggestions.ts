import { customFetch } from "@/services/customFetch";
import type { UserSuggestionsResponse } from "../types/friends";

export const getUserSuggestions = (): Promise<UserSuggestionsResponse> => {
  return customFetch("/friends/suggestions", {
    method: "GET",
  });
};
