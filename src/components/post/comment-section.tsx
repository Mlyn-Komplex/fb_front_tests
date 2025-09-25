import { useRef } from "react";
import { CommentList } from "./comment-list";
import { AddComment } from "./add-comment";
import type { PostData } from "@/types/posts.types";
import { useAuth } from "@/auth/AuthContext";
import { useAddComment } from "@/hooks/useAddComment";

interface CommentSectionProps
  extends Pick<PostData, "id" | "comments" | "author"> {
  isOpen: boolean;
}

export function CommentSection(post: CommentSectionProps) {
  const mutation = useAddComment();
  const { user } = useAuth();
  const addCommentRef = useRef<HTMLDivElement>(null);

  const handleAddComment = (content: string) => {
    mutation.mutate({ postId: post.id, newComment: content });
  };

  if (!post.isOpen) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <CommentList comments={post.comments} />
      </div>
      <div
        ref={addCommentRef}
        className="sticky bottom-0 left-0 right-0 bg-white"
      >
        <AddComment
          currentUser={user!}
          onAddComment={handleAddComment}
          className="border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
        />
      </div>
    </div>
  );
}
