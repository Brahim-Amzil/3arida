import { useState, useEffect } from 'react';
import { NextPageWithLayout } from 'types';

import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { AccountLayout } from '@/components/layouts';
import { ReactElement } from 'react';

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

const PetitionsPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Environment',
    'Social Justice',
    'Politics',
    'Education',
    'Healthcare',
    'Technology',
    'Human Rights',
    'Animal Rights',
    'Community',
    'Other',
  ];

  useEffect(() => {
    fetchPetitions();
  }, []);

  const fetchPetitions = async () => {
    try {
      const response = await fetch('/api/petitions');
      if (response.ok) {
        const data = await response.json();
        setPetitions(data.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching petitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPetitions = petitions.filter((petition) => {
    const matchesSearch =
      petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      petition.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || petition.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>العرائض - 3arida</title>
        <meta
          name="description"
          content="تصفح جميع العرائض النشطة على منصة 3arida"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            العرائض النشطة
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            اكتشف العرائض التي تحتاج دعمك ووقع لإحداث التغيير
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ابحث في العرائض..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-64">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <Link
            href="/petitions/create"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
          >
            إنشاء عريضة
          </Link>
        </div>

        {/* Petitions Grid */}
        {filteredPetitions.length === 0 ? (
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
              لا توجد عرائض
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              لم يتم العثور على عرائض تطابق معايير البحث
            </p>
            <Link
              href="/petitions/create"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              كن أول من ينشئ عريضة
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPetitions.map((petition) => (
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
                    <Link
                      href={`/petitions/${petition.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};



PetitionsPage.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default PetitionsPage;
