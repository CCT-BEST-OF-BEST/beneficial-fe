import { useEffect, useState } from 'react';
import { apiBlobFetch } from '@/shared/api/client.ts';

const normalizeLearningImagePath = (imagePath: string) => {
  let path = imagePath.trim().replace(/^\/+/, '');

  if (path.startsWith('learning/images/')) {
    path = path.slice('learning/images/'.length);
  }

  if (path.startsWith('images/')) {
    path = path.slice('images/'.length);
  }

  return `/learning/images/${path}`;
};

export const useAuthenticatedImage = (imagePath: string | null | undefined) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(imagePath));
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!imagePath) {
      setSrc(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    let objectUrl: string | null = null;

    setLoading(true);
    setError(null);
    setSrc(null);

    apiBlobFetch(normalizeLearningImagePath(imagePath))
      .then(blob => {
        objectUrl = URL.createObjectURL(blob);

        if (!active) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setSrc(objectUrl);
      })
      .catch(err => {
        if (!active) return;
        setError(err);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imagePath]);

  return { src, loading, error };
};
