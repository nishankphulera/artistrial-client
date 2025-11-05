/**
 * Utility functions for uploading images to S3
 */

/**
 * Upload a single image to S3
 * @param file - The image file to upload
 * @param folder - Optional folder path in S3 bucket (default: 'uploads')
 * @returns Promise with the uploaded image URL
 */
export const uploadImageToS3 = async (
  file: File,
  folder: string = 'uploads'
): Promise<string> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/api/upload/s3/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.data?.url) {
      return data.data.url;
    } else {
      throw new Error(data.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw error;
  }
};

/**
 * Upload multiple images to S3
 * @param files - Array of image files to upload
 * @param folder - Optional folder path in S3 bucket (default: 'uploads')
 * @returns Promise with array of uploaded image URLs
 */
export const uploadMultipleImagesToS3 = async (
  files: File[],
  folder: string = 'uploads'
): Promise<string[]> => {
  try {
    if (files.length === 0) {
      return [];
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/api/upload/s3/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => item.url).filter((url: string) => url);
    } else {
      throw new Error(data.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading images to S3:', error);
    throw error;
  }
};

