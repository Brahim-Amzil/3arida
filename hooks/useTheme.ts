import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

import { ThemesProps, applyTheme } from '@/lib/theme';

const useTheme = () => {
  const [theme, setTheme] = useState<string | null>(null);
  
  // Safe translation hook usage with fallback
  let t: (key: string) => string;
  try {
    const translation = useTranslation('common');
    t = translation.t;
  } catch (error) {
    // Fallback function if i18next is not initialized
    t = (key: string) => {
      const fallbacks: Record<string, string> = {
        'system': 'System',
        'dark': 'Dark',
        'light': 'Light'
      };
      return fallbacks[key] || key;
    };
  }

  useEffect(() => {
    setTheme(localStorage.getItem('theme'));
  }, []);

  const themes: ThemesProps[] = [
    {
      id: 'system',
      name: t('system'),
      icon: ComputerDesktopIcon,
    },
    {
      id: 'dark',
      name: t('dark'),
      icon: MoonIcon,
    },
    {
      id: 'light',
      name: t('light'),
      icon: SunIcon,
    },
  ];

  const selectedTheme = themes.find((t) => t.id === theme) || themes[0];

  const toggleTheme = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    selectedTheme.id === 'light' ? applyTheme('dark') : applyTheme('light');

    if (selectedTheme.id === 'light') {
      applyTheme('dark');
      setTheme('dark');
    } else if (selectedTheme.id === 'dark') {
      applyTheme('light');
      setTheme('light');
    } else if (selectedTheme.id === 'system') {
      applyTheme('dark');
      setTheme('dark');
    }
  };

  return { theme, setTheme, selectedTheme, toggleTheme, themes, applyTheme };
};

export default useTheme;
