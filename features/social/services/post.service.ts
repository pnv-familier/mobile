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
  videos: string[];
  reactionCount: number;
  commentCount: number;
  hasMore: boolean;
  userReacted: boolean;
}

interface FeedResponse {
  posts: PostResponse[];
  isEmpty: boolean;
}

export const getFeed = async () => {
  const response = await apiClient.get<SuccessResponse<FeedResponse>>('/api/v1/posts/feed');
  return response.data;
};

export const createPost = async (content: string, imageUrls: string[] = [], videoUrls: string[] = []) => {
  const response = await apiClient.post<SuccessResponse<PostResponse>>('/api/v1/posts', {
    content,
    imageUrls,
    videoUrls
  });
  return response.data;
};

export const getPostDetail = async (postId: number) => {
  const response = await apiClient.get<SuccessResponse<PostResponse>>(`/api/v1/posts/${postId}`);
  return response.data;
};

export const uploadImages = async (files: any[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.fileName || 'image.jpg',
    } as any);
  });

  const response = await apiClient.post<SuccessResponse<string[]>>('/api/v1/posts/upload-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadVideo = async (file: any) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type || 'video/mp4',
    name: file.fileName || 'video.mp4',
  } as any);

  const response = await apiClient.post<SuccessResponse<string>>('/api/v1/posts/upload-video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await apiClient.delete<SuccessResponse<void>>(`/api/v1/posts/${postId}`);
  return response.data;
};

export const updatePost = async (postId: number, content: string, imageUrls: string[] = [], videoUrls: string[] = []) => {
  const response = await apiClient.put<SuccessResponse<PostResponse>>(`/api/v1/posts/${postId}`, {
    content,
    imageUrls,
    videoUrls
  });
  return response.data;
};

export const toggleReaction = async (postId: number) => {
  const response = await apiClient.post<SuccessResponse<{ reacted: boolean; reactionCount: number }>>(
    `/api/v1/posts/${postId}/reactions`
  );
  return response.data;
};
