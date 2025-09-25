export interface PostAuthor {
  id: number;
  username: string;
}

export interface Comment {
  id: number;
  text: string;
  author: PostAuthor;
  created_at: string;
  updated_at: string;
}

export interface PostData {
  id: number;
  title: string;
  content: string;
  likes: number;
  liked_by: number[];
  author: PostAuthor;
  comments: Comment[];
  created_at: string;
  updated_at: string;
}
