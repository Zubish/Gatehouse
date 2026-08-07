import { useState, useEffect } from 'react';

interface DraftContainer<T> {
  data: T;
  expiresAt: number;
}

const FIVE_MINUTES_MS = 5 * 60 * 1000;

/**
 * Custom React hook for auto-saving form draft state to localStorage.
 * Draft expires automatically after 5 minutes of inactivity or upon clearDraft().
 * 
 * @param draftKey Unique key identifier for the draft form
 * @param initialValues Default initial form state values
 */
export function useFormDraft<T>(draftKey: string, initialValues: T) {
  const storageKey = `gatehouse_draft_${draftKey}`;

  const [formData, setFormData] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: DraftContainer<T> = JSON.parse(saved);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          return parsed.data;
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch {
      // Fallback on storage errors
    }
    return initialValues;
  });

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      const container: DraftContainer<T> = {
        data: formData,
        expiresAt: Date.now() + FIVE_MINUTES_MS,
      };
      localStorage.setItem(storageKey, JSON.stringify(container));
    } catch {
      // Ignore quota errors
    }
  }, [storageKey, formData]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
    setFormData(initialValues);
  };

  return [formData, setFormData, clearDraft] as const;
}
