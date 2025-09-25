import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/api/posts";

export const useGetPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};
