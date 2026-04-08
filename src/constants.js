export const PLATFORMS = [
  { id: 'pornhub',  name: 'Pornhub',   color: '#ff9000', icon: 'PH' },
  { id: 'xhamster', name: 'xHamster',  color: '#ff6600', icon: 'XH' },
  { id: 'fansly',  name: 'Fansly',    color: '#1da1f2', icon: 'FL' },
  { id: 'manyvids', name: 'ManyVids',  color: '#e91e8c', icon: 'MV' },
  { id: 'twitter', name: 'Twitter/X', color: '#000000', icon: 'X'  },
  { id: 'reddit',  name: 'Reddit',    color: '#ff4500', icon: 'Re' },
  { id: 'telegram',name: 'Telegram',  color: '#0088cc', icon: 'Tg' },
];

export const LANGS = [
  { code: 'en', label: 'English'    },
  { code: 'pt', label: 'Portuguese' },
  { code: 'fr', label: 'French'     },
  { code: 'de', label: 'German'     },
  { code: 'it', label: 'Italian'    },
];

export const STATUS_LABELS = {
  pending:   'Pendiente',
  uploading: 'Subiendo',
  reviewing: 'En revisión',
  approved:  'Aprobado',
  rejected:  'Rechazado',
  error:     'Error',
};

export const STATUS_COLORS = {
  pending:   '#888888',
  uploading: '#1da1f2',
  reviewing: '#ff9000',
  approved:  '#22c55e',
  rejected:  '#ef4444',
  error:     '#ef4444',
};

export const LANG_PREFIXES = { pt: '[PT] ', fr: '[FR] ', de: '[DE] ', it: '[IT] ' };

export function translateTitle(title, lang) {
  if (lang === 'en') return title;
  return (LANG_PREFIXES[lang] || '') + (title || '');
}
