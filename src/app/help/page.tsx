'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { useTranslation } from '@/hooks/useTranslation';

export default function HelpPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sections based on search query
  const filterContent = (translationKeys: string[]) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    // Check if any of the translation keys contain the search query
    return translationKeys.some((key) => {
      const translatedText = t(key).toLowerCase();
      return translatedText.includes(query);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('help.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{t('help.subtitle')}</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder={t('help.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
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
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                {t('help.showingResults', { query: searchQuery })}
              </p>
            )}
          </div>
        </div>

        {/* Getting Started */}
        {filterContent([
          'help.gettingStarted.title',
          'help.gettingStarted.createPetition.title',
          'help.gettingStarted.signPetition.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.gettingStarted.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion>
                <AccordionItem
                  title={t('help.gettingStarted.createPetition.title')}
                >
                  <p className="text-gray-600 mb-2">
                    {t('help.gettingStarted.createPetition.intro')}
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4 mb-3">
                    <li>{t('help.gettingStarted.createPetition.step1')}</li>
                    <li>{t('help.gettingStarted.createPetition.step2')}</li>
                    <li>{t('help.gettingStarted.createPetition.step3')}</li>
                    <li>{t('help.gettingStarted.createPetition.step4')}</li>
                    <li>{t('help.gettingStarted.createPetition.step5')}</li>
                    <li>{t('help.gettingStarted.createPetition.step6')}</li>
                  </ol>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                    <p className="text-amber-900 text-sm">
                      <strong>تذكير:</strong> التحقق من الهاتف والبريد
                      الإلكتروني مطلوب لمنشئي العرائض.
                    </p>
                  </div>
                </AccordionItem>

                <AccordionItem
                  title={t('help.gettingStarted.signPetition.title')}
                >
                  <p className="text-gray-600 mb-2">
                    {t('help.gettingStarted.signPetition.intro')}
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4">
                    <li>{t('help.gettingStarted.signPetition.step1')}</li>
                    <li>{t('help.gettingStarted.signPetition.step2')}</li>
                    <li>{t('help.gettingStarted.signPetition.step3')}</li>
                    <li>{t('help.gettingStarted.signPetition.step4')}</li>
                  </ol>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Account & Profile */}
        {filterContent([
          'help.account.title',
          'help.account.createAccount.title',
          'help.account.editProfile.title',
          'help.account.resetPassword.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.account.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion>
                <AccordionItem title={t('help.account.createAccount.title')}>
                  <p className="text-gray-600 mb-3">
                    {t('help.account.createAccount.description')}
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-900 text-lg mb-2">
                      <strong>أو ببساطة:</strong> سجل الدخول باستخدام حساب Gmail
                      الخاص بك ذون إنشاء حساب.
                    </p>

                    <p className="text-blue-800 text-lg">
                      يمكنك دائماً تغيير معلومات ملفك الشخصي وحسابك بالنقر على
                      صورة/اسم حسابك في الأعلى على اليسار ثم اختيار:{' '}
                      <strong>إعدادات الملف الشخصي</strong>
                    </p>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('help.account.resetPassword.title')}>
                  <p className="text-gray-600 mb-3">
                    لتغيير كلمة المرور الخاصة بك:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4 mb-3">
                    <li>انقر على صورة/اسم حسابك في الأعلى على اليسار</li>
                    <li>
                      اختر <strong>إعدادات الملف الشخصي</strong>
                    </li>
                    <li>
                      انتقل إلى تبويب <strong>الأمان</strong>
                    </li>
                    <li>ستجد خيار تغيير كلمة المرور هناك</li>
                  </ol>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                    <p className="text-gray-700 text-sm">
                      <strong>ملاحظة:</strong> يمكنك الوصول إلى إعدادات الأمان
                      من:{' '}
                      <strong>
                        الملف الشخصي → إعدادات الملف الشخصي → الأمان
                      </strong>
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    يمكنك التواصل مع فريق الدعم في أي وقت إذا واجهت أي مشكلة.
                  </p>
                </AccordionItem>

                <AccordionItem title="ما هي الإشعارات التي سأتلقاها عبر البريد الإلكتروني؟">
                  <p className="text-gray-600 mb-3">
                    نرسل إشعارات بريد إلكتروني في حالات محددة لإبقائك على اطلاع
                    بحالة عرائضك ونشاطك على المنصة.
                  </p>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <p className="text-indigo-900 font-semibold mb-2">
                      الإشعارات التي نرسلها:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-indigo-800 text-sm">
                      <li>
                        <strong>موافقة/رفض العريضة:</strong> عند مراجعة عريضتك
                        من قبل المشرفين
                      </li>
                      <li>
                        <strong>رسالة شكر:</strong> عند دعم المنصة بإكرامية
                      </li>
                      <li>
                        <strong>تحديثات مهمة:</strong> إعلانات خاصة بالمنصة
                        (نادراً)
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm">
                    <strong>نصيحة:</strong> تحقق من مجلد الرسائل غير المرغوب
                    فيها (Spam) إذا لم تجد رسائلنا. أضف{' '}
                    <span className="font-mono bg-gray-100 px-1 rounded">
                      noreply@3arida.com
                    </span>{' '}
                    إلى قائمة جهات الاتصال الآمنة.
                  </p>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Managing Petitions */}
        {filterContent([
          'help.managing.title',
          'help.managing.approval.title',
          'help.managing.edit.title',
          'help.managing.delete.title',
          'help.managing.updates.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.managing.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion>
                <AccordionItem title={t('help.managing.approval.title')}>
                  <p className="text-gray-600">
                    {t('help.managing.approval.description')}
                  </p>
                </AccordionItem>

                <AccordionItem title={t('help.managing.edit.title')}>
                  <p className="text-gray-600">
                    {t('help.managing.edit.description')}
                  </p>
                </AccordionItem>

                <AccordionItem title={t('help.managing.delete.title')}>
                  <p className="text-gray-600 mb-2">
                    {t('help.managing.delete.intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>{t('help.managing.delete.condition1')}</li>
                    <li>{t('help.managing.delete.condition2')}</li>
                    <li>{t('help.managing.delete.condition3')}</li>
                  </ul>
                  <p className="text-gray-600 mt-2">
                    {t('help.managing.delete.note')}
                  </p>
                </AccordionItem>

                <AccordionItem title={t('help.managing.updates.title')}>
                  <p className="text-gray-600">
                    {t('help.managing.updates.description')}
                  </p>
                </AccordionItem>

                <AccordionItem title="ماذا لو تم رفض عريضتي؟">
                  <p className="text-gray-600 mb-3">
                    إذا تم رفض عريضتك، يمكنك تقديم استئناف للمشرفين لمراجعة
                    القرار. نظام الاستئناف متاح لجميع المستخدمين.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-900 font-semibold mb-2">
                      كيفية تقديم استئناف:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm mr-4">
                      <li>اذهب إلى لوحة التحكم الخاصة بك</li>
                      <li>ابحث عن العريضة المرفوضة</li>
                      <li>اضغط على زر "استئناف القرار"</li>
                      <li>اشرح سبب اعتقادك أن القرار يجب مراجعته</li>
                      <li>سيتم الرد خلال 24-48 ساعة</li>
                    </ol>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm">
                    <strong>نصيحة:</strong> قدم معلومات واضحة ومحددة في
                    استئنافك. يمكنك متابعة حالة الاستئناف من خلال شارة العدد في
                    لوحة التحكم.
                  </p>
                </AccordionItem>

                <AccordionItem title="كيف أتواصل مع المشرفين؟">
                  <p className="text-gray-600 mb-3">
                    يمكن للمستخدمين في الباقات المدفوعة التواصل مباشرة مع
                    المشرفين عبر زر "تواصل مع المشرف" المتوفر في صفحات العرائض.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4 text-sm">
                    <li>متاح للباقات المدفوعة فقط</li>
                    <li>استخدمه للأسئلة أو الاستفسارات أو المشاكل</li>
                    <li>احرص على التواصل بشكل مهني ومحترم</li>
                    <li>وقت الاستجابة: عادة خلال 24 ساعة</li>
                  </ul>
                  <p className="text-gray-600 mt-3 text-sm">
                    <strong>ملاحظة:</strong> خلال فترة البيتا، جميع المستخدمين
                    يمكنهم استخدام نظام الاستئناف مجاناً.
                  </p>
                  <p className="text-gray-600 text-sm">
                    يمكنك التواصل مع فريق الدعم في أي وقت إذا واجهت أي مشكلة.
                  </p>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Sharing & Promotion */}
        {filterContent([
          'help.sharing.title',
          'help.sharing.howToShare.title',
          'help.sharing.qrCode.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.sharing.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion>
                <AccordionItem title={t('help.sharing.howToShare.title')}>
                  <p className="text-gray-600 mb-2">
                    {t('help.sharing.howToShare.intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>{t('help.sharing.howToShare.social')}</li>
                    <li>{t('help.sharing.howToShare.link')}</li>
                    <li>{t('help.sharing.howToShare.email')}</li>
                    <li>{t('help.sharing.howToShare.qr')}</li>
                  </ul>
                </AccordionItem>

                <AccordionItem title={t('help.sharing.qrCode.title')}>
                  <p className="text-gray-600">
                    {t('help.sharing.qrCode.description')}
                  </p>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Privacy & Security */}
        {filterContent([
          'help.privacy.title',
          'help.privacy.safe.title',
          'help.privacy.phoneVerification.title',
          'help.privacy.anonymous.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.privacy.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion>
                <AccordionItem title={t('help.privacy.safe.title')}>
                  <p className="text-gray-600">
                    {t('help.privacy.safe.description')}
                  </p>
                </AccordionItem>

                <AccordionItem
                  title={t('help.privacy.phoneVerification.title')}
                >
                  <p className="text-gray-600">
                    {t('help.privacy.phoneVerification.description')}
                  </p>
                </AccordionItem>

                <AccordionItem title={t('help.privacy.anonymous.title')}>
                  <p className="text-gray-600">
                    {t('help.privacy.anonymous.description')}
                  </p>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Pricing & Payments */}
        {filterContent([
          'help.pricing.title',
          'help.pricing.free.title',
          'help.pricing.payment.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.pricing.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion>
                <AccordionItem title={t('help.pricing.free.title')}>
                  <p className="text-gray-600 mb-2">
                    {t('help.pricing.free.intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>{t('help.pricing.free.tier1')}</li>
                    <li>{t('help.pricing.free.tier2')}</li>
                    <li>{t('help.pricing.free.tier3')}</li>
                    <li>{t('help.pricing.free.tier4')}</li>
                    <li>{t('help.pricing.free.tier5')}</li>
                  </ul>
                </AccordionItem>

                <AccordionItem title={t('help.pricing.payment.title')}>
                  <p className="text-gray-600">
                    {t('help.pricing.payment.description')}
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="هل إنشاء العرائض مجاني حالياً؟"
                  defaultOpen={true}
                >
                  {/* Commitment to Free Small Petitions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-900 font-semibold mb-2">
                      ✅ نعم! إلتزامنا الدائم
                    </p>
                    <p className="text-blue-800 text-sm">
                      نحن ملتزمون بإبقاء #منصة_عريضة{' '}
                      <strong>مجانية دائماً</strong> للعرائض الصغيرة التي تستهدف
                      حتى <strong>2500 توقيع</strong>. هدفنا هو دعم القضايا
                      المحلية والمبادرات المجتمعية.
                    </p>
                  </div>

                  {/* Beta Launch Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                    <p className="text-green-900 font-semibold mb-2">
                      🎉 إضافة: فترة الإطلاق التجريبي - مجاناً بالكامل
                    </p>
                    <p className="text-green-800 text-sm mb-2">
                      خلال فترة الإطلاق التجريبي (Beta)، يمكنك إنشاء عرائض
                      مجانية بنسبة 100% <strong>بدون حدود</strong>. يتم تطبيق
                      كوبون BETA100 تلقائياً على جميع العرائض.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-green-800 text-sm mr-4">
                      <li>لا حاجة لإدخال معلومات الدفع</li>
                      <li>جميع المزايا متاحة مجاناً</li>
                      <li>فرصة محدودة للمستخدمين الأوائل</li>
                    </ul>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <strong>ملاحظة:</strong> استفد من هذه الفرصة لإطلاق عريضتك
                    الآن. سيتم الإعلان عن أي تغييرات في الأسعار مسبقاً.
                  </p>
                </AccordionItem>

                <AccordionItem title="كيف يمكنني دعم المنصة؟">
                  <p className="text-gray-600 mb-3">
                    بعد إنشاء عريضتك بنجاح، يمكنك اختيار دعم المنصة عبر ميزة
                    "ادفع ما تشاء" (Pay What You Want).
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-900 font-semibold mb-2">
                      كيف يعمل الدعم:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm">
                      <li>اختياري بالكامل - لا إجبار</li>
                      <li>ابدأ من 10 درهم أو أي مبلغ تختاره</li>
                      <li>دفع آمن عبر Stripe</li>
                      <li>ستتلقى رسالة شكر عبر البريد الإلكتروني</li>
                      <li>يساعد في تغطية تكاليف التشغيل والتطوير</li>
                    </ul>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm">
                    كل إكرامية تساعدنا في الحفاظ على استقلالية المنصة وتطويرها
                    لخدمة المجتمع بشكل أفضل.
                  </p>
                </AccordionItem>

                <AccordionItem title="هل الدفع آمن؟">
                  <p className="text-gray-600 mb-3">
                    نعم، جميع المدفوعات تتم عبر Stripe، وهي منصة دفع عالمية
                    موثوقة تستخدمها ملايين الشركات حول العالم.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4 text-sm">
                    <li>لا نحتفظ بمعلومات بطاقتك الائتمانية على خوادمنا</li>
                    <li>معالجة آمنة ومشفرة للمدفوعات</li>
                    <li>معايير أمان PCI-DSS</li>
                    <li>
                      سيظهر في كشف حسابك البنكي: "3ARIDA* TIPS" أو "3ARIDA*
                      PETITION"
                    </li>
                  </ul>
                </AccordionItem>

                <AccordionItem title="لماذا #منصة_عريضة ليست مجانية؟">
                  <p className="text-gray-600 mb-3">
                    {' '}
                    #منصة_عريضة هي مبادرة مستقلة غير مدعومة من أي منظمة أو مؤسسة
                    جهة عمومية أو خاصة. و لضمان إستمرارية المنصة في أداء مهمتها
                    الإجتماعية، فهي بحاجة لفريق عمل للتطوير و الدعم الفني و
                    الإشراف فضلا عن توفير بيئة تقنية لإستضافة و تدبير آلاف
                    العرائض التي ستحتضن أعداداً جد ضخمة من التوقيعات، و كل هذا
                    مُكلِّف جداً مادياً. و لهذا نحن نعتمد على رسوم رمزية عن
                    الخدمة للمساعدة و لو نسبياً في تغطية تكاليف التشغيل
                    والتطوير.{' '}
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-900 font-semibold mb-2">
                      ما يميزنا:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm">
                      <li>لا نعرض إعلانات على المنصة</li>
                      <li>لا نبيع بيانات المستخدمين</li>
                      <li>استقلالية كاملة في القرارات</li>
                      <li>شفافية في التسعير</li>
                    </ul>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm">
                    <strong>ملاحظة:</strong> منصات العرائض الأجنبية مدعومة من
                    منظمات كبيرة وتتلقى تمويلاً من مؤسسات عامة وخاصة بالإضافة
                    إلى إكراميات المستخدمين، مما يسمح لها بتقديم خدمات مجانية.
                  </p>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Technical Issues */}
        {filterContent([
          'help.technical.title',
          'help.technical.upload.title',
          'help.technical.loading.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.technical.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion>
                <AccordionItem title={t('help.technical.upload.title')}>
                  <p className="text-gray-600 mb-2">
                    {t('help.technical.upload.intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>{t('help.technical.upload.format')}</li>
                    <li>{t('help.technical.upload.size')}</li>
                    <li>{t('help.technical.upload.dimensions')}</li>
                  </ul>
                </AccordionItem>

                <AccordionItem title={t('help.technical.loading.title')}>
                  <p className="text-gray-600 mb-2">
                    {t('help.technical.loading.intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>{t('help.technical.loading.cache')}</li>
                    <li>{t('help.technical.loading.browser')}</li>
                    <li>{t('help.technical.loading.connection')}</li>
                    <li>{t('help.technical.loading.extensions')}</li>
                  </ul>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Contact Support */}
        {filterContent([
          'help.contact.title',
          'help.contact.supportTitle',
          'help.contact.intro',
        ]) && (
          <Card className="mb-8">
            <CardHeader></CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  لا تزال تحتاج مساعدة؟
                </h3>
                <p className="text-gray-600 mb-4">{t('help.contact.intro')}</p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {t('help.contact.link')}
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results Message */}
        {searchQuery &&
          !filterContent([
            'help.gettingStarted.title',
            'help.gettingStarted.createPetition.title',
            'help.gettingStarted.signPetition.title',
          ]) &&
          !filterContent([
            'help.account.title',
            'help.account.createAccount.title',
            'help.account.editProfile.title',
            'help.account.resetPassword.title',
          ]) &&
          !filterContent([
            'help.managing.title',
            'help.managing.approval.title',
            'help.managing.edit.title',
            'help.managing.delete.title',
            'help.managing.updates.title',
          ]) &&
          !filterContent([
            'help.sharing.title',
            'help.sharing.howToShare.title',
            'help.sharing.qrCode.title',
          ]) &&
          !filterContent([
            'help.privacy.title',
            'help.privacy.safe.title',
            'help.privacy.phoneVerification.title',
            'help.privacy.anonymous.title',
          ]) &&
          !filterContent([
            'help.pricing.title',
            'help.pricing.free.title',
            'help.pricing.payment.title',
          ]) &&
          !filterContent([
            'help.technical.title',
            'help.technical.upload.title',
            'help.technical.loading.title',
          ]) &&
          !filterContent([
            'help.contact.title',
            'help.contact.supportTitle',
            'help.contact.intro',
          ]) && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {t('help.noResults.title')}
              </h3>
              <p className="mt-1 text-gray-500">
                {t('help.noResults.description')}{' '}
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {t('help.noResults.clearSearch')}
                </button>
              </p>
            </div>
          )}
      </div>

      <Footer />
    </div>
  );
}
