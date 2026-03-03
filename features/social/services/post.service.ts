import { apiClient } from '../../../api/api';
import { SuccessResponse } from '../../../types/api';

interface PostAuthor {
  userId: string;
  fullName: string;
  avatarUrl: string;
}

interface PostResponse {
  postId: number;
  author: PostAuthor;
  content: string;
  createdAt: string;
  images: string[];
  reactionCount: number;
  commentCount: number;
  hasMore: boolean;
}

interface FeedResponse {
  posts: PostResponse[];
  isEmpty: boolean;
}

export const getFeed = async () => {
  const response = await apiClient.get<SuccessResponse<FeedResponse>>('/api/v1/posts/feed');
  return response.data;
};

export const createPost = async (content: string, imageUrls: string[] = []) => {
  const response = await apiClient.post<SuccessResponse<PostResponse>>('/api/v1/posts', {
    content,
    imageUrls
  });
  return response.data;
};

export const getPostDetail = async (postId: number) => {
  const response = await apiClient.get<SuccessResponse<PostResponse>>(`/api/v1/posts/${postId}`);
  return response.data;
};
