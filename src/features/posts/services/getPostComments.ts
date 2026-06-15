import { customFetch } from "../../../services/customFetch";
import type{ GetCommentsResponse } from '../types/post';

export async function getPostComments(postId: string, page: number = 1): Promise<GetCommentsResponse> {

  const endpoint = `/comments?postId=${postId}&page=${page}&limit=10`;
  const response = await customFetch<GetCommentsResponse>(endpoint);
  
  return response;
}