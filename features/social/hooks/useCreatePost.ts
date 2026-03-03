import { useState } from 'react';
import { createPost } from '../services/post.service';

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (content: string, imageUrls: string[] = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createPost(content, imageUrls);
      return response.data;
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};
