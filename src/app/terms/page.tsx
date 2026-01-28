'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              شروط الخدمة
            </h1>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <p className="text-gray-600 mb-6">آخر تحديث: ديسمبر 2024</p>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. قبول الشروط
                </h2>
                <p>
                  باستخدامك لمنصة عريضة أو أي من خدماتها، فإنك تقرّ بأنك قرأت
                  وفهمت ووافقت على الالتزام بشروط الخدمة هذه، بالإضافة إلى سياسة
                  الخصوصية وإرشادات المجتمع.
                </p>
                <p className="mt-4">
                  إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام
                  المنصة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. وصف الخدمات
                </h2>
                <p>توفر عريضة منصة رقمية تتيح للمستخدمين:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>إنشاء عرائض إلكترونية</li>
                  <li>التوقيع على العرائض</li>
                  <li>التفاعل مع محتوى العرائض في إطار قانوني ومنظم</li>
                </ul>
                <p className="mt-4">
                  نحتفظ بالحق في تعديل، تحديث، تعليق، أو إيقاف أي جزء من الخدمات
                  مؤقتًا أو نهائيًا، في أي وقت، دون إشعار مسبق.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. أهلية الاستخدام
                </h2>
                <p>باستخدامك للمنصة، فإنك تقر بأنك:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>تبلغ السن القانوني لاستخدام الخدمات الرقمية</li>
                  <li>تستخدم المنصة بصفة شخصية وغير احتيالية</li>
                  <li>لن تستخدم المنصة لأي غرض غير قانوني</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. مسؤوليات المستخدم
                </h2>
                <p>أنت تتحمل المسؤولية الكاملة عن:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>المحتوى الذي تنشره أو توقع عليه</li>
                  <li>دقة وصحة المعلومات التي تقدمها</li>
                  <li>
                    التأكد من أن استخدامك للمنصة لا يخالف القوانين المعمول بها
                    أو حقوق الغير
                  </li>
                </ul>
                <p className="mt-4">
                  ويجب استخدام المنصة بطريقة مسؤولة، أخلاقية، وتحترم النظام
                  العام.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. المحتوى والمراجعة
                </h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>تخضع جميع العرائض لمراجعة يدوية قبل نشرها</li>
                  <li>لا تضمن المنصة نشر أي عريضة</li>
                  <li>
                    يحق لإدارة المنصة رفض أو حذف أي محتوى يخالف شروط الخدمة أو
                    إرشادات المجتمع، أو ترى أنه غير مناسب، دون الحاجة إلى تقديم
                    تبرير
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. الملكية الفكرية
                </h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>يحتفظ المستخدم بحقوقه على المحتوى الذي ينشره</li>
                  <li>
                    بمنحك نشر المحتوى على المنصة، فإنك تمنح عريضة ترخيصًا غير
                    حصري لاستخدامه وعرضه في إطار تشغيل المنصة
                  </li>
                  <li>يمنع نسخ أو إعادة استخدام محتوى المنصة دون إذن مسبق</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. تعليق أو إنهاء الحساب
                </h2>
                <p>يحق لإدارة المنصة:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>تعليق أو إنهاء حساب أي مستخدم في حال خرق هذه الشروط</li>
                  <li>حذف المحتوى المرتبط بالحساب المخالف</li>
                </ul>
                <p className="mt-4">دون أن يترتب عن ذلك أي تعويض.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. إخلاء المسؤولية
                </h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>
                    يتم توفير المنصة "كما هي" دون أي ضمانات صريحة أو ضمنية
                  </li>
                  <li>لا تتحمل عريضة أي مسؤولية عن محتوى العرائض أو نتائجها</li>
                  <li>
                    المستخدم وحده مسؤول قانونيًا عن المحتوى الذي ينشره أو يدعمه
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. تعديل شروط الخدمة
                </h2>
                <p>
                  نحتفظ بالحق في تعديل شروط الخدمة هذه في أي وقت. سيتم نشر
                  النسخة المحدّثة على هذه الصفحة، ويُعد استمرار استخدامك للمنصة
                  موافقة على التعديلات.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. القانون الواجب التطبيق
                </h2>
                <p>
                  تخضع شروط الخدمة هذه للقوانين المعمول بها في المملكة المغربية،
                  وأي نزاع يخضع لاختصاص المحاكم المغربية.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. اتصل بنا
                </h2>
                <p className="mb-4">
                  لأي استفسار بخصوص شروط الخدمة، يرجى التواصل معنا عبر:
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
