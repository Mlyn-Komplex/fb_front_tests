import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAddPost } from "@/hooks/useAddPost";

export const AddPost = () => {
  const [content, setContent] = useState("");
  const mutation = useAddPost();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim()) return;
    mutation.mutate({ content, title: "Not applicable" });
    setContent(""); // Clear input after submission
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent = content.trim().length > 0;

  return (
    <Card className="p-4 mb-4 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <div className="relative flex-grow">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-12 min-h-[80px] resize-none whitespace-pre-wrap"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!hasContent}
            className={cn(
              "absolute right-3 bottom-3 h-8 w-8",
              "transition-colors duration-200",
              hasContent
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-transparent hover:bg-transparent text-muted-foreground",
              "data-[state=disabled]:opacity-50"
            )}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Card>
  );
};
