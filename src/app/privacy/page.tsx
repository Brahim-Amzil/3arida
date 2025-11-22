import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية - 3arida',
  description: 'سياسة الخصوصية لمنصة 3arida للعرائض الرقمية',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            سياسة الخصوصية
          </h1>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. المعلومات التي نجمعها
              </h2>
              <p>نقوم بجمع المعلومات التالية عند استخدامك لمنصة 3arida:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف</li>
                <li>معلومات العرائض: العرائض التي تنشئها أو توقع عليها</li>
                <li>معلومات الاستخدام: كيفية تفاعلك مع المنصة</li>
                <li>معلومات الجهاز: نوع المتصفح، نظام التشغيل، عنوان IP</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. كيفية استخدام المعلومات
              </h2>
              <p>نستخدم المعلومات التي نجمعها من أجل:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>توفير وتحسين خدماتنا</li>
                <li>التواصل معك بشأن حسابك والعرائض</li>
                <li>منع الاحتيال وضمان أمان المنصة</li>
                <li>الامتثال للمتطلبات القانونية</li>
                <li>تحليل استخدام المنصة وتحسين الأداء</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. مشاركة المعلومات
              </h2>
              <p>
                نحن لا نبيع معلوماتك الشخصية. قد نشارك معلوماتك في الحالات
                التالية:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  مع منشئي العرائض: عند توقيعك على عريضة، يتم مشاركة اسمك وتاريخ
                  التوقيع
                </li>
                <li>مع مزودي الخدمات: الذين يساعدوننا في تشغيل المنصة</li>
                <li>للامتثال القانوني: عند الطلب من السلطات المختصة</li>
                <li>لحماية الحقوق: لحماية حقوقنا وحقوق المستخدمين الآخرين</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. أمان المعلومات
              </h2>
              <p>
                نتخذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير
                المصرح به أو التغيير أو الإفصاح أو الإتلاف. نستخدم:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>تشفير SSL/TLS لجميع عمليات نقل البيانات</li>
                <li>مصادقة آمنة عبر Firebase Authentication</li>
                <li>تخزين آمن للبيانات في Firebase Cloud</li>
                <li>مراقبة منتظمة للأنشطة المشبوهة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. حقوقك
              </h2>
              <p>لديك الحق في:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>الوصول إلى معلوماتك الشخصية</li>
                <li>تصحيح المعلومات غير الدقيقة</li>
                <li>حذف حسابك ومعلوماتك</li>
                <li>الاعتراض على معالجة معلوماتك</li>
                <li>تصدير بياناتك</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. ملفات تعريف الارتباط (Cookies)
              </h2>
              <p>
                نستخدم ملفات تعريف الارتباط والتقنيات المشابهة لتحسين تجربتك على
                المنصة. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات
                المتصفح الخاص بك.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. خصوصية الأطفال
              </h2>
              <p>
                منصتنا غير موجهة للأطفال دون سن 16 عامًا. نحن لا نجمع عن قصد
                معلومات شخصية من الأطفال. إذا علمنا أننا جمعنا معلومات من طفل،
                سنقوم بحذفها فورًا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. التغييرات على سياسة الخصوصية
              </h2>
              <p>
                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بأي
                تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على
                المنصة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. الاتصال بنا
              </h2>
              <p>
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا
                على:
              </p>
              <ul className="list-none space-y-2">
                <li>البريد الإلكتروني: privacy@3arida.ma</li>
                <li>الهاتف: +212 XXX XXX XXX</li>
              </ul>
            </section>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                آخر تحديث: {new Date().toLocaleDateString('ar-MA')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
