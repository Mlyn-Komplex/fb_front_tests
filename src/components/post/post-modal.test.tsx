import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostModal } from "./post-modal";
import type { PostData } from "@/types/posts.types";
import { AuthProvider } from "@/auth/AuthContext";

// Mock the hooks
vi.mock("@/hooks/useLikePost", () => ({
  useLikePost: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/hooks/useDislikePost", () => ({
  useDislikePost: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/hooks/useDeletePost", () => ({
  useDeletePost: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/hooks/useAddComment", () => ({
  useAddComment: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

// Mock the utils
vi.mock("@/lib/utils", () => ({
  formatTimeAgo: (date: string) => "2 hours ago",
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
  email: "test@example.com",
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

describe("PostModal Component", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the modal with post content", () => {
    renderWithProviders(<PostModal {...mockPost} onClose={mockOnClose} />);

    // Username appears in both post author and comment form
    expect(screen.getAllByText("testuser")).toHaveLength(2);
    expect(screen.getByText("This is a test post content")).toBeInTheDocument();
    expect(screen.getByText("5 Likes")).toBeInTheDocument();
    expect(screen.getByText("2 Comments")).toBeInTheDocument();
  });

  it("renders the comment section with all comments", () => {
    renderWithProviders(<PostModal {...mockPost} onClose={mockOnClose} />);

    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(screen.getByText("I totally agree!")).toBeInTheDocument();
    // Commenter usernames appear in both avatar and name
    expect(screen.getAllByText("commenter1")).toHaveLength(2);
    expect(screen.getAllByText("commenter2")).toHaveLength(2);
  });

  it("renders the add comment form", () => {
    renderWithProviders(<PostModal {...mockPost} onClose={mockOnClose} />);

    expect(
      screen.getByPlaceholderText("Write a comment...")
    ).toBeInTheDocument();
    expect(screen.getAllByText("testuser")).toHaveLength(2); // Avatar fallback and comment form
  });

  it("calls onClose when dialog is closed", () => {
    renderWithProviders(<PostModal {...mockPost} onClose={mockOnClose} />);

    // Find the dialog close button (usually an X button)
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders with correct CSS classes", () => {
    renderWithProviders(<PostModal {...mockPost} onClose={mockOnClose} />);

    const dialogContent = screen.getByRole("dialog");
    expect(dialogContent).toHaveClass(
      "max-w-2xl",
      "p-0",
      "gap-0",
      "overflow-hidden"
    );

    const modalContainer = dialogContent.querySelector("div");
    expect(modalContainer).toHaveClass("flex", "flex-col", "h-[80vh]");
  });

  it("renders post with modal variant", () => {
    renderWithProviders(<PostModal {...mockPost} onClose={mockOnClose} />);

    // The Post component should be rendered with variant="modal"
    const postContainer = screen
      .getByText("This is a test post content")
      .closest("div")?.parentElement;
    expect(postContainer).toHaveClass("border-0", "shadow-none");
  });

  it("renders comment section as open", () => {
    renderWithProviders(<PostModal {...mockPost} onClose={mockOnClose} />);

    // Comment section should be visible
    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write a comment...")
    ).toBeInTheDocument();
  });

  it("handles empty comments array", () => {
    const postWithoutComments = {
      ...mockPost,
      comments: [],
    };

    renderWithProviders(
      <PostModal {...postWithoutComments} onClose={mockOnClose} />
    );

    expect(screen.getByText("0 Comments")).toBeInTheDocument();
    expect(screen.queryByText("Great post!")).not.toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write a comment...")
    ).toBeInTheDocument();
  });

  it("handles post with no likes", () => {
    const postWithoutLikes = {
      ...mockPost,
      likes: 0,
      liked_by: [],
    };

    renderWithProviders(
      <PostModal {...postWithoutLikes} onClose={mockOnClose} />
    );

    expect(screen.getByText("0 Likes")).toBeInTheDocument();
  });

  it("renders with proper accessibility attributes", () => {
    renderWithProviders(<PostModal {...mockPost} onClose={mockOnClose} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const dialogTitle = screen.getByText("Post Modal");
    expect(dialogTitle).toHaveClass("sr-only");
  });

  it("handles different post content", () => {
    const differentPost = {
      ...mockPost,
      content:
        "Different post content with more text to test the modal rendering.",
      author: { id: 2, username: "differentuser" },
    };

    renderWithProviders(<PostModal {...differentPost} onClose={mockOnClose} />);

    expect(
      screen.getByText(
        "Different post content with more text to test the modal rendering."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("differentuser")).toBeInTheDocument();
  });

  it("handles post with many comments", () => {
    const manyComments = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      text: `Comment ${i + 1}`,
      author: { id: i + 2, username: `commenter${i + 1}` },
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
    }));

    const postWithManyComments = {
      ...mockPost,
      comments: manyComments,
    };

    renderWithProviders(
      <PostModal {...postWithManyComments} onClose={mockOnClose} />
    );

    expect(screen.getByText("10 Comments")).toBeInTheDocument();
    expect(screen.getByText("Comment 1")).toBeInTheDocument();
    expect(screen.getByText("Comment 10")).toBeInTheDocument();
  });

  it("renders scrollable comment area", () => {
    renderWithProviders(<PostModal {...mockPost} onClose={mockOnClose} />);

    // Find the comment area by looking for the div with the correct classes
    const commentArea = document.querySelector(
      ".flex-1.overflow-y-auto.border-t"
    );
    expect(commentArea).toHaveClass("flex-1", "overflow-y-auto", "border-t");
  });

  it("handles post with special characters in content", () => {
    const specialPost = {
      ...mockPost,
      content: "Post with émojis 🎉 and spëcial chars! @#$%^&*()",
    };

    renderWithProviders(<PostModal {...specialPost} onClose={mockOnClose} />);

    expect(
      screen.getByText("Post with émojis 🎉 and spëcial chars! @#$%^&*()")
    ).toBeInTheDocument();
  });

  it("handles post with special characters in comments", () => {
    const specialComment = {
      id: 1,
      text: "Comment with émojis 🎉 and spëcial chars!",
      author: { id: 2, username: "specialuser" },
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
    };

    const postWithSpecialComment = {
      ...mockPost,
      comments: [specialComment],
    };

    renderWithProviders(
      <PostModal {...postWithSpecialComment} onClose={mockOnClose} />
    );

    expect(
      screen.getByText("Comment with émojis 🎉 and spëcial chars!")
    ).toBeInTheDocument();
    expect(screen.getAllByText("specialuser")).toHaveLength(2); // Avatar and name
  });

  it("maintains proper layout structure", () => {
    renderWithProviders(<PostModal {...mockPost} onClose={mockOnClose} />);

    // Check that the main container has the correct structure
    const mainContainer = document.querySelector(".flex.flex-col.h-\\[80vh\\]");
    expect(mainContainer).toHaveClass("flex", "flex-col", "h-[80vh]");

    // Check that the comment section is properly positioned
    const commentSection = document.querySelector(
      ".flex-1.overflow-y-auto.border-t"
    );
    expect(commentSection).toHaveClass("flex-1", "overflow-y-auto", "border-t");
  });
});
