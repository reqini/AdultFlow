import { useState, useCallback } from 'react';

const INITIAL = { users: {}, session: null, videos: [], notifications: [] };

function load() {
  try {
    const s = localStorage.getItem('evil_mvp');
    return s ? JSON.parse(s) : INITIAL;
  } catch {
    return INITIAL;
  }
}

function persist(state) {
  try { localStorage.setItem('evil_mvp', JSON.stringify(state)); } catch {}
}

export function useStore() {
  const [store, setStore] = useState(load);

  const save = useCallback((updater) => {
    setStore(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, []);

  return [store, save];
}
