'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              سياسة ملفات تعريف الارتباط (Cookies)
            </h1>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <p className="text-gray-600 mb-6">آخر تحديث: ديسمبر 2024</p>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. ما هي ملفات تعريف الارتباط؟
                </h2>
                <p>
                  ملفات تعريف الارتباط (Cookies) هي ملفات نصية صغيرة تُحفظ على
                  جهازك عند زيارة موقعنا أو استخدام تطبيقنا. تساعدنا هذه الملفات
                  على:
                </p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>تحسين تجربة المستخدم</li>
                  <li>تذكر تفضيلاتك مثل اللغة أو الإعدادات الشخصية</li>
                  <li>تحليل استخدام الموقع وتطويره</li>
                  <li>تعزيز الأمان وحماية الحسابات</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. كيف نستخدم ملفات تعريف الارتباط؟
                </h2>
                <p>نستخدم ملفات تعريف الارتباط للأغراض التالية:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>
                    <strong>وظيفية:</strong> لتسهيل تصفح الموقع وحفظ تفضيلاتك
                  </li>
                  <li>
                    <strong>تحليلية:</strong> لفهم كيفية استخدام المنصة وتحسين
                    الخدمات
                  </li>
                  <li>
                    <strong>أمنية:</strong> لحماية حسابك والمعلومات الشخصية
                  </li>
                </ul>
                <p className="mt-4">
                  <strong>ملاحظة:</strong> لا نستخدم ملفات تعريف الارتباط لتتبعك
                  عبر مواقع أو خدمات أخرى دون موافقتك.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. أنواع ملفات تعريف الارتباط
                </h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>
                    <strong>أساسية:</strong> ضرورية لتشغيل المنصة بشكل صحيح
                  </li>
                  <li>
                    <strong>وظيفية:</strong> تساعد على تحسين تجربتك، مثل تذكر
                    تفضيلاتك
                  </li>
                  <li>
                    <strong>تحليلية / أداء:</strong> تساعدنا على فهم كيفية
                    استخدام المنصة وتحسينها
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. التحكم في ملفات تعريف الارتباط
                </h2>
                <p>
                  يمكنك إدارة أو تعطيل ملفات تعريف الارتباط عبر إعدادات المتصفح
                  أو الجهاز.
                </p>
                <p className="mt-4">
                  <strong>تنبيه:</strong> إيقاف بعض ملفات تعريف الارتباط قد يؤثر
                  على وظائف المنصة أو تجربة الاستخدام.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. موافقة المستخدم
                </h2>
                <p>
                  باستمرارك في استخدام المنصة، فإنك توافق على استخدام ملفات
                  تعريف الارتباط وفقًا لهذه السياسة، إلا إذا قمت بتعطيلها عبر
                  إعدادات المتصفح.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. التحديثات على السياسة
                </h2>
                <p>
                  قد نحدّث هذه السياسة من وقت لآخر. سيتم نشر أي تغييرات على هذه
                  الصفحة، ويُعد استمرارك في استخدام المنصة موافقة على التعديلات.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. اتصل بنا
                </h2>
                <p className="mb-4">
                  إذا كانت لديك أي أسئلة حول سياسة ملفات تعريف الارتباط، يرجى
                  التواصل معنا عبر:
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
