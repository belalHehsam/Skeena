import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/getCategories";

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // Categories don't change often
  });
}
