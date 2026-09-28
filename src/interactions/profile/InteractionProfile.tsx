import { useState, useSyncExternalStore } from 'react';
import { ProfileMenu, type ProfileTheme } from './ProfileMenu';

const themeStorageKey = 'portfolio-interaction-profile-theme';
const systemThemeQuery = '(prefers-color-scheme: dark)';

function readThemePreference(): ProfileTheme {
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // The menu remains usable when browser storage is unavailable.
  }
  return 'system';
}

function subscribeToSystemTheme(onChange: () => void) {
  const query = window.matchMedia(systemThemeQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function readSystemTheme() {
  return window.matchMedia(systemThemeQuery).matches ? 'dark' : 'light';
}

export function InteractionProfile() {
  const [selectedTheme, setSelectedTheme] = useState<ProfileTheme>(readThemePreference);
  const systemTheme = useSyncExternalStore(subscribeToSystemTheme, readSystemTheme, () => 'light');
  const resolvedTheme = selectedTheme === 'system' ? systemTheme : selectedTheme;

  function selectTheme(theme: ProfileTheme) {
    setSelectedTheme(theme);
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch {
      // Keep the in-memory preference usable even if persistence is blocked.
    }
  }

  return <div className="profile-demo interaction-profile-demo" data-theme={selectedTheme} data-resolved-theme={resolvedTheme}>
    <ProfileMenu selectedTheme={selectedTheme} onSelectTheme={selectTheme} />
  </div>;
}
