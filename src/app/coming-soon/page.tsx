'use client';

export default function ComingSoonPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white px-6 text-center"
    >
      {/* Logo / Brand */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-700 tracking-tight">
          عريضة
        </h1>
        <p className="text-green-500 text-lg mt-1 font-medium">3arida.org</p>
      </div>

      {/* Main message */}
      <div className="max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">قريباً 🚀</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-2">
          منصة عريضة قادمة قريباً لتمكينك من إطلاق عرائضك والتغيير الذي تريده.
        </p>
        <p className="text-gray-400 text-sm mt-4">
          Coming soon — Morocco&apos;s petition platform is launching soon.
        </p>
      </div>

      {/* Divider */}
      <div className="w-16 h-1 bg-green-400 rounded-full my-8" />

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
