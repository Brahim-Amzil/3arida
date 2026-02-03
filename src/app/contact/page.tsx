'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';

const contactReasons = [
  { value: 'general', label: 'استفسار عام' },
  { value: 'technical', label: 'مشكلة تقنية' },
  { value: 'petition', label: 'سؤال حول عريضة' },
  { value: 'account', label: 'مشكلة في الحساب' },
  { value: 'report', label: 'الإبلاغ عن محتوى' },
  { value: 'partnership', label: 'شراكة أو تعاون' },
  { value: 'press', label: 'استفسار صحفي' },
  { value: 'influencer-coupon', label: 'طلب كوبون مؤثر' },
  { value: 'other', label: 'أخرى' },
];

const socialPlatforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'snapchat', label: 'Snapchat' },
  { value: 'other', label: 'أخرى' },
];

const discountTiers = [
  { value: '10', label: '10% خصم (30K-50K متابع)' },
  { value: '15', label: '15% خصم (50K-100K متابع)' },
  { value: '20', label: '20% خصم (100K-500K متابع)' },
  { value: '30', label: '30% خصم (500K+ متابع)' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    subject: '',
    message: '',
    petitionCode: '',
    reportDetails: '',
    // Influencer coupon fields
    platform: '',
    accountUrl: '',
    followerCount: '',
    discountTier: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPetitionHelp, setShowPetitionHelp] = useState(false);
  const [petitionData, setPetitionData] = useState<any>(null);
  const [petitionLoading, setPetitionLoading] = useState(false);
  const [petitionError, setPetitionError] = useState('');

  // Check URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reason = params.get('reason');
    const tier = params.get('tier');

    if (reason === 'influencer-coupon') {
      setFormData((prev) => ({
        ...prev,
        reason: 'influencer-coupon',
        discountTier: tier || '',
        subject: 'طلب كوبون خصم للمؤثرين',
      }));
    }
  }, []);

  // Fetch petition data when code changes
  const fetchPetition = async (code: string) => {
    // Only fetch if code looks like a valid reference code (starts with 3AR- or similar pattern)
    if (!code || code.length < 5 || !/^[A-Z0-9-]+$/i.test(code)) {
      setPetitionData(null);
      setPetitionError('');
      return;
    }

    setPetitionLoading(true);
    setPetitionError('');

    try {
      const response = await fetch(
        `/api/petitions/${encodeURIComponent(code)}`,
      );
      if (!response.ok) {
        throw new Error('العريضة غير موجودة');
      }
      const data = await response.json();
      setPetitionData(data);
    } catch (error) {
      setPetitionError('لم يتم العثور على العريضة');
      setPetitionData(null);
    } finally {
      setPetitionLoading(false);
    }
  };

  // Debounce petition fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.petitionCode) {
        fetchPetition(formData.petitionCode);
      } else {
        setPetitionData(null);
        setPetitionError('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.petitionCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('فشل إرسال الرسالة');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        reason: '',
        subject: '',
        message: '',
        petitionCode: '',
        reportDetails: '',
        platform: '',
        accountUrl: '',
        followerCount: '',
        discountTier: '',
      });
      setPetitionData(null);
    } catch (error) {
      setStatus('error');
      setErrorMessage('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">اتصل بنا</h1>

            <div className="space-y-8">
              <section>
                <p className="text-gray-700 text-lg">
                  نحن هنا لمساعدتك! إذا كان لديك أي أسئلة أو استفسارات أو
                  تعليقات، يرجى ملء النموذج أدناه وسنرد عليك في أقرب وقت ممكن.
                </p>
              </section>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    سبب التواصل *
                  </label>
                  <select
                    id="reason"
                    required
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reason: e.target.value,
                        petitionCode: '',
                        reportDetails: '',
                        platform: '',
                        accountUrl: '',
                        followerCount: '',
                        discountTier: '',
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">اختر السبب</option>
                    {contactReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Petition Code - Show only when reason is 'petition' */}
                {formData.reason === 'petition' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="petitionCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        رمز العريضة *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPetitionHelp(true)}
                        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>كيف أجد الرمز؟</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      id="petitionCode"
                      required
                      value={formData.petitionCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          petitionCode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="مثال: 3AR-ABC123"
                    />

                    {/* Petition Preview Card */}
                    {petitionLoading && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    )}

                    {petitionError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        ❌ {petitionError}
                      </div>
                    )}

                    {petitionData && !petitionLoading && (
                      <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              {petitionData.title}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                {petitionData.signatureCount || 0} توقيع
                              </span>
                              <span className="px-2 py-0.5 bg-white rounded text-xs">
                                {petitionData.referenceCode}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Report Details - Show only when reason is 'report' */}
                {formData.reason === 'report' && (
                  <div>
                    <label
                      htmlFor="reportDetails"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      تفاصيل البلاغ *
                    </label>
                    <textarea
                      id="reportDetails"
                      required
                      rows={3}
                      value={formData.reportDetails}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reportDetails: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="يرجى وصف المحتوى الذي تريد الإبلاغ عنه بالتفصيل (نوع المحتوى، الرابط إن وجد، سبب البلاغ...)"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      💡 يرجى تضمين رابط العريضة أو المحتوى المبلغ عنه إن أمكن
                    </p>
                  </div>
                )}

                {/* Influencer Coupon Fields - Show only when reason is 'influencer-coupon' */}
                {formData.reason === 'influencer-coupon' && (
                  <div className="space-y-6 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center gap-2 text-purple-900 mb-4">
                      <span className="text-2xl">🌟</span>
                      <h3 className="text-lg font-bold">
                        طلب كوبون خصم للمؤثرين
                      </h3>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">
                      املأ المعلومات التالية للتحقق من حسابك والحصول على كوبون
                      الخصم الخاص بك
                    </p>

                    {/* Discount Tier */}
                    <div>
                      <label
                        htmlFor="discountTier"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        فئة الخصم *
                      </label>
                      <select
                        id="discountTier"
                        required
                        value={formData.discountTier}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountTier: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        <option value="">اختر فئة الخصم</option>
                        {discountTiers.map((tier) => (
                          <option key={tier.value} value={tier.value}>
                            {tier.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Platform */}
                    <div>
                      <label
                        htmlFor="platform"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        المنصة *
                      </label>
                      <select
                        id="platform"
                        required
                        value={formData.platform}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            platform: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        <option value="">اختر المنصة</option>
                        {socialPlatforms.map((platform) => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Account URL */}
                    <div>
                      <label
                        htmlFor="accountUrl"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        رابط الحساب / القناة *
                      </label>
                      <input
                        type="url"
                        id="accountUrl"
                        required
                        value={formData.accountUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accountUrl: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://instagram.com/username"
                        dir="ltr"
                      />
                      <p className="mt-2 text-xs text-gray-600">
                        💡 الرجاء إدخال الرابط الكامل لحسابك أو قناتك
                      </p>
                    </div>

                    {/* Follower Count */}
                    <div>
                      <label
                        htmlFor="followerCount"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        عدد المتابعين *
                      </label>
                      <input
                        type="text"
                        id="followerCount"
                        required
                        value={formData.followerCount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            followerCount: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="مثال: 50,000"
                      />
                      <p className="mt-2 text-xs text-gray-600">
                        💡 سنقوم بالتحقق من عدد المتابعين قبل إرسال الكوبون
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span>⏱️</span>
                        <span>ماذا بعد؟</span>
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>✅ سنقوم بمراجعة حسابك والتحقق من عدد المتابعين</li>
                        <li>
                          ✅ سنرسل لك كود الكوبون عبر البريد الإلكتروني خلال
                          دقائق{' '}
                        </li>
                        <li>
                          ✅ استخدم الكوبون عند إنشاء عريضتك للحصول على الخصم
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    الموضوع *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="موضوع رسالتك"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    الرسالة *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    ✅ تم إرسال رسالتك بنجاح! سنرد عليك قريبًا.
                  </div>
                )}

                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    ❌ {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-green-600 text-white py-2.5 px-6 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'loading' ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>

              {/* Response Times 
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  ⏰ أوقات الاستجابة المتوقعة
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    • <strong>الاستفسارات العامة:</strong> خلال 24-48 ساعة
                  </li>
                  <li>
                    • <strong>المشاكل التقنية:</strong> خلال 12-24 ساعة
                  </li>
                  <li>
                    • <strong>قضايا الأمان:</strong> خلال 6 ساعات
                  </li>
                  <li>
                    • <strong>الشراكات:</strong> خلال 3-5 أيام عمل
                  </li>
                </ul>
              </div> */}

              {/* FAQ Link */}
              <div className="bg-blue-50 border-r-4 border-blue-400 p-6 rounded">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  💡 نصيحة
                </h2>
                <p className="text-gray-700">
                  قبل التواصل معنا، يمكنك زيارة{' '}
                  <a
                    href="/help"
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    مركز المساعدة
                  </a>{' '}
                  للحصول على إجابات سريعة للأسئلة الشائعة.
                </p>
              </div>

              <div className="text-center text-gray-600">
                <p>
                  شكرًا لاستخدامك 3arida. نحن نقدر ملاحظاتك ونتطلع إلى سماع
                  رأيك!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Petition Help Modal */}
      {showPetitionHelp && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowPetitionHelp(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                كيف أجد رمز العريضة؟
              </h3>
              <button
                onClick={() => setShowPetitionHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                رمز العريضة هو معرف فريد لكل عريضة على المنصة. يمكنك العثور عليه
                بعدة طرق:
              </p>

              <div className="bg-green-50 border-r-4 border-green-500 p-4 rounded">
                <h4 className="font-semibold text-green-900 mb-2">
                  1️⃣ من صفحة العريضة
                </h4>
                <p>
                  عند فتح أي عريضة، ستجد رمز العريضة في أعلى الصفحة بجانب
                  العنوان. يبدأ الرمز عادة بـ{' '}
                  <code className="bg-white px-2 py-1 rounded">3AR-</code>
                </p>
              </div>

              <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">
                  2️⃣ من رابط العريضة (URL)
                </h4>
                <p className="mb-2">
                  انظر إلى رابط العريضة في شريط العنوان. الرمز موجود في نهاية
                  الرابط:
                </p>
                <code className="block bg-white px-3 py-2 rounded text-sm break-all">
                  https://3arida.vercel.app/petitions/
                  <span className="text-green-600 font-bold">3AR-ABC123</span>
                </code>
              </div>

              <div className="bg-purple-50 border-r-4 border-purple-500 p-4 rounded">
                <h4 className="font-semibold text-purple-900 mb-2">
                  3️⃣ من لوحة التحكم الخاصة بك
                </h4>
                <p>
                  إذا كنت منشئ العريضة، يمكنك العثور على الرمز في لوحة التحكم
                  الخاصة بك ضمن قائمة العرائض التي أنشأتها.
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">
                  💡 مثال على رمز عريضة:
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="bg-white px-4 py-2 rounded text-lg font-mono">
                    3AR-XYZ789
                  </code>
                  <span className="text-gray-600">أو</span>
                  <code className="bg-white px-4 py-2 rounded text-lg font-mono">
                    3AR-ABC123
                  </code>
                </div>
              </div>

              <div className="bg-yellow-50 border-r-4 border-yellow-500 p-4 rounded">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  ⚠️ ملاحظة مهمة
                </h4>
                <p>
                  تأكد من نسخ الرمز بالكامل بما في ذلك الأحرف الكبيرة والصغيرة.
                  الرمز حساس لحالة الأحرف.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPetitionHelp(false)}
              className="mt-6 w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              فهمت، شكرًا!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
