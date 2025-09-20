import { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddCommentProps {
  currentUser: {
    name: string;
    image?: string;
  };
  onAddComment: (content: string) => void;
  className?: string;
}

export function AddComment({
  currentUser,
  onAddComment,
  className,
}: AddCommentProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddComment(content);
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift+Enter: let the default behavior (new line) happen
        return;
      } else {
        // Enter without shift: submit the form
        e.preventDefault();
        if (content.trim()) {
          onAddComment(content);
          setContent("");
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex gap-4 p-4 bg-white transition-shadow duration-200",
        className
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={currentUser.image} />
        <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 relative">
        <Textarea
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          className="pr-12 min-h-[60px] resize-none bg-gray-50 border-gray-200"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!content.trim()}
          className="absolute right-2 bottom-2 h-8 w-8"
          variant="ghost"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
