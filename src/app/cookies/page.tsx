import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة ملفات تعريف الارتباط - 3arida',
  description: 'سياسة ملفات تعريف الارتباط (Cookies) لمنصة 3arida',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            سياسة ملفات تعريف الارتباط (Cookies)
          </h1>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ما هي ملفات تعريف الارتباط؟
              </h2>
              <p>
                ملفات تعريف الارتباط (Cookies) هي ملفات نصية صغيرة يتم تخزينها
                على جهازك عند زيارة موقعنا. تساعدنا هذه الملفات في تحسين تجربتك
                وتوفير ميزات معينة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                أنواع ملفات تعريف الارتباط التي نستخدمها
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                1. ملفات تعريف الارتباط الضرورية
              </h3>
              <p>
                هذه الملفات ضرورية لتشغيل الموقع بشكل صحيح. لا يمكن تعطيلها.
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  <strong>ملفات المصادقة:</strong> للحفاظ على تسجيل دخولك
                </li>
                <li>
                  <strong>ملفات الأمان:</strong> لحماية حسابك من الاحتيال
                </li>
                <li>
                  <strong>ملفات الجلسة:</strong> لتذكر تفضيلاتك أثناء التصفح
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                2. ملفات تعريف الارتباط الوظيفية
              </h3>
              <p>تساعد في تحسين وظائف الموقع وتخصيص تجربتك.</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>تذكر تفضيلات اللغة</li>
                <li>حفظ إعدادات العرض</li>
                <li>تذكر العرائض التي شاهدتها</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                3. ملفات تعريف الارتباط التحليلية
              </h3>
              <p>تساعدنا في فهم كيفية استخدام الزوار للموقع لتحسين الأداء.</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>Google Analytics: لتحليل حركة المرور</li>
                <li>Firebase Analytics: لتتبع الأداء</li>
                <li>معلومات مجهولة المصدر فقط</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                4. ملفات تعريف الارتباط الإعلانية
              </h3>
              <p>حاليًا، لا نستخدم ملفات تعريف ارتباط إعلانية.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ملفات تعريف الارتباط من طرف ثالث
              </h2>
              <p>نستخدم خدمات من أطراف ثالثة قد تضع ملفات تعريف ارتباط:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  <strong>Google:</strong> للمصادقة والتحليلات
                </li>
                <li>
                  <strong>Firebase:</strong> للمصادقة والتخزين
                </li>
                <li>
                  <strong>Vercel:</strong> لاستضافة الموقع
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                كيفية التحكم في ملفات تعريف الارتباط
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                إعدادات المتصفح
              </h3>
              <p>
                يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  <strong>Chrome:</strong> الإعدادات &gt; الخصوصية والأمان &gt;
                  ملفات تعريف الارتباط
                </li>
                <li>
                  <strong>Firefox:</strong> الخيارات &gt; الخصوصية والأمان &gt;
                  ملفات تعريف الارتباط
                </li>
                <li>
                  <strong>Safari:</strong> التفضيلات &gt; الخصوصية &gt; ملفات
                  تعريف الارتباط
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                حذف ملفات تعريف الارتباط
              </h3>
              <p>
                يمكنك حذف جميع ملفات تعريف الارتباط المخزنة على جهازك في أي وقت
                من خلال إعدادات المتصفح.
              </p>

              <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>ملاحظة:</strong> تعطيل ملفات تعريف الارتباط الضرورية
                  قد يؤثر على وظائف الموقع الأساسية.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                مدة الاحتفاظ
              </h2>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  <strong>ملفات الجلسة:</strong> تُحذف عند إغلاق المتصفح
                </li>
                <li>
                  <strong>ملفات دائمة:</strong> تبقى لمدة تصل إلى سنة واحدة
                </li>
                <li>
                  <strong>ملفات التحليلات:</strong> تبقى لمدة 26 شهرًا (Google
                  Analytics)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                التحديثات
              </h2>
              <p>
                قد نقوم بتحديث سياسة ملفات تعريف الارتباط من وقت لآخر. سنقوم
                بإخطارك بأي تغييرات جوهرية.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                الاتصال بنا
              </h2>
              <p>
                إذا كان لديك أي أسئلة حول سياسة ملفات تعريف الارتباط، يرجى
                الاتصال بنا على:
              </p>
              <ul className="list-none space-y-2">
                <li>البريد الإلكتروني: privacy@3arida.ma</li>
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
