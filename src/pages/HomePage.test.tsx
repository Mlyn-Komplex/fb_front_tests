import { act, render, screen } from "@testing-library/react";
import HomePage from "./HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PostData } from "@/types/posts.types";
import * as GetPostsModule from "@/hooks/useGetPosts";
import * as AuthModule from "@/auth/AuthContext";

const mockPosts: PostData[] = [
  {
    id: 1,
    title: "First Post Title",
    content: "First post",
    likes: 10,
    liked_by: [1, 2, 3],
    comments: [],
    created_at: "2023-10-01T10:00:00Z",
    updated_at: "2023-10-01T10:00:00Z",
    author: {
      id: 1,
      username: "user1",
    },
  },
  {
    id: 2,
    title: "Second Post Title",
    content: "Second Post",
    likes: 5,
    liked_by: [3],
    comments: [],
    created_at: "2023-10-01T10:00:00Z",
    updated_at: "2023-10-01T10:00:00Z",
    author: {
      id: 3,
      username: "user3",
    },
  },
];

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

vi.spyOn(GetPostsModule, "useGetPosts").mockReturnValue({
  data: mockPosts,
  isLoading: false,
  isError: false,
} as any as ReturnType<typeof GetPostsModule.useGetPosts>);

vi.spyOn(AuthModule, "useAuth").mockImplementation(() => {
  return {
    user: { id: 1, username: "Alice" },
    token: { access_token: "abc", token_type: "Bearer" },
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
  };
});

vi.mock("@/components/post/post", () => {
  return {
    __esModule: true,
    default: ({
      title,
      onContentClick,
    }: {
      title: string;
      onContentClick: () => void;
    }) => (
      <div onClick={onContentClick} data-testid="mock-post">
        {title}
      </div>
    ),
  };
});

const mockPostModal = vi.fn();

vi.mock("@/components/post/post-modal", () => {
  return {
    __esModule: true,
    PostModal: ({ id }: { id: string }) => mockPostModal(id),
  };
});

describe("HomePage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the HomePage component", () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByTestId("homepage_div")).toBeInTheDocument();
  });

  it("renders posts in descending order by id", () => {
    renderWithProviders(<HomePage />);

    const postTitles = screen.getAllByTestId("mock-post");
    expect(postTitles[0]).toHaveTextContent("Second Post Title");
    expect(postTitles[1]).toHaveTextContent("First Post Title");
  });

  it("opens PostModal when a post is clicked", async () => {
    renderWithProviders(<HomePage />);

    const firstPost = screen.getByText("Second Post Title");
    expect(firstPost).toBeInTheDocument();

    act(() => firstPost.click());
    expect(mockPostModal).toHaveBeenCalledWith(2);
  });
});
