import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_MODE_KEY = 'brana_theme_mode';

const BranaThemeModeContext = createContext(null);

function readStoredThemeMode() {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_MODE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyThemeMode(mode) {
  if (typeof document === 'undefined') return;
  const nextMode = mode === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.branaTheme = nextMode;
  document.documentElement.style.colorScheme = nextMode;
}

export function BranaThemeModeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => readStoredThemeMode());

  useEffect(() => {
    applyThemeMode(themeMode);
    try {
      window.localStorage.setItem(THEME_MODE_KEY, themeMode);
    } catch {
      // Persistencia indisponivel: o tema continua funcional nesta sessao.
    }
  }, [themeMode]);

  const value = useMemo(
    () => ({
      themeMode,
      isDarkMode: themeMode === 'dark',
      toggleThemeMode: () => setThemeMode((current) => (current === 'dark' ? 'light' : 'dark')),
      setThemeMode,
    }),
    [themeMode],
  );

  return <BranaThemeModeContext.Provider value={value}>{children}</BranaThemeModeContext.Provider>;
}

export function useBranaThemeMode() {
  const context = useContext(BranaThemeModeContext);
  if (!context) {
    throw new Error('useBranaThemeMode deve ser usado dentro de BranaThemeModeProvider.');
  }
  return context;
}

export { THEME_MODE_KEY };
