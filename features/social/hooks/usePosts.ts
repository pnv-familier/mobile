import { useState, useEffect } from 'react';
import { Post, PostImage } from '../types';
import { getFeed } from '../services/post.service';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getFeed();
      
      // Transform API response to match Post interface
      const transformedPosts: Post[] = response.data.posts.map((post, index) => ({
        post_id: post.postId,
        family_id: 0, // Not provided by API
        user_id: post.author.userId,
        content: post.content,
        created_at: post.createdAt,
        author_name: post.author.fullName,
        author_avatar: post.author.avatarUrl,
        images: post.images.map((url, idx): PostImage => ({
          image_id: index * 100 + idx,
          post_id: post.postId,
          image_url: url,
          order_index: idx
        })),
        reaction_count: post.reactionCount,
        comment_count: post.commentCount,
        has_more: post.hasMore
      }));
      
      setPosts(transformedPosts);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, error, refetch: fetchPosts };
};
