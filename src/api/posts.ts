import { api } from "./axios";
import type { PostData } from "@/types/posts.types";
import type { Comment } from "@/types/posts.types";

export const createPost = async (credentials: {
  title: string;
  content: string;
}): Promise<PostData> => {
  const { data } = await api.post("/posts", credentials);
  return data;
};

export const fetchPosts = async (): Promise<[PostData]> => {
  const { data } = await api.get("/posts");
  return data;
};

export const addComment = async (
  postId: number,
  text: string
): Promise<Comment> => {
  const { data } = await api.post<Comment>(`/posts/${postId}/comments`, {
    text,
  });
  return data;
};

export async function likePostApi(postId: number): Promise<void> {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
}

export async function dislikePostApi(postId: number): Promise<void> {
  const { data } = await api.delete(`/posts/${postId}/like`);
  return data;
}

export async function deletePost(postId: number): Promise<void> {
  await api.delete(`/posts/${postId}`);
}
