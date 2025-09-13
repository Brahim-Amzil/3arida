import { ReactElement, useEffect, useState } from 'react';
import { NextPageWithLayout } from 'types';


import Head from 'next/head';
import { AdminLayout } from '@/components/layouts';
import { useAuth } from '@/lib/firebase/AuthContext';
import { Loading } from '@/components/shared';
import { User } from '../../types/models';
import toast from 'react-hot-toast';

interface ModeratorPermissions {
  approve: boolean;
  pause: boolean;
  delete: boolean;
  statsAccess: boolean;
}

interface Moderator {
  id: string;
  userId: string;
  user: User;
  permissions: ModeratorPermissions;
  assignedAt: Date;
  assignedBy: string;
  isActive: boolean;
}

interface ModeratorWithActions extends Moderator {
  isUpdating?: boolean;
}

const AdminModerators: NextPageWithLayout = () => {
  const { user } = useAuth();
  const [moderators, setModerators] = useState<ModeratorWithActions[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newPermissions, setNewPermissions] = useState<ModeratorPermissions>({
    approve: true,
    pause: true,
    delete: false,
    statsAccess: true,
  });

  useEffect(() => {
    fetchModerators();
    fetchUsers();
  }, []);

  const fetchModerators = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/moderators');
      if (response.ok) {
        const data = await response.json();
        setModerators(data.moderators);
      } else {
        toast.error('فشل في تحميل المشرفين');
      }
    } catch (error) {
      console.error('Error fetching moderators:', error);
      toast.error('حدث خطأ في تحميل المشرفين');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users?role=user&limit=100');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const assignModerator = async () => {
    if (!selectedUserId) {
      toast.error('يرجى اختيار مستخدم');
      return;
    }

    try {
      const response = await fetch('/api/admin/moderators/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUserId,
          permissions: newPermissions,
        }),
      });

      if (response.ok) {
        toast.success('تم تعيين المشرف بنجاح');
        setShowAddModal(false);
        setSelectedUserId('');
        setNewPermissions({
          approve: true,
          pause: true,
          delete: false,
          statsAccess: true,
        });
        fetchModerators();
      } else {
        const error = await response.json();
        toast.error(error.error || 'فشل في تعيين المشرف');
      }
    } catch (error) {
      console.error('Error assigning moderator:', error);
      toast.error('حدث خطأ في تعيين المشرف');
    }
  };

  const updateModeratorPermissions = async (moderatorId: string, permissions: ModeratorPermissions) => {
    try {
      setModerators(prev => prev.map(m => 
        m.id === moderatorId ? { ...m, isUpdating: true } : m
      ));

      const response = await fetch('/api/admin/moderators/update-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moderatorId, permissions }),
      });

      if (response.ok) {
        setModerators(prev => prev.map(m => 
          m.id === moderatorId ? { ...m, permissions, isUpdating: false } : m
        ));
        toast.success('تم تحديث صلاحيات المشرف بنجاح');
      } else {
        const error = await response.json();
        toast.error(error.error || 'فشل في تحديث صلاحيات المشرف');
        setModerators(prev => prev.map(m => 
          m.id === moderatorId ? { ...m, isUpdating: false } : m
        ));
      }
    } catch (error) {
      console.error('Error updating moderator permissions:', error);
      toast.error('حدث خطأ في تحديث صلاحيات المشرف');
      setModerators(prev => prev.map(m => 
        m.id === moderatorId ? { ...m, isUpdating: false } : m
      ));
    }
  };

  const revokeModerator = async (moderatorId: string) => {
    if (!confirm('هل أنت متأكد من إلغاء صلاحيات هذا المشرف؟')) {
      return;
    }

    try {
      setModerators(prev => prev.map(m => 
        m.id === moderatorId ? { ...m, isUpdating: true } : m
      ));

      const response = await fetch('/api/admin/moderators/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moderatorId }),
      });

      if (response.ok) {
        setModerators(prev => prev.filter(m => m.id !== moderatorId));
        toast.success('تم إلغاء صلاحيات المشرف بنجاح');
      } else {
        const error = await response.json();
        toast.error(error.error || 'فشل في إلغاء صلاحيات المشرف');
        setModerators(prev => prev.map(m => 
          m.id === moderatorId ? { ...m, isUpdating: false } : m
        ));
      }
    } catch (error) {
      console.error('Error revoking moderator:', error);
      toast.error('حدث خطأ في إلغاء صلاحيات المشرف');
      setModerators(prev => prev.map(m => 
        m.id === moderatorId ? { ...m, isUpdating: false } : m
      ));
    }
  };

  const getPermissionDisplayName = (permission: string) => {
    switch (permission) {
      case 'approve':
        return 'الموافقة';
      case 'pause':
        return 'الإيقاف';
      case 'delete':
        return 'الحذف';
      case 'statsAccess':
        return 'الإحصائيات';
      default:
        return permission;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>إدارة المشرفين - لوحة تحكم المدير</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  إدارة المشرفين
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  تعيين وإدارة صلاحيات المشرفين في المنصة
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                إضافة مشرف
              </button>
            </div>
          </div>
        </div>

        {/* Moderators Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    المشرف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الصلاحيات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    تاريخ التعيين
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {moderators.map((moderator) => (
                  <tr key={moderator.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {moderator.user.name?.charAt(0) || moderator.user.email.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {moderator.user.name || 'غير محدد'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {moderator.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(moderator.permissions)
                          .filter(([_, value]) => value)
                          .map(([permission]) => (
                            <span
                              key={permission}
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            >
                              {getPermissionDisplayName(permission)}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(moderator.assignedAt).toLocaleDateString('ar-MA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        moderator.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {moderator.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => {
                            // Open permissions edit modal
                            // For simplicity, we'll just toggle some permissions
                            const newPermissions = {
                              ...moderator.permissions,
                              approve: !moderator.permissions.approve,
                            };
                            updateModeratorPermissions(moderator.id, newPermissions);
                          }}
                          disabled={moderator.isUpdating}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                        >
                          {moderator.isUpdating ? '...' : 'تعديل'}
                        </button>
                        <button
                          onClick={() => revokeModerator(moderator.id)}
                          disabled={moderator.isUpdating}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                        >
                          إلغاء
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {moderators.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">لا يوجد مشرفين حالياً</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Moderator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                إضافة مشرف جديد
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    اختيار المستخدم
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">اختر مستخدم</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الصلاحيات
                  </label>
                  <div className="space-y-2">
                    {Object.entries(newPermissions).map(([permission, value]) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNewPermissions(prev => ({
                            ...prev,
                            [permission]: e.target.checked
                          }))}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                          {getPermissionDisplayName(permission)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  إلغاء
                </button>
                <button
                  onClick={assignModerator}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

AdminModerators.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};



export default AdminModerators;