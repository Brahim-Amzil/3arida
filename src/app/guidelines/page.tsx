import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إرشادات المجتمع - 3arida',
  description: 'إرشادات المجتمع لمنصة 3arida للعرائض الرقمية',
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            إرشادات المجتمع
          </h1>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                مرحبا بك في مجتمع 3arida
              </h2>
              <p>
                نحن ملتزمون بتوفير منصة آمنة ومحترمة لجميع المستخدمين. هذه
                الإرشادات تساعد في الحفاظ على مجتمع إيجابي وبناء.
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
                <li>يجب أن تكون العرائض واضحة ومحددة</li>
                <li>استخدم لغة محترمة ومهنية</li>
                <li>قدم حقائق دقيقة ومصادر موثوقة</li>
                <li>تجنب المعلومات المضللة أو الكاذبة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. المحتوى المحظور
              </h2>
              <p>لا يُسمح بالمحتوى التالي على المنصة:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>خطاب الكراهية أو التحريض على العنف</li>
                <li>المحتوى الإباحي أو الجنسي الصريح</li>
                <li>التهديدات أو المضايقات</li>
                <li>انتهاك حقوق الملكية الفكرية</li>
                <li>المعلومات الشخصية الخاصة بالآخرين</li>
                <li>الاحتيال أو الأنشطة غير القانونية</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. التوقيع على العرائض
              </h2>
              <ul className="list-disc pr-6 space-y-2">
                <li>استخدم اسمك الحقيقي عند التوقيع</li>
                <li>لا تنشئ حسابات وهمية للتوقيع المتعدد</li>
                <li>اقرأ العريضة بالكامل قبل التوقيع</li>
                <li>وقع فقط على العرائض التي تؤمن بها</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. التعليقات والنقاشات
              </h2>
              <ul className="list-disc pr-6 space-y-2">
                <li>ساهم بتعليقات بناءة ومفيدة</li>
                <li>ابق على الموضوع</li>
                <li>لا ترسل رسائل غير مرغوب فيها (spam)</li>
                <li>احترم وجهات النظر المختلفة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. الإبلاغ عن المخالفات
              </h2>
              <p>
                إذا رأيت محتوى ينتهك هذه الإرشادات، يرجى الإبلاغ عنه باستخدام زر
                "الإبلاغ". سنراجع جميع التقارير بسرعة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. العواقب
              </h2>
              <p>انتهاك هذه الإرشادات قد يؤدي إلى:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>تحذير</li>
                <li>إزالة المحتوى</li>
                <li>تعليق الحساب مؤقتًا</li>
                <li>حظر الحساب نهائيًا</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. تحديثات الإرشادات
              </h2>
              <p>
                قد نقوم بتحديث هذه الإرشادات من وقت لآخر. سنقوم بإخطارك بأي
                تغييرات جوهرية.
              </p>
            </section>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                آخر تحديث: {new Date().toLocaleDateString('ar-MA')}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                شكرًا لمساعدتك في جعل 3arida مجتمعًا أفضل للجميع!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
