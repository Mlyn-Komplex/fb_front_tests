import { useState } from "react";
import Post from "@/components/post/post";
import { PostModal } from "@/components/post/post-modal";
import { AddPost } from "@/components/post/add-post";
import { useGetPosts } from "@/hooks/useGetPosts";

function HomePage() {
  const posts = useGetPosts();
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const sortedPosts = posts.data?.sort((a, b) => b.id - a.id);

  return (
    <>
      <div
        data-testid="homepage_div"
        className="space-y-6 p-4 max-w-2xl mx-auto"
      >
        <AddPost />
        {sortedPosts?.map((post) => (
          <Post
            key={post.id}
            {...post}
            variant="feed"
            onContentClick={() => setSelectedPostId(post.id)}
          />
        ))}
      </div>
      {selectedPostId && (
        <PostModal
          {...posts.data?.find((post) => post.id === selectedPostId)!}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </>
  );
}

export default HomePage;
