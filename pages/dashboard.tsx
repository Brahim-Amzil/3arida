import { ReactElement } from 'react';
import { NextPageWithLayout } from 'types';

import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/AuthContext';
import { AccountLayout } from '@/components/layouts';

const Dashboard: NextPageWithLayout = () => {
  const { user, userDocument, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          يرجى تسجيل الدخول
        </h2>
        <Link
          href="/auth/firebase-login"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>لوحة التحكم - 3arida</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            مرحباً، {userDocument?.name || user.displayName || 'المستخدم'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            إليك نظرة عامة على نشاطك على منصة 3arida
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/petitions/create"
            className="block p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center">
              <svg
                className="w-8 h-8 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold">إنشاء عريضة جديدة</h3>
                <p className="text-blue-100">ابدأ حملتك الآن</p>
              </div>
            </div>
          </Link>

          <Link
            href="/petitions"
            className="block p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <div className="flex items-center">
              <svg
                className="w-8 h-8 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold">تصفح العرائض</h3>
                <p className="text-green-100">اكتشف القضايا المهمة</p>
              </div>
            </div>
          </Link>

          <Link
            href="/my-petitions"
            className="block p-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <div className="flex items-center">
              <svg
                className="w-8 h-8 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold">عرائضي</h3>
                <p className="text-purple-100">إدارة عرائضك</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  عرائضي
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  0
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  توقيعاتي
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  0
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  العرائض النشطة
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  0
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  إجمالي التوقيعات
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            النشاط الأخير
          </h2>
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              لا يوجد نشاط حتى الآن
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              ابدأ بإنشاء عريضة أو توقيع عريضة موجودة
            </p>
          </div>
        </div>
      </div>
    </>
  );
};



Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default Dashboard;
