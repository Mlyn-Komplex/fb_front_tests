import { addComment } from "@/api/posts";
import type { PostData } from "@/types/posts.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Comment } from "@/types/posts.types";

interface AddCommentVariables {
  postId: number;
  newComment: string;
}

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation<Comment, unknown, AddCommentVariables>({
    mutationFn: ({ postId, newComment }) => addComment(postId, newComment),
    onSuccess: (comment, variables) => {
      queryClient.setQueryData(
        ["posts"],
        (oldPosts: PostData[] | undefined) => {
          if (!oldPosts) return oldPosts;
          return oldPosts.map((post) =>
            post.id === variables.postId
              ? { ...post, comments: [...post.comments, comment] }
              : post
          );
        }
      );
    },
  });
};
