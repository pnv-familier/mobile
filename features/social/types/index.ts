export interface Post {
  post_id: number;
  family_id: number;
  user_id: string;
  content: string;
  created_at: string;
  author_name: string;
  author_avatar: string;
  images: PostImage[];
  videos: string[];
  reaction_count: number;
  comment_count: number;
  has_more?: boolean;
  user_reacted?: boolean;
}

export interface PostImage {
  image_id: number;
  post_id: number;
  image_url: string;
  order_index: number;
}
