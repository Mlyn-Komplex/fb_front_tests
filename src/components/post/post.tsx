import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, Share2 } from "lucide-react";

type PostProps = {
  id: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  date: string;
  content: string;
  initialLikes?: number;
  initialComments?: Comment[];
  currentUser: {
    name: string;
    image?: string;
  };
  variant?: "feed" | "modal";
  onCommentClick?: () => void;
};

interface Comment {
  id: string;
  author: {
    name: string;
    image?: string;
  };
  content: string;
  createdAt: string;
}

export function Post({
  author,
  date,
  content,
  initialLikes = 0,
  initialComments = [],
  variant = "feed",
  onCommentClick,
}: PostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const containerClasses =
    variant === "modal"
      ? "border-0 shadow-none p-4 max-w-none mx-0 mb-0"
      : "border rounded-lg bg-white shadow-sm p-4 max-w-xl mx-auto mb-6";

  return (
    <div className={containerClasses}>
      <div className="flex items-center mb-3">
        <Avatar className="h-10 w-10 mr-3">
          {author.avatarUrl ? (
            <AvatarImage src={author.avatarUrl} alt={author.name} />
          ) : (
            <AvatarFallback>AV</AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-semibold">{author.name}</div>
          <div className="text-xs text-muted-foreground">{date}</div>
        </div>
      </div>
      <div className="my-4 text-base">{content}</div>
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <div className="flex items-center">
          <ThumbsUp className="w-4 h-4 mr-1" />
          <span className="mr-4">{likes} Likes</span>
        </div>
        <div
          className="flex items-center cursor-pointer"
          onClick={onCommentClick}
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          <span>{initialComments?.length ?? 0} Comments</span>
        </div>
      </div>
      <div className="flex justify-between border-t pt-2 gap-x-2">
        <Button
          variant={liked ? "default" : "ghost"}
          size="sm"
          className="flex items-center gap-2 flex-1"
          onClick={handleLike}
        >
          <ThumbsUp className="w-4 h-4" />
          Like
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 flex-1"
          onClick={onCommentClick}
        >
          <MessageCircle className="w-4 h-4" />
          Comment
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 flex-1"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  );
}

export default Post;
