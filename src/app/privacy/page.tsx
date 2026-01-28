'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              سياسة الخصوصية
            </h1>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <p className="text-gray-600 mb-6">آخر تحديث: ديسمبر 2024</p>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. مقدمة
                </h2>
                <p>
                  نحن في عريضة نلتزم بحماية خصوصيتك ومعالجة بياناتك الشخصية
                  وفقًا لمقتضيات القانون رقم 09-08 المتعلق بحماية الأشخاص
                  الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي، و المندرج تحت
                  اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي
                  (CNDP).
                </p>
                <p className="mt-4">
                  باستخدامك للمنصة، فإنك توافق على معالجة بياناتك وفق ما هو موضح
                  في هذه السياسة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. البيانات التي نقوم بجمعها
                </h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">
                  أ. البيانات التي تقدمها طوعًا
                </h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li>الاسم الشخصي</li>
                  <li>عنوان البريد الإلكتروني</li>
                  <li>رقم الهاتف</li>
                  <li>
                    أي معلومات تقدمها عند:
                    <ul className="list-disc pr-6 mt-2 space-y-1">
                      <li>إنشاء حساب</li>
                      <li>إنشاء عريضة</li>
                      <li>التوقيع على عريضة</li>
                    </ul>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">
                  ب. البيانات التقنية
                </h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li>عنوان IP</li>
                  <li>نوع الجهاز والمتصفح</li>
                  <li>بيانات التصفح والتفاعل داخل المنصة</li>
                </ul>
                <p className="mt-4">
                  يتم جمع هذه البيانات بشكل قانوني، مشروع، وشفاف.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. أغراض معالجة البيانات
                </h2>
                <p>تُستخدم بياناتك للأغراض التالية:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>إنشاء وإدارة حساب المستخدم</li>
                  <li>التحقق من الهوية ومنع الاحتيال أو التوقيعات الوهمية</li>
                  <li>تمكين إنشاء العرائض والتوقيع عليها</li>
                  <li>التواصل معك بخصوص إشعارات مهمة متعلقة بالخدمة</li>
                  <li>تحسين أداء المنصة وتجربة المستخدم</li>
                  <li>الامتثال للالتزامات القانونية والتنظيمية</li>
                </ul>
                <p className="mt-4">
                  ولا تتم معالجة البيانات لأي غرض يتعارض مع ما سبق.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. الأساس القانوني للمعالجة
                </h2>
                <p>تتم معالجة بياناتك بناءً على:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>موافقتك الصريحة عند التسجيل أو استخدام المنصة</li>
                  <li>الضرورة التعاقدية لتقديم الخدمة</li>
                  <li>الالتزامات القانونية المفروضة على المنصة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. مشاركة البيانات
                </h2>
                <p>نحن لا نبيع ولا نشارك بياناتك الشخصية لأغراض تجارية.</p>
                <p className="mt-4">
                  قد تتم مشاركة بعض البيانات فقط في الحالات التالية:
                </p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>
                    إذا كان ذلك مطلوبًا بموجب القانون أو بأمر من السلطات المختصة
                  </li>
                  <li>لحماية حقوق المنصة أو سلامة المستخدمين</li>
                  <li>
                    مع مزودي خدمات تقنيين (الاستضافة، الحماية)، مع التزامهم
                    الصارم بسرية البيانات
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. حماية البيانات
                </h2>
                <p>
                  نتخذ جميع التدابير التقنية والتنظيمية اللازمة لحماية بياناتك
                  من:
                </p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>الولوج غير المصرح به</li>
                  <li>التعديل أو الكشف غير المشروع</li>
                  <li>الفقدان أو الإتلاف</li>
                </ul>
                <p className="mt-4">
                  ومع ذلك، لا يمكن ضمان أمان مطلق للأنظمة الرقمية.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. مدة الاحتفاظ بالبيانات
                </h2>
                <p>
                  نحتفظ ببياناتك فقط للمدة الضرورية لتحقيق الأغراض التي جُمعت من
                  أجلها، أو للمدة التي يفرضها القانون.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. حقوق المستخدم (وفق القانون 09-08)
                </h2>
                <p>يحق لك، وفقًا للقانون، ما يلي:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>حق الولوج إلى بياناتك الشخصية</li>
                  <li>حق تصحيح أو تحديث البيانات غير الدقيقة</li>
                  <li>حق الاعتراض على معالجة بياناتك لأسباب مشروعة</li>
                  <li>
                    حق طلب حذف بياناتك، ما لم يكن الاحتفاظ بها مطلوبًا قانونيًا
                  </li>
                </ul>
                <p className="mt-4">
                  يمكنك ممارسة هذه الحقوق عبر التواصل معنا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. ملفات تعريف الارتباط (Cookies)
                </h2>
                <p>
                  قد نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل
                  استخدام المنصة. يمكنك تعطيلها أو التحكم فيها من خلال إعدادات
                  المتصفح.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. تعديل سياسة الخصوصية
                </h2>
                <p>
                  قد نقوم بتحديث هذه السياسة عند الاقتضاء. سيتم نشر أي تعديل على
                  هذه الصفحة، ويُعد استمرار استخدامك للمنصة موافقة على
                  التعديلات.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. الاتصال بنا
                </h2>
                <p className="mb-4">
                  لأي استفسار بخصوص حماية بياناتك الشخصية أو لممارسة حقوقك،
                  يمكنك التواصل معنا عبر:
                </p>
                <Link href="/contact">
                  <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                    اتصل بنا
                  </Button>
                </Link>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
