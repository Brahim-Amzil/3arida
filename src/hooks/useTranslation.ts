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
    'common.home': 'الرئيسية',
    'common.by': 'بواسطة',
    'common.download': ' تحميل الرمز',
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
    'common.getStarted': 'إبدأ الآن',
    'common.signIn': 'تسجيل الدخول',
    'common.morocco': 'المغرب',
    'common.moroccanDirham': 'درهم مغربي',

    // Petitions Page
    'petitions.discoverPetitions': 'إكتشف العرائض',
    'petitions.findAndSupport': 'أعثر على القضايا التي تهمك وادعمها',
    'petitions.startAPetition': 'إبدأ عريضة',
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
    'petitions.goal': 'مُوَجهة لِ',
    'petitions.createdBy': 'أنشأها',
    'petitions.browse': 'تصفح العرائض',
    'petitions.share': 'مشاركة العريضة',
    'petitions.qrCode': ' QR رمز الاستجابة السريعة',
    'petitions.sharingTips': 'نصائح للمشاركة',
    'petitions.sharingTip1': 'أضف رسالة شخصية عند المشاركة',
    'petitions.sharingTip2': 'شارك مع الأصدقاء المهتمين بهذه القضية',
    'petitions.sharingTip3': 'انشر في المجموعات والمجتمعات ذات الصلة',
    'petitions.sharingTip4':
      'استخدم الهاشتاجات ذات الصلة على وسائل التواصل الاجتماعي',
    'petitions.copyLink': 'نسخ الرابط',
    'petitions.copied': 'تم النسخ',
    'petitions.shareOnSocial': 'شارِك العريضة على منصات التواصل الإجتماعي',
    'petitions.shareButton': 'مشاركة',
    'petitions.signaturesCount': 'توقيعات',
    'petitions.startPetition': 'إبدأ عريضة',
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
    'home.categories.subtitle': 'أعثر على العرائض التي تهمك',
    'home.recent.title': 'العرائض الحديثة',
    'home.recent.subtitle': 'أحدث العرائض من المجتمع',
    'home.cta.title': 'مستعد لإحداث فرق؟',
    'home.cta.subtitle':
      'كل تغيير عظيم يبدأ بصوت واحد. إبدأ عريضتك اليوم واحشد الدعم للقضايا التي تهمك.',
    'home.cta.button': 'إبدأ عريضتك الآن',

    // Auth
    'auth.login.title': 'تسجيل الدخول',
    'auth.register.title': 'إنشاء حساب جديد',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل',

    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحبًا، {name}',
    'dashboard.welcomeBack': 'مرحبًا بعودتك، {name}!',
    'dashboard.manageSubtitle': 'إدارة عرائضك وتتبع تقدمها',
    'dashboard.yourPetitions': 'عرائضك',
    'dashboard.mySignatures': 'توقيعاتي',
    'dashboard.appeals': 'الطعون',
    'dashboard.myCampaigns': 'حملاتي',
    'dashboard.newPetition': '+ عريضة جديدة',

    // Dashboard Stats
    'dashboard.stats.totalPetitions': 'إجمالي العرائض',
    'dashboard.stats.activePetitions': 'العرائض النشطة',
    'dashboard.stats.pendingReview': 'في انتظار المراجعة',
    'dashboard.stats.totalSignatures': 'إجمالي التوقيعات',

    // Dashboard Filters
    'dashboard.filter.all': 'الكل',
    'dashboard.filter.active': 'نشطة',
    'dashboard.filter.pending': 'في انتظار المراجعة',
    'dashboard.filter.rejected': 'مرفوضة',
    'dashboard.filter.paused': 'متوقفة',
    'dashboard.filter.deleted': 'محذوفة',
    'dashboard.filter.archived': 'مؤرشفة',

    // Dashboard Empty States
    'dashboard.noPetitions.title': 'لا توجد عرائض بعد',
    'dashboard.noPetitions.description':
      'لم تنشئ أي عرائض بعد. ابدأ عريضتك الأولى لإحداث التغيير!',
    'dashboard.noPetitions.createFirst': 'أنشئ عريضتك الأولى',
    'dashboard.noFilterResults.title': 'لا توجد عرائض {status}',
    'dashboard.noFilterResults.description':
      'ليس لديك أي عرائض {status} في الوقت الحالي.',
    'dashboard.showAllPetitions': 'عرض جميع العرائض',

    // Dashboard Errors
    'dashboard.error.loadPetitions':
      'فشل في تحميل عرائضك. يرجى المحاولة مرة أخرى.',
    'dashboard.tryAgain': 'حاول مرة أخرى',

    // My Signatures Section
    'dashboard.mySignatures.title': 'توقيعاتي',
    'dashboard.mySignatures.count': '{count} عريضة موقعة',
    'dashboard.mySignatures.countSingle': 'عريضة واحدة موقعة',
    'dashboard.mySignatures.trackImpact': 'تتبع تأثيرك',
    'dashboard.mySignatures.trackDescription':
      'هذه هي العرائض التي وقعتها. يمكنك تتبع تقدمها ومشاهدة التحديثات من المنشئين.',
    'dashboard.mySignatures.noSignatures': 'لا توجد توقيعات بعد',
    'dashboard.mySignatures.noSignaturesDesc':
      'لم توقع على أي عرائض بعد. استكشف العرائض وادعم القضايا التي تهمك!',
    'dashboard.mySignatures.discoverPetitions': 'اكتشف العرائض',
    'dashboard.mySignatures.supportMore': 'تريد دعم المزيد من القضايا؟',
    'dashboard.mySignatures.discoverMore': 'اكتشف المزيد من العرائض',
    'dashboard.mySignatures.error':
      'فشل في تحميل العرائض الموقعة. يرجى المحاولة مرة أخرى.',

    // Help Page
    'help.title': 'مركز المساعدة',
    'help.subtitle':
      'أعثر على إجابات للأسئلة الشائعة وتعلم كيفية استخدام عريضة',
    'help.searchPlaceholder': 'ابحث عن مواضيع المساعدة...',
    'help.showingResults': 'عرض النتائج لـ "{query}"',
    'help.clearSearch': 'مسح البحث',

    // Getting Started Section
    'help.gettingStarted.title': 'البدء',
    'help.gettingStarted.createPetition.title': 'كيف أنشئ عريضة؟',
    'help.gettingStarted.createPetition.intro':
      'إنشاء عريضة على عريضة أمر بسيط:',
    'help.gettingStarted.createPetition.step1': 'سجل أو ادخل إلى حسابك',
    'help.gettingStarted.createPetition.step2': 'انقر على زر "إبدأ عريضة"',
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

    // Petition Updates Component
    'updates.title': 'التحديثات',
    'updates.postUpdate': 'نشر تحديث',
    'updates.noUpdates': 'لا توجد تحديثات بعد',
    'updates.noUpdatesCreator': 'انشر أول تحديث لإبقاء المؤيدين على اطلاع',
    'updates.noUpdatesVisitor': 'لم ينشر منشئ العريضة أي تحديثات',
    'updates.updateTitle': 'عنوان التحديث',
    'updates.updateContent': 'محتوى التحديث',
    'updates.titlePlaceholder': 'مثال: وصلنا إلى 1,000 توقيع!',
    'updates.contentPlaceholder': 'شارك التقدم أو الأخبار أو اشكر المؤيدين...',
    'updates.charactersCount': '{count}/1000 حرف',
    'updates.posting': 'جاري النشر...',
    'updates.cancel': 'إلغاء',
    'updates.edit': 'تعديل',
    'updates.delete': 'حذف',
    'updates.save': 'حفظ',
    'updates.saving': 'جاري الحفظ...',
    'updates.saveChanges': 'حفظ التغييرات',
    'updates.editOnce': 'يمكنك تعديل هذا التحديث مرة واحدة فقط',
    'updates.edited': 'تم التعديل',
    'updates.by': 'بواسطة',
    'updates.deleteConfirmTitle': 'حذف التحديث؟',
    'updates.deleteConfirmMessage':
      'هل أنت متأكد من حذف هذا التحديث؟ لا يمكن التراجع عن هذا الإجراء.',
    'updates.deleting': 'جاري الحذف...',
    'updates.fillAllFields': 'يرجى ملء جميع الحقول',
    'updates.mustBeLoggedIn': 'يجب تسجيل الدخول لنشر التحديثات',
    'updates.addFailed': 'فشل إضافة التحديث. يرجى المحاولة مرة أخرى.',
    'updates.updateFailed': 'فشل التحديث. يرجى المحاولة مرة أخرى.',
    'updates.deleteFailed': 'فشل حذف التحديث. يرجى المحاولة مرة أخرى.',

    // Supporters Tab
    'supporters.addComment': 'أضف تعليق',
    'supporters.comments': 'التعليقات',
    'supporters.signatures': 'التوقيعات',

    // Publisher Tab
    'publisher.memberSince': 'عضو منذ',
    'publisher.editBio': 'تعديل السيرة',
    'publisher.aboutPublisher': 'حول الناشر',
    'publisher.noBioYet':
      'لم تضف سيرة ذاتية بعد. انقر على "تعديل السيرة" لإضافة واحدة.',
    'publisher.userNoBio': '{name} لم يضف سيرة ذاتية بعد.',
    'publisher.thisUser': 'هذا المستخدم',
    'publisher.publisherInformation': 'معلومات الناشر',
    'publisher.type': 'النوع',
    'publisher.name': 'الاسم',
    'publisher.petitionDetails': 'تفاصيل العريضة',
    'publisher.addressedTo': 'موجهة إلى',
    'publisher.specificTarget': 'الهدف المحدد',
    'publisher.referenceCode': 'رمز العريضة',
    'publisher.useCodeForSupport': 'استخدم هذا الرمز لاستفسارات الدعم',

    // Supporters Tab (continued)
    'supporters.latest': 'الأحدث',
    'supporters.mostLiked': 'الأكثر إعجاباً',
    'supporters.shareThoughts': 'شارك أفكارك',
    'supporters.whySupport': 'لماذا تدعم هذه العريضة؟',
    'supporters.commentAnonymously': 'علق بشكل مجهول',
    'supporters.posting': 'جاري النشر...',
    'supporters.postComment': 'نشر تعليق',
    'supporters.cancel': 'إلغاء',
    'supporters.joinDiscussion': 'انضم إلى النقاش',
    'supporters.signInToComment': 'سجل الدخول للتعليق',
    'supporters.signInMessage': 'سجل الدخول لمشاركة أفكارك ودعم هذه العريضة.',
    'supporters.noComments': 'لا توجد تعليقات بعد',
    'supporters.noSignatures': 'لا توجد توقيعات بعد',
    'supporters.noActivity': 'لا يوجد نشاط بعد',
    'supporters.firstComment': 'كن أول من يشارك أفكاره حول هذه العريضة.',
    'supporters.firstSignature': 'كن أول من يوقع على هذه العريضة!',
    'supporters.firstSupport': 'كن أول من يدعم هذه العريضة.',
    'supporters.anonymous': 'مجهول',
    'supporters.comment': 'تعليق',
    'supporters.signature': 'توقيع',
    'supporters.reply': 'رد',
    'supporters.delete': 'حذف',
    'supporters.commentDeleted': '[تم حذف التعليق]',
    'supporters.showReplies': 'عرض {count} رد',
    'supporters.hideReplies': 'إخفاء الردود',
    'supporters.replyTo': 'الرد على {name}',
    'supporters.replying': 'جاري الرد...',
    'supporters.postReply': 'نشر الرد',
    'supporters.loadMore': 'تحميل المزيد',
    'supporters.loading': 'جاري التحميل...',

    // Sharing & Promotion Section
    'help.sharing.title': 'المشاركة والترويج',
    'help.sharing.howToShare.title': 'كيف أشارك عريضتي؟',
    'help.sharing.howToShare.intro': 'يمكنك مشاركة عريضتك بطرق متعددة:',
    'help.sharing.howToShare.social':
      'وسائل التواصل الاجتماعي (فيسبوك، تويتر، واتساب)',
    'help.sharing.howToShare.link': 'نسخ الرابط المباشر',
    'help.sharing.howToShare.email': 'مشاركة البريد الإلكتروني',
    'help.sharing.howToShare.qr': ' QR رمز الاستجابة السريعة (تحميل وطباعة)',
    'help.sharing.qrCode.title': 'ما هو رمز الاستجابة السريعة وكيف أستخدمه؟',
    'help.sharing.qrCode.description':
      'رمز الاستجابة السريعة هو رمز قابل للمسح يربط مباشرة بعريضتك. يمكنك تحميله من صفحة عريضتك وطباعته على المنشورات أو الملصقات أو مشاركته رقميًا. يمكن للناس مسحه بكاميرا هاتفهم للوصول الفوري إلى عريضتك.',

    // Privacy & Security Section
    'help.privacy.title': 'الخصوصية والأمان',
    'help.privacy.safe.title': 'هل معلوماتي الشخصية آمنة؟',
    'help.privacy.safe.description':
      'نعم. نستخدم تدابير أمنية معيارية في المجال لحماية بياناتك. بريدك الإلكتروني ورقم هاتفك لا يتم مشاركتهما علنًا أبدًا. فقط اسمك والتعليق الاختياري يظهران عند توقيع عريضة.',
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
    'help.pricing.free.tier1': 'الخطة المجانية: حتى 2,500 توقيع (0 درهم)',
    'help.pricing.free.tier2': 'الخطة الأساسية: حتى 10,000 توقيع (69 درهم)',
    'help.pricing.free.tier3': 'الخطة الاحترافية: حتى 30,000 توقيع (129 درهم)',
    'help.pricing.free.tier4': 'الخطة المتقدمة: حتى 75,000 توقيع (229 درهم)',
    'help.pricing.free.tier5': 'الخطة المؤسسية: حتى 100,000 توقيع (369 درهم)',
    'help.pricing.payment.title': 'ما طرق الدفع التي تقبلونها؟',
    'help.pricing.payment.description':
      'نقبل جميع بطاقات الائتمان والخصم الرئيسية من خلال معالج الدفع الآمن PayPal. جميع المعاملات مشفرة وآمنة.',

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
    'help.contact.link': 'اتصل بنا',
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
      'إبدأ عريضة حول قضية تهمك. أضف التفاصيل والصور وحدد هدف التوقيعات.',
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
    'about.cta.startPetition': 'إبدأ عريضة',
    'about.cta.browsePetitions': 'تصفح العرائض',
    'about.contact.question': 'لديك أسئلة أو تحتاج دعم؟',
    'about.contact.link': 'اتصل بنا',

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
    'footer.copyright': '© 2025 عريضة  / 3arida . جميع الحقوق محفوظة.',

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
      'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى',
    'privacy.contact.link': 'الاتصال بنا',

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
    'terms.contact.content': 'للأسئلة حول شروط الخدمة،',
    'terms.contact.link': 'اتصل بنا',

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
    'cookies.contact.content': 'للأسئلة حول ملفات تعريف الارتباط،',
    'cookies.contact.link': 'اتصل بنا',

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
    'admin.nav.maintenance': 'الصيانة',

    // Admin Users Page
    'admin.users.title': 'إدارة المستخدمين',
    'admin.users.subtitle': 'إدارة حسابات المستخدمين والصلاحيات',
    'admin.users.allUsers': 'جميع المستخدمين',
    'admin.users.active': 'نشطون',
    'admin.users.inactive': 'غير نشطين',
    'admin.users.staff': 'المُشرفون',
    'admin.users.noUsers': 'لا يوجد مستخدمون',
    'admin.users.noUsersDesc':
      'لا يوجد مستخدمون يطابقون معايير التصفية الحالية.',
    'admin.users.joined': 'انضم:',
    'admin.users.lastLogin': 'آخر تسجيل دخول:',
    'admin.users.email': 'البريد الإلكتروني',
    'admin.users.phone': 'الهاتف',
    'admin.users.you': 'أنت',
    'admin.users.activate': 'تفعيل',
    'admin.users.deactivate': 'إلغاء التفعيل',
    'admin.users.promoteToModerator': 'ترقية إلى مشرف',
    'admin.users.demoteToUser': 'تخفيض إلى مستخدم',
    'admin.users.confirmDeactivate':
      'هل أنت متأكد من أنك تريد إلغاء تفعيل هذا المستخدم؟',
    'admin.users.confirmPromote':
      'هل أنت متأكد من أنك تريد ترقية هذا المستخدم إلى مشرف؟',
    'admin.users.confirmDemote':
      'هل أنت متأكد من أنك تريد تخفيض هذا المشرف إلى مستخدم؟',
    'admin.users.failedToLoad': 'فشل في تحميل المستخدمين',
    'admin.users.tryAgain': 'حاول مرة أخرى',
    'admin.users.failedAction':
      'فشل في {action} المستخدم. يرجى المحاولة مرة أخرى.',

    // Admin Moderators Page
    'admin.moderators.title': 'إدارة المشرفين',
    'admin.moderators.subtitle': 'إدارة حسابات المشرفين والصلاحيات',
    'admin.moderators.totalModerators': 'إجمالي المشرفين',
    'admin.moderators.activeModerators': 'المشرفون النشطون',
    'admin.moderators.regularUsers': 'المستخدمون العاديون',
    'admin.moderators.searchPlaceholder':
      'البحث بالاسم أو البريد الإلكتروني...',
    'admin.moderators.currentModerators': 'المشرفون الحاليون',
    'admin.moderators.noModerators': 'لا يوجد مشرفون',
    'admin.moderators.promoteUsersDesc': 'ترقية المستخدمين إلى دور المشرف',
    'admin.moderators.noUsersFound': 'لا يوجد مستخدمون',
    'admin.moderators.showingUsers':
      'عرض 10 من {total} مستخدم. استخدم البحث للعثور على مستخدمين محددين.',
    'admin.moderators.failedToLoad': 'فشل في تحميل المستخدمين',
    'admin.moderators.failedToPromote': 'فشل في ترقية المستخدم إلى مشرف',
    'admin.maintenance.failedToDemote': 'فشل في تخفيض المشرف',

    // Admin Moderator Invitations
    'admin.invitations.title': 'دعوة مشرفين جدد',
    'admin.invitations.subtitle':
      'إرسال دعوات للمشرفين الجدد عبر البريد الإلكتروني',
    'admin.invitations.emailLabel': 'البريد الإلكتروني للمشرف الجديد',
    'admin.invitations.emailPlaceholder': 'أدخل البريد الإلكتروني...',
    'admin.invitations.nameLabel': 'الاسم الكامل (اختياري)',
    'admin.invitations.namePlaceholder': 'أدخل الاسم الكامل...',
    'admin.invitations.sendInvitation': 'إرسال الدعوة',
    'admin.invitations.sending': 'جاري الإرسال...',
    'admin.invitations.success': 'تم إرسال الدعوة بنجاح!',
    'admin.invitations.error': 'فشل في إرسال الدعوة. يرجى المحاولة مرة أخرى.',
    'admin.invitations.invalidEmail': 'يرجى إدخال بريد إلكتروني صحيح',
    'admin.invitations.alreadyExists': 'هذا البريد الإلكتروني مسجل بالفعل',
    'admin.invitations.pendingInvitations': 'الدعوات المعلقة',
    'admin.invitations.noInvitations': 'لا توجد دعوات معلقة',
    'admin.invitations.invitedBy': 'دعا من قبل',
    'admin.invitations.invitedAt': 'تاريخ الدعوة',
    'admin.invitations.resend': 'إعادة إرسال',
    'admin.invitations.cancel': 'إلغاء',

    // Moderator Welcome
    'moderator.welcome.title': 'مرحباً بك كمشرف!',
    'moderator.welcome.subtitle': 'شكراً لقبول دعوة الإشراف على منصة عريضة',
    'moderator.welcome.description':
      'كمشرف، يمكنك الآن مراجعة العرائض، إدارة المستخدمين، والمساعدة في الحفاظ على جودة المحتوى على المنصة.',
    'moderator.welcome.responsibilities': 'مسؤولياتك كمشرف:',
    'moderator.welcome.reviewPetitions':
      '• مراجعة العرائض الجديدة والموافقة عليها أو رفضها',
    'moderator.welcome.manageUsers': '• إدارة المستخدمين وحل النزاعات',
    'moderator.welcome.maintainQuality':
      '• الحفاظ على جودة المحتوى ومعايير المجتمع',
    'moderator.welcome.handleAppeals': '• التعامل مع طعون المستخدمين',
    'moderator.welcome.getStarted': 'ابدأ الإشراف',
    'moderator.welcome.goToDashboard': 'الذهاب إلى لوحة التحكم',
    'moderator.welcome.gettingStarted': 'البدء',
    'moderator.welcome.loggedInReady':
      'أنت مسجل الدخول ومستعد لقبول هذه الدعوة. انقر على الزر أدناه لتصبح مشرفاً.',
    'moderator.welcome.needToLogin':
      'ستحتاج إلى تسجيل الدخول أو إنشاء حساب لقبول دعوة الإشراف هذه.',
    'moderator.welcome.accepting': 'جاري القبول...',
    'moderator.welcome.signInToAccept': 'سجل الدخول للقبول',
    'moderator.welcome.createAccount': 'إنشاء حساب',
    'moderator.welcome.supportContact':
      'إذا كان لديك أي أسئلة حول دورك كمشرف، يرجى الاتصال بفريق الدعم لدينا.',
    'moderator.welcome.invalidInvitation': 'دعوة غير صالحة',
    'moderator.welcome.goToHomepage': 'الذهاب إلى الصفحة الرئيسية',

    // Admin Maintenance Page Details
    'admin.maintenance.userMaintenanceTitle': '👥 صيانة المستخدمين',
    'admin.maintenance.userMaintenanceDesc': 'أدوات ومرافق صيانة المستخدمين.',
    'admin.maintenance.noUserTools':
      'لا توجد أدوات صيانة مستخدمين متاحة حاليًا.',
    'admin.maintenance.backupDatabase': '• نسخ احتياطي من قاعدة البيانات',
    'admin.maintenance.notifyAdmins': '• إشعار المديرين الآخرين',
    'admin.maintenance.checkSystemLoad': '• فحص حمولة النظام',
    'admin.maintenance.reviewDocumentation': '• مراجعة وثائق الأداة',
    'admin.maintenance.verifyResults': '• التحقق من النتائج',
    'admin.maintenance.checkErrors': '• فحص الأخطاء',
    'admin.maintenance.testFunctionality': '• اختبار الوظائف المتأثرة',
    'admin.maintenance.documentChanges': '• توثيق التغييرات المجراة',

    // User Roles
    'admin.roles.admin': 'مدير',
    'admin.roles.moderator': 'مشرف',
    'admin.roles.user': 'مستخدم',

    // User Status
    'admin.userStatus.active': 'نشط',
    'admin.userStatus.inactive': 'غير نشط',

    // Admin Maintenance Page
    'admin.maintenance.title': 'صيانة النظام',
    'admin.maintenance.subtitle': 'أدوات صيانة قاعدة البيانات ومرافق النظام',
    'admin.maintenance.warning': '⚠️ تحذير: أدوات الصيانة',
    'admin.maintenance.warningText':
      'هذه الأدوات تعدل سجلات قاعدة البيانات مباشرة. استخدمها بحذر وفقط عند الضرورة. قم دائماً بنسخ احتياطي من بياناتك قبل تشغيل عمليات الصيانة.',
    'admin.maintenance.dataCleanup': 'أدوات تنظيف البيانات',
    'admin.maintenance.userManagement': 'إدارة المستخدمين',
    'admin.maintenance.systemReports': 'تقارير النظام',
    'admin.maintenance.systemUtilities': 'مرافق النظام',
    'admin.maintenance.guidelines': '📋 إرشادات الصيانة',
    'admin.maintenance.beforeRunning': 'قبل تشغيل الأدوات:',
    'admin.maintenance.afterRunning': 'بعد تشغيل الأدوات:',

    // Petition Moderation
    'admin.moderation.title': 'إدارة العرائض',
    'admin.moderation.subtitle': 'مراجعة وإدارة العرائض على المنصة',
    'admin.moderation.allCategories': 'جميع الفئات',
    'admin.moderation.searchPlaceholder':
      'البحث بالعنوان، الوصف، الفئة، الناشر، أو الرمز العريضةي (مثل: AB1234)',

    // Petition Status Tabs
    'admin.moderation.tabs.allPetitions': 'جميع العرائض',
    'admin.moderation.tabs.pendingReview': 'في انتظار المراجعة',
    'admin.moderation.tabs.approved': 'مقبولة',
    'admin.moderation.tabs.rejected': 'مرفوضة',
    'admin.moderation.tabs.paused': 'متوقفة',
    'admin.moderation.tabs.archived': 'مؤرشفة',
    'admin.moderation.tabs.deleted': 'محذوفة',
    'admin.moderation.tabs.deletionRequests': 'طلبات الحذف',

    // Petition Status Messages
    'admin.moderation.noPetitions': 'لا توجد عرائض تطابق معايير البحث.',
    'admin.moderation.noPendingPetitions': 'لا توجد عرائض في انتظار المراجعة.',
    'admin.moderation.noStatusPetitions': 'لا توجد عرائض {status}.',
    'admin.moderation.noDeletionRequests': 'لا توجد طلبات حذف',
    'admin.moderation.noDeletionRequestsDesc':
      'لا توجد طلبات حذف معلقة في الوقت الحالي.',

    // Petition Creation Form
    'create.title': 'إنشاء عريضة جديدة',
    'create.subtitle': 'إبدأ حملة لإحداث التغيير',
    'create.publisherInformation': 'معلومات الناشر',
    'create.publisherInformationDesc': 'من ينشر هذه العريضة؟',
    'create.petitionDetails': 'تفاصيل العريضة',
    'create.petitionDetailsDesc': 'المعلومات الأساسية حول عريضتك',
    'create.startPetition': 'إبدأ عريضة',
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
    'form.petitionDetails': 'تفاصيل العريضة',
    'form.publishAs': 'نشر العريضة كـ *',
    'form.selectPublisherType': 'اختر نوع الناشر',
    'form.yourName': 'اسمك',
    'form.organizationName': 'اسم المنظمة/الجمعية/المؤسسة',
    'form.enterFullName': 'أدخل اسمك الكامل',
    'form.enterOrganizationName': 'أدخل اسم المنظمة/الجمعية/المؤسسة',
    'form.officialDocument': 'الوثيقة الرسمية *',
    'form.officialDocumentDesc':
      'ارفع وثيقة رسمية عن المنظمة/الجمعية أو المؤسسة التي تمثلها  (PDF، DOC، DOCX، JPG، PNG). الحد الأقصى: 5 ميجابايت',
    'form.petitionType': 'نوع العريضة *',
    'form.selectPetitionType': 'اختر نوع العريضة',
    'form.addressedTo': 'من هو المخاطب بهذه العريضة؟ *',
    'form.selectAddressedTo': 'اختر من توجه إليه هذه العريضة',
    'form.specificName': 'الاسم المحدد لـ {type} *',
    'form.enterSpecificName': 'أدخل الاسم المحدد لـ {type}',

    // Addressed To Type Names (for use in labels)
    'form.governmentType': 'المسؤول / الجهة الحكومية',
    'form.companyType': 'الشركة أو الجهة الخاصة',
    'form.organizationType': 'المنظمة أو الجهة غير الربحية',
    'form.communityType': 'المجتمع / السلطة المحلية',
    'form.individualType': 'الفرد',
    'form.otherType': 'الجهة الأخرى',

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
    'form.chooseFile': 'إختر ملف',
    'form.noFileChosen': 'لم يتم اختيار ملف',
    'form.changeFile': 'تغيير الملف',
    'form.addVideo': 'إضافة فيديو (إ`ختياري)',
    'form.youtubeUrlPlaceholder': 'ألصق رابط فيديو يوتيوب هنا',
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
    'form.change': '🔄 تغيير - طلب تغيير في سياسة أو ممارسة',
    'form.support': '✊ دعم - إظهار الدعم لقضية أو شخص',
    'form.stop': '⛔ إيقاف - منع أو إيقاف إجراء أو قرار',
    'form.start': '🚀 بدء - إطلاق مبادرة أو برنامج جديد',
    'form.accountability':
      '⚖️ مساءلة وعدالة - المطالبة بالمحاسبة أو التحقيق أو تحقيق العدالة',
    'form.awareness':
      '📢 توعية واعتراف - رفع الوعي أو المطالبة بالاعتراف بقضية ما',

    // Petition Type Help Text
    'form.changeHelp':
      'استخدم هذه الفئة إذا كنت تطالب بتعديل سياسة، قانون، إجراء، أو ممارسة قائمة.',
    'form.supportHelp':
      'اختر هذه الفئة لإظهار الدعم أو التضامن مع قضية، مبادرة، أو شخص.',
    'form.stopHelp':
      'مناسبة للعرائض التي تهدف إلى منع أو إيقاف قرار، إجراء، أو حدث قبل وقوعه أو استمراره.',
    'form.startHelp':
      'استخدم هذه الفئة عند المطالبة بإطلاق مبادرة، برنامج، خدمة، أو مشروع جديد.',
    'form.accountabilityHelp':
      'اختر هذه الفئة إذا كانت العريضة تطالب بالتحقيق، المحاسبة، أو اتخاذ إجراءات قانونية عادلة.',
    'form.awarenessHelp':
      'مناسبة للعرائض التي تهدف إلى رفع الوعي، لفت الانتباه، أو المطالبة بالاعتراف الرسمي بقضية ما.',

    'form.government': '🏛️ مسؤول / جهة حكومية',
    'form.company': '🏢 شركة أو جهة خاصة',
    'form.organizationOption': '🏛️ منظمة أو جهة غير ربحية',
    'form.community': '🏘️ مجتمع / سلطة محلية',
    'form.individualOption': '👤 فرد',
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
    'form.selectPetitionTypeError': 'يرجى اختيار نوع العريضة',
    'form.selectAddressedToError': 'يرجى اختيار من توجه إليه هذه العريضة',
    'form.specifyAddressedToError': 'يرجى تحديد {type}',
    'form.selectCategoryError': 'يرجى اختيار فئة العريضة',
    'form.specifyCustomCategoryError': 'يرجى تحديد فئة مخصصة',
    'form.specifyCustomSubcategoryError': 'يرجى تحديد فئة فرعية مخصصة',
    'form.enterTitleError': 'يرجى إدخال عنوان العريضة',
    'form.enterDescriptionError': 'يرجى إدخال وصف العريضة',
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
    'form.validationErrors': 'يرجى تصحيح الأخطاء التالية',

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
    'review.petitionTitle': 'العنوان:',
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
    'pricing.securePayment': '💳 سيتم معالجة الدفع بأمان من خلال PayPal',
    'pricing.moroccanDirham': '🇲🇦 جميع الأسعار بالدرهم المغربي (MAD)',
    'pricing.includes': 'يتضمن:',

    // Pricing Tier Names
    'pricing.tierName.free': 'المجانية',
    'pricing.tierName.starter': 'الأساسية',
    'pricing.tierName.pro': 'الاحترافية',
    'pricing.tierName.advanced': 'المتقدمة',
    'pricing.tierName.enterprise': 'المؤسسية',

    // Pricing Tier Features
    'pricing.tierFeature.upTo2500': 'حتى 2,500 توقيع',
    'pricing.tierFeature.upTo10000': 'حتى 10,000 توقيع',
    'pricing.tierFeature.upTo30000': 'حتى 30,000 توقيع',
    'pricing.tierFeature.upTo75000': 'حتى 75,000 توقيع',
    'pricing.tierFeature.upTo100000': 'حتى 100,000 توقيع',
    'pricing.tierFeature.basicPetitionPage': 'صفحة عريضة أساسية',
    'pricing.tierFeature.emailSharing': 'مشاركة عبر البريد الإلكتروني',
    'pricing.tierFeature.enhancedPetitionPage': 'صفحة عريضة محسنة',
    'pricing.tierFeature.socialMediaSharing':
      'مشاركة عبر وسائل التواصل الاجتماعي',
    'pricing.tierFeature.basicAnalytics': 'تحليلات أساسية',
    'pricing.tierFeature.premiumPetitionPage': 'صفحة عريضة متميزة',
    'pricing.tierFeature.advancedSharing': 'مشاركة متقدمة',
    'pricing.tierFeature.detailedAnalytics': 'تحليلات مفصلة',
    'pricing.tierFeature.prioritySupport': 'دعم ذو أولوية',
    'pricing.tierFeature.advancedAnalytics': 'تحليلات متقدمة',
    'pricing.tierFeature.exportSigneesData': 'تصدير بيانات الموقعين',
    'pricing.tierFeature.featuredListing': 'إدراج مميز',
    'pricing.tierFeature.emailSupport': 'دعم عبر البريد الإلكتروني',
    'pricing.tierFeature.customBranding': 'علامة تجارية مخصصة',
    'pricing.tierFeature.apiAccess': 'وصول API',
    'pricing.tierFeature.dedicatedSupport': 'دعم مخصص',

    // Moroccan Cities
    'city.kingdomOfMorocco': 'المملكة المغربية',
    'city.agadir': 'أكادير',
    'city.alhoceima': 'الحسيمة',
    'city.benimellal': 'بني ملال',
    'city.berkane': 'بركان',
    'city.casablanca': 'الدار البيضاء',
    'city.chefchaouen': 'شفشاون',
    'city.eljadida': 'الجديدة',
    'city.errachidia': 'الراشيدية',
    'city.essaouira': 'الصويرة',
    'city.fez': 'فاس',
    'city.ifrane': 'إفران',
    'city.kenitra': 'القنيطرة',
    'city.khenifra': 'خنيفرة',
    'city.khouribga': 'خريبكة',
    'city.larache': 'العرائش',
    'city.marrakech': 'مراكش',
    'city.meknes': 'مكناس',
    'city.nador': 'الناظور',
    'city.ouarzazate': 'ورزازات',
    'city.oujda': 'وجدة',
    'city.rabat': 'الرباط',
    'city.safi': 'آسفي',
    'city.sale': 'سلا',
    'city.tangier': 'طنجة',
    'city.tetouan': 'تطوان',
    'city.other': 'أخرى',

    // Payment Modal
    'payment.completePayment': 'أكمل دفعتك',
    'payment.payToCreate': 'ادفع لإنشاء عريضتك مع هدف {signatures} توقيع',
    'payment.orderSummary': 'ملخص الطلب',
    'payment.petitionPlan': 'خطة العريضة:',
    'payment.signatureGoal': 'هدف التوقيعات:',
    'payment.petitionTitle': 'عنوان العريضة:',
    'payment.total': 'المجموع:',
    'payment.whatsIncluded': 'المميزات المشمولة',

    // Pricing Features
    'features.upToSignatures': 'حتى {count} توقيع',
    'features.basicPetitionPage': 'صفحة عريضة أساسية',
    'features.enhancedPetitionPage': 'صفحة عريضة محسنة',
    'features.premiumPetitionPage': 'صفحة عريضة متميزة',
    'features.emailSharing': 'مشاركة عبر البريد الإلكتروني',
    'features.socialMediaSharing': 'مشاركة عبر وسائل التواصل الاجتماعي',
    'features.advancedSharing': 'مشاركة متقدمة',
    'features.basicAnalytics': 'تحليلات أساسية',
    'features.detailedAnalytics': 'تحليلات مفصلة',
    'features.prioritySupport': 'دعم أولوية',
    'features.customBranding': 'علامة تجارية مخصصة',
    'features.apiAccess': 'وصول إلى API',

    // Pricing Page
    'pricing.page.title': 'تسعير بسيط وشفاف',
    'pricing.page.subtitle':
      'اختر الخطة المثالية لعريضتك. ابدأ بخطتنا المجانية وقم بالترقية مع نمو حركتك.',
    'pricing.page.plan': 'الخطة',
    'pricing.page.freePlan': 'الخطة المجانية',
    'pricing.page.starterPlan': 'الخطة الأساسية',
    'pricing.page.proPlan': 'الخطة الاحترافية',
    'pricing.page.advancedPlan': 'الخطة المتقدمة',
    'pricing.page.enterprisePlan': 'الخطة المؤسسية',
    'pricing.page.upTo': 'حتى {count}',
    'pricing.page.signatures': 'توقيع',
    'pricing.page.getStartedFree': 'ابدأ مجاناً',
    'pricing.page.chooseThisPlan': 'اختر هذه الخطة',
    'pricing.page.features': 'المميزات',
    'pricing.page.qrCode': 'رمز الاستجابة السريعة QR ',
    'pricing.page.messaging': 'المراسلة (للموقعين)',
    'pricing.page.available': 'متاح',
    'pricing.page.notAvailable': 'غير متاح',
    'pricing.page.includedWithPlan': 'مشمول مع الخطة',
    'pricing.page.notIncluded': 'غير مشمول',
    'pricing.page.optionalAddon': 'إضافة اختيارية: {price} درهم',
    'pricing.page.messagingAddon':
      'إضافة المراسلة: {count} رسائل مقابل {price} درهم',
    'pricing.page.freeMessages':
      '{count} رسائل مجانية + إضافة: {extraCount} رسائل مقابل {price} درهم',
    'pricing.page.readyToStart': 'مستعد لبدء عريضتك مع',

    // Pricing Plan Features
    'pricing.features.createPublish': 'إنشاء ونشر العرائض',
    'pricing.features.basicSharing':
      'أدوات مشاركة أساسية (بريد إلكتروني/وسائل التواصل)',
    'pricing.features.basicAnalytics': 'تحليلات أساسية (المشاهدات، التوقيعات)',
    'pricing.features.publicListing': 'إدراج عام على المنصة',
    'pricing.features.allFreeFeatures': 'جميع مميزات الخطة المجانية',
    'pricing.features.customCoverImage': 'صورة غلاف مخصصة',
    'pricing.features.enhancedSocialSharing': 'مشاركة محسنة عبر وسائل التواصل',
    'pricing.features.basicAnalyticsDashboard': 'لوحة تحليلات أساسية',
    'pricing.features.fasterApproval': 'موافقة أسرع',
    'pricing.features.allStarterFeatures': 'جميع مميزات الخطة الأساسية',
    'pricing.features.regionalTargeting': 'استهداف إقليمي',
    'pricing.features.petitionBranding': 'علامة تجارية للعريضة (شعار، ألوان)',
    'pricing.features.priorityVisibility': 'ظهور أولوي على الصفحة الرئيسية',
    'pricing.features.allProFeatures': 'جميع مميزات الخطة الاحترافية',
    'pricing.features.advancedAnalytics': 'تحليلات متقدمة (ديموغرافيا، مواقع)',
    'pricing.features.exportSigneesData': 'تصدير بيانات الموقعين (CSV)',
    'pricing.features.featuredListing': 'إدراج مميز في صفحات الفئات',
    'pricing.features.emailSupport': 'دعم عبر البريد الإلكتروني',
    'pricing.features.allAdvancedFeatures': 'جميع مميزات الخطة المتقدمة',
    'pricing.features.apiAccess': 'وصول API',
    'pricing.features.customDomain': 'خيار نطاق مخصص',
    'pricing.features.dedicatedSupport': 'فريق دعم مخصص',
    'pricing.features.organizationBadge': 'شارة تحقق المنظمة',
    'pricing.features.highestVisibility': 'أعلى ظهور على المنصة',

    // Enterprise Contact
    'pricing.enterprise.title': 'تتوقع أكثر من 100 ألف توقيع؟',
    'pricing.enterprise.description':
      'نقدم خطط مؤسسات مخصصة مع دعم مخصص، وضمانات SLA، وأسعار حسب الحجم.',
    'pricing.enterprise.cta': 'اتصل بنا',

    'payment.testCard': 'بطاقة اختبار (وضع التطوير)',
    'payment.testCardNumber': 'رقم البطاقة: 4242 4242 4242 4242',
    'payment.testExpiry': 'تاريخ الانتهاء: أي تاريخ مستقبلي (مثل 12/25)',
    'payment.testCvc': 'رمز الأمان: أي 3 أرقام (مثل 123)',
    'payment.secureProcessing': '🔒 دفع آمن معالج بواسطة PayPal',
    'payment.backToReview': 'العودة إلى المراجعة',
    'payment.loadingPaymentSystem': 'جاري تحميل نظام الدفع...',
    'payment.paymentSystemError': '❌ خطأ في نظام الدفع',
    'payment.paymentNotAvailable': 'نظام الدفع غير متاح',
    'payment.goBack': 'العودة',
    'payment.cardInformation': 'معلومات البطاقة',
    'payment.cardValid': 'البطاقة صالحة',
    'payment.processing': 'جاري المعالجة...',
    'payment.paymentInfo': 'معلومات الدفع',
    'payment.paypalSupportsCards':
      'يدعم PayPal جميع بطاقات الائتمان والخصم الرئيسية',
    'payment.paypalSupportsAccount':
      'يمكنك الدفع باستخدام حساب PayPal الخاص بك',
    'payment.securePayment': 'معاملات آمنة ومشفرة',
    'payment.currencyDisclosure':
      'السعر الثابت: {mad} درهم مغربي (حوالي ${usd} دولار أمريكي)',
    'payment.currencyNote':
      'يتم احتساب المبلغ النهائي وفق سعر الصرف المعتمد من PayPal. قد يختلف المبلغ المحمل قليلاً بناءً على سعر الصرف.',
    'payment.noRefunds':
      'نظرًا لطبيعة الخدمة الرقمية، لا يتم تقديم أي استرداد للمبالغ المدفوعة بعد إتمام عملية الدفع.',

    // Success Page
    'success.paymentSuccessful': 'تم إنشاء العريضة بنجاح!',
    'success.petitionCreated': 'تم إنشاء العريضة بنجاح!',
    'success.petitionPublished': 'تم إنشاء العريضة بنجاح!',
    'success.paymentSuccessMessage':
      ' ستكون متاحة للتوقيع بمجرد موافقة المشرفين خلال بضع دقائق.',
    'success.needsPaymentMessage':
      'تم إنشاء عريضتك بنجاح. أكمل الدفع لإرسالها للمراجعة.',
    'success.publishedMessage':
      'تم إنشاء عريضتك بنجاح!\nستكون متاحة للتوقيع بمجرد موافقة المشرفين خلال 24-48 ساعة.',
    'success.completePayment': 'إكمال الدفع',
    'success.viewPetition': 'عرض العريضة',
    'success.browsePetitions': 'تصفح العرائض',
    'success.whatsNext': 'ما التالي؟',
    'success.petitionUnderReview': '• عريضتك قيد المراجعة من قبل المشرفين',
    'success.approvalTimeframe': '• ستتم الموافقة خلال 24-48 ساعة',
    'success.notificationOnApproval':
      '• ستتلقى إشعارًا عند الموافقة على العريضة',
    'success.shareWithFriends': '• شارك عريضتك مع الأصدقاء والعائلة',
    'success.promoteOnSocial': '• روج لها على وسائل التواصل الاجتماعي',
    'success.monitorSignatures': '• راقب التوقيعات والتفاعل',
    'success.respondToComments': '• رد على التعليقات والمؤيدين',
    'success.completePaymentStep': '• أكمل الدفع لإرسال عريضتك للمراجعة',

    // Tips for Success
    'tips.title': '💡 نصائح لإنجاح عريضتك',
    'tips.clearTitle': 'أكتب عنوانًا واضحًا ومقنعًا يعبّر عن قضيتك مباشرة',
    'tips.explainWhy':
      'إشرح المشكلة بوضوح ولماذا تهم الناس، وما التغيير الذي تطالب به',
    'tips.realisticGoal': 'حدّد هدف توقيعات واقعي للمرحلة الأولى',
    'tips.addMedia': 'أضف صورًا و مقطع فيديو لدعم قصتك وجعلها أكثر تأثيرًا',
    'tips.shareWithFriends':
      'شارك عريضتك مع الأصدقاء والعائلة أولًا للحصول على دعم مبكر',
    'tips.shareOnSocial':
      'أنشر العريضة على وسائل التواصل الاجتماعي (فيسبوك، واتساب، إنستغرام، تويتر) للوصول إلى أكبر عدد ممكن',
    'tips.updatePetition':
      'حدّث العريضة وشارك تطوراتها لإبقاء الداعمين متفاعلين',
    'tips.successStory':
      '⭐  العرائض الناجحة تبدأ بدعم بسيط… ثم تنتشر وتكبر مع المشاركة.',

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
    'petition.target': 'مُوَجهة لِ',
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
    'button.getStarted': 'إبدأ الآن',
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
    'stats.goal': 'مُوَجهة لِ',
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

    // Admin Action Buttons
    'admin.actions.approve': 'قبول',
    'admin.actions.reject': 'رفض',
    'admin.actions.pause': 'إيقاف',
    'admin.actions.delete': 'حذف',
    'admin.actions.review': 'مراجعة',
    'admin.actions.approving': 'جاري القبول...',
    'admin.actions.rejecting': 'جاري الرفض...',
    'admin.actions.pausing': 'جاري الإيقاف...',
    'admin.actions.deleting': 'جاري الحذف...',
    'admin.actions.processing': 'جاري المعالجة...',

    // Admin Confirmation Messages
    'admin.confirm.approve': 'هل أنت متأكد من أنك تريد قبول هذه العريضة؟',
    'admin.confirm.reject': 'هل أنت متأكد من أنك تريد رفض هذه العريضة؟',
    'admin.confirm.pause': 'هل أنت متأكد من أنك تريد إيقاف هذه العريضة؟',
    'admin.confirm.delete': 'هل أنت متأكد من أنك تريد حذف هذه العريضة؟',

    // Admin Reason Prompts
    'admin.reason.delete': 'سبب الحذف (مطلوب):',
    'admin.reason.approve': 'سبب القبول (اختياري):',
    'admin.reason.reject': 'سبب الرفض (اختياري):',
    'admin.reason.pause': 'سبب الإيقاف (اختياري):',
    'admin.reason.required': 'السبب مطلوب للحذف.',

    // Admin Success Messages
    'admin.success.approved': 'تم قبول العريضة بنجاح!',
    'admin.success.rejected': 'تم رفض العريضة بنجاح!',
    'admin.success.paused': 'تم إيقاف العريضة بنجاح!',
    'admin.success.deleted': 'تم حذف العريضة بنجاح!',

    // Admin Error Messages
    'admin.error.approving': 'خطأ في قبول العريضة. يرجى المحاولة مرة أخرى.',
    'admin.error.rejecting': 'خطأ في رفض العريضة. يرجى المحاولة مرة أخرى.',
    'admin.error.pausing': 'خطأ في إيقاف العريضة. يرجى المحاولة مرة أخرى.',
    'admin.error.deleting': 'خطأ في حذف العريضة. يرجى المحاولة مرة أخرى.',

    // Appeals Page
    'appeals.title': 'إدارة الطعون',
    'appeals.subtitle': 'مراجعة والرد على طعون منشئي العرائض',
    'appeals.totalAppeals': 'إجمالي الطعون',
    'appeals.pending': 'في الانتظار',
    'appeals.inProgress': 'قيد المعالجة',
    'appeals.resolved': 'محلولة',
    'appeals.rejected': 'مرفوضة',
    'appeals.filterByStatus': 'تصفية حسب الحالة',
    'appeals.search': 'بحث',
    'appeals.searchPlaceholder':
      'البحث بعنوان العريضة، اسم المنشئ، أو معرف الطعن...',
    'appeals.appealsCount': 'الطعون ({count})',
    'appeals.noAppealsFound': 'لا توجد طعون',
    'appeals.noAppealsMessage': 'ستظهر الطعون هنا عندما يقدمها المنشئون',
    'appeals.tryChangingFilter': 'جرب تغيير المرشح',
    'appeals.creator': 'المنشئ:',
    'appeals.appealId': 'معرف الطعن:',
    'appeals.messages': 'رسائل',
    'appeals.needsResponse': 'يحتاج رد',
    'appeals.showingResults': 'عرض {start} إلى {end} من {total} طعون',
    'appeals.previous': 'السابق',
    'appeals.next': 'التالي',
    'appeals.tryAgain': 'حاول مرة أخرى',
    'appeals.failedToLoad': 'فشل في تحميل الطعون',

    // Appeals Status Labels
    'appeals.status.pending': 'في الانتظار',
    'appeals.status.inProgress': 'قيد المعالجة',
    'appeals.status.resolved': 'محلولة',
    'appeals.status.rejected': 'مرفوضة',

    // Appeals Filter Buttons
    'appeals.filter.all': 'الكل ({count})',
    'appeals.filter.pending': 'في الانتظار ({count})',
    'appeals.filter.inProgress': 'قيد المعالجة ({count})',
    'appeals.filter.resolved': 'محلولة ({count})',
    'appeals.filter.rejected': 'مرفوضة ({count})',

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
    'categories.healthcare': 'الرعاية الصحية',
    'categories.infrastructure': 'البنية التحتية',
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

    // Notifications
    'notifications.title': 'الإشعارات',
    'notifications.markAllRead': 'تحديد الكل كمقروء',
    'notifications.loading': 'جاري تحميل الإشعارات...',
    'notifications.noNotifications': 'لا توجد إشعارات',
    'notifications.allCaughtUp': 'أنت محدث بكل شيء!',
    'notifications.viewAll': 'عرض جميع الإشعارات',
    'notifications.justNow': 'الآن',
    'notifications.minutesAgo': 'منذ {count} دقيقة',
    'notifications.hoursAgo': 'منذ {count} ساعة',
    'notifications.daysAgo': 'منذ {count} يوم',
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
    'common.home': 'Accueil',
    'common.by': 'Par',
    'common.download': 'Télécharger',
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
    'common.morocco': 'Maroc',
    'common.moroccanDirham': 'Dirham marocain',

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
    'petitions.share': 'Partager la pétition',
    'petitions.qrCode': 'Code QR',
    'petitions.sharingTips': 'Conseils de partage',
    'petitions.sharingTip1': 'Ajoutez un message personnel lors du partage',
    'petitions.sharingTip2':
      'Partagez avec des amis qui se soucient de cette cause',
    'petitions.sharingTip3':
      'Publiez dans des groupes et communautés pertinents',
    'petitions.sharingTip4':
      'Utilisez des hashtags pertinents sur les réseaux sociaux',
    'petitions.copyLink': 'Copier le lien',
    'petitions.copied': 'Copié',
    'petitions.shareOnSocial': 'Partager sur les réseaux sociaux',
    'petitions.shareButton': 'Partager',
    'petitions.signaturesCount': 'signatures',
    'petitions.startPetition': 'Commencer une pétition',

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
    'dashboard.welcomeBack': 'Bon retour, {name} !',
    'dashboard.manageSubtitle':
      'Gérez vos pétitions et suivez leur progression',
    'dashboard.yourPetitions': 'Vos pétitions',
    'dashboard.mySignatures': 'Mes signatures',
    'dashboard.appeals': 'Appels',
    'dashboard.myCampaigns': 'Mes campagnes',
    'dashboard.newPetition': '+ Nouvelle pétition',

    // Dashboard Stats
    'dashboard.stats.totalPetitions': 'Total des pétitions',
    'dashboard.stats.activePetitions': 'Pétitions actives',
    'dashboard.stats.pendingReview': 'En attente de révision',
    'dashboard.stats.totalSignatures': 'Total des signatures',

    // Dashboard Filters
    'dashboard.filter.all': 'Toutes',
    'dashboard.filter.active': 'Actives',
    'dashboard.filter.pending': 'En attente de révision',
    'dashboard.filter.rejected': 'Rejetées',
    'dashboard.filter.paused': 'En pause',
    'dashboard.filter.deleted': 'Supprimées',

    // Dashboard Empty States
    'dashboard.noPetitions.title': 'Aucune pétition pour le moment',
    'dashboard.noPetitions.description':
      "Vous n'avez pas encore créé de pétitions. Commencez votre première pétition pour faire le changement !",
    'dashboard.noPetitions.createFirst': 'Créez votre première pétition',
    'dashboard.noFilterResults.title': 'Aucune pétition {status}',
    'dashboard.noFilterResults.description':
      "Vous n'avez aucune pétition {status} pour le moment.",
    'dashboard.showAllPetitions': 'Afficher toutes les pétitions',

    // Dashboard Errors
    'dashboard.error.loadPetitions':
      'Échec du chargement de vos pétitions. Veuillez réessayer.',
    'dashboard.tryAgain': 'Réessayer',

    // My Signatures Section
    'dashboard.mySignatures.title': 'Mes signatures',
    'dashboard.mySignatures.count': '{count} pétitions signées',
    'dashboard.mySignatures.countSingle': '1 pétition signée',
    'dashboard.mySignatures.trackImpact': 'Suivez votre impact',
    'dashboard.mySignatures.trackDescription':
      'Voici les pétitions que vous avez signées. Vous pouvez suivre leur progression et voir les mises à jour des créateurs.',
    'dashboard.mySignatures.noSignatures': 'Aucune signature pour le moment',
    'dashboard.mySignatures.noSignaturesDesc':
      "Vous n'avez pas encore signé de pétitions. Explorez les pétitions et soutenez les causes qui vous importent !",
    'dashboard.mySignatures.discoverPetitions': 'Découvrir les pétitions',
    'dashboard.mySignatures.supportMore':
      'Vous voulez soutenir plus de causes ?',
    'dashboard.mySignatures.discoverMore': 'Découvrir plus de pétitions',
    'dashboard.mySignatures.error':
      'Échec du chargement des pétitions signées. Veuillez réessayer.',

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

    // Petition Updates Component
    'updates.title': 'Mises à jour',
    'updates.postUpdate': 'Publier une mise à jour',
    'updates.noUpdates': 'Aucune mise à jour pour le moment',
    'updates.noUpdatesCreator':
      'Publiez votre première mise à jour pour tenir les supporters informés',
    'updates.noUpdatesVisitor':
      "Le créateur de la pétition n'a publié aucune mise à jour",
    'updates.updateTitle': 'Titre de la mise à jour',
    'updates.updateContent': 'Contenu de la mise à jour',
    'updates.titlePlaceholder': 'ex: Nous avons atteint 1 000 signatures !',
    'updates.contentPlaceholder':
      'Partagez les progrès, les nouvelles ou remerciez les supporters...',
    'updates.charactersCount': '{count}/1000 caractères',
    'updates.posting': 'Publication...',
    'updates.cancel': 'Annuler',
    'updates.edit': 'Modifier',
    'updates.delete': 'Supprimer',
    'updates.save': 'Enregistrer',
    'updates.saving': 'Enregistrement...',
    'updates.saveChanges': 'Enregistrer les modifications',
    'updates.editOnce':
      "Vous ne pouvez modifier cette mise à jour qu'une seule fois",
    'updates.edited': 'Modifié',
    'updates.by': 'par',
    'updates.deleteConfirmTitle': 'Supprimer la mise à jour ?',
    'updates.deleteConfirmMessage':
      'Êtes-vous sûr de vouloir supprimer cette mise à jour ? Cette action ne peut pas être annulée.',
    'updates.deleting': 'Suppression...',
    'updates.fillAllFields': 'Veuillez remplir tous les champs',
    'updates.mustBeLoggedIn':
      'Vous devez être connecté pour publier des mises à jour',
    'updates.addFailed':
      "Échec de l'ajout de la mise à jour. Veuillez réessayer.",
    'updates.updateFailed': 'Échec de la mise à jour. Veuillez réessayer.',
    'updates.deleteFailed':
      'Échec de la suppression de la mise à jour. Veuillez réessayer.',

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
    'help.pricing.free.tier1':
      "Plan Gratuit : Jusqu'à 2 500 signatures (0 MAD)",
    'help.pricing.free.tier2':
      "Plan Débutant : Jusqu'à 10 000 signatures (69 MAD)",
    'help.pricing.free.tier3': "Plan Pro : Jusqu'à 30 000 signatures (129 MAD)",
    'help.pricing.free.tier4':
      "Plan Avancé : Jusqu'à 75 000 signatures (229 MAD)",
    'help.pricing.free.tier5':
      "Plan Entreprise : Jusqu'à 100 000 signatures (369 MAD)",
    'help.pricing.payment.title': 'Quels modes de paiement acceptez-vous ?',
    'help.pricing.payment.description':
      'Nous acceptons toutes les principales cartes de crédit et de débit via notre processeur de paiement sécurisé PayPal. Toutes les transactions sont cryptées et sécurisées.',

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
    'help.contact.link': 'Contactez-nous',
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
    'about.contact.link': 'Contactez-nous',

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
      'Si vous avez des questions concernant cette politique de confidentialité, veuillez',
    'privacy.contact.link': 'nous contacter',

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
      "Pour des questions sur les conditions d'utilisation,",
    'terms.contact.link': 'contactez-nous',

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
    'cookies.contact.content': 'Pour des questions sur les cookies,',
    'cookies.contact.link': 'contactez-nous',

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
    'admin.nav.maintenance': 'Maintenance',

    // Admin Users Page
    'admin.users.title': 'Gestion des utilisateurs',
    'admin.users.subtitle': 'Gérer les comptes utilisateurs et les permissions',
    'admin.users.allUsers': 'Tous les utilisateurs',
    'admin.users.active': 'Actifs',
    'admin.users.inactive': 'Inactifs',
    'admin.users.staff': 'Personnel',
    'admin.users.noUsers': 'Aucun utilisateur trouvé',
    'admin.users.noUsersDesc':
      'Aucun utilisateur ne correspond aux critères de filtre actuels.',
    'admin.users.joined': 'Rejoint :',
    'admin.users.lastLogin': 'Dernière connexion :',
    'admin.users.email': 'E-mail',
    'admin.users.phone': 'Téléphone',
    'admin.users.you': 'Vous',
    'admin.users.activate': 'Activer',
    'admin.users.deactivate': 'Désactiver',
    'admin.users.promoteToModerator': 'Promouvoir en modérateur',
    'admin.users.demoteToUser': 'Rétrograder en utilisateur',
    'admin.users.confirmDeactivate':
      'Êtes-vous sûr de vouloir désactiver cet utilisateur ?',
    'admin.users.confirmPromote':
      'Êtes-vous sûr de vouloir promouvoir cet utilisateur en modérateur ?',
    'admin.users.confirmDemote':
      'Êtes-vous sûr de vouloir rétrograder ce modérateur en utilisateur ?',
    'admin.users.failedToLoad': 'Échec du chargement des utilisateurs',
    'admin.users.tryAgain': 'Réessayer',
    'admin.users.failedAction':
      "Échec de {action} l'utilisateur. Veuillez réessayer.",

    // Admin Moderators Page
    'admin.moderators.title': 'Gestion des modérateurs',
    'admin.moderators.subtitle':
      'Gérer les comptes modérateurs et les permissions',
    'admin.moderators.totalModerators': 'Total des modérateurs',
    'admin.moderators.activeModerators': 'Modérateurs actifs',
    'admin.moderators.regularUsers': 'Utilisateurs réguliers',
    'admin.moderators.searchPlaceholder': 'Rechercher par nom ou e-mail...',
    'admin.moderators.currentModerators': 'Modérateurs actuels',
    'admin.moderators.noModerators': 'Aucun modérateur trouvé',
    'admin.moderators.promoteUsersDesc':
      'Promouvoir les utilisateurs au rôle de modérateur',
    'admin.moderators.noUsersFound': 'Aucun utilisateur trouvé',
    'admin.moderators.showingUsers':
      'Affichage de 10 sur {total} utilisateurs. Utilisez la recherche pour trouver des utilisateurs spécifiques.',
    'admin.moderators.failedToLoad': 'Échec du chargement des utilisateurs',
    'admin.moderators.failedToPromote':
      "Échec de la promotion de l'utilisateur en modérateur",
    'admin.moderators.failedToDemote':
      'Échec de la rétrogradation du modérateur',

    // Admin Moderator Invitations
    'admin.invitations.title': 'Inviter de nouveaux modérateurs',
    'admin.invitations.subtitle':
      'Envoyer des invitations aux nouveaux modérateurs par e-mail',
    'admin.invitations.emailLabel': 'E-mail du nouveau modérateur',
    'admin.invitations.emailPlaceholder': "Entrez l'e-mail...",
    'admin.invitations.nameLabel': 'Nom complet (optionnel)',
    'admin.invitations.namePlaceholder': 'Entrez le nom complet...',
    'admin.invitations.sendInvitation': "Envoyer l'invitation",
    'admin.invitations.sending': 'Envoi en cours...',
    'admin.invitations.success': 'Invitation envoyée avec succès !',
    'admin.invitations.error':
      "Échec de l'envoi de l'invitation. Veuillez réessayer.",
    'admin.invitations.invalidEmail': 'Veuillez entrer un e-mail valide',
    'admin.invitations.alreadyExists': 'Cet e-mail est déjà enregistré',
    'admin.invitations.pendingInvitations': 'Invitations en attente',
    'admin.invitations.noInvitations': 'Aucune invitation en attente',
    'admin.invitations.invitedBy': 'Invité par',
    'admin.invitations.invitedAt': "Date d'invitation",
    'admin.invitations.resend': 'Renvoyer',
    'admin.invitations.cancel': 'Annuler',

    // Moderator Welcome
    'moderator.welcome.title': 'Bienvenue en tant que modérateur !',
    'moderator.welcome.subtitle':
      "Merci d'avoir accepté l'invitation de modération sur la plateforme 3arida",
    'moderator.welcome.description':
      'En tant que modérateur, vous pouvez maintenant examiner les pétitions, gérer les utilisateurs et aider à maintenir la qualité du contenu sur la plateforme.',
    'moderator.welcome.responsibilities':
      'Vos responsabilités en tant que modérateur :',
    'moderator.welcome.reviewPetitions':
      '• Examiner les nouvelles pétitions et les approuver ou les rejeter',
    'moderator.welcome.manageUsers':
      '• Gérer les utilisateurs et résoudre les conflits',
    'moderator.welcome.maintainQuality':
      '• Maintenir la qualité du contenu et les normes de la communauté',
    'moderator.welcome.handleAppeals': '• Traiter les appels des utilisateurs',
    'moderator.welcome.getStarted': 'Commencer la modération',
    'moderator.welcome.goToDashboard': 'Aller au tableau de bord',
    'moderator.welcome.gettingStarted': 'Commencer',
    'moderator.welcome.loggedInReady':
      'Vous êtes connecté et prêt à accepter cette invitation. Cliquez sur le bouton ci-dessous pour devenir modérateur.',
    'moderator.welcome.needToLogin':
      'Vous devrez vous connecter ou créer un compte pour accepter cette invitation de modération.',
    'moderator.welcome.accepting': 'Acceptation en cours...',
    'moderator.welcome.signInToAccept': 'Se connecter pour accepter',
    'moderator.welcome.createAccount': 'Créer un compte',
    'moderator.welcome.supportContact':
      'Si vous avez des questions sur votre rôle de modérateur, veuillez contacter notre équipe de support.',
    'moderator.welcome.invalidInvitation': 'Invitation invalide',
    'moderator.welcome.goToHomepage': "Aller à la page d'accueil",

    // Admin Maintenance Page Details
    'admin.maintenance.userMaintenanceTitle': '👥 Maintenance des utilisateurs',
    'admin.maintenance.userMaintenanceDesc':
      'Outils et utilitaires de maintenance des utilisateurs.',
    'admin.maintenance.noUserTools':
      'Aucun outil de maintenance utilisateur actuellement disponible.',
    'admin.maintenance.backupDatabase': '• Sauvegarder votre base de données',
    'admin.maintenance.notifyAdmins': '• Notifier les autres administrateurs',
    'admin.maintenance.checkSystemLoad': '• Vérifier la charge système',
    'admin.maintenance.reviewDocumentation':
      "• Examiner la documentation de l'outil",
    'admin.maintenance.verifyResults': '• Vérifier les résultats',
    'admin.maintenance.checkErrors': '• Vérifier les erreurs',
    'admin.maintenance.testFunctionality':
      '• Tester les fonctionnalités affectées',
    'admin.maintenance.documentChanges':
      '• Documenter les changements effectués',

    // User Roles
    'admin.roles.admin': 'Administrateur',
    'admin.roles.moderator': 'Modérateur',
    'admin.roles.user': 'Utilisateur',

    // User Status
    'admin.userStatus.active': 'Actif',
    'admin.userStatus.inactive': 'Inactif',

    // Admin Maintenance Page
    'admin.maintenance.title': 'Maintenance du système',
    'admin.maintenance.subtitle':
      'Outils de maintenance de base de données et utilitaires système',
    'admin.maintenance.warning': '⚠️ Attention : Outils de maintenance',
    'admin.maintenance.warningText':
      "Ces outils modifient directement les enregistrements de la base de données. Utilisez avec prudence et seulement si nécessaire. Sauvegardez toujours vos données avant d'exécuter des opérations de maintenance.",
    'admin.maintenance.dataCleanup': 'Outils de nettoyage des données',
    'admin.maintenance.userManagement': 'Gestion des utilisateurs',
    'admin.maintenance.systemReports': 'Rapports système',
    'admin.maintenance.systemUtilities': 'Utilitaires système',
    'admin.maintenance.guidelines': '📋 Directives de maintenance',
    'admin.maintenance.beforeRunning': "Avant d'exécuter les outils :",
    'admin.maintenance.afterRunning': 'Après avoir exécuté les outils :',

    // Petition Moderation
    'admin.moderation.title': 'Modération des pétitions',
    'admin.moderation.subtitle':
      'Examiner et gérer les pétitions sur la plateforme',
    'admin.moderation.allCategories': 'Toutes les catégories',
    'admin.moderation.searchPlaceholder':
      'Rechercher par titre, description, catégorie, éditeur ou code de référence (ex: AB1234)',

    // Petition Status Tabs
    'admin.moderation.tabs.allPetitions': 'Toutes les pétitions',
    'admin.moderation.tabs.pendingReview': 'En attente de révision',
    'admin.moderation.tabs.approved': 'Approuvées',
    'admin.moderation.tabs.rejected': 'Rejetées',
    'admin.moderation.tabs.paused': 'En pause',
    'admin.moderation.tabs.archived': 'Archivées',
    'admin.moderation.tabs.deleted': 'Supprimées',
    'admin.moderation.tabs.deletionRequests': 'Demandes de suppression',

    // Petition Status Messages
    'admin.moderation.noPetitions':
      'Aucune pétition ne correspond à vos critères de recherche.',
    'admin.moderation.noPendingPetitions':
      'Aucune pétition en attente de révision.',
    'admin.moderation.noStatusPetitions': 'Aucune pétition {status} trouvée.',
    'admin.moderation.noDeletionRequests': 'Aucune demande de suppression',
    'admin.moderation.noDeletionRequestsDesc':
      "Il n'y a aucune demande de suppression en attente pour le moment.",

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
    'form.petitionDetails': 'Détails de la pétition',
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

    // Addressed To Type Names (for use in labels)
    'form.governmentType': "l'officiel / l'agence gouvernementale",
    'form.companyType': "l'entreprise ou l'entité privée",
    'form.organizationType': "l'organisation ou l'entité à but non lucratif",
    'form.communityType': "la communauté / l'autorité locale",
    'form.individualType': "l'individu",
    'form.otherType': "l'autre entité",

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
    'form.chooseFile': 'Choisir un fichier',
    'form.noFileChosen': 'Aucun fichier choisi',
    'form.changeFile': 'Changer le fichier',
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
    'form.stop': '⛔ Arrêter - Empêcher ou arrêter une action ou une décision',
    'form.start': '🚀 Commencer - Lancer une nouvelle initiative ou programme',
    'form.accountability':
      '⚖️ Responsabilité et justice - Demander des comptes, une enquête ou la justice',
    'form.awareness':
      "📢 Sensibilisation et reconnaissance - Sensibiliser ou demander la reconnaissance d'une cause",

    // Petition Type Help Text
    'form.changeHelp':
      "Utilisez cette catégorie si vous demandez la modification d'une politique, loi, procédure ou pratique existante.",
    'form.supportHelp':
      'Choisissez cette catégorie pour montrer votre soutien ou solidarité avec une cause, initiative ou personne.',
    'form.stopHelp':
      "Approprié pour les pétitions visant à empêcher ou arrêter une décision, action ou événement avant qu'il ne se produise ou ne continue.",
    'form.startHelp':
      "Utilisez cette catégorie pour demander le lancement d'une nouvelle initiative, programme, service ou projet.",
    'form.accountabilityHelp':
      'Choisissez cette catégorie si la pétition demande une enquête, des comptes ou des actions juridiques justes.',
    'form.awarenessHelp':
      "Approprié pour les pétitions visant à sensibiliser, attirer l'attention ou demander la reconnaissance officielle d'une cause.",

    'form.government': '🏛️ Officiel / Agence gouvernementale',
    'form.company': '🏢 Entreprise ou entité privée',
    'form.organizationOption': '🏛️ Organisation ou entité à but non lucratif',
    'form.community': '🏘️ Communauté / Autorité locale',
    'form.individualOption': '👤 Individu',
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
    'form.selectPetitionTypeError': 'Veuillez sélectionner le type de pétition',
    'form.selectAddressedToError':
      'Veuillez sélectionner à qui cette pétition est adressée',
    'form.specifyAddressedToError': 'Veuillez spécifier le {type}',
    'form.selectCategoryError':
      'Veuillez sélectionner la catégorie de la pétition',
    'form.specifyCustomCategoryError':
      'Veuillez spécifier une catégorie personnalisée',
    'form.specifyCustomSubcategoryError':
      'Veuillez spécifier une sous-catégorie personnalisée',
    'form.enterTitleError': 'Veuillez entrer le titre de la pétition',
    'form.enterDescriptionError':
      'Veuillez entrer la description de la pétition',
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
    'form.validationErrors': 'Veuillez corriger les erreurs suivantes',

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
    'review.petitionTitle': 'Titre :',
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
      '💳 Le paiement sera traité en toute sécurité via PayPal',
    'pricing.moroccanDirham': '🇲🇦 Tous les prix sont en Dirham marocain (MAD)',
    'pricing.includes': 'Comprend :',

    // Pricing Tier Names
    'pricing.tierName.free': 'Gratuite',
    'pricing.tierName.starter': 'Démarrage',
    'pricing.tierName.pro': 'Pro',
    'pricing.tierName.advanced': 'Avancée',
    'pricing.tierName.enterprise': 'Entreprise',

    // Pricing Tier Features
    'pricing.tierFeature.upTo2500': "Jusqu'à 2 500 signatures",
    'pricing.tierFeature.upTo10000': "Jusqu'à 10 000 signatures",
    'pricing.tierFeature.upTo30000': "Jusqu'à 30 000 signatures",
    'pricing.tierFeature.upTo75000': "Jusqu'à 75 000 signatures",
    'pricing.tierFeature.upTo100000': "Jusqu'à 100 000 signatures",
    'pricing.tierFeature.basicPetitionPage': 'Page de pétition basique',
    'pricing.tierFeature.emailSharing': 'Partage par e-mail',
    'pricing.tierFeature.enhancedPetitionPage': 'Page de pétition améliorée',
    'pricing.tierFeature.socialMediaSharing': 'Partage sur les réseaux sociaux',
    'pricing.tierFeature.basicAnalytics': 'Analyses de base',
    'pricing.tierFeature.premiumPetitionPage': 'Page de pétition premium',
    'pricing.tierFeature.advancedSharing': 'Partage avancé',
    'pricing.tierFeature.detailedAnalytics': 'Analyses détaillées',
    'pricing.tierFeature.prioritySupport': 'Support prioritaire',
    'pricing.tierFeature.advancedAnalytics': 'Analyses avancées',
    'pricing.tierFeature.exportSigneesData':
      'Exportation des données des signataires',
    'pricing.tierFeature.featuredListing': 'Liste en vedette',
    'pricing.tierFeature.emailSupport': 'Support par e-mail',
    'pricing.tierFeature.customBranding': 'Marque personnalisée',
    'pricing.tierFeature.apiAccess': 'Accès API',
    'pricing.tierFeature.dedicatedSupport': 'Support dédié',

    // Moroccan Cities
    'city.kingdomOfMorocco': 'Royaume du Maroc',
    'city.agadir': 'Agadir',
    'city.alhoceima': 'Al Hoceima',
    'city.benimellal': 'Beni Mellal',
    'city.berkane': 'Berkane',
    'city.casablanca': 'Casablanca',
    'city.chefchaouen': 'Chefchaouen',
    'city.eljadida': 'El Jadida',
    'city.errachidia': 'Errachidia',
    'city.essaouira': 'Essaouira',
    'city.fez': 'Fès',
    'city.ifrane': 'Ifrane',
    'city.kenitra': 'Kénitra',
    'city.khenifra': 'Khénifra',
    'city.khouribga': 'Khouribga',
    'city.larache': 'Larache',
    'city.marrakech': 'Marrakech',
    'city.meknes': 'Meknès',
    'city.nador': 'Nador',
    'city.ouarzazate': 'Ouarzazate',
    'city.oujda': 'Oujda',
    'city.rabat': 'Rabat',
    'city.safi': 'Safi',
    'city.sale': 'Salé',
    'city.tangier': 'Tanger',
    'city.tetouan': 'Tétouan',
    'city.other': 'Autre',

    // Payment Modal
    'payment.completePayment': 'Complétez votre paiement',
    'payment.payToCreate':
      'Payez pour créer votre pétition avec un objectif de {signatures} signatures',
    'payment.orderSummary': 'Résumé de la commande',
    'payment.petitionPlan': 'Plan de pétition :',
    'payment.signatureGoal': 'Objectif de signatures :',
    'payment.petitionTitle': 'Titre de la pétition :',
    'payment.total': 'Total :',
    'payment.whatsIncluded': 'Fonctionnalités incluses',

    // Pricing Features
    'features.upToSignatures': "Jusqu'à {count} signatures",
    'features.basicPetitionPage': 'Page de pétition basique',
    'features.enhancedPetitionPage': 'Page de pétition améliorée',
    'features.premiumPetitionPage': 'Page de pétition premium',
    'features.emailSharing': 'Partage par email',
    'features.socialMediaSharing': 'Partage sur les réseaux sociaux',
    'features.advancedSharing': 'Partage avancé',
    'features.basicAnalytics': 'Analyses de base',
    'features.detailedAnalytics': 'Analyses détaillées',
    'features.prioritySupport': 'Support prioritaire',
    'features.customBranding': 'Image de marque personnalisée',
    'features.apiAccess': "Accès à l'API",

    // Pricing Page
    'pricing.page.title': 'Tarification simple et transparente',
    'pricing.page.subtitle':
      'Sélectionnez le plan parfait pour votre pétition. Commencez avec notre plan gratuit et mettez à niveau au fur et à mesure que votre mouvement grandit.',
    'pricing.page.plan': 'Plan',
    'pricing.page.freePlan': 'Plan Gratuit',
    'pricing.page.starterPlan': 'Plan Débutant',
    'pricing.page.proPlan': 'Plan Pro',
    'pricing.page.advancedPlan': 'Plan Avancé',
    'pricing.page.enterprisePlan': 'Plan Entreprise',
    'pricing.page.upTo': "Jusqu'à {count}",
    'pricing.page.signatures': 'signatures',
    'pricing.page.getStartedFree': 'Commencer gratuitement',
    'pricing.page.chooseThisPlan': 'Choisir ce plan',
    'pricing.page.features': 'Fonctionnalités',
    'pricing.page.qrCode': 'Code QR',
    'pricing.page.messaging': 'Messagerie (aux signataires)',
    'pricing.page.available': 'Disponible',
    'pricing.page.notAvailable': 'Non disponible',
    'pricing.page.includedWithPlan': 'Inclus avec le plan',
    'pricing.page.notIncluded': 'Non inclus',
    'pricing.page.optionalAddon': 'Module optionnel : {price} MAD',
    'pricing.page.messagingAddon':
      'Module messagerie : {count} messages pour {price} MAD',
    'pricing.page.freeMessages':
      '{count} messages gratuits + module : {extraCount} messages pour {price} MAD',
    'pricing.page.readyToStart': 'Prêt à commencer votre pétition avec le',

    // Pricing Plan Features
    'pricing.features.createPublish': 'Créer et publier des pétitions',
    'pricing.features.basicSharing':
      'Outils de partage de base (email/réseaux sociaux)',
    'pricing.features.basicAnalytics': 'Analyses de base (vues, signatures)',
    'pricing.features.publicListing': 'Liste publique sur la plateforme',
    'pricing.features.allFreeFeatures':
      'Toutes les fonctionnalités du plan gratuit',
    'pricing.features.customCoverImage': 'Image de couverture personnalisée',
    'pricing.features.enhancedSocialSharing': 'Partage social amélioré',
    'pricing.features.basicAnalyticsDashboard':
      'Tableau de bord analytique de base',
    'pricing.features.fasterApproval': 'Approbation plus rapide',
    'pricing.features.allStarterFeatures':
      'Toutes les fonctionnalités du plan débutant',
    'pricing.features.regionalTargeting': 'Ciblage régional',
    'pricing.features.petitionBranding':
      'Image de marque de pétition (logo, couleurs)',
    'pricing.features.priorityVisibility':
      "Visibilité prioritaire sur la page d'accueil",
    'pricing.features.allProFeatures': 'Toutes les fonctionnalités du plan pro',
    'pricing.features.advancedAnalytics':
      'Analyses avancées (démographie, emplacements)',
    'pricing.features.exportSigneesData':
      'Exporter les données des signataires (CSV)',
    'pricing.features.featuredListing':
      'Liste en vedette dans les pages de catégories',
    'pricing.features.emailSupport': 'Support par email',
    'pricing.features.allAdvancedFeatures':
      'Toutes les fonctionnalités du plan avancé',
    'pricing.features.apiAccess': "Accès à l'API",
    'pricing.features.customDomain': 'Option de domaine personnalisé',
    'pricing.features.dedicatedSupport': 'Équipe de support dédiée',
    'pricing.features.organizationBadge':
      "Badge de vérification d'organisation",
    'pricing.features.highestVisibility':
      'Visibilité maximale sur la plateforme',

    // Enterprise Contact
    'pricing.enterprise.title': 'Vous attendez plus de 100K signatures ?',
    'pricing.enterprise.description':
      'Nous proposons des plans entreprise personnalisés avec support dédié, garanties SLA et tarification au volume.',
    'pricing.enterprise.cta': 'Nous contacter',

    'payment.testCard': 'Carte de test (mode développement)',
    'payment.testCardNumber': 'Numéro de carte : 4242 4242 4242 4242',
    'payment.testExpiry': "Date d'expiration : toute date future (ex. 12/25)",
    'payment.testCvc': 'CVC : tout 3 chiffres (ex. 123)',
    'payment.secureProcessing': '🔒 Paiement sécurisé traité par PayPal',
    'payment.backToReview': 'Retour à la révision',
    'payment.loadingPaymentSystem': 'Chargement du système de paiement...',
    'payment.paymentSystemError': '❌ Erreur du système de paiement',
    'payment.paymentNotAvailable': 'Système de paiement non disponible',
    'payment.goBack': 'Retour',
    'payment.cardInformation': 'Informations de carte',
    'payment.cardValid': 'Carte valide',
    'payment.processing': 'Traitement en cours...',
    'payment.paymentInfo': 'Informations de paiement',
    'payment.paypalSupportsCards':
      'PayPal prend en charge toutes les principales cartes de crédit et de débit',
    'payment.paypalSupportsAccount':
      'Vous pouvez payer avec votre compte PayPal',
    'payment.securePayment': 'Transactions sécurisées et cryptées',
    'payment.currencyDisclosure': 'Prix fixe : {mad} MAD (environ ${usd} USD)',
    'payment.currencyNote':
      'Le montant final est calculé selon le taux de change adopté par PayPal. Le montant facturé peut varier légèrement en fonction du taux de change.',
    'payment.noRefunds':
      "En raison de la nature du service numérique, aucun remboursement n'est accordé après la finalisation du paiement.",

    // Success Page
    'success.paymentSuccessful': 'Pétition créée avec succès !',
    'success.petitionCreated': 'Pétition créée avec succès !',
    'success.petitionPublished': 'Pétition créée avec succès !',
    'success.paymentSuccessMessage':
      'Votre pétition a été créée avec succès et le paiement a été effectué !\nElle sera disponible pour signature une fois approuvée par les modérateurs dans 24-48 heures.',
    'success.needsPaymentMessage':
      "Votre pétition a été créée avec succès. Complétez le paiement pour l'envoyer en révision.",
    'success.publishedMessage':
      'Votre pétition a été créée avec succès !\nElle sera disponible pour signature une fois approuvée par les modérateurs dans 24-48 heures.',
    'success.completePayment': 'Compléter le paiement',
    'success.viewPetition': 'Voir la pétition',
    'success.browsePetitions': 'Parcourir les pétitions',
    'success.whatsNext': 'Quelle est la suite ?',
    'success.petitionUnderReview':
      '• Votre pétition est en cours de révision par les modérateurs',
    'success.approvalTimeframe': '• Elle sera approuvée dans 24-48 heures',
    'success.notificationOnApproval':
      "• Vous recevrez une notification lors de l'approbation",
    'success.shareWithFriends':
      '• Partagez votre pétition avec vos amis et votre famille',
    'success.promoteOnSocial': '• Faites-la connaître sur les réseaux sociaux',
    'success.monitorSignatures': "• Surveillez les signatures et l'engagement",
    'success.respondToComments':
      '• Répondez aux commentaires et aux supporters',
    'success.completePaymentStep':
      '• Complétez le paiement pour envoyer votre pétition en révision',

    // Tips for Success
    'tips.title': '💡 Conseils pour réussir votre pétition',
    'tips.clearTitle':
      'Rédigez un titre clair et convaincant qui exprime directement votre cause',
    'tips.explainWhy':
      'Expliquez clairement le problème, pourquoi il importe aux gens, et quel changement vous demandez',
    'tips.realisticGoal':
      'Fixez un objectif de signatures réaliste pour la première étape',
    'tips.addMedia':
      'Ajoutez des photos et une vidéo pour soutenir votre histoire et la rendre plus percutante',
    'tips.shareWithFriends':
      "Partagez d'abord votre pétition avec vos amis et votre famille pour obtenir un soutien précoce",
    'tips.shareOnSocial':
      'Publiez la pétition sur les réseaux sociaux (Facebook, WhatsApp, Instagram, Twitter) pour atteindre le plus grand nombre possible',
    'tips.updatePetition':
      'Mettez à jour la pétition et partagez ses développements pour garder les supporters engagés',
    'tips.successStory':
      '⭐ Les pétitions réussies commencent par un soutien simple… puis se propagent et grandissent avec le partage.',

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

    // Admin Action Buttons
    'admin.actions.approve': 'Approuver',
    'admin.actions.reject': 'Rejeter',
    'admin.actions.pause': 'Pause',
    'admin.actions.delete': 'Supprimer',
    'admin.actions.review': 'Réviser',
    'admin.actions.approving': 'Approbation...',
    'admin.actions.rejecting': 'Rejet...',
    'admin.actions.pausing': 'Mise en pause...',
    'admin.actions.deleting': 'Suppression...',
    'admin.actions.processing': 'Traitement...',

    // Admin Confirmation Messages
    'admin.confirm.approve':
      'Êtes-vous sûr de vouloir approuver cette pétition ?',
    'admin.confirm.reject': 'Êtes-vous sûr de vouloir rejeter cette pétition ?',
    'admin.confirm.pause':
      'Êtes-vous sûr de vouloir mettre en pause cette pétition ?',
    'admin.confirm.delete':
      'Êtes-vous sûr de vouloir supprimer cette pétition ?',

    // Admin Reason Prompts
    'admin.reason.delete': 'Raison de la suppression (requis) :',
    'admin.reason.approve': "Raison de l'approbation (optionnel) :",
    'admin.reason.reject': 'Raison du rejet (optionnel) :',
    'admin.reason.pause': 'Raison de la pause (optionnel) :',
    'admin.reason.required': 'Une raison est requise pour la suppression.',

    // Admin Success Messages
    'admin.success.approved': 'Pétition approuvée avec succès !',
    'admin.success.rejected': 'Pétition rejetée avec succès !',
    'admin.success.paused': 'Pétition mise en pause avec succès !',
    'admin.success.deleted': 'Pétition supprimée avec succès !',

    // Admin Error Messages
    'admin.error.approving':
      "Erreur lors de l'approbation de la pétition. Veuillez réessayer.",
    'admin.error.rejecting':
      'Erreur lors du rejet de la pétition. Veuillez réessayer.',
    'admin.error.pausing':
      'Erreur lors de la mise en pause de la pétition. Veuillez réessayer.',
    'admin.error.deleting':
      'Erreur lors de la suppression de la pétition. Veuillez réessayer.',

    // Appeals Page
    'appeals.title': 'Gestion des appels',
    'appeals.subtitle':
      'Examiner et répondre aux appels des créateurs de pétitions',
    'appeals.totalAppeals': 'Total des appels',
    'appeals.pending': 'En attente',
    'appeals.inProgress': 'En cours',
    'appeals.resolved': 'Résolus',
    'appeals.rejected': 'Rejetés',
    'appeals.filterByStatus': 'Filtrer par statut',
    'appeals.search': 'Rechercher',
    'appeals.searchPlaceholder':
      "Rechercher par titre de pétition, nom du créateur ou ID d'appel...",
    'appeals.appealsCount': 'Appels ({count})',
    'appeals.noAppealsFound': 'Aucun appel trouvé',
    'appeals.noAppealsMessage':
      'Les appels apparaîtront ici lorsque les créateurs les soumettront',
    'appeals.tryChangingFilter': 'Essayez de changer le filtre',
    'appeals.creator': 'Créateur :',
    'appeals.appealId': "ID d'appel :",
    'appeals.messages': 'messages',
    'appeals.needsResponse': 'Nécessite une réponse',
    'appeals.showingResults': 'Affichage de {start} à {end} sur {total} appels',
    'appeals.previous': 'Précédent',
    'appeals.next': 'Suivant',
    'appeals.tryAgain': 'Réessayer',
    'appeals.failedToLoad': 'Échec du chargement des appels',

    // Appeals Status Labels
    'appeals.status.pending': 'En attente',
    'appeals.status.inProgress': 'En cours',
    'appeals.status.resolved': 'Résolus',
    'appeals.status.rejected': 'Rejetés',

    // Appeals Filter Buttons
    'appeals.filter.all': 'Tous ({count})',
    'appeals.filter.pending': 'En attente ({count})',
    'appeals.filter.inProgress': 'En cours ({count})',
    'appeals.filter.resolved': 'Résolus ({count})',
    'appeals.filter.rejected': 'Rejetés ({count})',

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
    'categories.healthcare': 'Soins de santé',
    'categories.infrastructure': 'Infrastructure',
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

    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Marquer tout comme lu',
    'notifications.loading': 'Chargement des notifications...',
    'notifications.noNotifications': 'Aucune notification',
    'notifications.allCaughtUp': 'Vous êtes à jour !',
    'notifications.viewAll': 'Voir toutes les notifications',
    'notifications.justNow': "À l'instant",
    'notifications.minutesAgo': 'Il y a {count} minute',
    'notifications.hoursAgo': 'Il y a {count} heure',
    'notifications.daysAgo': 'Il y a {count} jour',

    // Supporters Tab
    'supporters.addComment': 'Ajouter un commentaire',
    'supporters.comments': 'Commentaires',
    'supporters.signatures': 'Signatures',

    // Publisher Tab
    'publisher.memberSince': 'Membre depuis',
    'publisher.editBio': 'Modifier la bio',
    'publisher.aboutPublisher': 'À propos du créateur',
    'publisher.noBioYet':
      'Vous n\'avez pas encore ajouté de bio. Cliquez sur "Modifier la bio" pour en ajouter une.',
    'publisher.userNoBio': "{name} n'a pas encore ajouté de bio.",
    'publisher.thisUser': 'Cet utilisateur',
    'publisher.publisherInformation': 'Informations sur le créateur',
    'publisher.type': 'Type',
    'publisher.name': 'Nom',
    'publisher.petitionDetails': 'Détails de la pétition',
    'publisher.addressedTo': 'Adressée à',
    'publisher.specificTarget': 'Cible spécifique',
    'publisher.referenceCode': 'Code de référence',
    'publisher.useCodeForSupport':
      "Utilisez ce code pour les demandes d'assistance",

    // Supporters Tab (continued)
    'supporters.latest': 'Récents',
    'supporters.mostLiked': 'Les plus aimés',
    'supporters.shareThoughts': 'Partagez vos pensées',
    'supporters.whySupport': 'Pourquoi soutenez-vous cette pétition ?',
    'supporters.commentAnonymously': 'Commenter anonymement',
    'supporters.posting': 'Publication...',
    'supporters.postComment': 'Publier le commentaire',
    'supporters.cancel': 'Annuler',
    'supporters.joinDiscussion': 'Rejoindre la discussion',
    'supporters.signInToComment': 'Se connecter pour commenter',
    'supporters.signInMessage':
      'Connectez-vous pour partager vos pensées et soutenir cette pétition.',
    'supporters.noComments': 'Aucun commentaire pour le moment',
    'supporters.noSignatures': 'Aucune signature pour le moment',
    'supporters.noActivity': 'Aucune activité pour le moment',
    'supporters.firstComment':
      'Soyez le premier à partager vos pensées sur cette pétition.',
    'supporters.firstSignature': 'Soyez le premier à signer cette pétition !',
    'supporters.firstSupport': 'Soyez le premier à soutenir cette pétition.',
    'supporters.anonymous': 'Anonyme',
    'supporters.comment': 'Commentaire',
    'supporters.signature': 'Signature',
    'supporters.reply': 'Répondre',
    'supporters.delete': 'Supprimer',
    'supporters.commentDeleted': '[Commentaire supprimé]',
    'supporters.showReplies': 'Afficher {count} réponse(s)',
    'supporters.hideReplies': 'Masquer les réponses',
    'supporters.replyTo': 'Répondre à {name}',
    'supporters.replying': 'Réponse en cours...',
    'supporters.postReply': 'Publier la réponse',
    'supporters.loadMore': 'Charger plus',
    'supporters.loading': 'Chargement...',
    'supporters.signed': 'Signé',
    'supporters.writeReply': 'Écrivez votre réponse...',
    'supporters.deleteReply': 'Supprimer cette réponse ?',
    'supporters.deleteComment': 'Supprimer ce commentaire ?',
    'supporters.deleteMessage':
      'Êtes-vous sûr de vouloir supprimer ce commentaire ? Les réponses resteront visibles.',
    'supporters.deleting': 'Suppression...',
    'supporters.replyDeleted': '[Réponse supprimée]',
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
      '',
    );
    document.body.classList.add(currentLocale === 'ar' ? 'rtl' : 'ltr');
    document.body.classList.add(
      currentLocale === 'ar' ? 'font-arabic' : 'font-inter',
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
      '',
    );
    document.body.classList.add(newLocale === 'ar' ? 'rtl' : 'ltr');
    document.body.classList.add(
      newLocale === 'ar' ? 'font-arabic' : 'font-inter',
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
