import { apiClient } from './api';

export const createNewPost = async (
  content: string,
  imageUrls: string[] = [],
  videoUrls: string[] = []
) => {
  const response = await apiClient.post('/api/v1/posts', {
    content,
    imageUrls,
    videoUrls,
  });
  return response.data;
};
