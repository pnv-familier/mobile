import { useState, useEffect } from 'react';
import { Post, PostImage } from '../types';
import { getFeed, toggleReaction } from '../services/post.service';
import { useAuthStore } from '../../auth/store/auth.store';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getFeed();
      
      const transformedPosts: Post[] = response.data.posts.map((post, index) => {
        const userReacted = post.userReacted ?? post.reacted ?? false;
        return {
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
          user_reacted: userReacted === true,
        };
      });
      
      setPosts(transformedPosts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const addNewPost = (newPostData: any) => {
    const userReacted = newPostData.userReacted ?? newPostData.reacted ?? false;
    const newPost: Post = {
      post_id: newPostData.postId,
      family_id: 0,
      user_id: user?.id || '',
      content: newPostData.content,
      created_at: newPostData.createdAt || new Date().toISOString(),
      author_name: user?.fullName || '',
      author_avatar: user?.avatarUrl || '',
      images: (newPostData.imageUrls || newPostData.images || []).map((url: string, idx: number): PostImage => ({
        image_id: Date.now() + idx,
        post_id: newPostData.postId,
        image_url: url,
        order_index: idx
      })),
      videos: newPostData.videoUrls || newPostData.videos || [],
      reaction_count: newPostData.reactionCount || 0,
      comment_count: newPostData.commentCount || 0,
      has_more: false,
      user_reacted: userReacted === true,
    };

    setPosts(prev => [newPost, ...prev]);
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
      const userReacted = response.data.userReacted ?? response.data.reacted ?? false;
      setPosts(prev => {
        const idx = prev.findIndex(p => p.post_id === postId);
        if (idx === -1) return prev;
        return [
          ...prev.slice(0, idx),
          { ...prev[idx], user_reacted: userReacted === true, reaction_count: response.data.reactionCount },
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

  return { posts, loading, error, refetch: fetchPosts, addNewPost, updatePostReaction, incrementCommentCount };
};
