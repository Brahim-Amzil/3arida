import { Metadata } from 'next';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية - 3arida',
  description: 'سياسة الخصوصية لمنصة 3arida للعرائض الرقمية',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
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
                    مع منشئي العرائض: عند توقيعك على عريضة، يتم مشاركة اسمك
                    وتاريخ التوقيع
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
                  نستخدم ملفات تعريف الارتباط والتقنيات المشابهة لتحسين تجربتك
                  على المنصة. يمكنك التحكم في ملفات تعريف الارتباط من خلال
                  إعدادات المتصفح الخاص بك. لمزيد من المعلومات، راجع{' '}
                  <a
                    href="/cookies"
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    سياسة ملفات تعريف الارتباط
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. الاحتفاظ بالبيانات
                </h2>
                <p>
                  نحتفظ بمعلوماتك الشخصية طالما كان حسابك نشطًا أو حسب الحاجة
                  لتقديم الخدمات. قد نحتفظ ببعض المعلومات للامتثال للالتزامات
                  القانونية أو حل النزاعات أو إنفاذ اتفاقياتنا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. خصوصية الأطفال
                </h2>
                <p>
                  منصتنا غير موجهة للأطفال دون سن 16 عامًا. نحن لا نجمع عن قصد
                  معلومات شخصية من الأطفال. إذا علمنا أننا جمعنا معلومات من طفل،
                  سنقوم بحذفها فورًا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. نقل البيانات الدولي
                </h2>
                <p>
                  قد يتم نقل معلوماتك ومعالجتها في دول خارج المغرب. نتخذ خطوات
                  لضمان معالجة بياناتك بشكل آمن ووفقًا لسياسة الخصوصية هذه
                  والقوانين المعمول بها.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. الامتثال لـ GDPR
                </h2>
                <p>
                  إذا كنت في الاتحاد الأوروبي، لديك حقوق إضافية بموجب اللائحة
                  العامة لحماية البيانات (GDPR):
                </p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>الحق في الوصول إلى بياناتك الشخصية</li>
                  <li>الحق في تصحيح البيانات غير الدقيقة</li>
                  <li>الحق في محو بياناتك ("الحق في النسيان")</li>
                  <li>الحق في تقييد المعالجة</li>
                  <li>الحق في نقل البيانات</li>
                  <li>الحق في الاعتراض على المعالجة</li>
                  <li>الحق في تقديم شكوى إلى سلطة إشرافية</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. التغييرات على سياسة الخصوصية
                </h2>
                <p>
                  قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك
                  بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على
                  المنصة. استمرارك في استخدام المنصة بعد التغييرات يعني قبولك
                  للسياسة المحدثة.
                </p>
              </section>

              <section className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  12. الاتصال بنا
                </h2>
                <p className="mb-4">
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ترغب في ممارسة
                  حقوقك، يرجى الاتصال بنا:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>البريد الإلكتروني:</strong> privacy@3arida.ma
                  </li>
                  <li>
                    <strong>صفحة الاتصال:</strong>{' '}
                    <a
                      href="/contact"
                      className="text-green-600 hover:text-green-700 underline"
                    >
                      3arida.ma/contact
                    </a>
                  </li>
                  <li>
                    <strong>العنوان:</strong> المغرب
                  </li>
                </ul>
                <p className="mt-4 text-sm">
                  سنرد على طلبك في غضون 30 يومًا من استلامه.
                </p>
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
      <Footer />
    </>
  );
}
