import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AddPost } from "./add-post";

// Mock the hook
const mockMutate = vi.fn();
vi.mock("@/hooks/useAddPost", () => ({
  useAddPost: vi.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
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

describe("AddPost Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutate.mockClear();
  });

  it("renders the component correctly", () => {
    renderWithProviders(<AddPost />);

    expect(
      screen.getByPlaceholderText("What's on your mind?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument();
    expect(screen.getByText("AV")).toBeInTheDocument(); // Avatar fallback
  });

  it("updates textarea value when typing", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");
    fireEvent.change(textarea, { target: { value: "Hello world!" } });

    expect(textarea).toHaveValue("Hello world!");
  });

  it("enables submit button when content is entered", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const submitButton = screen.getByRole("button", { name: "" });

    expect(submitButton).toBeDisabled();

    fireEvent.change(textarea, { target: { value: "Hello world!" } });

    expect(submitButton).toBeEnabled();
  });

  it("disables submit button when content is empty", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const submitButton = screen.getByRole("button", { name: "" });

    fireEvent.change(textarea, { target: { value: "   " } }); // Only whitespace

    expect(submitButton).toBeDisabled();
  });

  it("calls mutation with correct data when form is submitted", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const form = textarea.closest("form");

    fireEvent.change(textarea, { target: { value: "Test post content" } });
    fireEvent.submit(form!);

    expect(mockMutate).toHaveBeenCalledWith({
      content: "Test post content",
      title: "Not applicable",
    });
  });

  it("calls mutation when Enter key is pressed", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");

    fireEvent.change(textarea, { target: { value: "Test post content" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockMutate).toHaveBeenCalledWith({
      content: "Test post content",
      title: "Not applicable",
    });
  });

  it("does not submit when Shift+Enter is pressed", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");

    fireEvent.change(textarea, { target: { value: "Test post content" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("clears textarea after successful submission", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const form = textarea.closest("form");

    fireEvent.change(textarea, { target: { value: "Test post content" } });
    fireEvent.submit(form!);

    expect(textarea).toHaveValue("");
  });

  it("does not submit when content is empty", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const form = textarea.closest("form");

    fireEvent.change(textarea, { target: { value: "" } });
    fireEvent.submit(form!);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("does not submit when content is only whitespace", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const form = textarea.closest("form");

    fireEvent.change(textarea, { target: { value: "   \n  " } });
    fireEvent.submit(form!);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("applies correct styling to submit button based on content state", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const submitButton = screen.getByRole("button", { name: "" });

    // Initially disabled
    expect(submitButton).toHaveClass("bg-transparent", "text-muted-foreground");

    // After adding content
    fireEvent.change(textarea, { target: { value: "Hello world!" } });
    expect(submitButton).toHaveClass(
      "bg-gray-800",
      "hover:bg-gray-700",
      "text-white"
    );
  });

  it("handles multiline content correctly", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const multilineContent = "Line 1\nLine 2\nLine 3";

    fireEvent.change(textarea, { target: { value: multilineContent } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockMutate).toHaveBeenCalledWith({
      content: multilineContent,
      title: "Not applicable",
    });
  });

  it("has correct textarea attributes", () => {
    renderWithProviders(<AddPost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");

    expect(textarea).toHaveAttribute("placeholder", "What's on your mind?");
    expect(textarea).toHaveClass(
      "pr-12",
      "min-h-[80px]",
      "resize-none",
      "whitespace-pre-wrap"
    );
  });
});
