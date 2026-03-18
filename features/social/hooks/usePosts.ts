import { useState, useEffect } from 'react';
import { Post, PostImage } from '../types';
import { getFeed, toggleReaction } from '../services/post.service';

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
      
      const transformedPosts: Post[] = response.data.posts.map((post, index) => ({
        post_id: post.postId,
        family_id: 0,
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
        videos: post.videos || [],
        reaction_count: post.reactionCount,
        comment_count: post.commentCount,
        has_more: post.hasMore,
        user_reacted: post.userReacted || false,
      }));
      
      setPosts(transformedPosts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const updatePostReaction = async (postId: number) => {
    const postIndex = posts.findIndex(p => p.post_id === postId);
    if (postIndex === -1) return;

    const oldPost = posts[postIndex];
    const optimisticPost = {
      ...oldPost,
      user_reacted: !oldPost.user_reacted,
      reaction_count: oldPost.user_reacted ? oldPost.reaction_count - 1 : oldPost.reaction_count + 1,
    };

    setPosts(prev => [
      ...prev.slice(0, postIndex),
      optimisticPost,
      ...prev.slice(postIndex + 1),
    ]);

    try {
      const response = await toggleReaction(postId);
      setPosts(prev => {
        const idx = prev.findIndex(p => p.post_id === postId);
        if (idx === -1) return prev;
        return [
          ...prev.slice(0, idx),
          { ...prev[idx], user_reacted: response.data.reacted, reaction_count: response.data.reactionCount },
          ...prev.slice(idx + 1),
        ];
      });
    } catch (err) {
      setPosts(prev => [
        ...prev.slice(0, postIndex),
        oldPost,
        ...prev.slice(postIndex + 1),
      ]);
      throw err;
    }
  };

  const incrementCommentCount = (postId: number) => {
    setPosts(prev => {
      const idx = prev.findIndex(p => p.post_id === postId);
      if (idx === -1) return prev;
      return [
        ...prev.slice(0, idx),
        { ...prev[idx], comment_count: prev[idx].comment_count + 1 },
        ...prev.slice(idx + 1),
      ];
    });
  };

  return { posts, loading, error, refetch: fetchPosts, updatePostReaction, incrementCommentCount };
};
