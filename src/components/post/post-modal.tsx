import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Post } from "./post";
import { CommentSection } from "./comment-section";
import type { PostData } from "@/types/posts.types";
import { DialogTitle } from "@radix-ui/react-dialog";

interface PostModalProps extends PostData {
  onClose: () => void;
}

export function PostModal(post: PostModalProps) {
  return (
    <Dialog open={true} onOpenChange={() => post.onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-2xl p-0 gap-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">Post Modal</DialogTitle>
        <div className="flex flex-col h-[80vh]">
          <Post {...post} onContentClick={() => null} variant="modal" />
          <div className="flex-1 overflow-y-auto border-t">
            <CommentSection
              id={post.id}
              comments={post.comments}
              author={post.author}
              isOpen={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
