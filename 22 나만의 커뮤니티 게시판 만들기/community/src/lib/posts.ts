import { createClient } from "@/lib/supabase/server";
import type { PostWithMeta, ReactionType } from "@/lib/types";

type RawPost = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  image_path: string | null;
  created_at: string;
  updated_at: string;
  profiles: { username: string } | { username: string }[] | null;
};

export async function fetchPostsWithMeta(searchQuery?: string): Promise<PostWithMeta[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("posts")
    .select(
      "id, author_id, title, content, image_path, created_at, updated_at, profiles(username)",
    )
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
  }

  const { data: posts, error } = await query;
  if (error || !posts) return [];

  return attachMeta(posts as RawPost[], user?.id ?? null);
}

export async function fetchPostWithMeta(postId: string): Promise<PostWithMeta | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "id, author_id, title, content, image_path, created_at, updated_at, profiles(username)",
    )
    .eq("id", postId)
    .single();

  if (error || !post) return null;

  const [withMeta] = await attachMeta([post as RawPost], user?.id ?? null);
  return withMeta ?? null;
}

async function attachMeta(posts: RawPost[], userId: string | null): Promise<PostWithMeta[]> {
  if (posts.length === 0) return [];

  const supabase = await createClient();
  const postIds = posts.map((p) => p.id);

  const [{ data: reactions }, { data: comments }] = await Promise.all([
    supabase
      .from("post_reactions")
      .select("post_id, user_id, reaction_type")
      .in("post_id", postIds),
    supabase.from("comments").select("post_id").in("post_id", postIds),
  ]);

  return posts.map((post) => {
    const postReactions = reactions?.filter((r) => r.post_id === post.id) ?? [];
    const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
    const my = userId
      ? postReactions.find((r) => r.user_id === userId)?.reaction_type ?? null
      : null;

    return {
      id: post.id,
      author_id: post.author_id,
      title: post.title,
      content: post.content,
      image_path: post.image_path,
      created_at: post.created_at,
      updated_at: post.updated_at,
      profiles: profile ?? null,
      like_count: postReactions.filter((r) => r.reaction_type === "like").length,
      dislike_count: postReactions.filter((r) => r.reaction_type === "dislike").length,
      comment_count: comments?.filter((c) => c.post_id === post.id).length ?? 0,
      my_reaction: (my as ReactionType | null) ?? null,
    };
  });
}
