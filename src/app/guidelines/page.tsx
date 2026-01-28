'use client';

import { Metadata } from 'next';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';

export default function GuidelinesPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              إرشادات المجتمع
            </h1>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  مرحبًا بك في مجتمع 3arida
                </h2>
                <p>
                  نحن ملتزمون بتوفير منصة آمنة، محترمة وبنّاءة لجميع المستخدمين.
                  تهدف هذه الإرشادات إلى تنظيم استخدام المنصة وضمان بيئة إيجابية
                  تشجع على التعبير المسؤول والمطالب ذات المصلحة العامة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. الاحترام والتسامح
                </h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>احترم آراء الآخرين حتى لو كنت لا توافق عليها</li>
                  <li>لا تستخدم لغة مسيئة أو تمييزية</li>
                  <li>تجنب الهجمات الشخصية والتنمر</li>
                  <li>احترم خصوصية الآخرين</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. محتوى العرائض
                </h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>يجب أن تكون العرائض واضحة، محددة، وذات هدف مشروع</li>
                  <li>استخدم لغة محترمة ومهنية</li>
                  <li>قدّم معلومات دقيقة قدر الإمكان</li>
                  <li>تجنب نشر معلومات مضللة، كاذبة، أو غير موثوقة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. المحتوى المحظور
                </h2>
                <p>لا يُسمح بنشر أو دعم أي من المحتويات التالية على المنصة:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>
                    أي اتهام علني أو تشهير بأشخاص أو جهات، سواء كان مثبتًا أو
                    غير مثبت
                  </li>
                  <li>أي نص أو محتوى يهاجم الشخصيات العامة</li>
                  <li>
                    أي محتوى يهاجم أو يسيء إلى جلالة الملك أو المؤسسات الوطنية
                    أو الشخصيات الرسمية
                  </li>
                  <li>أي محتوى يهاجم أو يدنس الأديان أو المعتقدات الدينية</li>
                  <li>أي محتوى يروج للإرهاب، العنف، أو التمييز</li>
                  <li>خطاب الكراهية أو التحريض على العنف</li>
                  <li>
                    الدعوات غير القانونية، بما في ذلك أي عريضة تدعو إلى خرق
                    القوانين المعمول بها، العصيان المدني، أو تعطيل المرافق
                    العامة
                  </li>
                  <li>المحتوى الإباحي أو الجنسي الصريح</li>
                  <li>التهديدات، التخويف، أو المضايقات</li>
                  <li>انتهاك حقوق الملكية الفكرية</li>
                  <li>
                    نشر المعلومات الشخصية الخاصة بالآخرين دون موافقتهم الصريحة
                  </li>
                  <li>الاحتيال أو أي أنشطة غير قانونية</li>
                  <li>
                    الإعلانات أو المحتوى التجاري، بما في ذلك استخدام المنصة
                    لأغراض إعلانية، تسويقية، أو ترويج خدمات ومنتجات
                  </li>
                  <li>
                    المحتوى المكرر أو العبثي، بما في ذلك العرائض المكررة، غير
                    الجادة، أو التي لا تهدف إلى مصلحة عامة واضحة
                  </li>
                  <li>
                    أي محتوى خارج نطاق أهداف المنصة كمنصة للعرائض والمطالب
                    المدنية
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. التوقيع على العرائض
                </h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>استخدم اسمك الحقيقي عند التوقيع</li>
                  <li>
                    يُمنع إنشاء حسابات وهمية أو استخدام وسائل احتيالية للتوقيع
                    المتعدد
                  </li>
                  <li>اقرأ العريضة بالكامل قبل التوقيع</li>
                  <li>وقّع فقط على العرائض التي تعبّر عن قناعاتك الشخصية</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. التعليقات والنقاشات
                </h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>ساهم بتعليقات بناءة ومفيدة</li>
                  <li>التزم بموضوع العريضة أو النقاش</li>
                  <li>يُمنع إرسال الرسائل غير المرغوب فيها (Spam)</li>
                  <li>احترم اختلاف الآراء ووجهات النظر</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. المراجعة والإبلاغ
                </h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>
                    تخضع جميع العرائض لمراجعة يدوية من طرف إدارة المنصة قبل
                    نشرها
                  </li>
                  <li>
                    يحق لإدارة المنصة قبول أو رفض أي عريضة وفق هذه الإرشادات
                  </li>
                  <li>
                    في حال رصد أي محتوى مخالف، يرجى الإبلاغ عنه عبر زر
                    "الإبلاغ"، وسيتم التعامل مع جميع البلاغات في أقرب وقت ممكن
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. العواقب
                </h2>
                <p>
                  قد يؤدي انتهاك هذه الإرشادات، حسب خطورة المخالفة وتكرارها، إلى
                  اتخاذ أحد الإجراءات التالية:
                </p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>توجيه تحذير</li>
                  <li>إزالة المحتوى المخالف</li>
                  <li>تعليق الحساب مؤقتًا</li>
                  <li>حظر الحساب نهائيًا</li>
                </ul>
                <p className="mt-4">
                  تحتفظ إدارة المنصة بحق اتخاذ الإجراء المناسب دون الحاجة إلى
                  تقديم تبرير.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. تحديثات الإرشادات
                </h2>
                <p>
                  قد نقوم بتحديث هذه الإرشادات من وقت لآخر. سيتم إشعار
                  المستخدمين بأي تغييرات جوهرية عند الاقتضاء.
                </p>
                <p className="mt-4">
                  لا تُعتبر هذه الإرشادات بديلاً عن القوانين المعمول بها، ويظل
                  المستخدم مسؤولًا قانونيًا عن المحتوى الذي ينشره.
                </p>
              </section>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600">آخر تحديث: يناير 2026</p>
                <p className="text-sm text-gray-600 mt-2">
                  شكرًا لمساعدتك في جعل 3arida مجتمعًا أفضل للجميع!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
