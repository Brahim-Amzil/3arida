'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const { locale, switchLanguage } = useTranslation();

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code as 'ar' | 'fr')}
            className={`flex items-center gap-2 cursor-pointer ${
              locale === language.code ? 'bg-gray-100' : ''
            }`}
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
            {locale === language.code && (
              <span className="ml-auto rtl:ml-0 rtl:mr-auto text-green-600">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
