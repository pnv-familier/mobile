import { apiClient } from '../../../api/api';
import { SuccessResponse } from '../../../types/api';

interface CommentAuthor {
  userId: string;
  fullName: string;
  avatarUrl: string;
}

export interface CommentResponse {
  commentId: number;
  author: CommentAuthor;
  content: string;
  createdAt: string;
}

interface CommentListResponse {
  comments: CommentResponse[];
  totalComments: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export const getComments = async (postId: number, page: number = 0, size: number = 20) => {
  const response = await apiClient.get<SuccessResponse<CommentListResponse>>(
    `/api/v1/posts/${postId}/comments`,
    { params: { page, size } }
  );
  return response.data;
};

export const createComment = async (postId: number, content: string) => {
  const response = await apiClient.post<SuccessResponse<CommentResponse>>(
    `/api/v1/posts/${postId}/comments`,
    { content }
  );
  return response.data;
};
