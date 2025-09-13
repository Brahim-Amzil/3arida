import { ReactElement, useEffect, useState } from 'react';
import { NextPageWithLayout } from 'types';

import Head from 'next/head';
import { AdminLayout } from '@/components/layouts';
import { useAuth } from '@/lib/firebase/AuthContext';
import { Loading } from '@/components/shared';
import { User } from '../../types/models';
import toast from 'react-hot-toast';

interface UserWithActions extends User {
  isUpdating?: boolean;
}

const AdminUsers: NextPageWithLayout = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithActions[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'moderator' | 'admin'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString(),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / usersPerPage));
      } else {
        toast.error('فشل في تحميل المستخدمين');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('حدث خطأ في تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'moderator' | 'admin') => {
    try {
      // Update UI optimistically
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isUpdating: true } : u
      ));

      const response = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, role: newRole, isUpdating: false } : u
        ));
        toast.success('تم تحديث دور المستخدم بنجاح');
      } else {
        const error = await response.json();
        toast.error(error.error || 'فشل في تحديث دور المستخدم');
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isUpdating: false } : u
        ));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('حدث خطأ في تحديث دور المستخدم');
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isUpdating: false } : u
      ));
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isUpdating: true } : u
      ));

      const response = await fetch('/api/admin/users/toggle-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, isActive }),
      });

      if (response.ok) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isActive, isUpdating: false } : u
        ));
        toast.success(`تم ${isActive ? 'تفعيل' : 'إلغاء تفعيل'} المستخدم بنجاح`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'فشل في تحديث حالة المستخدم');
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isUpdating: false } : u
        ));
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('حدث خطأ في تحديث حالة المستخدم');
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isUpdating: false } : u
      ));
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مدير';
      case 'moderator':
        return 'مشرف';
      default:
        return 'مستخدم';
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>إدارة المستخدمين - لوحة تحكم المدير</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              إدارة المستخدمين
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              عرض وإدارة جميع المستخدمين في المنصة
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  البحث
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="البحث بالاسم أو البريد الإلكتروني"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  تصفية حسب الدور
                </label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">جميع الأدوار</option>
                  <option value="user">مستخدم</option>
                  <option value="moderator">مشرف</option>
                  <option value="admin">مدير</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchUsers}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'جاري البحث...' : 'بحث'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    تاريخ التسجيل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((userData) => (
                  <tr key={userData.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {userData.name?.charAt(0) || userData.email.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {userData.name || 'غير محدد'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(userData.role)}`}>
                        {getRoleDisplayName(userData.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userData.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {userData.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(userData.createdAt).toLocaleDateString('ar-MA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        {userData.id !== user?.uid && (
                          <>
                            <select
                              value={userData.role}
                              onChange={(e) => updateUserRole(userData.id, e.target.value as any)}
                              disabled={userData.isUpdating}
                              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                              <option value="user">مستخدم</option>
                              <option value="moderator">مشرف</option>
                              <option value="admin">مدير</option>
                            </select>
                            <button
                              onClick={() => toggleUserStatus(userData.id, !userData.isActive)}
                              disabled={userData.isUpdating}
                              className={`px-3 py-1 text-xs rounded ${
                                userData.isActive
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                              } disabled:opacity-50`}
                            >
                              {userData.isUpdating ? '...' : userData.isActive ? 'تعطيل' : 'تفعيل'}
                            </button>
                          </>
                        )}
                        {userData.id === user?.uid && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">أنت</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                السابق
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                التالي
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  عرض صفحة <span className="font-medium">{currentPage}</span> من{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    السابق
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    التالي
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

AdminUsers.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminUsers;