'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(
      'cookie-consent',
      JSON.stringify({
        ...prefs,
        timestamp: new Date().toISOString(),
      })
    );
    setShowBanner(false);
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      functional: true,
      analytics: true,
    });
  };

  const acceptNecessary = () => {
    savePreferences({
      necessary: true,
      functional: false,
      analytics: false,
    });
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🍪 نحن نستخدم ملفات تعريف الارتباط
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل استخدام الموقع.
            يمكنك اختيار الملفات التي تريد قبولها.
          </p>

          {!showDetails ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptAll}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                قبول الكل
              </button>
              <button
                onClick={acceptNecessary}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                الضرورية فقط
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                تخصيص
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="mt-1 w-4 h-4 text-primary-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      ملفات ضرورية (مطلوبة)
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ضرورية لعمل الموقع بشكل صحيح. لا يمكن تعطيلها.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        functional: e.target.checked,
                      })
                    }
                    className="mt-1 w-4 h-4 text-primary-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      ملفات وظيفية
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      تحسن تجربة المستخدم وتحفظ تفضيلاتك.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        analytics: e.target.checked,
                      })
                    }
                    className="mt-1 w-4 h-4 text-primary-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      ملفات تحليلية
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      تساعدنا على فهم كيفية استخدام الموقع وتحسينه.
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={saveCustom}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  حفظ التفضيلات
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  رجوع
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            لمزيد من المعلومات، راجع{' '}
            <Link href="/cookies" className="text-primary-600 hover:underline">
              سياسة ملفات تعريف الارتباط
            </Link>{' '}
            و{' '}
            <Link href="/privacy" className="text-primary-600 hover:underline">
              سياسة الخصوصية
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
