import { useState, useEffect } from 'react';
import { fetchHomePage } from '../components/features/sanity/sanityClient';
import { HomePage } from '../components/features/sanity/types/home';

export function useSanityHomePage(organizationId: string) {
  const [homePage, setHomePage] = useState<HomePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchHomePage(organizationId)
      .then((data) => {
        setHomePage(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error fetching home page for ${organizationId}:`, err);
        setError(err);
        setLoading(false);
      });
  }, [organizationId]);

  return { homePage, loading, error };
}
