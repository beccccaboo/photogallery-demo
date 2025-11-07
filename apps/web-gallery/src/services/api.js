const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const fetchImages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/images`);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    const data = await response.json();
    return data.images;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const fetchImageById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/images/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

export const fetchImagesByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/images/category/${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch images by category');
    }
    const data = await response.json();
    return data.images;
  } catch (error) {
    console.error('Error fetching images by category:', error);
    throw error;
  }
};
