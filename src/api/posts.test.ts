import type { PostData, Comment } from "@/types/posts.types";

// Mock the axios module
const mockApi = {
  post: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock("./axios", () => ({
  api: mockApi,
}));

describe("posts.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createPost", () => {
    it("should create a post successfully", async () => {
      const mockPost: PostData = {
        id: 1,
        title: "Test Post",
        content: "This is a test post",
        author: { id: 1, username: "testuser" },
        created_at: "2024-01-01T00:00:00Z",
        likes: 0,
        liked_by: [],
        updated_at: "2024-01-01T00:00:00Z",
        comments: [],
      };

      const mockResponse = {
        data: mockPost,
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const { createPost } = await import("./posts");
      const credentials = {
        title: "Test Post",
        content: "This is a test post",
      };

      const result = await createPost(credentials);

      expect(mockApi.post).toHaveBeenCalledWith("/posts", credentials);
      expect(result).toEqual(mockPost);
    });

    it("should handle post creation errors", async () => {
      const error = new Error("Failed to create post");
      mockApi.post.mockRejectedValue(error);

      const { createPost } = await import("./posts");
      const credentials = {
        title: "Test Post",
        content: "This is a test post",
      };

      await expect(createPost(credentials)).rejects.toThrow(
        "Failed to create post"
      );
      expect(mockApi.post).toHaveBeenCalledWith("/posts", credentials);
    });
  });

  describe("fetchPosts", () => {
    it("should fetch posts successfully", async () => {
      const mockPosts: PostData[] = [
        {
          id: 1,
          title: "Test Post 1",
          content: "This is test post 1",
          author: { id: 1, username: "testuser1" },
          created_at: "2024-01-01T00:00:00Z",
          likes: 5,
          liked_by: [],
          updated_at: "2024-01-01T00:00:00Z",
          comments: [],
        },
        {
          id: 2,
          title: "Test Post 2",
          content: "This is test post 2",
          author: { id: 2, username: "testuser2" },
          liked_by: [],
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
          likes: 3,
          comments: [],
        },
      ];

      const mockResponse = {
        data: mockPosts,
      };

      mockApi.get.mockResolvedValue(mockResponse);

      const { fetchPosts } = await import("./posts");
      const result = await fetchPosts();

      expect(mockApi.get).toHaveBeenCalledWith("/posts");
      expect(result).toEqual(mockPosts);
    });

    it("should handle fetch posts errors", async () => {
      const error = new Error("Failed to fetch posts");
      mockApi.get.mockRejectedValue(error);

      const { fetchPosts } = await import("./posts");
      await expect(fetchPosts()).rejects.toThrow("Failed to fetch posts");
      expect(mockApi.get).toHaveBeenCalledWith("/posts");
    });

    it("should handle empty posts array", async () => {
      const mockResponse = {
        data: [],
      };

      mockApi.get.mockResolvedValue(mockResponse);

      const { fetchPosts } = await import("./posts");
      const result = await fetchPosts();

      expect(mockApi.get).toHaveBeenCalledWith("/posts");
      expect(result).toEqual([]);
    });
  });

  describe("addComment", () => {
    it("should add a comment successfully", async () => {
      const mockComment: Comment = {
        id: 1,
        text: "This is a test comment",
        author: { id: 1, username: "testuser" },
        updated_at: "2024-01-01T00:00:00Z",
        created_at: "2024-01-01T00:00:00Z",
      };

      const mockResponse = {
        data: mockComment,
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const { addComment } = await import("./posts");
      const postId = 1;
      const text = "This is a test comment";

      const result = await addComment(postId, text);

      expect(mockApi.post).toHaveBeenCalledWith(`/posts/${postId}/comments`, {
        text,
      });
      expect(result).toEqual(mockComment);
    });

    it("should handle add comment errors", async () => {
      const error = new Error("Failed to add comment");
      mockApi.post.mockRejectedValue(error);

      const { addComment } = await import("./posts");
      const postId = 1;
      const text = "This is a test comment";

      await expect(addComment(postId, text)).rejects.toThrow(
        "Failed to add comment"
      );
      expect(mockApi.post).toHaveBeenCalledWith(`/posts/${postId}/comments`, {
        text,
      });
    });

    it("should handle different post IDs", async () => {
      const mockComment: Comment = {
        id: 1,
        text: "This is a test comment",
        author: { id: 1, username: "testuser" },
        updated_at: "2024-01-01T00:00:00Z",
        created_at: "2024-01-01T00:00:00Z",
      };

      const mockResponse = {
        data: mockComment,
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const { addComment } = await import("./posts");
      const postId = 999;
      const text = "This is a test comment";

      const result = await addComment(postId, text);

      expect(mockApi.post).toHaveBeenCalledWith(`/posts/${postId}/comments`, {
        text,
      });
      expect(result).toEqual(mockComment);
    });
  });

  describe("likePostApi", () => {
    it("should like a post successfully", async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const { likePostApi } = await import("./posts");
      const postId = 1;

      const result = await likePostApi(postId);

      expect(mockApi.post).toHaveBeenCalledWith(`/posts/${postId}/like`);
      expect(result).toEqual({ success: true });
    });

    it("should handle like post errors", async () => {
      const error = new Error("Failed to like post");
      mockApi.post.mockRejectedValue(error);

      const { likePostApi } = await import("./posts");
      const postId = 1;

      await expect(likePostApi(postId)).rejects.toThrow("Failed to like post");
      expect(mockApi.post).toHaveBeenCalledWith(`/posts/${postId}/like`);
    });

    it("should handle different post IDs for liking", async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const { likePostApi } = await import("./posts");
      const postId = 42;

      const result = await likePostApi(postId);

      expect(mockApi.post).toHaveBeenCalledWith(`/posts/${postId}/like`);
      expect(result).toEqual({ success: true });
    });
  });

  describe("dislikePostApi", () => {
    it("should dislike a post successfully", async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const { dislikePostApi } = await import("./posts");
      const postId = 1;

      const result = await dislikePostApi(postId);

      expect(mockApi.delete).toHaveBeenCalledWith(`/posts/${postId}/like`);
      expect(result).toEqual({ success: true });
    });

    it("should handle dislike post errors", async () => {
      const error = new Error("Failed to dislike post");
      mockApi.delete.mockRejectedValue(error);

      const { dislikePostApi } = await import("./posts");
      const postId = 1;

      await expect(dislikePostApi(postId)).rejects.toThrow(
        "Failed to dislike post"
      );
      expect(mockApi.delete).toHaveBeenCalledWith(`/posts/${postId}/like`);
    });

    it("should handle different post IDs for disliking", async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const { dislikePostApi } = await import("./posts");
      const postId = 42;

      const result = await dislikePostApi(postId);

      expect(mockApi.delete).toHaveBeenCalledWith(`/posts/${postId}/like`);
      expect(result).toEqual({ success: true });
    });
  });

  describe("deletePost", () => {
    it("should delete a post successfully", async () => {
      mockApi.delete.mockResolvedValue({ data: { success: true } });

      const { deletePost } = await import("./posts");
      const postId = 1;

      await deletePost(postId);

      expect(mockApi.delete).toHaveBeenCalledWith(`/posts/${postId}`);
    });

    it("should handle delete post errors", async () => {
      const error = new Error("Failed to delete post");
      mockApi.delete.mockRejectedValue(error);

      const { deletePost } = await import("./posts");
      const postId = 1;

      await expect(deletePost(postId)).rejects.toThrow("Failed to delete post");
      expect(mockApi.delete).toHaveBeenCalledWith(`/posts/${postId}`);
    });

    it("should handle different post IDs for deletion", async () => {
      mockApi.delete.mockResolvedValue({ data: { success: true } });

      const { deletePost } = await import("./posts");
      const postId = 42;

      await deletePost(postId);

      expect(mockApi.delete).toHaveBeenCalledWith(`/posts/${postId}`);
    });

    it("should not return any value on successful deletion", async () => {
      mockApi.delete.mockResolvedValue({ data: { success: true } });

      const { deletePost } = await import("./posts");
      const postId = 1;

      const result = await deletePost(postId);

      expect(result).toBeUndefined();
    });
  });
});
