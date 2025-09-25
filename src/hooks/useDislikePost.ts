import { dislikePostApi } from "@/api/posts";
import { useAuth } from "@/auth/AuthContext";
import type { PostData } from "@/types/posts.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDislikePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: dislikePostApi,
    onMutate: async (postId: number) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<PostData[]>(["posts"]);

      if (previousPosts) {
        const updatedPosts = previousPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes + 1,
                liked_by: [...post.liked_by.filter((id) => id !== user!.id)],
              }
            : post
        );

        queryClient.setQueryData<PostData[]>(["posts"], updatedPosts);
      }

      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
