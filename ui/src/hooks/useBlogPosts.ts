import { useState, useEffect } from 'react';
import { fetchPosts, fetchPostsPreview } from '../components/features/sanity/sanityClient';
import { BlogPost } from '../components/features/sanity/types';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for preview mode via query parameter
    const isPreview =
      typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('preview');
    const loader = isPreview ? fetchPostsPreview : fetchPosts;
    loader()
      .then((posts) => {
        // Ensure posts are sorted newest to oldest
        const sortedPosts = posts.sort((a: BlogPost, b: BlogPost) => {
          const dateA = new Date(a.publishedAt || a._createdAt || 0);
          const dateB = new Date(b.publishedAt || b._createdAt || 0);
          return dateB.getTime() - dateA.getTime(); // Newest first
        });
        setPosts(sortedPosts);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts: ', error);
        setLoading(false);
      });
  }, []);

  return { posts, loading };
}
