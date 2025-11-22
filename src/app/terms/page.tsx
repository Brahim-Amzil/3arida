import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              شروط الخدمة
            </h1>
            <p className="text-sm text-gray-600 mb-8">آخر تحديث: نوفمبر 2024</p>

            <div className="space-y-8 text-gray-700">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. مقدمة
                </h2>
                <p className="mb-4">
                  مرحبًا بك في منصة 3arida ("المنصة" أو "الخدمة"). من خلال
                  الوصول إلى هذه المنصة أو استخدامها، فإنك توافق على الالتزام
                  بشروط الخدمة هذه. يرجى قراءتها بعناية قبل استخدام خدماتنا.
                </p>
                <p>
                  إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يجوز لك استخدام
                  المنصة.
                </p>
              </section>

              {/* Definitions */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. التعريفات
                </h2>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>
                    <strong>"المنصة"</strong> تشير إلى موقع 3arida وجميع خدماته
                    المرتبطة
                  </li>
                  <li>
                    <strong>"المستخدم"</strong> يشير إلى أي شخص يستخدم المنصة
                  </li>
                  <li>
                    <strong>"العريضة"</strong> تشير إلى أي حملة أو طلب يتم
                    إنشاؤه على المنصة
                  </li>
                  <li>
                    <strong>"المحتوى"</strong> يشير إلى النصوص والصور والبيانات
                    التي يتم نشرها على المنصة
                  </li>
                  <li>
                    <strong>"منشئ العريضة"</strong> المستخدم الذي يقوم بإنشاء
                    عريضة على المنصة
                  </li>
                </ul>
              </section>

              {/* Eligibility */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. الأهلية للاستخدام
                </h2>
                <p className="mb-4">لاستخدام المنصة، يجب أن تكون:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>بالغًا (18 عامًا أو أكثر) أو تحت إشراف ولي أمر</li>
                  <li>قادرًا قانونيًا على الدخول في عقود ملزمة</li>
                  <li>
                    غير محظور من استخدام الخدمة بموجب القوانين المعمول بها
                  </li>
                </ul>
              </section>

              {/* User Accounts */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. حسابات المستخدمين
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      4.1 إنشاء الحساب
                    </h3>
                    <p>
                      لإنشاء عريضة أو التوقيع عليها، يجب عليك إنشاء حساب. أنت
                      مسؤول عن:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mr-4 mt-2">
                      <li>تقديم معلومات دقيقة وكاملة</li>
                      <li>الحفاظ على أمان كلمة المرور الخاصة بك</li>
                      <li>جميع الأنشطة التي تحدث تحت حسابك</li>
                      <li>إخطارنا فورًا بأي استخدام غير مصرح به</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      4.2 إنهاء الحساب
                    </h3>
                    <p>نحتفظ بالحق في تعليق أو إنهاء حسابك إذا:</p>
                    <ul className="list-disc list-inside space-y-1 mr-4 mt-2">
                      <li>انتهكت هذه الشروط</li>
                      <li>قدمت معلومات كاذبة أو مضللة</li>
                      <li>انخرطت في سلوك احتيالي أو غير قانوني</li>
                      <li>أسأت استخدام المنصة أو أضررت بمستخدمين آخرين</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Petitions */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. العرائض والمحتوى
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      5.1 إنشاء العرائض
                    </h3>
                    <p className="mb-2">عند إنشاء عريضة، أنت توافق على:</p>
                    <ul className="list-disc list-inside space-y-1 mr-4">
                      <li>تقديم معلومات دقيقة وصادقة</li>
                      <li>عدم انتحال شخصية الآخرين أو تمثيلهم بشكل خاطئ</li>
                      <li>عدم نشر محتوى غير قانوني أو مسيء أو مضلل</li>
                      <li>احترام حقوق الملكية الفكرية للآخرين</li>
                      <li>الامتثال لجميع القوانين واللوائح المعمول بها</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      5.2 المحتوى المحظور
                    </h3>
                    <p className="mb-2">يُحظر نشر محتوى يتضمن:</p>
                    <ul className="list-disc list-inside space-y-1 mr-4">
                      <li>خطاب الكراهية أو التمييز أو العنف</li>
                      <li>معلومات كاذبة أو مضللة</li>
                      <li>محتوى جنسي صريح أو غير لائق</li>
                      <li>انتهاك للخصوصية أو حقوق الآخرين</li>
                      <li>محتوى غير قانوني أو يروج لأنشطة غير قانونية</li>
                      <li>رسائل غير مرغوب فيها أو محتوى ترويجي غير مصرح به</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      5.3 الإشراف على المحتوى
                    </h3>
                    <p>
                      نحتفظ بالحق في مراجعة وإزالة أو تعديل أي محتوى ينتهك هذه
                      الشروط أو يعتبر غير مناسب، دون إشعار مسبق.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      5.4 حقوق الملكية الفكرية
                    </h3>
                    <p className="mb-2">
                      بنشر محتوى على المنصة، فإنك تمنحنا ترخيصًا غير حصري وعالمي
                      ومجاني لاستخدام وعرض وتوزيع المحتوى الخاص بك على المنصة.
                      أنت تحتفظ بجميع حقوق الملكية في المحتوى الخاص بك.
                    </p>
                  </div>
                </div>
              </section>

              {/* Signatures */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. التوقيعات
                </h2>
                <div className="space-y-4">
                  <p>عند التوقيع على عريضة، فإنك توافق على أن:</p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>توقيعك يمثل دعمك الحقيقي للعريضة</li>
                    <li>قد يتم مشاركة اسمك وتوقيعك علنًا مع العريضة</li>
                    <li>
                      قد يتم استخدام معلومات الاتصال الخاصة بك من قبل منشئ
                      العريضة للتحديثات (وفقًا لسياسة الخصوصية)
                    </li>
                    <li>
                      لا يمكن سحب التوقيعات بمجرد إرسالها (إلا في حالات
                      استثنائية)
                    </li>
                  </ul>
                </div>
              </section>

              {/* Privacy */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. الخصوصية وحماية البيانات
                </h2>
                <p className="mb-4">
                  استخدامك للمنصة يخضع أيضًا لـ{' '}
                  <a
                    href="/privacy"
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    سياسة الخصوصية
                  </a>{' '}
                  الخاصة بنا، والتي تشرح كيفية جمع واستخدام وحماية معلوماتك
                  الشخصية.
                </p>
                <p>
                  نحن ملتزمون بحماية خصوصيتك وأمان بياناتك وفقًا للقوانين
                  المعمول بها.
                </p>
              </section>

              {/* Prohibited Uses */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. الاستخدامات المحظورة
                </h2>
                <p className="mb-4">يُحظر عليك استخدام المنصة لـ:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>انتهاك أي قوانين محلية أو وطنية أو دولية</li>
                  <li>انتحال شخصية أي شخص أو كيان</li>
                  <li>نشر معلومات كاذبة أو مضللة</li>
                  <li>التحرش أو الإساءة أو التهديد للآخرين</li>
                  <li>جمع معلومات المستخدمين دون موافقتهم</li>
                  <li>التدخل في أمن المنصة أو تعطيلها</li>
                  <li>استخدام برامج آلية أو روبوتات دون إذن</li>
                  <li>إنشاء حسابات متعددة للتلاعب بالتوقيعات</li>
                  <li>بيع أو نقل حسابك لآخرين</li>
                </ul>
              </section>

              {/* Disclaimers */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. إخلاء المسؤولية
                </h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded">
                    <p className="font-semibold mb-2">⚠️ تنويه مهم</p>
                    <p>
                      المنصة توفر وسيلة لإنشاء والتوقيع على العرائض. نحن لا
                      نضمن:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mr-4 mt-2">
                      <li>نجاح أي عريضة في تحقيق أهدافها</li>
                      <li>دقة أو صحة المحتوى المنشور من قبل المستخدمين</li>
                      <li>أن الخدمة ستكون متاحة دائمًا دون انقطاع</li>
                      <li>خلو المنصة من الأخطاء أو الفيروسات</li>
                    </ul>
                  </div>

                  <p>
                    <strong>الخدمة مقدمة "كما هي" و"حسب التوفر"</strong> دون أي
                    ضمانات من أي نوع، صريحة أو ضمنية.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. تحديد المسؤولية
                </h2>
                <p className="mb-4">
                  إلى أقصى حد يسمح به القانون، لن نكون مسؤولين عن:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية</li>
                  <li>فقدان الأرباح أو البيانات أو الفرص</li>
                  <li>محتوى أو سلوك المستخدمين الآخرين</li>
                  <li>أي انقطاع أو خطأ في الخدمة</li>
                  <li>الوصول غير المصرح به إلى بياناتك</li>
                </ul>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. التعويض
                </h2>
                <p>
                  أنت توافق على تعويضنا والدفاع عنا وحمايتنا من أي مطالبات أو
                  أضرار أو خسائر أو نفقات (بما في ذلك أتعاب المحاماة) الناشئة
                  عن:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4 mt-4">
                  <li>استخدامك للمنصة</li>
                  <li>انتهاكك لهذه الشروط</li>
                  <li>انتهاكك لحقوق أي طرف ثالث</li>
                  <li>المحتوى الذي تنشره على المنصة</li>
                </ul>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  12. التغييرات على الشروط
                </h2>
                <p className="mb-4">
                  نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإخطارك بأي
                  تغييرات جوهرية عن طريق:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>نشر الشروط المحدثة على المنصة</li>
                  <li>إرسال إشعار عبر البريد الإلكتروني</li>
                  <li>عرض إشعار على المنصة</li>
                </ul>
                <p className="mt-4">
                  استمرارك في استخدام المنصة بعد التغييرات يعني قبولك للشروط
                  المحدثة.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  13. إنهاء الخدمة
                </h2>
                <div className="space-y-4">
                  <p>
                    يمكنك إنهاء حسابك في أي وقت عن طريق الاتصال بنا. نحتفظ بالحق
                    في:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>تعليق أو إنهاء حسابك لانتهاك الشروط</li>
                    <li>إزالة أي محتوى ينتهك سياساتنا</li>
                    <li>إنهاء الخدمة أو تعديلها في أي وقت</li>
                  </ul>
                  <p className="mt-4">
                    عند إنهاء الحساب، قد نحتفظ ببعض المعلومات وفقًا لسياسة
                    الخصوصية والقوانين المعمول بها.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  14. القانون الحاكم
                </h2>
                <p>
                  تخضع هذه الشروط وتفسر وفقًا لقوانين المملكة المغربية. أي نزاع
                  ناشئ عن هذه الشروط سيخضع للاختصاص الحصري للمحاكم المغربية.
                </p>
              </section>

              {/* Dispute Resolution */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  15. حل النزاعات
                </h2>
                <p className="mb-4">
                  في حالة وجود أي نزاع، نشجعك على الاتصال بنا أولاً لمحاولة حل
                  المشكلة وديًا. يمكنك التواصل معنا عبر:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>
                    صفحة{' '}
                    <a
                      href="/contact"
                      className="text-green-600 hover:text-green-700 underline"
                    >
                      اتصل بنا
                    </a>
                  </li>
                  <li>البريد الإلكتروني: support@3arida.ma</li>
                </ul>
              </section>

              {/* Severability */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  16. قابلية الفصل
                </h2>
                <p>
                  إذا تبين أن أي حكم من هذه الشروط غير قابل للتنفيذ أو غير صالح،
                  فسيتم تعديل هذا الحكم وتفسيره لتحقيق أهداف الحكم الأصلي إلى
                  أقصى حد ممكن، وستظل الأحكام المتبقية سارية المفعول.
                </p>
              </section>

              {/* Entire Agreement */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  17. الاتفاقية الكاملة
                </h2>
                <p>
                  تشكل هذه الشروط، جنبًا إلى جنب مع سياسة الخصوصية وأي سياسات
                  أخرى منشورة على المنصة، الاتفاقية الكاملة بينك وبيننا فيما
                  يتعلق باستخدام المنصة.
                </p>
              </section>

              {/* Contact */}
              <section className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  18. اتصل بنا
                </h2>
                <p className="mb-4">
                  إذا كان لديك أي أسئلة حول شروط الخدمة هذه، يرجى الاتصال بنا:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>البريد الإلكتروني:</strong> legal@3arida.ma
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
              </section>

              {/* Acknowledgment */}
              <section className="bg-gray-100 p-6 rounded-lg">
                <p className="text-center font-semibold">
                  باستخدام منصة 3arida، فإنك تقر بأنك قرأت وفهمت ووافقت على
                  الالتزام بشروط الخدمة هذه.
                </p>
                <p className="text-center text-sm text-gray-600 mt-4">
                  آخر تحديث: نوفمبر 2024
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
