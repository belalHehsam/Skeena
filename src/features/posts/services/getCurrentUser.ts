import { customFetch } from "@/services/customFetch";
import type { User } from "../types/user";

export default function getCurrentUser() {
  return customFetch<User>("/users/me");
}
