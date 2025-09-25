import type { Comment } from "@/types/posts.types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { formatTimeAgo } from "@/lib/utils";

interface CommentListProps {
  comments: Comment[];
}
export function CommentList({ comments }: CommentListProps) {
  return (
    <ScrollArea className="w-full h-full scroll-overlay">
      <div className="space-y-6 p-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2 group">
            <Avatar className="h-8 w-8 mt-1">
              {/* <AvatarImage src={comment.author.image} /> */}
              <AvatarFallback>{comment.author.username}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold">
                  {comment.author.username}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(comment.created_at)}
                </span>
              </div>
              <div className="inline-block max-w-[85%]">
                <p className="text-sm bg-gray-100 px-4 py-2 rounded-2xl rounded-tl-sm break-all">
                  {comment.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
