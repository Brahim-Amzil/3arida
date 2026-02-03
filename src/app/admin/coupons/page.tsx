'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/HeaderWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: string;
  createdBy: string;
  createdFor?: string;
  createdAt: any;
  expiresAt?: any;
  maxUses: number | null;
  usedCount: number;
  status: 'active' | 'used' | 'expired';
  metadata?: any;
}

export default function AdminCouponsPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'expired' | 'used'
  >('all');
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);

  // Form state
  const [discount, setDiscount] = useState('10');
  const [createdFor, setCreatedFor] = useState('');
  const [maxUses, setMaxUses] = useState('1');
  const [expiryDays, setExpiryDays] = useState('30');

  useEffect(() => {
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'moderator') {
      router.push('/');
      return;
    }
    loadCoupons();
  }, [userProfile, router]);

  const loadCoupons = async () => {
    try {
      const couponsRef = collection(db, 'coupons');
      const q = query(couponsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const couponsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Coupon[];
      setCoupons(couponsData);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCouponCode = () => {
    const prefix = 'INFL';
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${discount}-${random}`;
  };

  const handleGenerateCoupon = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      const code = generateCouponCode();
      const expiresAt = expiryDays
        ? Timestamp.fromDate(
            new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000),
          )
        : null;

      const couponData = {
        code,
        discount: parseInt(discount),
        type: 'influencer',
        createdBy: user.email || user.uid,
        createdFor: createdFor || null,
        createdAt: Timestamp.now(),
        expiresAt,
        maxUses: maxUses ? parseInt(maxUses) : null,
        usedCount: 0,
        usedBy: [],
        status: 'active',
        metadata: {},
      };

      await addDoc(collection(db, 'coupons'), couponData);

      // Reload coupons
      await loadCoupons();

      // Reset form
      setCreatedFor('');

      alert(`✅ تم إنشاء الكوبون: ${code}`);
    } catch (error) {
      console.error('Error generating coupon:', error);
      alert('❌ فشل في إنشاء الكوبون');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeactivateCoupon = async (couponId: string) => {
    if (!confirm('هل أنت متأكد من تعطيل هذا الكوبون؟')) return;

    try {
      const couponRef = doc(db, 'coupons', couponId);
      await updateDoc(couponRef, {
        status: 'expired',
      });
      await loadCoupons();
      alert('✅ تم تعطيل الكوبون');
    } catch (error) {
      console.error('Error deactivating coupon:', error);
      alert('❌ فشل في تعطيل الكوبون');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (
      !confirm(
        'هل أنت متأكد من حذف هذا الكوبون نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      )
    )
      return;

    try {
      const { deleteDoc } = await import('firebase/firestore');
      const couponRef = doc(db, 'coupons', couponId);
      await deleteDoc(couponRef);
      await loadCoupons();
      setSelectedCoupons((prev) => prev.filter((id) => id !== couponId));
      alert('✅ تم حذف الكوبون');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('❌ فشل في حذف الكوبون');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCoupons.length === 0) {
      alert('⚠️ الرجاء اختيار كوبونات للحذف');
      return;
    }

    if (
      !confirm(
        `هل أنت متأكد من حذف ${selectedCoupons.length} كوبون؟ لا يمكن التراجع عن هذا الإجراء.`,
      )
    )
      return;

    try {
      const { deleteDoc } = await import('firebase/firestore');

      // Delete all selected coupons
      await Promise.all(
        selectedCoupons.map((couponId) => {
          const couponRef = doc(db, 'coupons', couponId);
          return deleteDoc(couponRef);
        }),
      );

      await loadCoupons();
      setSelectedCoupons([]);
      alert(`✅ تم حذف ${selectedCoupons.length} كوبون`);
    } catch (error) {
      console.error('Error bulk deleting coupons:', error);
      alert('❌ فشل في حذف الكوبونات');
    }
  };

  const handleSelectAll = () => {
    if (selectedCoupons.length === filteredCoupons.length) {
      setSelectedCoupons([]);
    } else {
      setSelectedCoupons(filteredCoupons.map((c) => c.id));
    }
  };

  const handleSelectCoupon = (couponId: string) => {
    setSelectedCoupons((prev) =>
      prev.includes(couponId)
        ? prev.filter((id) => id !== couponId)
        : [...prev, couponId],
    );
  };

  // Filter coupons based on status
  const filteredCoupons = coupons.filter((coupon) => {
    if (filterStatus === 'all') return true;
    return coupon.status === filterStatus;
  });

  // Count by status
  const statusCounts = {
    all: coupons.length,
    active: coupons.filter((c) => c.status === 'active').length,
    expired: coupons.filter((c) => c.status === 'expired').length,
    used: coupons.filter((c) => c.status === 'used').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            إدارة كوبونات الخصم
          </h1>
          <p className="text-gray-600 mt-2">
            إنشاء وإدارة كوبونات الخصم للمؤثرين
          </p>
        </div>

        {/* Generate Coupon Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>إنشاء كوبون جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نسبة الخصم (%)
                </label>
                <select
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="30">30%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد مرات الاستخدام
                </label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صلاحية (أيام)
                </label>
                <input
                  type="number"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  value={createdFor}
                  onChange={(e) => setCreatedFor(e.target.value)}
                  placeholder="influencer@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerateCoupon}
              disabled={generating}
              className="w-full md:w-auto"
            >
              {generating ? 'جاري الإنشاء...' : '🎟️ إنشاء كوبون'}
            </Button>
          </CardContent>
        </Card>

        {/* Coupons List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>الكوبونات ({filteredCoupons.length})</CardTitle>

              {/* Filter Tabs */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  الكل ({statusCounts.all})
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  نشط ({statusCounts.active})
                </button>
                <button
                  onClick={() => setFilterStatus('expired')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'expired'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  منتهي ({statusCounts.expired})
                </button>
                <button
                  onClick={() => setFilterStatus('used')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'used'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  مستخدم ({statusCounts.used})
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Bulk Actions */}
            {selectedCoupons.length > 0 && (
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-md flex items-center justify-between">
                <span className="text-sm text-purple-900">
                  تم اختيار {selectedCoupons.length} كوبون
                </span>
                <Button
                  onClick={handleBulkDelete}
                  variant="destructive"
                  size="sm"
                >
                  🗑️ حذف المحدد
                </Button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedCoupons.length === filteredCoupons.length &&
                          filteredCoupons.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="text-right p-3">الكود</th>
                    <th className="text-right p-3">الخصم</th>
                    <th className="text-right p-3">الاستخدام</th>
                    <th className="text-right p-3">الحالة</th>
                    <th className="text-right p-3">تاريخ الإنشاء</th>
                    <th className="text-right p-3">الصلاحية</th>
                    <th className="text-right p-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedCoupons.includes(coupon.id)}
                          onChange={() => handleSelectCoupon(coupon.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-mono text-sm">{coupon.code}</td>
                      <td className="p-3">{coupon.discount}%</td>
                      <td className="p-3">
                        {coupon.usedCount} / {coupon.maxUses || '∞'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            coupon.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : coupon.status === 'used'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {coupon.status === 'active'
                            ? 'نشط'
                            : coupon.status === 'used'
                              ? 'مستخدم'
                              : 'منتهي'}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {coupon.createdAt?.toDate().toLocaleDateString('ar')}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {coupon.expiresAt
                          ? coupon.expiresAt.toDate().toLocaleDateString('ar')
                          : 'بدون'}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {coupon.status === 'active' && (
                            <button
                              onClick={() => handleDeactivateCoupon(coupon.id)}
                              className="text-orange-600 hover:text-orange-800 text-sm"
                            >
                              تعطيل
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCoupons.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {filterStatus === 'all'
                    ? 'لا توجد كوبونات بعد'
                    : `لا توجد كوبونات ${
                        filterStatus === 'active'
                          ? 'نشطة'
                          : filterStatus === 'expired'
                            ? 'منتهية'
                            : 'مستخدمة'
                      }`}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
