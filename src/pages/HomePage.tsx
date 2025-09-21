import { useState } from "react";
import Post from "@/components/post/post";
import { PostModal } from "@/components/post/post-modal";

function HomePage() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = posts.find((post) => post.id === selectedPostId);

  return (
    <>
      <div className="space-y-6 p-4 max-w-2xl mx-auto">
        {posts.map((post) => (
          <Post
            key={post.id}
            {...post}
            variant="feed"
            onCommentClick={() => setSelectedPostId(post.id)}
          />
        ))}
      </div>

      {selectedPostId && selectedPost && (
        <PostModal
          postId={selectedPostId}
          post={selectedPost}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </>
  );
}

const sampleComments = [
  {
    id: "0",
    author: {
      name: "John Doe",
      image: undefined,
    },
    content: "Great job! Keep it up! 💪",
    createdAt: new Date(Date.now() - 999 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: "1",
    author: {
      name: "Sarah Wilson",
      image: undefined,
    },
    content: "That's amazing! What's your training routine like?",
    createdAt: new Date(Date.now() - 999 * 60 * 15).toISOString(), // 15 minutes ago
  },
];

const currentUser = {
  name: "Current User",
  image: undefined,
};

const posts = [
  {
    id: "1",
    author: { name: "Alice Smith" },
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString(),
    content: "Just finished a 10k run! Feeling great.",
    initialLikes: 12,
    initialComments: sampleComments,
    currentUser: currentUser,
  },
  {
    id: "2",
    author: { name: "Bob Johnson" },
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toLocaleString(),
    content: "Check out this amazing sunset from my trip.",
    initialLikes: 34,
    initialComments: sampleComments,
    currentUser: currentUser,
  },
  {
    id: "3",
    author: { name: "Charlie Lee" },
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString(),
    content: "Started learning React today. Excited for the journey!",
    initialLikes: 5,
    initialComments: sampleComments,
    currentUser: currentUser,
  },
];

export default HomePage;
