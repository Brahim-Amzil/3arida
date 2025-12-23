'use client';

import { useState, useEffect } from 'react';

type Locale = 'ar' | 'fr';

interface TranslationMessages {
  [key: string]: any;
}

const translations: Record<Locale, TranslationMessages> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.petitions': 'العرائض',
    'nav.dashboard': 'لوحة التحكم',
    'nav.profile': 'الملف الشخصي',
    'nav.admin': 'الإدارة',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.logout': 'تسجيل الخروج',
    'nav.pricing': 'الأسعار',
    'nav.about': 'حول المنصة',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.share': 'مشاركة',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.tryAgain': 'حاول مرة أخرى',
    'common.viewAll': 'عرض الكل',
    'common.getStarted': 'ابدأ الآن',
    'common.signIn': 'تسجيل الدخول',

    // Petitions Page
    'petitions.discoverPetitions': 'اكتشف العرائض',
    'petitions.findAndSupport': 'اعثر على القضايا التي تهمك وادعمها',
    'petitions.startAPetition': 'ابدأ عريضة',
    'petitions.searchPetitions': 'ابحث في العرائض...',
    'petitions.allCategories': 'جميع الفئات',
    'petitions.mostRecent': 'الأحدث',
    'petitions.mostPopular': 'الأكثر شعبية',
    'petitions.mostSignatures': 'الأكثر توقيعات',
    'petitions.petitionsFound': '{count} عريضة موجودة',
    'petitions.loading': 'جاري التحميل...',
    'petitions.tryAgain': 'حاول مرة أخرى',

    // Petitions
    'petitions.title': 'العرائض',
    'petitions.create': 'إنشاء عريضة',
    'petitions.sign': 'وقع العريضة',
    'petitions.signed': 'تم التوقيع',
    'petitions.signatures': 'التوقيعات',
    'petitions.goal': 'الهدف',
    'petitions.createdBy': 'أنشأها',
    'petitions.browse': 'تصفح العرائض',
    'petitions.qrCode': 'رمز الاستجابة السريعة',
    'petitions.startPetition': 'ابدأ عريضة',
    'petitions.discoverPetitions': 'اكتشف العرائض',
    'petitions.viewAllPetitions': 'عرض جميع العرائض',
    'petitions.alreadySigned': 'تم التوقيع بالفعل',
    'petitions.signatureCount': '{count} توقيع',
    'petitions.progress': 'التقدم',
    'petitions.moreNeeded': 'نحتاج {count} توقيع إضافي',
    'petitions.goalReached': 'تم الوصول للهدف! 🎉',
    'petitions.verifiedSignatures': '100% توقيعات موثقة',

    // Home page
    'home.hero.title': 'وصَّل صوتك',
    'home.hero.subtitle':
      'صوتك قوة للتغيير حوّل مطالبك إلى عرائض مؤثرة، \n وشارك في صناعة القرار مع آلاف المواطنين.',
    'home.stats.signatures': 'توقيع تم جمعه',
    'home.stats.petitions': 'عريضة نشطة',
    'home.stats.changes': 'تغيير تم إحداثه',
    'home.featured.title': 'العرائض المميزة',
    'home.featured.subtitle': 'العرائض الأكثر تأثيراً التي تحدث التغيير الآن',
    'home.categories.title': 'استكشف حسب الفئة',
    'home.categories.subtitle': 'اعثر على العرائض التي تهمك',
    'home.recent.title': 'العرائض الحديثة',
    'home.recent.subtitle': 'أحدث العرائض من المجتمع',
    'home.cta.title': 'مستعد لإحداث فرق؟',
    'home.cta.subtitle':
      'كل تغيير عظيم يبدأ بصوت واحد. ابدأ عريضتك اليوم واحشد الدعم للقضايا التي تهمك.',
    'home.cta.button': 'ابدأ عريضتك الآن',

    // Auth
    'auth.login.title': 'تسجيل الدخول',
    'auth.register.title': 'إنشاء حساب جديد',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل',

    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحبًا، {name}',
    'dashboard.yourPetitions': 'عرائضك',
    'dashboard.mySignatures': 'توقيعاتي',
    'dashboard.appeals': 'الطعون',
    'dashboard.myCampaigns': 'حملاتي',

    // Help Page
    'help.title': 'مركز المساعدة',
    'help.subtitle':
      'اعثر على إجابات للأسئلة الشائعة وتعلم كيفية استخدام عريضة',
    'help.searchPlaceholder': 'ابحث عن مواضيع المساعدة...',
    'help.showingResults': 'عرض النتائج لـ "{query}"',
    'help.clearSearch': 'مسح البحث',

    // Getting Started Section
    'help.gettingStarted.title': 'البدء',
    'help.gettingStarted.createPetition.title': 'كيف أنشئ عريضة؟',
    'help.gettingStarted.createPetition.intro':
      'إنشاء عريضة على عريضة أمر بسيط:',
    'help.gettingStarted.createPetition.step1': 'سجل أو ادخل إلى حسابك',
    'help.gettingStarted.createPetition.step2': 'انقر على زر "ابدأ عريضة"',
    'help.gettingStarted.createPetition.step3':
      'املأ تفاصيل عريضتك (العنوان، الوصف، الفئة)',
    'help.gettingStarted.createPetition.step4':
      'أضف صور أو مقاطع فيديو لدعم قضيتك',
    'help.gettingStarted.createPetition.step5': 'حدد هدف التوقيعات',
    'help.gettingStarted.createPetition.step6': 'أرسل للمراجعة',
    'help.gettingStarted.signPetition.title': 'كيف أوقع عريضة؟',
    'help.gettingStarted.signPetition.intro': 'لتوقيع عريضة:',
    'help.gettingStarted.signPetition.step1':
      'تصفح العرائض أو ابحث عن قضية محددة',
    'help.gettingStarted.signPetition.step2': 'انقر على العريضة لعرض التفاصيل',
    'help.gettingStarted.signPetition.step3': 'انقر على زر "وقع هذه العريضة"',
    'help.gettingStarted.signPetition.step4': 'تحقق من رقم هاتفك (للأمان)',
    'help.gettingStarted.signPetition.step5':
      'اختياريًا أضف تعليقًا يوضح سبب توقيعك',

    // Account & Profile Section
    'help.account.title': 'الحساب والملف الشخصي',
    'help.account.createAccount.title': 'كيف أنشئ حسابًا؟',
    'help.account.createAccount.description':
      'يمكنك التسجيل باستخدام عنوان بريدك الإلكتروني أو حساب جوجل. انقر على "إنشاء حساب" في الزاوية العلوية اليمنى واتبع عملية التسجيل.',
    'help.account.editProfile.title': 'هل يمكنني تعديل ملفي الشخصي؟',
    'help.account.editProfile.description':
      'نعم! اذهب إلى صفحة ملفك الشخصي وانقر على "تعديل السيرة" لتحديث معلوماتك، بما في ذلك اسمك وسيرتك وصورة الملف الشخصي.',
    'help.account.resetPassword.title': 'كيف أعيد تعيين كلمة المرور؟',
    'help.account.resetPassword.description':
      'انقر على "نسيت كلمة المرور" في صفحة تسجيل الدخول، أدخل عنوان بريدك الإلكتروني، وسنرسل لك تعليمات لإعادة تعيين كلمة المرور.',

    // Managing Petitions Section
    'help.managing.title': 'إدارة عرائضك',
    'help.managing.approval.title': 'كم يستغرق الموافقة على العريضة؟',
    'help.managing.approval.description':
      'فريق الإشراف لدينا يراجع العرائض خلال 24-48 ساعة. ستتلقى إشعارًا بمجرد الموافقة على عريضتك أو إذا كانت هناك حاجة لتغييرات.',
    'help.managing.edit.title': 'هل يمكنني تعديل عريضتي بعد الإرسال؟',
    'help.managing.edit.description':
      'إذا تم رفض عريضتك، يمكنك تعديلها وإعادة إرسالها (حتى 3 مرات). بمجرد الموافقة، التغييرات الكبيرة تتطلب الاتصال بالدعم للحفاظ على سلامة العريضة.',
    'help.managing.delete.title': 'كيف أحذف عريضتي؟',
    'help.managing.delete.intro': 'يمكنك حذف عريضتك في ظروف معينة:',
    'help.managing.delete.condition1': 'إذا كان لديها 10 توقيعات أو أقل',
    'help.managing.delete.condition2': 'إذا كانت لا تزال في انتظار الموافقة',
    'help.managing.delete.condition3': 'إذا تم إنشاؤها منذ أقل من 24 ساعة',
    'help.managing.delete.note':
      'للعرائض التي تحتوي على توقيعات أكثر، يمكنك طلب الحذف من فريق الإشراف لدينا.',
    'help.managing.updates.title': 'ما هي تحديثات العريضة؟',
    'help.managing.updates.description':
      'كمنشئ عريضة، يمكنك نشر تحديثات لإبقاء المؤيدين على اطلاع بالتقدم أو الانتصارات أو الخطوات التالية. تظهر التحديثات على صفحة عريضتك.',

    // Sharing & Promotion Section
    'help.sharing.title': 'المشاركة والترويج',
    'help.sharing.howToShare.title': 'كيف أشارك عريضتي؟',
    'help.sharing.howToShare.intro': 'يمكنك مشاركة عريضتك بطرق متعددة:',
    'help.sharing.howToShare.social':
      'وسائل التواصل الاجتماعي (فيسبوك، تويتر، واتساب)',
    'help.sharing.howToShare.link': 'نسخ الرابط المباشر',
    'help.sharing.howToShare.email': 'مشاركة البريد الإلكتروني',
    'help.sharing.howToShare.qr': 'رمز الاستجابة السريعة (تحميل وطباعة)',
    'help.sharing.qrCode.title': 'ما هو رمز الاستجابة السريعة وكيف أستخدمه؟',
    'help.sharing.qrCode.description':
      'رمز الاستجابة السريعة هو رمز قابل للمسح يربط مباشرة بعريضتك. يمكنك تحميله من صفحة عريضتك وطباعته على المنشورات أو الملصقات أو مشاركته رقميًا. يمكن للناس مسحه بكاميرا هاتفهم للوصول الفوري إلى عريضتك.',

    // Privacy & Security Section
    'help.privacy.title': 'الخصوصية والأمان',
    'help.privacy.safe.title': 'هل معلوماتي الشخصية آمنة؟',
    'help.privacy.safe.description':
      'نعم. نستخدم تدابير أمنية معيارية في الصناعة لحماية بياناتك. بريدك الإلكتروني ورقم هاتفك لا يتم مشاركتهما علنًا أبدًا. فقط اسمك والتعليق الاختياري يظهران عند توقيع عريضة.',
    'help.privacy.phoneVerification.title': 'لماذا أحتاج للتحقق من رقم هاتفي؟',
    'help.privacy.phoneVerification.description':
      'التحقق من الهاتف يضمن أن كل توقيع من شخص حقيقي ويمنع التوقيعات المكررة أو الاحتيالية. هذا يحافظ على سلامة جميع العرائض على منصتنا.',
    'help.privacy.anonymous.title': 'هل يمكنني التوقيع بشكل مجهول؟',
    'help.privacy.anonymous.description':
      'بينما نتطلب التحقق من الهاتف للأمان، يمكنك اختيار عدم عرض اسمك الكامل علنًا. ومع ذلك، يمكن لمنشئي العرائض رؤية جميع التوقيعات للتحقق من الدعم.',

    // Pricing & Payments Section
    'help.pricing.title': 'التسعير والمدفوعات',
    'help.pricing.free.title': 'هل عريضة مجانية الاستخدام؟',
    'help.pricing.free.intro':
      'نعم! إنشاء وتوقيع العرائض مجاني. نقدم مستويات مختلفة بناءً على هدف التوقيعات:',
    'help.pricing.free.tier1': 'مجاني: حتى 2,500 توقيع',
    'help.pricing.free.tier2': 'أساسي: حتى 5,000 توقيع',
    'help.pricing.free.tier3': 'متقدم: حتى 10,000 توقيع',
    'help.pricing.free.tier4': 'مؤسسي: حتى 100,000 توقيع',
    'help.pricing.payment.title': 'ما طرق الدفع التي تقبلونها؟',
    'help.pricing.payment.description':
      'نقبل جميع بطاقات الائتمان والخصم الرئيسية من خلال معالج الدفع الآمن Stripe. جميع المعاملات مشفرة وآمنة.',

    // Technical Issues Section
    'help.technical.title': 'المشاكل التقنية',
    'help.technical.upload.title': 'أواجه مشكلة في رفع الصور',
    'help.technical.upload.intro': 'تأكد من أن صورك تلبي هذه المتطلبات:',
    'help.technical.upload.format': 'التنسيق: JPG، PNG، أو WebP',
    'help.technical.upload.size': 'الحجم: حد أقصى 5 ميجابايت لكل صورة',
    'help.technical.upload.dimensions':
      'الأبعاد: 800x600 بكسل على الأقل موصى به',
    'help.technical.loading.title': 'الموقع لا يتم تحميله بشكل صحيح',
    'help.technical.loading.intro': 'جرب هذه خطوات استكشاف الأخطاء:',
    'help.technical.loading.cache':
      'امسح ذاكرة التخزين المؤقت وملفات تعريف الارتباط في متصفحك',
    'help.technical.loading.browser': 'جرب متصفحًا مختلفًا',
    'help.technical.loading.connection': 'تحقق من اتصالك بالإنترنت',
    'help.technical.loading.extensions': 'عطل إضافات المتصفح مؤقتًا',

    // Contact Support Section
    'help.contact.title': 'لا تزال تحتاج مساعدة؟',
    'help.contact.intro':
      'إذا لم تجد إجابة لسؤالك، فريق الدعم لدينا هنا للمساعدة.',
    'help.contact.supportTitle': 'اتصل بالدعم',
    'help.contact.email': 'راسلنا على:',
    'help.contact.responseTime': 'نحن عادة نرد خلال 24 ساعة خلال أيام العمل.',

    // No Results
    'help.noResults.title': 'لم يتم العثور على نتائج',
    'help.noResults.description': 'جرب البحث بكلمات مفتاحية مختلفة أو',
    'help.noResults.clearSearch': 'امسح بحثك',

    // About Page
    'about.title': 'حول عريضة',
    'about.subtitle':
      'تمكين الأصوات، قيادة التغيير. عريضة هي منصة المغرب للمشاركة المدنية والتأثير الاجتماعي.',
    'about.mission.title': 'مهمتنا',
    'about.mission.paragraph1':
      'عريضة مكرسة لإعطاء كل مغربي صوتاً في تشكيل مجتمعه وبلده. نحن نؤمن أن التغيير يبدأ بالناس الذين يجتمعون حول قضايا مشتركة ويجعلون أصواتهم مسموعة.',
    'about.mission.paragraph2':
      'منصتنا تجعل من السهل بدء ومشاركة وتوقيع العرائض التي تهمك. سواء كانت قضية محلية في حيك أو اهتمام وطني، عريضة توفر الأدوات لحشد الدعم وخلق تأثير حقيقي.',
    'about.howItWorks.title': 'كيف يعمل',
    'about.howItWorks.step1.title': 'أنشئ عريضة',
    'about.howItWorks.step1.description':
      'ابدأ عريضة حول قضية تهمك. أضف التفاصيل والصور وحدد هدف التوقيعات.',
    'about.howItWorks.step2.title': 'شارك واحشد',
    'about.howItWorks.step2.description':
      'شارك عريضتك على وسائل التواصل الاجتماعي، عبر رموز الاستجابة السريعة، أو مباشرة مع شبكتك لجمع الدعم.',
    'about.howItWorks.step3.title': 'أحدث تأثيراً',
    'about.howItWorks.step3.description':
      'مع نمو التوقيعات، يلاحظ صناع القرار. عريضتك يمكن أن تقود تغييراً حقيقياً في مجتمعك.',
    'about.features.title': 'ميزات المنصة',
    'about.features.secureAuth.title': 'مصادقة آمنة',
    'about.features.secureAuth.description':
      'التحقق من الهاتف يضمن أن كل توقيع أصيل ويمنع الاحتيال.',
    'about.features.discussion.title': 'نقاش المجتمع',
    'about.features.discussion.description':
      'علق ورد وتفاعل مع الآخرين الذين يدعمون نفس القضايا.',
    'about.features.sharing.title': 'مشاركة سهلة',
    'about.features.sharing.description':
      'شارك عبر وسائل التواصل الاجتماعي أو رموز الاستجابة السريعة أو الروابط المباشرة لتحقيق أقصى وصول.',
    'about.features.analytics.title': 'تحليلات فورية',
    'about.features.analytics.description':
      'تتبع تقدم عريضتك مع تحليلات ورؤى مفصلة.',
    'about.features.privacy.title': 'حماية الخصوصية',
    'about.features.privacy.description':
      'معلوماتك الشخصية محمية والتوقيعات تبقى خاصة.',
    'about.features.notifications.title': 'الإشعارات',
    'about.features.notifications.description':
      'ابق محدثاً حول العرائض التي تهمك مع الإشعارات الفورية.',
    'about.values.title': 'قيمنا',
    'about.values.voices.title': '🗣️ تضخيم الأصوات',
    'about.values.voices.description':
      'كل صوت مهم. نحن نوفر منصة حيث يمكن لأي شخص أن يتكلم ويُسمع.',
    'about.values.community.title': '🤝 بناء المجتمع',
    'about.values.community.description':
      'التغيير يحدث عندما يجتمع الناس. نحن نعزز الروابط بين الأفراد الذين يشتركون في أهداف مشتركة.',
    'about.values.transparency.title': '✨ الشفافية والثقة',
    'about.values.transparency.description':
      'نحن نعمل بشفافية كاملة ونضمن أن كل توقيع موثق وأصيل.',
    'about.values.impact.title': '🚀 قيادة التأثير',
    'about.values.impact.description':
      'نحن لسنا فقط حول جمع التوقيعات—نحن حول خلق تغيير حقيقي وقابل للقياس في المجتمعات.',
    'about.cta.title': 'مستعد لإحداث فرق؟',
    'about.cta.subtitle':
      'انضم إلى آلاف المغاربة الذين يستخدمون عريضة لخلق تغيير إيجابي.',
    'about.cta.startPetition': 'ابدأ عريضة',
    'about.cta.browsePetitions': 'تصفح العرائض',
    'about.contact.question': 'لديك أسئلة أو تحتاج دعم؟',
    'about.contact.email': 'اتصل بنا على',

    // Footer
    'footer.description': 'منصة العرائض الرقمية للمغرب.\nوصَّل صوتك.',
    'footer.platform': 'المنصة',
    'footer.support': 'الدعم',
    'footer.legal': 'قانوني',
    'footer.rights': 'جميع الحقوق محفوظة. صنع بـ ❤️ للمغرب.\nوصَّل صوتك.',
    'footer.helpCenter': 'مركز المساعدة',
    'footer.contactUs': 'اتصل بنا',
    'footer.communityGuidelines': 'إرشادات المجتمع',
    'footer.privacyPolicy': 'سياسة الخصوصية',
    'footer.termsOfService': 'شروط الخدمة',
    'footer.cookiePolicy': 'سياسة ملفات تعريف الارتباط',
    'footer.aboutUs': 'حول المنصة',
    'footer.copyright': '© 2025 عريضة  /3arida . جميع الحقوق محفوظة.',

    // Privacy Page
    'privacy.title': 'سياسة الخصوصية',
    'privacy.lastUpdated': 'آخر تحديث',
    'privacy.introduction.title': 'مقدمة',
    'privacy.introduction.content':
      'نحن في عريضة نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا.',
    'privacy.dataCollection.title': 'جمع البيانات',
    'privacy.dataCollection.content':
      'نجمع المعلومات التي تقدمها لنا مباشرة، مثل اسمك وعنوان بريدك الإلكتروني ورقم هاتفك عند إنشاء حساب أو توقيع عريضة. كما نجمع معلومات تقنية حول استخدامك للموقع.',
    'privacy.dataUsage.title': 'استخدام البيانات',
    'privacy.dataUsage.content':
      'نستخدم بياناتك لتوفير خدماتنا، والتحقق من هويتك، وإرسال الإشعارات المهمة، وتحسين تجربة المستخدم. لا نشارك معلوماتك الشخصية مع أطراف ثالثة دون موافقتك.',
    'privacy.contact.title': 'اتصل بنا',
    'privacy.contact.content':
      'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على support@3arida.ma',

    // Terms Page
    'terms.title': 'شروط الخدمة',
    'terms.lastUpdated': 'آخر تحديث',
    'terms.acceptance.title': 'قبول الشروط',
    'terms.acceptance.content':
      'باستخدام منصة عريضة، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا.',
    'terms.services.title': 'الخدمات',
    'terms.services.content':
      'توفر عريضة منصة لإنشاء وتوقيع العرائض الرقمية. نحتفظ بالحق في تعديل أو إيقاف أي جزء من خدماتنا في أي وقت.',
    'terms.userResponsibilities.title': 'مسؤوليات المستخدم',
    'terms.userResponsibilities.content':
      'أنت مسؤول عن المحتوى الذي تنشره والتأكد من أنه لا يخالف القوانين أو يضر بالآخرين. يجب استخدام المنصة بطريقة مسؤولة وأخلاقية.',
    'terms.contact.title': 'اتصل بنا',
    'terms.contact.content':
      'للأسئلة حول شروط الخدمة، اتصل بنا على support@3arida.ma',

    // Cookies Page
    'cookies.title': 'سياسة ملفات تعريف الارتباط',
    'cookies.lastUpdated': 'آخر تحديث',
    'cookies.whatAre.title': 'ما هي ملفات تعريف الارتباط؟',
    'cookies.whatAre.content':
      'ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم حفظها على جهازك عند زيارة موقعنا. تساعدنا في تحسين تجربتك وتذكر تفضيلاتك.',
    'cookies.howWeUse.title': 'كيف نستخدمها',
    'cookies.howWeUse.content':
      'نستخدم ملفات تعريف الارتباط لحفظ إعدادات اللغة، وتحليل استخدام الموقع، وضمان الأمان. لا نستخدمها لتتبعك عبر مواقع أخرى.',
    'cookies.control.title': 'التحكم في ملفات تعريف الارتباط',
    'cookies.control.content':
      'يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك. إيقافها قد يؤثر على وظائف الموقع.',
    'cookies.contact.title': 'اتصل بنا',
    'cookies.contact.content':
      'للأسئلة حول ملفات تعريف الارتباط، اتصل بنا على support@3arida.ma',

    // Admin Page
    'admin.dashboard.title': 'لوحة تحكم الإدارة',
    'admin.dashboard.subtitle': 'إدارة العرائض والمستخدمين وإحصائيات المنصة',
    'admin.stats.totalPetitions': 'إجمالي العرائض',
    'admin.stats.pendingReview': 'في انتظار المراجعة',
    'admin.stats.totalUsers': 'إجمالي المستخدمين',
    'admin.stats.totalSignatures': 'إجمالي التوقيعات',
    'admin.tools.title': 'أدوات الإدارة',
    'admin.recentPetitions.title': 'العرائض الحديثة',
    'admin.recentPetitions.noRecent': 'لا توجد عرائض حديثة',
    'admin.recentPetitions.signatures': 'توقيع',
    'admin.recentPetitions.review': 'مراجعة',
    'admin.systemStatus.title': 'حالة النظام',
    'admin.systemStatus.platformStatus': 'حالة المنصة',
    'admin.systemStatus.database': 'قاعدة البيانات',
    'admin.systemStatus.storage': 'التخزين',
    'admin.systemStatus.payments': 'المدفوعات',
    'admin.status.operational': 'تعمل بشكل طبيعي',
    'admin.status.connected': 'متصلة',
    'admin.status.available': 'متاحة',
    'admin.status.active': 'نشطة',
    'admin.status.pending': 'في الانتظار',
    'admin.status.approved': 'مقبولة',
    'admin.status.paused': 'متوقفة',
    'admin.error.loadStats': 'فشل في تحميل إحصائيات الإدارة',
    'admin.tryAgain': 'حاول مرة أخرى',

    // Admin Navigation
    'admin.nav.dashboard': 'لوحة التحكم',
    'admin.nav.petitions': 'العرائض',
    'admin.nav.appeals': 'الطعون',
    'admin.nav.users': 'المستخدمون',
    'admin.nav.moderators': 'المشرفون',
    'admin.nav.activity': 'النشاط',
    'admin.nav.analytics': 'التحليلات',

    // Petition Creation Form
    'create.title': 'إنشاء عريضة جديدة',
    'create.subtitle': 'ابدأ حملة لإحداث التغيير',
    'create.publisherInformation': 'معلومات الناشر',
    'create.publisherInformationDesc': 'من ينشر هذه العريضة؟',
    'create.petitionDetails': 'تفاصيل العريضة',
    'create.petitionDetailsDesc': 'المعلومات الأساسية حول عريضتك',
    'create.startPetition': 'ابدأ عريضة',
    'create.createPetitionDesc': 'أنشئ عريضة لحشد الدعم لقضيتك وإحداث التغيير',
    'create.stepOf': 'الخطوة {current} من {total}',
    'create.contentDescription': 'المحتوى والوصف',
    'create.contentDescriptionDesc': 'احك قصتك واشرح قضيتك',
    'create.autoFillTestData': 'ملء البيانات التجريبية 🤖',
    'create.mediaImages': 'الوسائط والصور',
    'create.mediaImagesDesc': 'أضف صورًا ومقاطع فيديو لجعل عريضتك جذابة',
    'create.locationTargeting': 'الموقع والاستهداف',
    'create.locationTargetingDesc': 'حدد موقع عريضتك وهدف التوقيعات',
    'create.reviewSubmit': 'المراجعة والإرسال',
    'create.reviewSubmitDesc': 'راجع عريضتك قبل النشر',

    // Form Labels
    'form.publishAs': 'نشر العريضة كـ *',
    'form.selectPublisherType': 'اختر نوع الناشر',
    'form.yourName': 'اسمك',
    'form.organizationName': 'اسم المنظمة/الجمعية/المؤسسة',
    'form.enterFullName': 'أدخل اسمك الكامل',
    'form.enterOrganizationName': 'أدخل اسم المنظمة/الجمعية/المؤسسة',
    'form.officialDocument': 'الوثيقة الرسمية *',
    'form.officialDocumentDesc':
      'ارفع وثيقة رسمية (PDF، DOC، DOCX، JPG، PNG). الحد الأقصى: 5 ميجابايت',
    'form.petitionType': 'نوع العريضة *',
    'form.selectPetitionType': 'اختر نوع العريضة',
    'form.addressedTo': 'من هو المخاطب بهذه العريضة؟ *',
    'form.selectAddressedTo': 'اختر من توجه إليه هذه العريضة',
    'form.specificName': 'الاسم المحدد لـ {type} *',
    'form.enterSpecificName': 'أدخل الاسم المحدد لـ {type}',
    'form.category': 'الفئة *',
    'form.selectCategory': 'اختر فئة',
    'form.customCategory': 'فئة مخصصة *',
    'form.enterCustomCategory': 'أدخل فئتك المخصصة',
    'form.subcategory': 'الفئة الفرعية *',
    'form.selectSubcategory': 'اختر فئة فرعية',
    'form.customSubcategory': 'فئة فرعية مخصصة *',
    'form.enterCustomSubcategory': 'أدخل فئتك الفرعية المخصصة',
    'form.petitionTitle': 'عنوان العريضة *',
    'form.petitionTitlePlaceholder': 'أدخل عنوانًا واضحًا ومقنعًا لعريضتك',
    'form.petitionDescription': 'وصف العريضة *',
    'form.petitionDescriptionPlaceholder':
      'اشرح قضيتك، ولماذا هي مهمة، وما التغيير الذي تريد رؤيته. كن محددًا ومقنعًا.\n\nاضغط Enter لفواصل الأسطر. حدد النص واستخدم أزرار B و U للتنسيق.',
    'form.petitionImage': 'صورة العريضة (اختياري)',
    'form.petitionImageDesc':
      'ارفع صورة لجعل عريضتك أكثر إقناعًا. الحد الأقصى: 5 ميجابايت',
    'form.addVideo': 'إضافة فيديو (اختياري)',
    'form.youtubeUrlPlaceholder': 'الصق رابط فيديو يوتيوب هنا',
    'form.youtubeVideoDesc':
      'أضف فيديو يوتيوب لمساعدة في شرح قضيتك (الصق الرابط الكامل لليوتيوب)',
    'form.targetSignatures': 'العدد المستهدف من التوقيعات *',
    'form.enterSignatures': 'أدخل عدد التوقيعات',
    'form.signatureGoalDesc':
      'حدد هدف التوقيعات الذي يتناسب مع نطاق عريضتك. يمكنك دائمًا ترقية خطتك مع نمو الدعم.',
    'form.geographicalScope': 'النطاق الجغرافي للعريضة *',
    'form.selectLocation': 'اختر الموقع',
    'form.customLocation': 'موقع مخصص *',
    'form.enterCustomLocation': 'أدخل موقعك المخصص',
    'form.tags': 'الكلمات المفتاحية (اختياري)',
    'form.tagsPlaceholder':
      'أدخل الكلمات المفتاحية مفصولة بفواصل (مثل: البيئة، المناخ، الاستدامة)',
    'form.tagsDesc':
      'أضف كلمات مفتاحية ذات صلة لمساعدة الناس في اكتشاف عريضتك. افصل بين الكلمات بفواصل.',

    // Form Options
    'form.individual': '👤 فرد',
    'form.organization': '🏢 جمعية، منظمة، مؤسسة',
    'form.change': '🔄 تغيير - طلب تغيير في السياسة أو الممارسة',
    'form.support': '✊ دعم - إظهار الدعم لقضية أو شخص',
    'form.stop': '🛑 إيقاف - منع حدوث شيء ما',
    'form.start': '🚀 بدء - بدء مبادرة أو برنامج جديد',
    'form.government': '🏛️ مسؤول/وكالة حكومية',
    'form.company': '🏢 شركة/مؤسسة',
    'form.organizationOption': '🏛️ منظمة/مؤسسة',
    'form.individualOption': '👤 فرد',
    'form.community': '🏘️ مجتمع/سلطة محلية',
    'form.other': '📝 أخرى',

    // Form Buttons and Actions
    'form.selectText': 'حدد النص أولاً، ثم انقر على B للعريض أو U للتسطير',
    'form.boldButton': 'جعل النص المحدد عريضًا',
    'form.underlineButton': 'جعل النص المحدد مسطرًا',
    'form.hidePreview': 'إخفاء المعاينة',
    'form.showPreview': 'إظهار المعاينة',
    'form.preview': 'معاينة:',
    'form.uploadingImage': 'جاري رفع الصورة...',
    'form.slider': 'شريط التمرير',
    'form.specificNumber': 'رقم محدد',
    'form.signatures': 'توقيع',
    'form.enterNumberSignatures': 'أدخل أي رقم بين 1 و 1,000,000 توقيع',
    'form.previewTags': 'معاينة:',

    // Form Validation Messages
    'form.selectPublisherTypeError': 'يرجى اختيار من ينشر هذه العريضة',
    'form.enterPublisherNameError': 'يرجى إدخال اسم الناشر',
    'form.uploadDocumentError':
      'يرجى رفع وثيقة رسمية تثبت منظمتك/جمعيتك/مؤسستك',
    'form.specifyCustomCategoryError': 'يرجى تحديد فئة مخصصة',
    'form.specifyCustomSubcategoryError': 'يرجى تحديد فئة فرعية مخصصة',
    'form.selectAddressedToError': 'يرجى اختيار من توجه إليه هذه العريضة',
    'form.specifyAddressedToError': 'يرجى تحديد {type}',
    'form.enterValidSignaturesError': 'يرجى إدخال عدد صحيح من التوقيعات',
    'form.maxSignaturesError': 'العدد الأقصى للتوقيعات هو 1,000,000',
    'form.selectTargetSignaturesError':
      'يرجى اختيار أو إدخال عدد مستهدف من التوقيعات',

    // Form File Upload
    'form.fileSizeError': 'حجم الملف يجب أن يكون أقل من 5 ميجابايت',
    'form.validYouTubeUrl':
      'يرجى إدخال رابط يوتيوب صحيح (مثل: https://www.youtube.com/watch?v=VIDEO_ID)',

    // Form Steps Navigation
    'form.previous': 'السابق',
    'form.next': 'التالي',
    'form.uploadingImageButton': 'جاري رفع الصورة...',
    'form.creatingPetition': 'جاري إنشاء العريضة...',
    'form.createPetitionButton': 'إنشاء العريضة',

    // Review Step
    'review.title': 'راجع عريضتك',
    'review.subtitle': 'يرجى مراجعة جميع المعلومات أدناه قبل إرسال عريضتك.',
    'review.publisherInfo': 'معلومات الناشر',
    'review.petitionDetails': 'تفاصيل العريضة',
    'review.content': 'المحتوى',
    'review.media': 'الوسائط',
    'review.locationTargeting': 'الموقع والاستهداف',
    'review.pricingInfo': 'معلومات التسعير',
    'review.type': 'النوع:',
    'review.name': 'الاسم:',
    'review.document': 'الوثيقة:',
    'review.addressedTo': 'موجهة إلى:',
    'review.category': 'الفئة:',
    'review.subcategory': 'الفئة الفرعية:',
    'review.title': 'العنوان:',
    'review.description': 'الوصف:',
    'review.imageUploaded': '✅ تم رفع الصورة',
    'review.youtubeAdded': '✅ تم إضافة فيديو يوتيوب',
    'review.targetSignatures': 'التوقيعات المستهدفة:',
    'review.location': 'الموقع:',
    'review.tags': 'الكلمات المفتاحية:',
    'review.totalCost': 'التكلفة الإجمالية:',
    'review.free': 'مجاني',
    'review.tier': 'المستوى:',
    'review.plan': 'الخطة:',
    'review.notSpecified': 'غير محدد',

    // Pricing and Plans
    'pricing.information': '💰 معلومات التسعير',
    'pricing.tier': 'مستوى {name}',
    'pricing.upTo': 'حتى {count} توقيع',
    'pricing.free': 'مجاني',
    'pricing.oneTimePayment': 'دفعة واحدة',
    'pricing.securePayment': '💳 سيتم معالجة الدفع بأمان من خلال Stripe',
    'pricing.moroccanDirham': '🇲🇦 جميع الأسعار بالدرهم المغربي (MAD)',
    'pricing.includes': 'يتضمن:',

    // Tips for Success
    'tips.title': '💡 نصائح للنجاح',
    'tips.clearTitle': 'اكتب عنوانًا واضحًا ومقنعًا يشرح قضيتك',
    'tips.explainWhy': 'اشرح لماذا هذه القضية مهمة وما التغيير الذي تريد رؤيته',
    'tips.realisticGoal': 'اختر هدف توقيعات واقعي للبدء',
    'tips.addMedia': 'أضف صورًا أو مقاطع فيديو لجعل عريضتك أكثر جاذبية',
    'tips.shareWithFriends':
      'شارك عريضتك مع الأصدقاء والعائلة للحصول على الدعم الأولي',

    // Character and File Limits
    'limits.characters': '{count} حرف',
    'limits.charactersLimit': '{count}/{max} حرف',
    'limits.maxFileSize': 'الحد الأقصى: {size}',
    'limits.fileTypes': 'أنواع الملفات المدعومة: {types}',

    // Publisher Types
    'publisherType.individual': 'فرد',
    'publisherType.organization': 'جمعية، منظمة، مؤسسة',

    // Petition Types
    'petitionType.change': 'تغيير',
    'petitionType.support': 'دعم',
    'petitionType.oppose': 'معارضة',

    // Addressed To Types
    'addressedTo.government': 'الحكومة',
    'addressedTo.company': 'شركة',
    'addressedTo.organization': 'منظمة',
    'addressedTo.individual': 'فرد',
    'create.petitionTitle': 'عنوان العريضة',
    'create.petitionTitlePlaceholder': 'أدخل عنوان واضح ومقنع لعريضتك',
    'create.description': 'وصف العريضة',
    'create.descriptionPlaceholder': 'اشرح قضيتك بالتفصيل...',
    'create.category': 'الفئة',
    'create.selectCategory': 'اختر فئة',
    'create.subcategory': 'الفئة الفرعية',
    'create.selectSubcategory': 'اختر فئة فرعية',
    'create.tags': 'الكلمات المفتاحية',
    'create.tagsPlaceholder': 'أدخل الكلمات المفتاحية مفصولة بفواصل',
    'create.publisherName': 'اسم الناشر',
    'create.publisherNamePlaceholder': 'اسمك أو اسم منظمتك',
    'create.publisherType': 'نوع الناشر',
    'create.individual': 'فرد',
    'create.organization': 'منظمة',
    'create.addressedTo': 'موجهة إلى',
    'create.addressedToPlaceholder': 'إلى من توجه هذه العريضة؟',
    'create.targetSignatures': 'عدد التوقيعات المطلوب',
    'create.uploadImage': 'رفع صورة',
    'create.uploadVideo': 'رفع فيديو',
    'create.youtubeUrl': 'رابط يوتيوب',
    'create.youtubeUrlPlaceholder': 'https://www.youtube.com/watch?v=...',
    'create.createPetition': 'إنشاء العريضة المجانية',
    'create.saveDraft': 'حفظ كمسودة',
    'create.preview': 'معاينة',
    'create.formatting': 'التنسيق',
    'create.bold': 'عريض',
    'create.italic': 'مائل',
    'create.underline': 'تحته خط',
    'create.bulletList': 'قائمة نقطية',
    'create.numberedList': 'قائمة مرقمة',
    'create.addTestData': 'إضافة بيانات تجريبية',
    'create.clearForm': 'مسح النموذج',
    'create.required': 'مطلوب',
    'create.optional': 'اختياري',
    'create.characterCount': '{count} حرف',
    'create.minCharacters': 'الحد الأدنى {min} حرف',
    'create.maxCharacters': 'الحد الأقصى {max} حرف',

    // Petition Detail Page
    'petition.aboutPetition': 'نص العريضة',
    'petition.signPetition': 'وقع هذه العريضة',
    'petition.alreadySigned': 'تم التوقيع بالفعل',
    'petition.checking': 'جاري التحقق...',
    'petition.signatureCount': '{count} توقيع',
    'petition.goalProgress': '{progress}% من هدف {goal} توقيع',
    'petition.moreSignaturesNeeded': 'نحتاج {count} توقيع إضافي',
    'petition.goalReached': 'تم الوصول للهدف! 🎉',
    'petition.verifiedSignatures': '100% توقيعات موثقة',
    'petition.securityInfo': 'محمي بـ reCAPTCHA',
    'petition.securityDescription':
      'هذه العريضة محمية ضد البوتات والرسائل المزعجة بتقنية التحقق الأمني غير المرئي.',
    'petition.allSignaturesVerified': 'جميع توقيعات العرائض موثقة 100%.',
    'petition.thankYouSigning': 'شكرًا لتوقيعك!',
    'petition.signatureRecorded': 'تم تسجيل توقيعك بنجاح.',
    'petition.sharePetition': 'شارك العريضة',
    'petition.viewDiscussion': 'عرض النقاش',
    'petition.publisher': 'الناشر',
    'petition.target': 'الهدف',
    'petition.subject': 'الموضوع',
    'petition.createdBy': 'أنشأها',
    'petition.createdAt': 'تاريخ الإنشاء',
    'petition.tags': 'الكلمات المفتاحية',
    'petition.category': 'الفئة',
    'petition.status': 'الحالة',
    'petition.updates': 'التحديثات',
    'petition.comments': 'التعليقات',
    'petition.supporters': 'المؤيدون',

    // Profile Dropdown
    'profile.dashboard': 'لوحة التحكم',
    'profile.myCampaigns': 'حملاتي',
    'profile.admin': 'الإدارة',
    'profile.settings': 'إعدادات الملف الشخصي',
    'profile.signOut': 'تسجيل الخروج',

    // Buttons and Actions
    'button.getStarted': 'ابدأ الآن',
    'button.signIn': 'تسجيل الدخول',
    'button.signUp': 'إنشاء حساب',
    'button.viewAll': 'عرض الكل',
    'button.loadMore': 'تحميل المزيد',
    'button.tryAgain': 'حاول مرة أخرى',
    'button.goBack': 'رجوع',
    'button.continue': 'متابعة',
    'button.submit': 'إرسال',
    'button.cancel': 'إلغاء',
    'button.close': 'إغلاق',
    'button.dismiss': 'تجاهل',

    // Form Validation
    'validation.required': 'هذا الحقل مطلوب',
    'validation.email': 'يرجى إدخال بريد إلكتروني صحيح',
    'validation.phone': 'يرجى إدخال رقم هاتف صحيح',
    'validation.minLength': 'يجب أن يكون على الأقل {min} أحرف',
    'validation.maxLength': 'يجب أن يكون أقل من {max} حرف',
    'validation.passwordMatch': 'كلمات المرور غير متطابقة',
    'validation.invalidFormat': 'تنسيق غير صحيح',

    // Status Messages
    'status.loading': 'جاري التحميل...',
    'status.saving': 'جاري الحفظ...',
    'status.success': 'تم بنجاح',
    'status.error': 'حدث خطأ',
    'status.noResults': 'لا توجد نتائج',
    'status.noData': 'لا توجد بيانات',

    // Error Messages
    'errors.loadingPetitions': 'فشل في تحميل العرائض. يرجى المحاولة مرة أخرى.',
    'errors.tryAgain': 'حاول مرة أخرى',
    'errors.pageNotFound': 'الصفحة غير موجودة',
    'errors.serverError': 'خطأ في الخادم',
    'errors.networkError': 'خطأ في الشبكة',
    'errors.unauthorized': 'غير مخول',
    'errors.forbidden': 'ممنوع',

    // Success Messages
    'success.petitionCreated': 'تم إنشاء العريضة بنجاح',
    'success.petitionSigned': 'تم توقيع العريضة بنجاح',
    'success.profileUpdated': 'تم تحديث الملف الشخصي',

    // Petition Statuses
    'status.draft': 'مسودة',
    'status.pending': 'في الانتظار',
    'status.approved': 'مقبولة',
    'status.rejected': 'مرفوضة',
    'status.paused': 'متوقفة',
    'status.archived': 'مؤرشفة',
    'status.deleted': 'محذوفة',

    // Time and Date
    'time.memberSince': 'عضو منذ',
    'time.createdAt': 'تم الإنشاء في',
    'time.updatedAt': 'تم التحديث في',

    // Actions
    'actions.edit': 'تعديل',
    'actions.delete': 'حذف',
    'actions.archive': 'أرشفة',
    'actions.approve': 'قبول',
    'actions.reject': 'رفض',
    'actions.pause': 'إيقاف',
    'actions.resume': 'استئناف',
    'actions.download': 'تحميل',

    // Petition Stats
    'stats.petitionStats': 'إحصائيات العريضة',
    'stats.signatures': 'التوقيعات',
    'stats.goal': 'الهدف',
    'stats.progress': 'التقدم',
    'stats.views': 'المشاهدات',
    'stats.shares': 'المشاركات',

    // Admin Actions
    'admin.adminActions': 'إجراءات الإدارة',
    'admin.rejectPetition': 'رفض العريضة',
    'admin.pausePetition': 'إيقاف العريضة',
    'admin.archivePetition': 'أرشفة العريضة',
    'admin.deletePetition': 'حذف العريضة',
    'admin.approvePetition': 'قبول العريضة',
    'admin.approveReverseRejection': 'قبول (إلغاء الرفض)',
    'admin.resumePetition': 'استئناف العريضة',
    'admin.unarchiveApprove': 'إلغاء الأرشفة والقبول',

    // Resubmission
    'resubmission.history': 'تاريخ إعادة الإرسال',
    'resubmission.rejected': 'مرفوضة',
    'resubmission.reason': 'السبب',
    'resubmission.resubmitted': 'تم إعادة الإرسال',
    'resubmission.attempt': 'المحاولة',
    'resubmission.invalidDate': 'تاريخ غير صحيح',
    'resubmission.noReason': 'لم يتم تقديم سبب',

    // QR Code and Sharing
    'qr.shareThisPetition': 'شارك هذه العريضة',
    'qr.scanToView': 'امسح رمز الاستجابة السريعة لعرض ودعم هذه العريضة',
    'qr.createdBy': 'أنشأها',
    'qr.shareThisPetitionButton': 'شارك هذه العريضة',

    // Categories
    'categories.all': 'جميع الفئات',
    'categories.environment': 'البيئة',
    'categories.education': 'التعليم',
    'categories.health': 'الصحة',
    'categories.social': 'اجتماعية',
    'categories.politics': 'السياسة',
    'categories.economy': 'الاقتصاد',
    'categories.culture': 'الثقافة',
    'categories.sports': 'الرياضة',
    'categories.technology': 'التكنولوجيا',
    'categories.other': 'أخرى',
    'categories.petitions': 'عرائض',
    'categories.socialjustice': 'العدالة الاجتماعية',

    // Petition Card Elements
    'petitionCard.createdBy': 'أنشأها',
    'petitionCard.signatures': 'توقيع',
    'petitionCard.of': 'من',
    'petitionCard.views': 'مشاهدة',
    'petitionCard.shares': 'مشاركة',
    'petitionCard.signPetition': 'وقع العريضة',
    'petitionCard.viewPetition': 'عرض العريضة',
    'petitionCard.featuredPetition': '⭐ عريضة مميزة',
    'petitionCard.goal': 'هدف',
    'petitionCard.complete': 'مكتمل',

    // Status Labels
    'status.active': 'نشطة',
    'status.inactive': 'غير نشطة',
    'status.completed': 'مكتملة',

    // Errors
    'errors.loadingPetitions': 'فشل في تحميل العرائض. يرجى المحاولة مرة أخرى.',
    'errors.tryAgain': 'حاول مرة أخرى',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.petitions': 'Pétitions',
    'nav.dashboard': 'Tableau de bord',
    'nav.profile': 'Profil',
    'nav.admin': 'Administration',
    'nav.login': 'Connexion',
    'nav.register': "S'inscrire",
    'nav.logout': 'Déconnexion',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.share': 'Partager',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',

    // Petitions Page
    'petitions.discoverPetitions': 'Découvrir les pétitions',
    'petitions.findAndSupport':
      'Trouvez et soutenez les causes qui vous importent',
    'petitions.startAPetition': 'Commencer une pétition',
    'petitions.searchPetitions': 'Rechercher des pétitions...',
    'petitions.allCategories': 'Toutes les catégories',
    'petitions.mostRecent': 'Plus récentes',
    'petitions.mostPopular': 'Plus populaires',
    'petitions.mostSignatures': 'Plus de signatures',
    'petitions.petitionsFound': '{count} pétitions trouvées',
    'petitions.loading': 'Chargement...',
    'petitions.tryAgain': 'Réessayer',

    // Petitions
    'petitions.title': 'Pétitions',
    'petitions.create': 'Créer une pétition',
    'petitions.sign': 'Signer la pétition',
    'petitions.signed': 'Signé',
    'petitions.signatures': 'Signatures',
    'petitions.goal': 'Objectif',
    'petitions.createdBy': 'Créé par',
    'petitions.browse': 'Parcourir les pétitions',
    'petitions.qrCode': 'Code QR',
    'petitions.startPetition': 'Commencer une pétition',
    'petitions.discoverPetitions': 'Découvrir les pétitions',

    // Home page
    'home.hero.title': 'Votre voix compte',
    'home.hero.subtitle':
      "Rejoignez des milliers de citoyens créant des pétitions et faisant entendre leurs voix. Commencez une pétition aujourd'hui et menez le changement que vous voulez voir.",
    'home.stats.signatures': 'Signatures collectées',
    'home.stats.petitions': 'Pétitions actives',
    'home.stats.changes': 'Changements réalisés',
    'home.featured.title': 'Pétitions en vedette',
    'home.featured.subtitle':
      'Les pétitions les plus impactantes qui font le changement maintenant',
    'home.categories.title': 'Explorer par catégorie',
    'home.categories.subtitle': 'Trouvez les pétitions qui vous importent',
    'home.recent.title': 'Pétitions récentes',
    'home.recent.subtitle': 'Dernières pétitions de la communauté',
    'home.cta.title': 'Prêt à faire la différence ?',
    'home.cta.subtitle':
      "Chaque grand changement commence par une seule voix. Commencez votre pétition aujourd'hui et ralliez le soutien pour les causes qui vous importent.",
    'home.cta.button': 'Commencez votre pétition maintenant',

    // Auth
    'auth.login.title': 'Connexion',
    'auth.register.title': 'Créer un compte',
    'auth.email': 'Adresse e-mail',
    'auth.password': 'Mot de passe',
    'auth.name': 'Nom complet',

    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.welcome': 'Bienvenue, {name}',
    'dashboard.yourPetitions': 'Vos pétitions',
    'dashboard.mySignatures': 'Mes signatures',
    'dashboard.appeals': 'Appels',
    'dashboard.myCampaigns': 'Mes campagnes',

    // Help Page
    'help.title': "Centre d'aide",
    'help.subtitle':
      'Trouvez des réponses aux questions courantes et apprenez à utiliser 3arida',
    'help.searchPlaceholder': "Rechercher des sujets d'aide...",
    'help.showingResults': 'Affichage des résultats pour "{query}"',
    'help.clearSearch': 'effacer votre recherche',

    // Getting Started Section
    'help.gettingStarted.title': 'Commencer',
    'help.gettingStarted.createPetition.title': 'Comment créer une pétition ?',
    'help.gettingStarted.createPetition.intro':
      'Créer une pétition sur 3arida est simple :',
    'help.gettingStarted.createPetition.step1':
      'Inscrivez-vous ou connectez-vous à votre compte',
    'help.gettingStarted.createPetition.step2':
      'Cliquez sur le bouton "Commencer une pétition"',
    'help.gettingStarted.createPetition.step3':
      'Remplissez les détails de votre pétition (titre, description, catégorie)',
    'help.gettingStarted.createPetition.step4':
      'Ajoutez des images ou vidéos pour soutenir votre cause',
    'help.gettingStarted.createPetition.step5':
      'Définissez votre objectif de signatures',
    'help.gettingStarted.createPetition.step6': 'Soumettez pour révision',
    'help.gettingStarted.signPetition.title': 'Comment signer une pétition ?',
    'help.gettingStarted.signPetition.intro': 'Pour signer une pétition :',
    'help.gettingStarted.signPetition.step1':
      'Parcourez les pétitions ou recherchez une cause spécifique',
    'help.gettingStarted.signPetition.step2':
      'Cliquez sur la pétition pour voir les détails',
    'help.gettingStarted.signPetition.step3':
      'Cliquez sur le bouton "Signer cette pétition"',
    'help.gettingStarted.signPetition.step4':
      'Vérifiez votre numéro de téléphone (pour la sécurité)',
    'help.gettingStarted.signPetition.step5':
      'Optionnellement, ajoutez un commentaire expliquant pourquoi vous signez',

    // Account & Profile Section
    'help.account.title': 'Compte et profil',
    'help.account.createAccount.title': 'Comment créer un compte ?',
    'help.account.createAccount.description':
      'Vous pouvez vous inscrire avec votre adresse e-mail ou votre compte Google. Cliquez sur "S\'inscrire" dans le coin supérieur droit et suivez le processus d\'inscription.',
    'help.account.editProfile.title': 'Puis-je modifier mon profil ?',
    'help.account.editProfile.description':
      'Oui ! Allez sur votre page de profil et cliquez sur "Modifier la bio" pour mettre à jour vos informations, y compris votre nom, bio et photo de profil.',
    'help.account.resetPassword.title':
      'Comment réinitialiser mon mot de passe ?',
    'help.account.resetPassword.description':
      'Cliquez sur "Mot de passe oublié" sur la page de connexion, entrez votre adresse e-mail, et nous vous enverrons des instructions pour réinitialiser votre mot de passe.',

    // Managing Petitions Section
    'help.managing.title': 'Gérer vos pétitions',
    'help.managing.approval.title':
      "Combien de temps prend l'approbation d'une pétition ?",
    'help.managing.approval.description':
      'Notre équipe de modération examine les pétitions dans les 24-48 heures. Vous recevrez une notification une fois votre pétition approuvée ou si des modifications sont nécessaires.',
    'help.managing.edit.title':
      'Puis-je modifier ma pétition après soumission ?',
    'help.managing.edit.description':
      "Si votre pétition est rejetée, vous pouvez la modifier et la resoumettre (jusqu'à 3 fois). Une fois approuvée, les modifications majeures nécessitent de contacter le support pour maintenir l'intégrité de la pétition.",
    'help.managing.delete.title': 'Comment supprimer ma pétition ?',
    'help.managing.delete.intro':
      'Vous pouvez supprimer votre pétition sous certaines conditions :',
    'help.managing.delete.condition1': 'Si elle a 10 signatures ou moins',
    'help.managing.delete.condition2':
      "Si elle est encore en attente d'approbation",
    'help.managing.delete.condition3':
      'Si elle a été créée il y a moins de 24 heures',
    'help.managing.delete.note':
      'Pour les pétitions avec plus de signatures, vous pouvez demander la suppression à notre équipe de modération.',
    'help.managing.updates.title': 'Que sont les mises à jour de pétition ?',
    'help.managing.updates.description':
      'En tant que créateur de pétition, vous pouvez publier des mises à jour pour tenir les supporters informés des progrès, victoires ou prochaines étapes. Les mises à jour apparaissent sur votre page de pétition.',

    // Sharing & Promotion Section
    'help.sharing.title': 'Partage et promotion',
    'help.sharing.howToShare.title': 'Comment partager ma pétition ?',
    'help.sharing.howToShare.intro':
      'Vous pouvez partager votre pétition de plusieurs façons :',
    'help.sharing.howToShare.social':
      'Réseaux sociaux (Facebook, Twitter, WhatsApp)',
    'help.sharing.howToShare.link': 'Copie de lien direct',
    'help.sharing.howToShare.email': 'Partage par e-mail',
    'help.sharing.howToShare.qr': 'Code QR (télécharger et imprimer)',
    'help.sharing.qrCode.title':
      "Qu'est-ce qu'un code QR et comment l'utiliser ?",
    'help.sharing.qrCode.description':
      "Un code QR est un code scannable qui mène directement à votre pétition. Vous pouvez le télécharger depuis votre page de pétition et l'imprimer sur des flyers, affiches, ou le partager numériquement. Les gens peuvent le scanner avec l'appareil photo de leur téléphone pour accéder instantanément à votre pétition.",

    // Privacy & Security Section
    'help.privacy.title': 'Confidentialité et sécurité',
    'help.privacy.safe.title':
      'Mes informations personnelles sont-elles sûres ?',
    'help.privacy.safe.description':
      "Oui. Nous utilisons des mesures de sécurité standard de l'industrie pour protéger vos données. Votre e-mail et numéro de téléphone ne sont jamais partagés publiquement. Seuls votre nom et commentaire optionnel apparaissent quand vous signez une pétition.",
    'help.privacy.phoneVerification.title':
      'Pourquoi dois-je vérifier mon numéro de téléphone ?',
    'help.privacy.phoneVerification.description':
      "La vérification téléphonique garantit que chaque signature provient d'une vraie personne et empêche les signatures dupliquées ou frauduleuses. Cela maintient l'intégrité de toutes les pétitions sur notre plateforme.",
    'help.privacy.anonymous.title': 'Puis-je signer anonymement ?',
    'help.privacy.anonymous.description':
      'Bien que nous exigions la vérification téléphonique pour la sécurité, vous pouvez choisir de ne pas afficher votre nom complet publiquement. Cependant, les créateurs de pétitions peuvent voir toutes les signatures pour vérifier le soutien.',

    // Pricing & Payments Section
    'help.pricing.title': 'Tarification et paiements',
    'help.pricing.free.title': '3arida est-il gratuit ?',
    'help.pricing.free.intro':
      'Oui ! Créer et signer des pétitions est gratuit. Nous offrons différents niveaux basés sur votre objectif de signatures :',
    'help.pricing.free.tier1': "Gratuit : Jusqu'à 2 500 signatures",
    'help.pricing.free.tier2': "Basique : Jusqu'à 5 000 signatures",
    'help.pricing.free.tier3': "Premium : Jusqu'à 10 000 signatures",
    'help.pricing.free.tier4': "Entreprise : Jusqu'à 100 000 signatures",
    'help.pricing.payment.title': 'Quels modes de paiement acceptez-vous ?',
    'help.pricing.payment.description':
      'Nous acceptons toutes les principales cartes de crédit et de débit via notre processeur de paiement sécurisé Stripe. Toutes les transactions sont cryptées et sécurisées.',

    // Technical Issues Section
    'help.technical.title': 'Problèmes techniques',
    'help.technical.upload.title':
      "J'ai des problèmes pour télécharger des images",
    'help.technical.upload.intro':
      'Assurez-vous que vos images répondent à ces exigences :',
    'help.technical.upload.format': 'Format : JPG, PNG ou WebP',
    'help.technical.upload.size': 'Taille : Maximum 5MB par image',
    'help.technical.upload.dimensions':
      'Dimensions : Au moins 800x600 pixels recommandé',
    'help.technical.loading.title': 'Le site web ne se charge pas correctement',
    'help.technical.loading.intro': 'Essayez ces étapes de dépannage :',
    'help.technical.loading.cache':
      'Videz le cache et les cookies de votre navigateur',
    'help.technical.loading.browser': 'Essayez un navigateur différent',
    'help.technical.loading.connection': 'Vérifiez votre connexion internet',
    'help.technical.loading.extensions':
      'Désactivez temporairement les extensions du navigateur',

    // Contact Support Section
    'help.contact.title': "Besoin d'aide supplémentaire ?",
    'help.contact.intro':
      "Si vous n'avez pas trouvé la réponse à votre question, notre équipe de support est là pour vous aider.",
    'help.contact.supportTitle': 'Contacter le support',
    'help.contact.email': 'Envoyez-nous un e-mail à :',
    'help.contact.responseTime':
      'Nous répondons généralement dans les 24 heures pendant les jours ouvrables.',

    // No Results
    'help.noResults.title': 'Aucun résultat trouvé',
    'help.noResults.description':
      'Essayez de rechercher avec des mots-clés différents ou',
    'help.noResults.clearSearch': 'effacez votre recherche',

    // About Page
    'about.title': 'À propos de 3arida',
    'about.subtitle':
      "Amplifier les voix, conduire le changement. 3arida est la plateforme du Maroc pour l'engagement civique et l'impact social.",
    'about.mission.title': 'Notre Mission',
    'about.mission.paragraph1':
      '3arida se consacre à donner à chaque Marocain une voix dans la formation de sa communauté et de son pays. Nous croyons que le changement commence par des personnes qui se rassemblent autour de causes communes et font entendre leurs voix.',
    'about.mission.paragraph2':
      "Notre plateforme facilite le démarrage, le partage et la signature de pétitions qui vous importent. Qu'il s'agisse d'un problème local dans votre quartier ou d'une préoccupation nationale, 3arida fournit les outils pour mobiliser le soutien et créer un impact réel.",
    'about.howItWorks.title': 'Comment ça marche',
    'about.howItWorks.step1.title': 'Créer une pétition',
    'about.howItWorks.step1.description':
      'Commencez une pétition sur un sujet qui vous tient à cœur. Ajoutez des détails, des images et fixez votre objectif de signatures.',
    'about.howItWorks.step2.title': 'Partager et mobiliser',
    'about.howItWorks.step2.description':
      'Partagez votre pétition sur les réseaux sociaux, via des codes QR, ou directement avec votre réseau pour rassembler du soutien.',
    'about.howItWorks.step3.title': 'Créer un impact',
    'about.howItWorks.step3.description':
      'À mesure que les signatures augmentent, les décideurs prennent note. Votre pétition peut conduire à un changement réel dans votre communauté.',
    'about.features.title': 'Fonctionnalités de la plateforme',
    'about.features.secureAuth.title': 'Authentification sécurisée',
    'about.features.secureAuth.description':
      'La vérification par téléphone garantit que chaque signature est authentique et prévient la fraude.',
    'about.features.discussion.title': 'Discussion communautaire',
    'about.features.discussion.description':
      "Commentez, répondez et engagez-vous avec d'autres qui soutiennent les mêmes causes.",
    'about.features.sharing.title': 'Partage facile',
    'about.features.sharing.description':
      'Partagez via les réseaux sociaux, les codes QR ou les liens directs pour maximiser la portée.',
    'about.features.analytics.title': 'Analyses en temps réel',
    'about.features.analytics.description':
      'Suivez les progrès de votre pétition avec des analyses et des insights détaillés.',
    'about.features.privacy.title': 'Protection de la vie privée',
    'about.features.privacy.description':
      'Vos informations personnelles sont protégées et les signatures restent privées.',
    'about.features.notifications.title': 'Notifications',
    'about.features.notifications.description':
      'Restez informé des pétitions qui vous importent avec des notifications en temps réel.',
    'about.values.title': 'Nos valeurs',
    'about.values.voices.title': '🗣️ Amplifier les voix',
    'about.values.voices.description':
      "Chaque voix compte. Nous fournissons une plateforme où chacun peut s'exprimer et être entendu.",
    'about.values.community.title': '🤝 Construire la communauté',
    'about.values.community.description':
      'Le changement se produit quand les gens se rassemblent. Nous favorisons les connexions entre individus qui partagent des objectifs communs.',
    'about.values.transparency.title': '✨ Transparence et confiance',
    'about.values.transparency.description':
      'Nous opérons avec une transparence complète et nous nous assurons que chaque signature est vérifiée et authentique.',
    'about.values.impact.title': "🚀 Conduire l'impact",
    'about.values.impact.description':
      'Nous ne nous contentons pas de collecter des signatures—nous créons un changement réel et mesurable dans les communautés.',
    'about.cta.title': 'Prêt à faire la différence ?',
    'about.cta.subtitle':
      'Rejoignez des milliers de Marocains qui utilisent 3arida pour créer un changement positif.',
    'about.cta.startPetition': 'Commencer une pétition',
    'about.cta.browsePetitions': 'Parcourir les pétitions',
    'about.contact.question': "Vous avez des questions ou besoin d'aide ?",
    'about.contact.email': 'Contactez-nous à',

    // Footer
    'footer.description':
      'Plateforme de pétitions numériques du Maroc - Votre voix compte',
    'footer.platform': 'Plateforme',
    'footer.support': 'Support',
    'footer.legal': 'Légal',
    'footer.rights': 'Tous droits réservés. Fabriqué avec ❤️ pour le Maroc.',
    'footer.helpCenter': "Centre d'aide",
    'footer.contactUs': 'Nous contacter',
    'footer.communityGuidelines': 'Directives communautaires',
    'footer.privacyPolicy': 'Politique de confidentialité',
    'footer.termsOfService': "Conditions d'utilisation",
    'footer.cookiePolicy': 'Politique des cookies',
    'footer.aboutUs': 'À propos de nous',
    'footer.copyright': '© 2025 3arida. Tous droits réservés.',

    // Privacy Page
    'privacy.title': 'Politique de confidentialité',
    'privacy.lastUpdated': 'Dernière mise à jour',
    'privacy.introduction.title': 'Introduction',
    'privacy.introduction.content':
      'Chez 3arida, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre plateforme.',
    'privacy.dataCollection.title': 'Collecte de données',
    'privacy.dataCollection.content':
      "Nous collectons les informations que vous nous fournissez directement, telles que votre nom, adresse e-mail et numéro de téléphone lors de la création d'un compte ou de la signature d'une pétition. Nous collectons également des informations techniques sur votre utilisation du site.",
    'privacy.dataUsage.title': 'Utilisation des données',
    'privacy.dataUsage.content':
      "Nous utilisons vos données pour fournir nos services, vérifier votre identité, envoyer des notifications importantes et améliorer l'expérience utilisateur. Nous ne partageons pas vos informations personnelles avec des tiers sans votre consentement.",
    'privacy.contact.title': 'Nous contacter',
    'privacy.contact.content':
      'Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à support@3arida.ma',

    // Terms Page
    'terms.title': "Conditions d'utilisation",
    'terms.lastUpdated': 'Dernière mise à jour',
    'terms.acceptance.title': 'Acceptation des conditions',
    'terms.acceptance.content':
      "En utilisant la plateforme 3arida, vous acceptez ces termes et conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.",
    'terms.services.title': 'Services',
    'terms.services.content':
      "3arida fournit une plateforme pour créer et signer des pétitions numériques. Nous nous réservons le droit de modifier ou d'interrompre tout ou partie de nos services à tout moment.",
    'terms.userResponsibilities.title': "Responsabilités de l'utilisateur",
    'terms.userResponsibilities.content':
      "Vous êtes responsable du contenu que vous publiez et devez vous assurer qu'il ne viole pas les lois ou ne nuit pas à autrui. Vous devez utiliser la plateforme de manière responsable et éthique.",
    'terms.contact.title': 'Nous contacter',
    'terms.contact.content':
      "Pour des questions sur les conditions d'utilisation, contactez-nous à support@3arida.ma",

    // Cookies Page
    'cookies.title': 'Politique des cookies',
    'cookies.lastUpdated': 'Dernière mise à jour',
    'cookies.whatAre.title': 'Que sont les cookies ?',
    'cookies.whatAre.content':
      'Les cookies sont de petits fichiers texte sauvegardés sur votre appareil lors de la visite de notre site. Ils nous aident à améliorer votre expérience et à mémoriser vos préférences.',
    'cookies.howWeUse.title': 'Comment nous les utilisons',
    'cookies.howWeUse.content':
      "Nous utilisons les cookies pour sauvegarder les paramètres de langue, analyser l'utilisation du site et assurer la sécurité. Nous ne les utilisons pas pour vous suivre sur d'autres sites.",
    'cookies.control.title': 'Contrôler les cookies',
    'cookies.control.content':
      'Vous pouvez contrôler les cookies via les paramètres de votre navigateur. Les désactiver peut affecter les fonctionnalités du site.',
    'cookies.contact.title': 'Nous contacter',
    'cookies.contact.content':
      'Pour des questions sur les cookies, contactez-nous à support@3arida.ma',

    // Admin Page
    'admin.dashboard.title': 'Tableau de bord administrateur',
    'admin.dashboard.subtitle':
      'Gérer les pétitions, utilisateurs et statistiques de la plateforme',
    'admin.stats.totalPetitions': 'Total des pétitions',
    'admin.stats.pendingReview': 'En attente de révision',
    'admin.stats.totalUsers': 'Total des utilisateurs',
    'admin.stats.totalSignatures': 'Total des signatures',
    'admin.tools.title': "Outils d'administration",
    'admin.recentPetitions.title': 'Pétitions récentes',
    'admin.recentPetitions.noRecent': 'Aucune pétition récente',
    'admin.recentPetitions.signatures': 'signatures',
    'admin.recentPetitions.review': 'Réviser',
    'admin.systemStatus.title': 'État du système',
    'admin.systemStatus.platformStatus': 'État de la plateforme',
    'admin.systemStatus.database': 'Base de données',
    'admin.systemStatus.storage': 'Stockage',
    'admin.systemStatus.payments': 'Paiements',
    'admin.status.operational': 'Opérationnel',
    'admin.status.connected': 'Connecté',
    'admin.status.available': 'Disponible',
    'admin.status.active': 'Actif',
    'admin.status.pending': 'En attente',
    'admin.status.approved': 'Approuvé',
    'admin.status.paused': 'En pause',
    'admin.error.loadStats':
      "Échec du chargement des statistiques d'administration",
    'admin.tryAgain': 'Réessayer',

    // Admin Navigation
    'admin.nav.dashboard': 'Tableau de bord',
    'admin.nav.petitions': 'Pétitions',
    'admin.nav.appeals': 'Appels',
    'admin.nav.users': 'Utilisateurs',
    'admin.nav.moderators': 'Modérateurs',
    'admin.nav.activity': 'Activité',
    'admin.nav.analytics': 'Analyses',

    // Petition Creation Form
    'create.title': 'Créer une nouvelle pétition',
    'create.subtitle': 'Commencez une campagne pour créer le changement',
    'create.publisherInformation': "Informations de l'éditeur",
    'create.publisherInformationDesc': 'Qui publie cette pétition ?',
    'create.petitionDetails': 'Détails de la pétition',
    'create.petitionDetailsDesc': 'Informations de base sur votre pétition',
    'create.startPetition': 'Commencer une pétition',
    'create.createPetitionDesc':
      'Créez une pétition pour rallier le soutien à votre cause et faire le changement',
    'create.stepOf': 'Étape {current} sur {total}',
    'create.contentDescription': 'Contenu et description',
    'create.contentDescriptionDesc':
      'Racontez votre histoire et expliquez votre cause',
    'create.autoFillTestData': 'Remplir les données de test 🤖',
    'create.mediaImages': 'Médias et images',
    'create.mediaImagesDesc':
      'Ajoutez des photos et vidéos pour rendre votre pétition attrayante',
    'create.locationTargeting': 'Localisation et ciblage',
    'create.locationTargetingDesc':
      "Définissez la localisation de votre pétition et l'objectif de signatures",
    'create.reviewSubmit': 'Révision et soumission',
    'create.reviewSubmitDesc': 'Révisez votre pétition avant publication',

    // Form Labels
    'form.publishAs': 'Publier une pétition en tant que *',
    'form.selectPublisherType': "Sélectionner le type d'éditeur",
    'form.yourName': 'Votre nom',
    'form.organizationName': "Nom de l'organisation/association/institution",
    'form.enterFullName': 'Entrez votre nom complet',
    'form.enterOrganizationName':
      "Entrez le nom de l'organisation/association/institution",
    'form.officialDocument': 'Document officiel *',
    'form.officialDocumentDesc':
      'Téléchargez un document officiel (PDF, DOC, DOCX, JPG, PNG). Taille max : 5MB',
    'form.petitionType': 'Type de pétition *',
    'form.selectPetitionType': 'Sélectionner le type de pétition',
    'form.addressedTo': 'À qui cette pétition est-elle adressée ? *',
    'form.selectAddressedTo': 'Sélectionner à qui cette pétition est destinée',
    'form.specificName': 'Nom spécifique de {type} *',
    'form.enterSpecificName': 'Entrez le nom spécifique de {type}',
    'form.category': 'Catégorie *',
    'form.selectCategory': 'Sélectionner une catégorie',
    'form.customCategory': 'Catégorie personnalisée *',
    'form.enterCustomCategory': 'Entrez votre catégorie personnalisée',
    'form.subcategory': 'Sous-catégorie *',
    'form.selectSubcategory': 'Sélectionner une sous-catégorie',
    'form.customSubcategory': 'Sous-catégorie personnalisée *',
    'form.enterCustomSubcategory': 'Entrez votre sous-catégorie personnalisée',
    'form.petitionTitle': 'Titre de la pétition *',
    'form.petitionTitlePlaceholder':
      'Entrez un titre clair et convaincant pour votre pétition',
    'form.petitionDescription': 'Description de la pétition *',
    'form.petitionDescriptionPlaceholder':
      'Expliquez votre cause, pourquoi elle est importante, et quel changement vous voulez voir. Soyez spécifique et convaincant.\\n\\nAppuyez sur Entrée pour les sauts de ligne. Sélectionnez le texte et utilisez les boutons B et U pour le formatage.',
    'form.petitionImage': 'Image de la pétition (Optionnel)',
    'form.petitionImageDesc':
      'Téléchargez une image pour rendre votre pétition plus convaincante. Taille max : 5MB',
    'form.addVideo': 'Ajouter une vidéo (Optionnel)',
    'form.youtubeUrlPlaceholder': "Collez l'URL de la vidéo YouTube ici",
    'form.youtubeVideoDesc':
      "Ajoutez une vidéo YouTube pour aider à expliquer votre cause (collez l'URL complète YouTube)",
    'form.targetSignatures': 'Nombre cible de signatures *',
    'form.enterSignatures': 'Entrez le nombre de signatures',
    'form.signatureGoalDesc':
      'Définissez un objectif de signatures qui correspond à la portée de votre pétition. Vous pouvez toujours améliorer votre plan à mesure que votre soutien grandit.',
    'form.geographicalScope': 'Portée géographique de la pétition *',
    'form.selectLocation': "Sélectionner l'emplacement",
    'form.customLocation': 'Localisation personnalisée *',
    'form.enterCustomLocation': 'Entrez votre localisation personnalisée',
    'form.tags': 'Mots-clés (Optionnel)',
    'form.tagsPlaceholder':
      'Entrez les mots-clés séparés par des virgules (ex: environnement, climat, durabilité)',
    'form.tagsDesc':
      'Ajoutez des mots-clés pertinents pour aider les gens à découvrir votre pétition. Séparez plusieurs mots-clés par des virgules.',

    // Form Options
    'form.individual': '👤 Individu',
    'form.organization': '🏢 Association, Organisation, Institution',
    'form.change':
      '🔄 Changement - Demander un changement de politique ou de pratique',
    'form.support':
      '✊ Soutien - Montrer le soutien pour une cause ou une personne',
    'form.stop': '🛑 Arrêter - Empêcher que quelque chose se produise',
    'form.start': '🚀 Commencer - Lancer une nouvelle initiative ou programme',
    'form.government': '🏛️ Officiel/Agence gouvernementale',
    'form.company': '🏢 Entreprise/Corporation',
    'form.organizationOption': '🏛️ Organisation/Institution',
    'form.individualOption': '👤 Individu',
    'form.community': '🏘️ Communauté/Autorité locale',
    'form.other': '📝 Autre',

    // Form Buttons and Actions
    'form.selectText':
      "Sélectionnez d'abord le texte, puis cliquez sur B pour gras ou U pour souligné",
    'form.boldButton': 'Rendre le texte sélectionné gras',
    'form.underlineButton': 'Rendre le texte sélectionné souligné',
    'form.hidePreview': "Masquer l'aperçu",
    'form.showPreview': "Afficher l'aperçu",
    'form.preview': 'Aperçu :',
    'form.uploadingImage': "Téléchargement de l'image...",
    'form.slider': 'Curseur',
    'form.specificNumber': 'Nombre spécifique',
    'form.signatures': 'signatures',
    'form.enterNumberSignatures':
      "Entrez n'importe quel nombre entre 1 et 1 000 000 signatures",
    'form.previewTags': 'Aperçu :',

    // Form Validation Messages
    'form.selectPublisherTypeError':
      'Veuillez sélectionner qui publie cette pétition',
    'form.enterPublisherNameError': "Veuillez entrer le nom de l'éditeur",
    'form.uploadDocumentError':
      'Veuillez télécharger un document officiel prouvant votre organisation/association/institution',
    'form.specifyCustomCategoryError':
      'Veuillez spécifier une catégorie personnalisée',
    'form.specifyCustomSubcategoryError':
      'Veuillez spécifier une sous-catégorie personnalisée',
    'form.selectAddressedToError':
      'Veuillez sélectionner à qui cette pétition est adressée',
    'form.specifyAddressedToError': 'Veuillez spécifier le {type}',
    'form.enterValidSignaturesError':
      'Veuillez entrer un nombre valide de signatures',
    'form.maxSignaturesError':
      'Le nombre maximum de signatures est de 1 000 000',
    'form.selectTargetSignaturesError':
      'Veuillez sélectionner ou entrer un nombre cible de signatures',

    // Form File Upload
    'form.fileSizeError': 'La taille du fichier doit être inférieure à 5MB',
    'form.validYouTubeUrl':
      'Veuillez entrer une URL YouTube valide (ex: https://www.youtube.com/watch?v=VIDEO_ID)',

    // Form Steps Navigation
    'form.previous': 'Précédent',
    'form.next': 'Suivant',
    'form.uploadingImageButton': "Téléchargement de l'image...",
    'form.creatingPetition': 'Création de la pétition...',
    'form.createPetitionButton': 'Créer la pétition',

    // Review Step
    'review.title': 'Révisez votre pétition',
    'review.subtitle':
      'Veuillez réviser toutes les informations ci-dessous avant de soumettre votre pétition.',
    'review.publisherInfo': "Informations de l'éditeur",
    'review.petitionDetails': 'Détails de la pétition',
    'review.content': 'Contenu',
    'review.media': 'Médias',
    'review.locationTargeting': 'Localisation et ciblage',
    'review.pricingInfo': 'Informations de tarification',
    'review.type': 'Type :',
    'review.name': 'Nom :',
    'review.document': 'Document :',
    'review.addressedTo': 'Adressé à :',
    'review.category': 'Catégorie :',
    'review.subcategory': 'Sous-catégorie :',
    'review.title': 'Titre :',
    'review.description': 'Description :',
    'review.imageUploaded': '✅ Image téléchargée',
    'review.youtubeAdded': '✅ Vidéo YouTube ajoutée',
    'review.targetSignatures': 'Signatures cibles :',
    'review.location': 'Localisation :',
    'review.tags': 'Mots-clés :',
    'review.totalCost': 'Coût total :',
    'review.free': 'Gratuit',
    'review.tier': 'Niveau :',
    'review.plan': 'Plan :',
    'review.notSpecified': 'Non spécifié',

    // Pricing and Plans
    'pricing.information': '💰 Informations de tarification',
    'pricing.tier': 'Niveau {name}',
    'pricing.upTo': "Jusqu'à {count} signatures",
    'pricing.free': 'Gratuit',
    'pricing.oneTimePayment': 'Paiement unique',
    'pricing.securePayment':
      '💳 Le paiement sera traité en toute sécurité via Stripe',
    'pricing.moroccanDirham': '🇲🇦 Tous les prix sont en Dirham marocain (MAD)',
    'pricing.includes': 'Comprend :',

    // Tips for Success
    'tips.title': '💡 Conseils pour réussir',
    'tips.clearTitle':
      'Rédigez un titre clair et convaincant qui explique votre cause',
    'tips.explainWhy':
      'Expliquez pourquoi cette question est importante et quel changement vous voulez voir',
    'tips.realisticGoal':
      'Choisissez un objectif de signatures réaliste pour commencer',
    'tips.addMedia':
      'Ajoutez des photos ou des vidéos pour rendre votre pétition plus attrayante',
    'tips.shareWithFriends':
      'Partagez votre pétition avec vos amis et votre famille pour obtenir un soutien initial',

    // Character and File Limits
    'limits.characters': '{count} caractères',
    'limits.charactersLimit': '{count}/{max} caractères',
    'limits.maxFileSize': 'Taille max : {size}',
    'limits.fileTypes': 'Types de fichiers pris en charge : {types}',

    // Publisher Types
    'publisherType.individual': 'Individu',
    'publisherType.organization': 'Association, Organisation, Institution',

    // Petition Types
    'petitionType.change': 'Changement',
    'petitionType.support': 'Soutien',
    'petitionType.oppose': 'Opposition',

    // Addressed To Types
    'addressedTo.government': 'Gouvernement',
    'addressedTo.company': 'Entreprise',
    'addressedTo.organization': 'Organisation',
    'addressedTo.individual': 'Individu',
    'create.petitionTitle': 'Titre de la pétition',
    'create.petitionTitlePlaceholder':
      'Entrez un titre clair et convaincant pour votre pétition',
    'create.description': 'Description de la pétition',
    'create.descriptionPlaceholder': 'Expliquez votre cause en détail...',
    'create.category': 'Catégorie',
    'create.selectCategory': 'Choisir une catégorie',
    'create.subcategory': 'Sous-catégorie',
    'create.selectSubcategory': 'Choisir une sous-catégorie',
    'create.tags': 'Mots-clés',
    'create.tagsPlaceholder': 'Entrez les mots-clés séparés par des virgules',
    'create.publisherName': "Nom de l'éditeur",
    'create.publisherNamePlaceholder':
      'Votre nom ou le nom de votre organisation',
    'create.publisherType': "Type d'éditeur",
    'create.individual': 'Individu',
    'create.organization': 'Organisation',
    'create.addressedTo': 'Adressé à',
    'create.addressedToPlaceholder': 'À qui cette pétition est-elle adressée ?',
    'create.targetSignatures': 'Nombre de signatures souhaité',
    'create.uploadImage': 'Télécharger une image',
    'create.uploadVideo': 'Télécharger une vidéo',
    'create.youtubeUrl': 'Lien YouTube',
    'create.youtubeUrlPlaceholder': 'https://www.youtube.com/watch?v=...',
    'create.createPetition': 'Créer la pétition gratuite',
    'create.saveDraft': 'Enregistrer comme brouillon',
    'create.preview': 'Aperçu',
    'create.formatting': 'Formatage',
    'create.bold': 'Gras',
    'create.italic': 'Italique',
    'create.underline': 'Souligné',
    'create.bulletList': 'Liste à puces',
    'create.numberedList': 'Liste numérotée',
    'create.addTestData': 'Ajouter des données de test',
    'create.clearForm': 'Effacer le formulaire',
    'create.required': 'Requis',
    'create.optional': 'Optionnel',
    'create.characterCount': '{count} caractères',
    'create.minCharacters': 'Minimum {min} caractères',
    'create.maxCharacters': 'Maximum {max} caractères',

    // Petition Detail Page
    'petition.aboutPetition': 'À propos de cette pétition',
    'petition.signPetition': 'Signer cette pétition',
    'petition.alreadySigned': 'Déjà signé',
    'petition.checking': 'Vérification...',
    'petition.signatureCount': '{count} signature',
    'petition.goalProgress': "{progress}% de l'objectif de {goal} signatures",
    'petition.moreSignaturesNeeded':
      '{count} signatures supplémentaires nécessaires',
    'petition.goalReached': 'Objectif atteint ! 🎉',
    'petition.verifiedSignatures': '100% signatures vérifiées',
    'petition.securityInfo': 'Protégé par reCAPTCHA',
    'petition.securityDescription':
      'Cette pétition est protégée contre les bots et le spam avec une vérification de sécurité invisible.',
    'petition.allSignaturesVerified':
      'Toutes les signatures de pétitions sont vérifiées à 100%.',
    'petition.thankYouSigning': "Merci d'avoir signé !",
    'petition.signatureRecorded':
      'Votre signature a été enregistrée avec succès.',
    'petition.sharePetition': 'Partager la pétition',
    'petition.viewDiscussion': 'Voir la discussion',
    'petition.publisher': 'Éditeur',
    'petition.target': 'Cible',
    'petition.subject': 'Sujet',
    'petition.createdBy': 'Créé par',
    'petition.createdAt': 'Date de création',
    'petition.tags': 'Mots-clés',
    'petition.category': 'Catégorie',
    'petition.status': 'Statut',
    'petition.updates': 'Mises à jour',
    'petition.comments': 'Commentaires',
    'petition.supporters': 'Supporters',

    // Profile Dropdown
    'profile.dashboard': 'Tableau de bord',
    'profile.myCampaigns': 'Mes campagnes',
    'profile.admin': 'Administration',
    'profile.settings': 'Paramètres du profil',
    'profile.signOut': 'Déconnexion',

    // Buttons and Actions
    'button.getStarted': 'Commencer',
    'button.signIn': 'Se connecter',
    'button.signUp': "S'inscrire",
    'button.viewAll': 'Voir tout',
    'button.loadMore': 'Charger plus',
    'button.tryAgain': 'Réessayer',
    'button.goBack': 'Retour',
    'button.continue': 'Continuer',
    'button.submit': 'Soumettre',
    'button.cancel': 'Annuler',
    'button.close': 'Fermer',
    'button.dismiss': 'Ignorer',

    // Form Validation
    'validation.required': 'Ce champ est requis',
    'validation.email': 'Veuillez entrer un e-mail valide',
    'validation.phone': 'Veuillez entrer un numéro de téléphone valide',
    'validation.minLength': 'Doit contenir au moins {min} caractères',
    'validation.maxLength': 'Doit contenir moins de {max} caractères',
    'validation.passwordMatch': 'Les mots de passe ne correspondent pas',
    'validation.invalidFormat': 'Format invalide',

    // Status Messages
    'status.loading': 'Chargement...',
    'status.saving': 'Enregistrement...',
    'status.success': 'Succès',
    'status.error': 'Erreur',
    'status.noResults': 'Aucun résultat',
    'status.noData': 'Aucune donnée',

    // Error Messages
    'errors.loadingPetitions':
      'Échec du chargement des pétitions. Veuillez réessayer.',
    'errors.tryAgain': 'Réessayer',
    'errors.pageNotFound': 'Page non trouvée',
    'errors.serverError': 'Erreur serveur',
    'errors.networkError': 'Erreur réseau',
    'errors.unauthorized': 'Non autorisé',
    'errors.forbidden': 'Interdit',

    // Success Messages
    'success.petitionCreated': 'Pétition créée avec succès',
    'success.petitionSigned': 'Pétition signée avec succès',
    'success.profileUpdated': 'Profil mis à jour',

    // Petition Statuses
    'status.draft': 'Brouillon',
    'status.pending': 'En attente',
    'status.approved': 'Approuvé',
    'status.rejected': 'Rejeté',
    'status.paused': 'En pause',
    'status.archived': 'Archivé',
    'status.deleted': 'Supprimé',

    // Time and Date
    'time.memberSince': 'Membre depuis',
    'time.createdAt': 'Créé le',
    'time.updatedAt': 'Mis à jour le',

    // Actions
    'actions.edit': 'Modifier',
    'actions.delete': 'Supprimer',
    'actions.archive': 'Archiver',
    'actions.approve': 'Approuver',
    'actions.reject': 'Rejeter',
    'actions.pause': 'Mettre en pause',
    'actions.resume': 'Reprendre',
    'actions.download': 'Télécharger',

    // Petition Stats
    'stats.petitionStats': 'Statistiques de la pétition',
    'stats.signatures': 'Signatures',
    'stats.goal': 'Objectif',
    'stats.progress': 'Progrès',
    'stats.views': 'Vues',
    'stats.shares': 'Partages',

    // Admin Actions
    'admin.adminActions': 'Actions administrateur',
    'admin.rejectPetition': 'Rejeter la pétition',
    'admin.pausePetition': 'Mettre en pause la pétition',
    'admin.archivePetition': 'Archiver la pétition',
    'admin.deletePetition': 'Supprimer la pétition',
    'admin.approvePetition': 'Approuver la pétition',
    'admin.approveReverseRejection': 'Approuver (Annuler le rejet)',
    'admin.resumePetition': 'Reprendre la pétition',
    'admin.unarchiveApprove': 'Désarchiver et approuver',

    // Resubmission
    'resubmission.history': 'Historique de resoumission',
    'resubmission.rejected': 'Rejetée',
    'resubmission.reason': 'Raison',
    'resubmission.resubmitted': 'Resoumise',
    'resubmission.attempt': 'Tentative',
    'resubmission.invalidDate': 'Date invalide',
    'resubmission.noReason': 'Aucune raison fournie',

    // QR Code and Sharing
    'qr.shareThisPetition': 'Partager cette pétition',
    'qr.scanToView': 'Scannez le code QR pour voir et soutenir cette pétition',
    'qr.createdBy': 'Créé par',
    'qr.shareThisPetitionButton': 'Partager cette pétition',

    // Categories
    'categories.all': 'Toutes les catégories',
    'categories.environment': 'Environnement',
    'categories.education': 'Éducation',
    'categories.health': 'Santé',
    'categories.social': 'Social',
    'categories.politics': 'Politique',
    'categories.economy': 'Économie',
    'categories.culture': 'Culture',
    'categories.sports': 'Sports',
    'categories.technology': 'Technologie',
    'categories.other': 'Autre',
    'categories.petitions': 'Pétitions',
    'categories.socialjustice': 'Justice sociale',

    // Petition Card Elements
    'petitionCard.createdBy': 'Créé par',
    'petitionCard.signatures': 'signature',
    'petitionCard.of': 'de',
    'petitionCard.views': 'vues',
    'petitionCard.shares': 'partages',
    'petitionCard.signPetition': 'Signer la pétition',
    'petitionCard.viewPetition': 'Voir la pétition',
    'petitionCard.featuredPetition': '⭐ Pétition en vedette',
    'petitionCard.goal': 'objectif',
    'petitionCard.complete': 'terminé',

    // Status Labels
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.completed': 'Terminée',
  },
};

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('ar'); // Default to Arabic
  const [isRTL, setIsRTL] = useState(true);

  useEffect(() => {
    // Get locale from localStorage or URL
    const savedLocale = localStorage.getItem('locale') as Locale;
    const urlLocale = window.location.pathname.startsWith('/fr') ? 'fr' : 'ar';

    const currentLocale = savedLocale || urlLocale;
    setLocale(currentLocale);
    setIsRTL(currentLocale === 'ar');

    // Update document direction and language
    document.documentElement.dir = currentLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLocale;

    // Update body class for styling and fonts
    document.body.className = document.body.className.replace(
      /\b(rtl|ltr|font-arabic|font-inter)\b/g,
      ''
    );
    document.body.classList.add(currentLocale === 'ar' ? 'rtl' : 'ltr');
    document.body.classList.add(
      currentLocale === 'ar' ? 'font-arabic' : 'font-inter'
    );
  }, []);

  const t = (key: string, params?: Record<string, string | number>) => {
    let translation = translations[locale][key] || key;

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }

    return translation;
  };

  const switchLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsRTL(newLocale === 'ar');
    localStorage.setItem('locale', newLocale);

    // Update document direction and language
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;

    // Update body class and fonts
    document.body.className = document.body.className.replace(
      /\b(rtl|ltr|font-arabic|font-inter)\b/g,
      ''
    );
    document.body.classList.add(newLocale === 'ar' ? 'rtl' : 'ltr');
    document.body.classList.add(
      newLocale === 'ar' ? 'font-arabic' : 'font-inter'
    );

    // Update URL without page reload
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '') || '/';
    const newPath =
      newLocale === 'ar'
        ? pathWithoutLocale
        : `/${newLocale}${pathWithoutLocale}`;

    window.history.pushState({}, '', newPath);
  };

  return {
    t,
    locale,
    isRTL,
    switchLanguage,
    availableLocales: ['ar', 'fr'] as Locale[],
  };
}
