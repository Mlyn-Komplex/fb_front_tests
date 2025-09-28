import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Post } from "./post";
import type { PostData } from "@/types/posts.types";
import { AuthProvider } from "@/auth/AuthContext";
import { vi } from "vitest";
import * as AuthModule from "@/auth/AuthContext";
import * as useDeleteMutation from "@/hooks/useDeletePost";
// -----------------
// Mock hooks
// -----------------
const mockLikeMutation = vi.fn();
const mockDislikeMutation = vi.fn();
const mockDeleteMutation = vi.fn();

vi.mock("@/hooks/useLikePost", () => ({
  useLikePost: () => ({ mutate: mockLikeMutation, isPending: false }),
}));

vi.mock("@/hooks/useDislikePost", () => ({
  useDislikePost: () => ({ mutate: mockDislikeMutation, isPending: false }),
}));

vi.mock("@/hooks/useDeletePost", () => ({
  useDeletePost: () => ({ mutateAsync: mockDeleteMutation, isPending: false }),
}));

vi.mock("@/lib/utils", async () => {
  const actual: any = await vi.importActual("@/lib/utils");
  return {
    ...actual,
    formatTimeAgo: (_date: string) => "2 hours ago",
  };
});

// -----------------
// Mock data
// -----------------
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
      author: { id: 2, username: "commenter" },
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
    },
  ],
  created_at: "2024-01-01T08:00:00Z",
  updated_at: "2024-01-01T08:00:00Z",
};

vi.spyOn(AuthModule, "useAuth").mockReturnValue({
  user: { id: 1, username: "Alice" },
  token: { access_token: "abc", token_type: "Bearer" },
  login: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

const renderWithProviders = (ui: React.ReactElement) =>
  render(ui, { wrapper: AllTheProviders });

// -----------------
// Tests
// -----------------
describe("Post Component", () => {
  const mockOnContentClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders post content correctly", () => {
    renderWithProviders(
      <Post {...mockPost} onContentClick={mockOnContentClick} />
    );

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
    expect(screen.getByText("This is a test post content")).toBeInTheDocument();
    expect(screen.getByText("5 Likes")).toBeInTheDocument();
    expect(screen.getByText("1 Comments")).toBeInTheDocument();
  });

  it("renders with feed variant by default", () => {
    renderWithProviders(
      <Post {...mockPost} onContentClick={mockOnContentClick} />
    );
    const container = screen.getByText(
      "This is a test post content"
    ).parentElement;
    expect(container).toHaveClass("border", "cursor-pointer", "rounded-lg");
  });

  it("renders with modal variant when specified", () => {
    renderWithProviders(
      <Post {...mockPost} onContentClick={mockOnContentClick} variant="modal" />
    );
    const container = screen.getByText(
      "This is a test post content"
    ).parentElement;
    expect(container).toHaveClass("border-0", "shadow-none");
  });

  it("calls onContentClick when post container is clicked", () => {
    renderWithProviders(
      <Post {...mockPost} onContentClick={mockOnContentClick} />
    );
    const container = screen
      .getByText("This is a test post content")
      .closest("div")!;
    fireEvent.click(container);
    expect(mockOnContentClick).toHaveBeenCalledTimes(1);
  });

  it("renders like button correctly based on user liked state", () => {
    renderWithProviders(
      <Post {...mockPost} onContentClick={mockOnContentClick} />
    );
    const likeButton = screen.getByRole("button", { name: /like/i });
    expect(likeButton).toHaveClass("bg-primary", "text-primary-foreground"); // liked state
  });

  it("renders ghost like button if user has not liked", () => {
    const postWithoutLike = { ...mockPost, liked_by: [2, 3] };
    renderWithProviders(
      <Post {...postWithoutLike} onContentClick={mockOnContentClick} />
    );
    const likeButton = screen.getByRole("button", { name: /like/i });
    expect(likeButton).toHaveClass(
      "hover:bg-accent",
      "hover:text-accent-foreground"
    );
  });

  it("shows delete dropdown only for post owner", () => {
    renderWithProviders(
      <Post {...mockPost} onContentClick={mockOnContentClick} />
    );
    const moreButton = screen.getByLabelText("More Options"); // replace with aria-label if possible
    expect(moreButton).toBeInTheDocument();
  });

  it("does not show delete dropdown for non-owner", () => {
    const otherPost = { ...mockPost, author: { id: 2, username: "otheruser" } };
    renderWithProviders(
      <Post {...otherPost} onContentClick={mockOnContentClick} />
    );
    const moreButton = screen.queryByRole("button", { name: "" });
    expect(moreButton).not.toBeInTheDocument();
  });

  it("calls like mutation correctly", () => {
    renderWithProviders(
      <Post
        {...mockPost}
        liked_by={[2, 3]}
        onContentClick={mockOnContentClick}
      />
    );
    const likeButton = screen.getByRole("button", { name: /like/i });
    fireEvent.click(likeButton);
    expect(mockLikeMutation).toHaveBeenCalledWith(mockPost.id);
  });

  it("calls dislike mutation correctly", () => {
    renderWithProviders(
      <Post {...mockPost} onContentClick={mockOnContentClick} />
    );
    const likeButton = screen.getByRole("button", { name: /like/i });
    fireEvent.click(likeButton);
    expect(mockDislikeMutation).toHaveBeenCalledWith(mockPost.id);
  });

  it("opens delete dialog and deletes post", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Post {...mockPost} onContentClick={mockOnContentClick} />
    );

    // Open dropdown
    const moreButton = screen.getByLabelText("More Options");
    await user.click(moreButton);

    // Wait for Delete action to appear
    const deleteActionIcon = await screen.findByLabelText("Delete action");
    user.click(deleteActionIcon);

    // Assert dialog opens
    await waitFor(() => {
      expect(
        screen.getByText(
          "Are you sure you want to delete this post? This action cannot be undone."
        )
      ).toBeInTheDocument();
    });

    const confirmDelete = screen.getByText("Delete");
    fireEvent.click(confirmDelete);

    expect(mockDeleteMutation).toHaveBeenCalledWith(mockPost.id);
  });

  it("displays loading state when deleting", async () => {
    const user = userEvent.setup();
    vi.spyOn(useDeleteMutation, "useDeletePost").mockReturnValue({
      mutate: mockDeleteMutation,
      isPending: true,
    } as unknown as ReturnType<typeof useDeleteMutation.useDeletePost>);

    renderWithProviders(
      <Post {...mockPost} onContentClick={mockOnContentClick} />
    );

    const moreButton = screen.getByLabelText("More Options");
    await user.click(moreButton);

    const deleteActionIcon = await screen.findByLabelText("Delete action");
    user.click(deleteActionIcon);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Are you sure you want to delete this post? This action cannot be undone."
        )
      ).toBeInTheDocument();
    });

    const confirmDelete = screen.getByText("Deleting...");
    expect(confirmDelete).toBeDisabled();
    expect(confirmDelete).toHaveTextContent("Deleting...");
  });

  it("handles empty comments and zero likes", () => {
    const postEmpty = { ...mockPost, comments: [], likes: 0, liked_by: [] };
    renderWithProviders(
      <Post {...postEmpty} onContentClick={mockOnContentClick} />
    );
    expect(screen.getByText("0 Comments")).toBeInTheDocument();
    expect(screen.getByText("0 Likes")).toBeInTheDocument();
  });
});
