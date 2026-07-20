export type Profile = {
  id: string;
  username: string;
  bio: string;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};

export type ReactionType = "like" | "dislike";

export type PostReaction = {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
};

export type PostWithMeta = Post & {
  profiles: Pick<Profile, "username"> | null;
  like_count: number;
  dislike_count: number;
  comment_count: number;
  my_reaction: ReactionType | null;
};
