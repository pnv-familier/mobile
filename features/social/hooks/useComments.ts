import { useState, useEffect } from 'react';
import { Comment } from '../types';
import { getComments, createComment, CommentResponse } from '../services/comment.service';

export const useComments = (postId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalComments, setTotalComments] = useState(0);

  const transformComment = (comment: CommentResponse): Comment => ({
    comment_id: comment.commentId,
    author_id: comment.author.userId,
    author_name: comment.author.fullName,
    author_avatar: comment.author.avatarUrl,
    content: comment.content,
    created_at: comment.createdAt,
  });

  const fetchComments = async (pageNum: number = 0, append: boolean = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await getComments(postId, pageNum, 20);
      const transformedComments = response.data.comments.map(transformComment).reverse();
      
      if (append) {
        setComments(prev => [...prev, ...transformedComments]);
      } else {
        setComments(transformedComments);
      }
      
      setHasMore(response.data.hasMore);
      setTotalComments(response.data.totalComments);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchComments(page + 1, true);
    }
  };

  const addComment = async (content: string) => {
    const response = await createComment(postId, content);
    const newComment = transformComment(response.data);
    setComments(prev => [newComment, ...prev]);
    setTotalComments(prev => prev + 1);
    return newComment;
  };

  const refresh = () => {
    setPage(0);
    setHasMore(true);
    fetchComments(0, false);
  };

  useEffect(() => {
    fetchComments(0, false);
  }, [postId]);

  return {
    comments,
    loading,
    error,
    hasMore,
    totalComments,
    loadMore,
    addComment,
    refresh,
  };
};
