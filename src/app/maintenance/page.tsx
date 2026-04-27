export default function MaintenancePage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white px-6 text-center"
    >
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-700 tracking-tight">
          عريضة
        </h1>
        <p className="text-green-500 text-lg mt-1 font-medium">3arida.org</p>
      </div>

      {/* Maintenance icon */}
      <div className="mb-6 text-6xl">🔧</div>

      {/* Main message */}
      <div className="max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">صيانة قصيرة</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-2">
          نحن نقوم ببعض التحسينات لضمان أفضل تجربة لكم. سنعود خلال دقائق.
        </p>
        <p className="text-gray-400 text-sm mt-2">شكراً على تفهمكم 🙏</p>
        <p className="text-gray-400 text-sm mt-1">
          Under brief maintenance — back shortly.
        </p>
      </div>

      {/* Divider */}
      <div className="w-16 h-1 bg-orange-400 rounded-full my-8" />

      {/* Contact */}
      <p className="text-gray-400 text-sm">
        للتواصل:{' '}
        <a
          href="mailto:contact@3arida.org"
          className="text-green-600 hover:underline font-medium"
        >
          contact@3arida.org
        </a>
      </p>
    </div>
  );
}
