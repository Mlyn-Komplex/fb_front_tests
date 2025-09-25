import { deletePost } from "@/api/posts";
import type { PostData } from "@/types/posts.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onMutate: async (postId: number) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<PostData[]>(["posts"]);

      if (previousPosts) {
        const updatedPosts = previousPosts.filter((post) => post.id !== postId);
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
