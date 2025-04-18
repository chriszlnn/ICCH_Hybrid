import { mutate } from 'swr';

// Cache keys for different data types
export const CACHE_KEYS = {
  BEAUTY_POSTS: '/api/beauty-info',
  BEAUTY_POST: (id: number) => `/api/beauty-info/${id}`,
};

// Function to revalidate beauty post data globally
export const revalidateBeautyPost = async (postId: number) => {
  // Revalidate the individual post with force revalidation
  await mutate(CACHE_KEYS.BEAUTY_POST(postId), undefined, { revalidate: true });
  
  // Revalidate the posts list with force revalidation
  await mutate(CACHE_KEYS.BEAUTY_POSTS, undefined, { revalidate: true });
  
  // Return a promise that resolves after a short delay to ensure the revalidation has started
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 50);
  });
};

// Function to revalidate all beauty posts
export const revalidateAllBeautyPosts = async () => {
  // Force revalidation of the posts list
  await mutate(CACHE_KEYS.BEAUTY_POSTS, undefined, { revalidate: true });
  
  // Return a promise that resolves after a short delay to ensure the revalidation has started
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 50);
  });
}; 