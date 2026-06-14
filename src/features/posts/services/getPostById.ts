
import { customFetch } from "../../../services/customFetch";
import type { Post } from '../types/post';

export interface SinglePostResponse {
  status: string;
  data: {
    post: Post;
  };
}

export async function getPostById(postId: string): Promise<Post> {
  const response = await customFetch<SinglePostResponse>(`/posts/${postId}`);
  
  return response.data.post; 
}