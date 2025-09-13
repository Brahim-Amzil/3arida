import { ReactElement, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Loading } from '@/components/shared';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps): ReactElement => {
  const { user, loading } = useAuth();
  const { isAdmin } = useRoleAccess();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/firebase-login');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              غير مخول للوصول
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              تحتاج إلى صلاحيات المدير للوصول إلى هذه الصفحة
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                العودة إلى لوحة التحكم
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    لوحة تحكم المدير
                  </h1>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                لوحة التحكم الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 rtl:space-x-reverse" aria-label="Tabs">
            <Link
              href="/admin/dashboard"
              className={`${
                router.pathname === '/admin/dashboard'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              نظرة عامة
            </Link>
            <Link
              href="/admin/users"
              className={`${
                router.pathname === '/admin/users'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              إدارة المستخدمين
            </Link>
            <Link
              href="/admin/moderators"
              className={`${
                router.pathname === '/admin/moderators'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              إدارة المشرفين
            </Link>
            <Link
              href="/admin/petitions"
              className={`${
                router.pathname === '/admin/petitions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              إدارة العرائض
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;