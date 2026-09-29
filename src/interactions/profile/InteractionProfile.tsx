import { useState } from 'react';
import { ProfileMenu, type ProfileTheme } from './ProfileMenu';

export function InteractionProfile() {
  const [selectedTheme, setSelectedTheme] = useState<ProfileTheme>('light');
  const resolvedTheme = selectedTheme === 'dark' ? 'dark' : 'light';

  return <div className="profile-demo interaction-profile-demo" data-theme={selectedTheme} data-resolved-theme={resolvedTheme}>
    <ProfileMenu selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
  </div>;
}
