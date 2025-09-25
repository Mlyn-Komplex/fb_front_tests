import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  ThumbsUp,
  Share2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import type { PostData } from "@/types/posts.types";
import { formatTimeAgo } from "@/lib/utils";
import { useAuth } from "@/auth/AuthContext";
import { useLikePost } from "@/hooks/useLikePost";
import { useDislikePost } from "@/hooks/useDislikePost";
// import { useDeletePost } from "@/hooks/useDeletePost"; // you need to implement this hook
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeletePost } from "@/hooks/useDeletePost";

interface PostProps extends PostData {
  variant?: "feed" | "modal";
  onContentClick: () => void;
}

export function Post(post: PostProps) {
  const likeMutation = useLikePost();
  const dislikeMutation = useDislikePost();
  const deleteMutation = useDeletePost();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const liked = post.liked_by.includes(user!.id);
  const isOwner = user?.id === post.author.id;

  const handlePressLike = () => {
    if (liked) {
      dislikeMutation.mutate(post.id);
    } else {
      likeMutation.mutate(post.id);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutateAsync(post.id);
  };

  const containerClasses =
    post.variant === "modal"
      ? "border-0 shadow-none p-4 max-w-none mx-0 mb-0"
      : "border cursor-pointer rounded-lg bg-white shadow-sm p-4 max-w-xl mx-auto mb-6";

  return (
    <div className={containerClasses} onClick={post.onContentClick}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            {/* <AvatarImage src={author.avatarUrl} alt={author.name} /> */}
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{post.author.username}</div>
            <div className="text-xs text-muted-foreground">
              {formatTimeAgo(post.created_at)}
            </div>
          </div>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              asChild
              className={`${post.variant === "modal" && "invisible"} `}
            >
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Post content */}
      <div className="my-4 text-base">{post.content}</div>

      {/* Stats */}
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <div className="flex items-center cursor-pointer">
          <ThumbsUp className="w-4 h-4 mr-1" />
          <span className="mr-4">{post.likes} Likes</span>
        </div>
        <div className="flex items-center cursor-pointer">
          <MessageCircle className="w-4 h-4 mr-1" />
          <span>{post.comments.length} Comments</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between border-t pt-2 gap-x-2">
        <Button
          variant={liked ? "default" : "ghost"}
          size="sm"
          className="flex items-center gap-2 flex-1"
          onClick={(e) => {
            e.stopPropagation();
            handlePressLike();
          }}
        >
          <ThumbsUp className="w-4 h-4" />
          Like
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 flex-1"
          onClick={post.onContentClick}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          aria-describedby={undefined}
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Post;
