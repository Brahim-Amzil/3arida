import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">#</span>
              </div>
              <span className="text-xl font-bold">3arida</span>
            </div>
            <p className="text-gray-400 whitespace-pre-line">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.platform')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/petitions" className="hover:text-white">
                  {t('petitions.discoverPetitions')}
                </Link>
              </li>
              <li>
                <Link href="/petitions/create" className="hover:text-white">
                  {t('petitions.startAPetition')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  {t('footer.aboutUs')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white">
                  {t('footer.helpCenter')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-white">
                  {t('footer.communityGuidelines')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  {t('footer.termsOfService')}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white">
                  {t('footer.cookiePolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
