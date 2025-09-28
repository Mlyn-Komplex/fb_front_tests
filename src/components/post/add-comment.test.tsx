import { render, screen, fireEvent } from "@testing-library/react";
import { AddComment } from "./add-comment";
import type { User } from "@/auth/AuthContext";

const mockUser: User = {
  id: 1,
  username: "testuser",
};

const mockOnAddComment = vi.fn();

describe("AddComment Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    expect(
      screen.getByPlaceholderText("Write a comment...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument(); // Avatar fallback
  });

  it("updates textarea value when typing", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    fireEvent.change(textarea, { target: { value: "Great post!" } });

    expect(textarea).toHaveValue("Great post!");
  });

  it("enables submit button when content is entered", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const submitButton = screen.getByRole("button", { name: "" });

    expect(submitButton).toBeDisabled();

    fireEvent.change(textarea, { target: { value: "Great post!" } });

    expect(submitButton).toBeEnabled();
  });

  it("disables submit button when content is empty", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const submitButton = screen.getByRole("button", { name: "" });

    fireEvent.change(textarea, { target: { value: "   " } }); // Only whitespace

    expect(submitButton).toBeDisabled();
  });

  it("calls onAddComment with correct content when form is submitted", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const form = textarea.closest("form");

    fireEvent.change(textarea, { target: { value: "Great post!" } });
    fireEvent.submit(form!);

    expect(mockOnAddComment).toHaveBeenCalledWith("Great post!");
  });

  it("calls onAddComment when Enter key is pressed", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");

    fireEvent.change(textarea, { target: { value: "Great post!" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockOnAddComment).toHaveBeenCalledWith("Great post!");
  });

  it("does not submit when Shift+Enter is pressed", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");

    fireEvent.change(textarea, { target: { value: "Great post!" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(mockOnAddComment).not.toHaveBeenCalled();
  });

  it("clears textarea after successful submission", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const form = textarea.closest("form");

    fireEvent.change(textarea, { target: { value: "Great post!" } });
    fireEvent.submit(form!);

    expect(textarea).toHaveValue("");
  });

  it("does not submit when content is empty", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const form = textarea.closest("form");

    fireEvent.change(textarea, { target: { value: "" } });
    fireEvent.submit(form!);

    expect(mockOnAddComment).not.toHaveBeenCalled();
  });

  it("does not submit when content is only whitespace", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const form = textarea.closest("form");

    fireEvent.change(textarea, { target: { value: "   \n  " } });
    fireEvent.submit(form!);

    expect(mockOnAddComment).not.toHaveBeenCalled();
  });

  it("applies custom className when provided", () => {
    const customClassName = "custom-comment-class";

    render(
      <AddComment
        currentUser={mockUser}
        onAddComment={mockOnAddComment}
        className={customClassName}
      />
    );

    const form = screen
      .getByPlaceholderText("Write a comment...")
      .closest("form");
    expect(form).toHaveClass(customClassName);
  });

  it("handles multiline content correctly", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const multilineContent = "Line 1\nLine 2\nLine 3";

    fireEvent.change(textarea, { target: { value: multilineContent } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockOnAddComment).toHaveBeenCalledWith(multilineContent);
  });

  it("has correct textarea attributes", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");

    expect(textarea).toHaveAttribute("placeholder", "Write a comment...");
    expect(textarea).toHaveClass(
      "pr-12",
      "min-h-[60px]",
      "resize-none",
      "bg-gray-50",
      "border-gray-200"
    );
  });

  it("shows correct avatar fallback for different usernames", () => {
    const userWithLongName = {
      ...mockUser,
      username: "verylongusername",
    };

    render(
      <AddComment
        currentUser={userWithLongName}
        onAddComment={mockOnAddComment}
      />
    );

    expect(screen.getByText("verylongusername")).toBeInTheDocument();
  });

  it("handles special characters in comment content", () => {
    render(
      <AddComment currentUser={mockUser} onAddComment={mockOnAddComment} />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const specialContent = "Comment with émojis 🎉 and spëcial chars!";

    fireEvent.change(textarea, { target: { value: specialContent } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockOnAddComment).toHaveBeenCalledWith(specialContent);
  });
});
