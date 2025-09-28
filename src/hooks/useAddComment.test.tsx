import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAddComment } from "./useAddComment";
import * as api from "@/api/posts";
import { vi } from "vitest";
import { type PostData } from "@/types/posts.types";

describe("useAddComment hook", () => {
  const queryClient = new QueryClient();
  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("calls addComment and updates cache on success", async () => {
    const mockComment = {
      id: 1,
      text: "Hello!",
      author: { id: 1, username: "Alice" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    vi.spyOn(api, "addComment").mockResolvedValue(mockComment);

    // Seed the cache
    queryClient.setQueryData<PostData[]>(
      ["posts"],
      [
        {
          id: 123,
          title: "Test Post",
          author: { id: 1, username: "Alice" },
          comments: [],
          content: "Test content",
          likes: 0,
          liked_by: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    );

    const { result } = renderHook(() => useAddComment(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ postId: 123, newComment: "Hello!" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const posts = queryClient.getQueryData<PostData[]>(["posts"]);
    expect(posts?.[0].comments).toContainEqual(mockComment);
  });
});
