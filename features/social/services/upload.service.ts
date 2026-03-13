import { apiClient } from '../../../api/api';

export const uploadImage = async (uri: string): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);

    const response = await apiClient.post<{ data: string }>('/api/v1/posts/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Upload image error:', error);
    return null;
  }
};

export const uploadVideo = async (uri: string): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'video/mp4',
      name: 'video.mp4',
    } as any);

    const response = await apiClient.post<{ data: string }>('/api/v1/posts/upload-video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Upload video error:', error);
    return null;
  }
};
