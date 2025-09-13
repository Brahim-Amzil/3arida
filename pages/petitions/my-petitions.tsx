import { useState, useEffect } from 'react';
import { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
;
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { AccountLayout } from '@/components/layouts';
import { ReactElement } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface Petition {
  id: string;
  title: string;
  description: string;
  category: string;
  currentSignatures: number;
  targetSignatures: number;
  status: string;
  createdAt: string;
  creatorName?: string;
}

const MyPetitionsPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyPetitions();
    }
  }, [user]);

  const fetchMyPetitions = async () => {
    try {
      const response = await fetch('/api/petitions/my-petitions');
      if (response.ok) {
        const data = await response.json();
        setPetitions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching my petitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>My Petitions - 3arida</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            عرائضي
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            إدارة ومتابعة العرائض التي أنشأتها
          </p>
        </div>

        {petitions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              لم تنشئ أي عرائض بعد
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              ابدأ بإنشاء عريضتك الأولى لإحداث التغيير
            </p>
            <Link
              href="/petitions/create"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              إنشاء عريضة جديدة
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petitions.map((petition) => (
              <div
                key={petition.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {petition.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        petition.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : petition.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {petition.status === 'approved'
                        ? 'نشطة'
                        : petition.status === 'pending'
                          ? 'قيد المراجعة'
                          : petition.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {petition.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {petition.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <span>
                        {petition.currentSignatures.toLocaleString()} توقيع
                      </span>
                      <span>
                        الهدف: {petition.targetSignatures.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${getProgressPercentage(petition.currentSignatures, petition.targetSignatures)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(petition.createdAt).toLocaleDateString('ar-MA')}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/petitions/${petition.id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        عرض
                      </Link>
                      <Link
                        href={`/petitions/${petition.id}/edit`}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        تعديل
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};



MyPetitionsPage.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default MyPetitionsPage;