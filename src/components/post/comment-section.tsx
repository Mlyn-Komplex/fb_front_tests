import { useState, useRef, useEffect } from "react";
import { CommentList } from "./comment-list";
import { AddComment } from "./add-comment";

interface Comment {
  id: string;
  author: {
    name: string;
    image?: string;
  };
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  currentUser: {
    name: string;
    image?: string;
  };
  isOpen: boolean;
}

export function CommentSection({
  postId,
  initialComments,
  currentUser,
  isOpen,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const addCommentRef = useRef<HTMLDivElement>(null);

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substring(7), // Temporary ID generation
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
    };

    setComments((prevComments) => [...prevComments, newComment]);
    // Here you would typically make an API call to save the comment
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <CommentList comments={comments} />
      </div>
      <div
        ref={addCommentRef}
        className="sticky bottom-0 left-0 right-0 bg-white"
      >
        <AddComment
          currentUser={currentUser}
          onAddComment={handleAddComment}
          className="border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
        />
      </div>
    </div>
  );
}
