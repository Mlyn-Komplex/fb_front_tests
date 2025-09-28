import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAddPost } from "./useAddPost";
import * as api from "@/api/posts";

describe("useAddPost", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("calls createPost and invalidates posts query on success", async () => {
    const mockPost = {
      id: 1,
      title: "Test",
      content: "Test",
      likes: 0,
      liked_by: [],
      author: { id: 1, username: "Test" },
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      comments: [],
    };
    const createPostSpy = vi
      .spyOn(api, "createPost")
      .mockResolvedValue(mockPost);
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useAddPost(), { wrapper });

    act(() => {
      result.current.mutate(mockPost);
    });

    await waitFor(() => result.current.isSuccess);

    expect(createPostSpy).toHaveBeenCalledWith(mockPost, expect.any(Object));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["posts"] });
  });
});
