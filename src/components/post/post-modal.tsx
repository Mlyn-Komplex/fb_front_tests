import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Post } from "./post";
import { CommentSection } from "./comment-section";

interface PostModalProps {
  postId: string;
  post: {
    id: string;
    author: {
      name: string;
      avatarUrl?: string;
    };
    date: string;
    content: string;
    initialLikes: number;
    initialComments: Comment[];
    currentUser: {
      name: string;
      image?: string;
    };
  };
  onClose: () => void;
}

interface Comment {
  id: string;
  author: {
    name: string;
    image?: string;
  };
  content: string;
  createdAt: string;
}

export function PostModal({ postId, post, onClose }: PostModalProps) {
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex flex-col h-[80vh]">
          <Post {...post} variant="modal" />
          <div className="flex-1 overflow-y-auto border-t">
            <CommentSection
              postId={postId}
              initialComments={post.initialComments}
              currentUser={post.currentUser}
              isOpen={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
