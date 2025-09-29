import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CommentSection } from "./comment-section";
import type { PostData } from "@/types/posts.types";
import * as useAddCommentHook from "@/hooks/useAddComment";

// Mock the hooks
vi.mock("@/hooks/useAddComment", () => ({
  useAddComment: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

// Mock the utils
vi.mock("@/lib/utils", () => ({
  formatTimeAgo: (_date: string) => "2 hours ago",
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

const mockPost: PostData = {
  id: 1,
  title: "Test Post",
  content: "This is a test post content",
  author: { id: 1, username: "testuser" },
  likes: 5,
  liked_by: [1, 2, 3],
  comments: [
    {
      id: 1,
      text: "Great post!",
      author: { id: 2, username: "commenter1" },
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
    },
    {
      id: 2,
      text: "I totally agree!",
      author: { id: 3, username: "commenter2" },
      created_at: "2024-01-01T11:00:00Z",
      updated_at: "2024-01-01T11:00:00Z",
    },
  ],
  created_at: "2024-01-01T08:00:00Z",
  updated_at: "2024-01-01T08:00:00Z",
};

const mockUser = {
  id: 1,
  username: "testuser",
};

// Mock AuthProvider
vi.mock("@/auth/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    user: mockUser,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: AllTheProviders });
};

describe("CommentSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when isOpen is false", () => {
    renderWithProviders(
      <CommentSection
        id={mockPost.id}
        comments={mockPost.comments}
        author={mockPost.author}
        isOpen={false}
      />
    );

    expect(screen.queryByText("Great post!")).not.toBeInTheDocument();
    expect(screen.queryByText("Write a comment...")).not.toBeInTheDocument();
  });

  it("renders comment list and add comment form when isOpen is true", () => {
    renderWithProviders(
      <CommentSection
        id={mockPost.id}
        comments={mockPost.comments}
        author={mockPost.author}
        isOpen={true}
      />
    );

    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(screen.getByText("I totally agree!")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write a comment...")
    ).toBeInTheDocument();
  });

  it("renders all comments from the post", () => {
    renderWithProviders(
      <CommentSection
        id={mockPost.id}
        comments={mockPost.comments}
        author={mockPost.author}
        isOpen={true}
      />
    );

    expect(screen.getAllByText("commenter1")).toHaveLength(2); // Avatar and name
    expect(screen.getAllByText("commenter2")).toHaveLength(2); // Avatar and name
    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(screen.getByText("I totally agree!")).toBeInTheDocument();
  });

  it("renders add comment form with current user", () => {
    renderWithProviders(
      <CommentSection
        id={mockPost.id}
        comments={mockPost.comments}
        author={mockPost.author}
        isOpen={true}
      />
    );

    expect(screen.getAllByText("testuser")).toHaveLength(1); // Avatar fallback and comment form
    expect(
      screen.getByPlaceholderText("Write a comment...")
    ).toBeInTheDocument();
  });

  it("calls mutation with correct data when comment is added", () => {
    const mockMutate = vi.fn();

    // Spy on the hook and mock its return value
    vi.spyOn(useAddCommentHook, "useAddComment").mockReturnValue({
      mutate: mockMutate,
    } as unknown as ReturnType<typeof useAddCommentHook.useAddComment>);

    renderWithProviders(
      <CommentSection
        id={mockPost.id}
        comments={mockPost.comments}
        author={mockPost.author}
        isOpen={true}
      />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const form = textarea.closest("form");

    fireEvent.change(textarea, { target: { value: "New comment!" } });
    fireEvent.submit(form!);

    expect(mockMutate).toHaveBeenCalledWith({
      postId: mockPost.id,
      newComment: "New comment!",
    });
  });

  it("handles empty comments array", () => {
    renderWithProviders(
      <CommentSection
        id={mockPost.id}
        comments={[]}
        author={mockPost.author}
        isOpen={true}
      />
    );

    expect(screen.queryByText("Great post!")).not.toBeInTheDocument();
    expect(screen.queryByText("I totally agree!")).not.toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write a comment...")
    ).toBeInTheDocument();
  });

  it("handles different post IDs correctly", () => {
    const mockMutate = vi.fn();
    vi.spyOn(useAddCommentHook, "useAddComment").mockReturnValue({
      mutate: mockMutate,
    } as unknown as ReturnType<typeof useAddCommentHook.useAddComment>);

    const differentPostId = 999;
    renderWithProviders(
      <CommentSection
        id={differentPostId}
        comments={mockPost.comments}
        author={mockPost.author}
        isOpen={true}
      />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const form = textarea.closest("form");

    fireEvent.change(textarea, { target: { value: "New comment!" } });
    fireEvent.submit(form!);

    expect(mockMutate).toHaveBeenCalledWith({
      postId: differentPostId,
      newComment: "New comment!",
    });
  });

  it("handles different authors correctly", () => {
    const differentAuthor = { id: 2, username: "differentuser" };

    renderWithProviders(
      <CommentSection
        id={mockPost.id}
        comments={mockPost.comments}
        author={differentAuthor}
        isOpen={true}
      />
    );

    // Should still render the comments and add comment form
    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write a comment...")
    ).toBeInTheDocument();
  });

  it("renders with proper accessibility attributes", () => {
    renderWithProviders(
      <CommentSection
        id={mockPost.id}
        comments={mockPost.comments}
        author={mockPost.author}
        isOpen={true}
      />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    expect(textarea).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "" });
    expect(submitButton).toBeInTheDocument();
  });

  it("handles rapid state changes between open and closed", () => {
    const { rerender } = renderWithProviders(
      <CommentSection
        id={mockPost.id}
        comments={mockPost.comments}
        author={mockPost.author}
        isOpen={false}
      />
    );

    expect(screen.queryByText("Great post!")).not.toBeInTheDocument();

    rerender(
      <CommentSection
        id={mockPost.id}
        comments={mockPost.comments}
        author={mockPost.author}
        isOpen={true}
      />
    );

    expect(screen.getByText("Great post!")).toBeInTheDocument();

    rerender(
      <CommentSection
        id={mockPost.id}
        comments={mockPost.comments}
        author={mockPost.author}
        isOpen={false}
      />
    );

    expect(screen.queryByText("Great post!")).not.toBeInTheDocument();
  });
});
