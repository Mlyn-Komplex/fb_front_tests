import { render, screen } from "@testing-library/react";
import { CommentList } from "./comment-list";
import type { Comment } from "@/types/posts.types";

// Mock the utils
vi.mock("@/lib/utils", () => ({
  formatTimeAgo: (date: string) => {
    const dateMap: Record<string, string> = {
      "2024-01-01T10:00:00Z": "2 hours ago",
      "2024-01-01T11:00:00Z": "1 hour ago",
      "2024-01-01T12:00:00Z": "30 minutes ago",
    };
    return dateMap[date] || "unknown time";
  },
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

const mockComments: Comment[] = [
  {
    id: 1,
    text: "Great post!",
    author: { id: 2, username: "commenter1" },
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: 2,
    text: "I totally agree with this!",
    author: { id: 3, username: "commenter2" },
    created_at: "2024-01-01T11:00:00Z",
    updated_at: "2024-01-01T11:00:00Z",
  },
  {
    id: 3,
    text: "Thanks for sharing this valuable information.",
    author: { id: 4, username: "commenter3" },
    created_at: "2024-01-01T12:00:00Z",
    updated_at: "2024-01-01T12:00:00Z",
  },
];

describe("CommentList Component", () => {
  it("renders all comments correctly", () => {
    render(<CommentList comments={mockComments} />);

    // Check that usernames appear (they appear in both avatar and name)
    expect(screen.getAllByText("commenter1")).toHaveLength(2);
    expect(screen.getAllByText("commenter2")).toHaveLength(2);
    expect(screen.getAllByText("commenter3")).toHaveLength(2);

    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(screen.getByText("I totally agree with this!")).toBeInTheDocument();
    expect(
      screen.getByText("Thanks for sharing this valuable information.")
    ).toBeInTheDocument();
  });

  it("renders timestamps correctly", () => {
    render(<CommentList comments={mockComments} />);

    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
    expect(screen.getByText("1 hour ago")).toBeInTheDocument();
    expect(screen.getByText("30 minutes ago")).toBeInTheDocument();
  });

  it("renders avatars with correct fallbacks", () => {
    render(<CommentList comments={mockComments} />);

    // Check that usernames appear in avatars (they appear in both avatar and name)
    expect(screen.getAllByText("commenter1")).toHaveLength(2);
    expect(screen.getAllByText("commenter2")).toHaveLength(2);
    expect(screen.getAllByText("commenter3")).toHaveLength(2);
  });

  it("handles empty comments array", () => {
    render(<CommentList comments={[]} />);

    expect(screen.queryByText("commenter1")).not.toBeInTheDocument();
    expect(screen.queryByText("Great post!")).not.toBeInTheDocument();
  });

  it("renders single comment correctly", () => {
    const singleComment = [mockComments[0]];
    render(<CommentList comments={singleComment} />);

    expect(screen.getAllByText("commenter1")).toHaveLength(2);
    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();

    expect(screen.queryByText("commenter2")).not.toBeInTheDocument();
    expect(
      screen.queryByText("I totally agree with this!")
    ).not.toBeInTheDocument();
  });

  it("handles comments with long text", () => {
    const longComment: Comment = {
      id: 4,
      text: "This is a very long comment that should be handled properly by the component and should not break the layout or cause any issues with the rendering.",
      author: { id: 5, username: "longcommenter" },
      created_at: "2024-01-01T13:00:00Z",
      updated_at: "2024-01-01T13:00:00Z",
    };

    render(<CommentList comments={[longComment]} />);

    expect(screen.getAllByText("longcommenter")).toHaveLength(2);
    expect(screen.getByText(longComment.text)).toBeInTheDocument();
  });

  it("handles comments with special characters", () => {
    const specialComment: Comment = {
      id: 5,
      text: "Comment with émojis 🎉 and spëcial chars! @#$%^&*()",
      author: { id: 6, username: "specialuser" },
      created_at: "2024-01-01T14:00:00Z",
      updated_at: "2024-01-01T14:00:00Z",
    };

    render(<CommentList comments={[specialComment]} />);

    expect(screen.getAllByText("specialuser")).toHaveLength(2);
    expect(screen.getByText(specialComment.text)).toBeInTheDocument();
  });

  it("handles usernames with special characters", () => {
    const specialUsernameComment: Comment = {
      id: 6,
      text: "Test comment",
      author: { id: 7, username: "user@domain.com" },
      created_at: "2024-01-01T15:00:00Z",
      updated_at: "2024-01-01T15:00:00Z",
    };

    render(<CommentList comments={[specialUsernameComment]} />);

    expect(screen.getAllByText("user@domain.com")).toHaveLength(2);
    expect(screen.getByText("Test comment")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(<CommentList comments={mockComments} />);

    // ScrollArea doesn't have a region role, so we'll find it by class
    const scrollArea = document.querySelector('[data-slot="scroll-area"]');
    expect(scrollArea).toHaveClass("w-full", "h-full", "scroll-overlay");

    // Find the comments container div with the correct classes
    const commentsContainer = document.querySelector(".space-y-6.p-4");
    expect(commentsContainer).toHaveClass("space-y-6", "p-4");
  });

  it("renders comments in correct order", () => {
    render(<CommentList comments={mockComments} />);

    // Get all comment text elements (the actual comment content)
    const commentTexts = screen.getAllByText(
      /Great post!|I totally agree|Thanks for sharing/
    );
    expect(commentTexts[0]).toHaveTextContent("Great post!");
    expect(commentTexts[1]).toHaveTextContent("I totally agree with this!");
    expect(commentTexts[2]).toHaveTextContent(
      "Thanks for sharing this valuable information."
    );
  });

  it("handles comments with empty text", () => {
    const emptyTextComment: Comment = {
      id: 7,
      text: "",
      author: { id: 8, username: "emptyuser" },
      created_at: "2024-01-01T16:00:00Z",
      updated_at: "2024-01-01T16:00:00Z",
    };

    render(<CommentList comments={[emptyTextComment]} />);

    expect(screen.getAllByText("emptyuser")).toHaveLength(2);
    // Empty text should still render (empty paragraph) - find by class instead
    const commentText = document.querySelector("p.text-sm.bg-gray-100");
    expect(commentText).toBeInTheDocument();
    expect(commentText).toHaveTextContent("");
  });

  it("handles comments with very long usernames", () => {
    const longUsernameComment: Comment = {
      id: 8,
      text: "Test comment",
      author: { id: 9, username: "verylongusernamethatexceedsnormallength" },
      created_at: "2024-01-01T17:00:00Z",
      updated_at: "2024-01-01T17:00:00Z",
    };

    render(<CommentList comments={[longUsernameComment]} />);

    expect(
      screen.getAllByText("verylongusernamethatexceedsnormallength")
    ).toHaveLength(2); // Avatar and name
    expect(screen.getByText("Test comment")).toBeInTheDocument();
  });

  it("renders comment text with proper styling", () => {
    render(<CommentList comments={[mockComments[0]]} />);

    const commentText = screen.getByText("Great post!");
    expect(commentText).toHaveClass(
      "text-sm",
      "bg-gray-100",
      "px-4",
      "py-2",
      "rounded-2xl",
      "rounded-tl-sm",
      "break-all"
    );
  });

  it("renders author names with proper styling", () => {
    render(<CommentList comments={[mockComments[0]]} />);

    const authorNames = screen.getAllByText("commenter1");
    const authorName = authorNames.find(
      (el) => el.tagName === "SPAN" && el.className.includes("font-semibold")
    );
    expect(authorName).toHaveClass("text-sm", "font-semibold");
  });

  it("renders timestamps with proper styling", () => {
    render(<CommentList comments={[mockComments[0]]} />);

    const timestamp = screen.getByText("2 hours ago");
    expect(timestamp).toHaveClass("text-xs", "text-gray-500");
  });
});
