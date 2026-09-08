export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'stackmaster_theme';

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'light';
}

export function applyTheme(mode: ThemeMode): boolean {
  if (typeof window === 'undefined') return false;

  const root = document.documentElement;
  const body = document.body;
  let isDark = false;

  if (mode === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDark = mode === 'dark';
  }

  if (isDark) {
    root.classList.add('dark');
    body.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    body.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // ignore
  }

  return isDark;
}

