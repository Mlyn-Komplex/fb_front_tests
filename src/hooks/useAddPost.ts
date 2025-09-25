import { createPost } from "@/api/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      return data;
    },
  });
};
