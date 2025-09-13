import Link from 'next/link';
import { type ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from 'types';

import useTheme from 'hooks/useTheme';
import env from '@/lib/env';
import Head from 'next/head';
import { useAuth } from '@/lib/firebase/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home: NextPageWithLayout = () => {
  const { toggleTheme, selectedTheme } = useTheme();
  const { t } = useTranslation('common');
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>3arida - منصة العرائض المغربية</title>
        <meta
          name="description"
          content="منصة 3arida لإنشاء وتوقيع العرائض في المغرب. ابدأ حملتك اليوم وأحدث التغيير في مجتمعك."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                3arida
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {env.darkModeEnabled && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <selectedTheme.icon className="w-5 h-5" />
                </button>
              )}
              <Link
                href="/auth/firebase-login"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/firebase-register"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            أطلق صوتك مع
            <span className="text-blue-600"> 3arida</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            منصة العرائض المغربية الأولى. أنشئ عريضتك، اجمع التوقيعات، وأحدث
            التغيير في مجتمعك. من القضايا البيئية إلى العدالة الاجتماعية، صوتك
            مهم.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/auth/firebase-register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
            >
              ابدأ عريضتك الآن
            </Link>
            <Link
              href="/petitions"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-lg"
            >
              تصفح العرائض
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-300">عريضة نشطة</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-300">توقيع مجمع</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                200+
              </div>
              <div className="text-gray-600 dark:text-gray-300">تغيير محقق</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              لماذا تختار 3arida؟
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  آمن وموثوق
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  التحقق من الهوية عبر رقم الهاتف يضمن صحة التوقيعات
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  سريع وسهل
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  أنشئ عريضتك في دقائق واجمع التوقيعات بسهولة
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  تحليلات مفصلة
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  تتبع تقدم عريضتك مع إحصائيات شاملة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              جاهز لإحداث التغيير؟
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف المغاربة الذين يستخدمون 3arida لإحداث تغيير إيجابي
              في مجتمعاتهم
            </p>
            <Link
              href="/auth/firebase-register"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold text-lg"
            >
              ابدأ الآن مجاناً
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};



Home.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Home;
