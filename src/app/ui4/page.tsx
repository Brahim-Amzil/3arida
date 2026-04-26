'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getPetitions, getCategories } from '@/lib/petitions';
import { Petition, Category } from '@/types/petition';
import { useTranslation } from '@/hooks/useTranslation';

// UI4 Design: Strength & Solidarity - Movement/Union Style
// Color Palette: Deep Red (#b91c1c), Charcoal (#18181b), Cream (#fefce8), Steel Gray
// Inspired by labor unions, civic movements, and solidarity organizations

export default function UI4HomePage() {
  const [featuredPetitions, setFeaturedPetitions] = useState<Petition[]>([]);
  const [recentPetitions, setRecentPetitions] = useState<Petition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [featuredResult, recentResult, categoriesData] = await Promise.all([
          getPetitions({ sortBy: 'signatures', sortOrder: 'desc' }, { page: 1, limit: 3, total: 0, hasMore: false }),
          getPetitions({ sortBy: 'recent', sortOrder: 'desc' }, { page: 1, limit: 6, total: 0, hasMore: false }),
          getCategories(),
        ]);
        setFeaturedPetitions(featuredResult.petitions || []);
        setRecentPetitions(recentResult.petitions || []);
        setCategories(categoriesData.slice(0, 8));
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="bg-zinc-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-3">
              {/* Strong geometric logo */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                  <span className="text-white font-black text-xl">3</span>
                </div>
                <div className="w-2 h-10 bg-red-600" />
              </div>
              <div className="ml-2 rtl:mr-2">
                <span className="text-xl font-black tracking-tight">3ARIDA</span>
                <div className="h-0.5 bg-red-600 w-full" />
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Link href="/petitions" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium transition-colors">
                {t('nav.petitions')}
              </Link>
              <Link href="/pricing" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium transition-colors">
                {t('nav.pricing')}
              </Link>
              <Link href="/about" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium transition-colors">
                {t('nav.about')}
              </Link>
              <Link href="/help" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium transition-colors">
                {locale === 'ar' ? 'المساعدة' : 'Help'}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/petitions/create">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20">
                  {t('petitions.create')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-zinc-900 overflow-hidden">
        {/* Diagonal stripe pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)',
          }} />
        </div>
        
        {/* Red accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-red-600" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Solidarity badge */}
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/30 px-4 py-2 mb-8">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-6 h-6 bg-zinc-700 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                  ))}
                </div>
                <span className="text-red-400 font-semibold text-sm">
                  {locale === 'ar' ? '+15,000 مواطن نشط' : '15,000+ Active Citizens'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                {locale === 'ar' ? (
                  <>
                    معاً
                    <br />
                    <span className="text-red-500">نصنع</span> التغيير
                  </>
                ) : (
                  <>
                    Together We
                    <br />
                    <span className="text-red-500">Make</span> Change
                  </>
                )}
              </h1>
              
              <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-lg">
                {locale === 'ar' 
                  ? 'منصة العرائض الشعبية. صوتك مسموع، مطالبك محققة. انضم إلى الحركة.'
                  : 'The people\'s petition platform. Your voice heard, your demands met. Join the movement.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/petitions/create">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 h-14 text-base shadow-xl shadow-red-600/20 w-full sm:w-auto">
                    {t('petitions.startPetition')}
                  </Button>
                </Link>
                <Link href="/petitions">
                  <Button size="lg" variant="outline" className="border-2 border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600 font-bold px-10 h-14 text-base w-full sm:w-auto">
                    {t('petitions.discoverPetitions')}
                  </Button>
                </Link>
              </div>
              
              {/* Trust stats */}
              <div className="mt-12 pt-8 border-t border-zinc-800 grid grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-black text-white">50K+</p>
                  <p className="text-zinc-500 text-sm font-medium">{locale === 'ar' ? 'توقيع' : 'Signatures'}</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">1,200+</p>
                  <p className="text-zinc-500 text-sm font-medium">{locale === 'ar' ? 'عريضة' : 'Petitions'}</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">45+</p>
                  <p className="text-zinc-500 text-sm font-medium">{locale === 'ar' ? 'انتصار' : 'Victories'}</p>
                </div>
              </div>
            </div>
            
            {/* Hero Visual - Raised Fist / Solidarity Symbol */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Main card */}
                <div className="bg-zinc-800 border border-zinc-700 p-8">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: locale === 'ar' ? 'توقيعات اليوم' : 'Today\'s Signatures', value: '2,547', up: true },
                      { label: locale === 'ar' ? 'عرائض جديدة' : 'New Petitions', value: '23', up: true },
                      { label: locale === 'ar' ? 'قضايا مفتوحة' : 'Open Causes', value: '156', up: false },
                      { label: locale === 'ar' ? 'نسبة النجاح' : 'Success Rate', value: '78%', up: true },
                    ].map((stat, i) => (
                      <div key={i} className="bg-zinc-900 p-4">
                        <p className="text-zinc-500 text-xs mb-1">{stat.label}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          {stat.up && (
                            <span className="text-green-500 text-xs">↑</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Recent activity */}
                  <div className="border-t border-zinc-700 pt-6">
                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">
                      {locale === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                    </p>
                    <div className="space-y-3">
                      {[
                        { name: locale === 'ar' ? 'أحمد م.' : 'Ahmed M.', action: locale === 'ar' ? 'وقع عريضة' : 'signed a petition', time: '2m' },
                        { name: locale === 'ar' ? 'فاطمة ب.' : 'Fatima B.', action: locale === 'ar' ? 'أنشأت عريضة' : 'created a petition', time: '5m' },
                        { name: locale === 'ar' ? 'يوسف ك.' : 'Youssef K.', action: locale === 'ar' ? 'شارك عريضة' : 'shared a petition', time: '8m' },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {activity.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">
                              <span className="font-semibold">{activity.name}</span>
                              <span className="text-zinc-500"> {activity.action}</span>
                            </p>
                          </div>
                          <span className="text-zinc-600 text-xs">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-red-600 px-6 py-3 shadow-xl">
                  <p className="text-white font-bold text-sm">
                    {locale === 'ar' ? '🔥 نشاط متزايد' : '🔥 Growing Movement'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom red bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="w-16 h-1 bg-red-600 mb-4" />
              <h2 className="text-3xl font-black text-zinc-900">
                {locale === 'ar' ? 'القضايا الرئيسية' : 'Key Issues'}
              </h2>
              <p className="text-zinc-600 mt-2">
                {locale === 'ar' ? 'اختر القضية التي تهمك' : 'Choose the cause that matters to you'}
              </p>
            </div>
            <Link href="/petitions" className="hidden md:flex items-center gap-2 text-red-600 hover:text-red-700 font-bold transition-colors">
              {t('common.viewAll')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200">
            {categories.map((category, index) => (
              <Link
                key={category.id || index}
                href={`/petitions?category=${category.id}`}
                className="group bg-white p-6 hover:bg-zinc-50 transition-colors"
              >
                <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                  <span className="text-xl">{category.icon || '📋'}</span>
                </div>
                <h3 className="font-bold text-zinc-900 mb-1 group-hover:text-red-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-zinc-500">
                  {category.petitionCount || 0} {locale === 'ar' ? 'عريضة' : 'petitions'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Petitions */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="w-16 h-1 bg-red-600 mb-4" />
              <h2 className="text-3xl font-black text-zinc-900">
                {locale === 'ar' ? 'العرائض الأكثر دعماً' : 'Most Supported'}
              </h2>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPetitions.map((petition, index) => (
              <Link
                key={petition.id}
                href={`/petitions/${petition.id}`}
                className="group bg-white border border-zinc-200 hover:border-red-600 hover:shadow-xl transition-all"
              >
                <div className="relative h-48 bg-zinc-100">
                  {petition.mediaUrls?.[0] ? (
                    <Image
                      src={petition.mediaUrls[0]}
                      alt={petition.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                      <span className="text-4xl">📋</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold uppercase">
                      {petition.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-zinc-900 text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {petition.title}
                  </h3>
                  <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                    {petition.description.replace(/\*\*(.*?)\*\*/g, '$1').substring(0, 100)}...
                  </p>
                  
                  <div className="space-y-3">
                    <div className="h-1 bg-zinc-200 overflow-hidden">
                      <div
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: `${Math.min((petition.currentSignatures / petition.targetSignatures) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-zinc-900">
                        {petition.currentSignatures.toLocaleString()} {locale === 'ar' ? 'توقيع' : 'signed'}
                      </span>
                      <span className="text-red-600">
                        {Math.round((petition.currentSignatures / petition.targetSignatures) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/petitions">
              <Button className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8">
                {locale === 'ar' ? 'عرض جميع العرائض' : 'View All Petitions'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-1 bg-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-4">
              {locale === 'ar' ? 'كيف نعمل معاً' : 'How We Work Together'}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: locale === 'ar' ? 'عبّر عن مطالبك' : 'Voice Your Demands',
                description: locale === 'ar' ? 'اكتب عريضتك بوضوح وحدد المطالب المحددة' : 'Write your petition clearly with specific demands',
                icon: '✊',
              },
              {
                step: '2',
                title: locale === 'ar' ? 'اجمع الدعم' : 'Gather Support',
                description: locale === 'ar' ? 'شارك عريضتك واجمع توقيعات المواطنين' : 'Share your petition and collect citizen signatures',
                icon: '🤝',
              },
              {
                step: '3',
                title: locale === 'ar' ? 'حقق الانتصار' : 'Achieve Victory',
                description: locale === 'ar' ? 'قدم عريضتك للجهات المعنية وحقق التغيير' : 'Submit to authorities and make change happen',
                icon: '🏆',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="border border-zinc-700 p-8 hover:border-red-600 transition-colors">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">{item.icon}</span>
                    <span className="text-6xl font-black text-zinc-800">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Impact */}
      <section className="py-20 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-1 bg-white mb-4" />
              <h2 className="text-3xl font-black text-white mb-6">
                {locale === 'ar' ? 'قصص نجاح حقيقية' : 'Real Success Stories'}
              </h2>
              <blockquote className="text-xl text-white/90 mb-6 leading-relaxed">
                "{locale === 'ar' 
                  ? 'بفضل هذه المنصة، تمكنا من جمع 5000 توقيع وتقديم مطالبنا للبرلمان. تم الاستجابة لطلبنا خلال شهرين!'
                  : 'Thanks to this platform, we gathered 5,000 signatures and presented our demands to Parliament. Our request was answered within two months!'}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">م</span>
                </div>
                <div>
                  <p className="text-white font-bold">{locale === 'ar' ? 'محمد العلوي' : 'Mohamed Alami'}</p>
                  <p className="text-white/70 text-sm">{locale === 'ar' ? 'ناشط مدني' : 'Civic Activist'}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '45+', label: locale === 'ar' ? 'قضية مُحلّة' : 'Cases Resolved' },
                { value: '78%', label: locale === 'ar' ? 'نسبة النجاح' : 'Success Rate' },
                { value: '15K+', label: locale === 'ar' ? 'مستخدم نشط' : 'Active Users' },
                { value: '50K+', label: locale === 'ar' ? 'توقيع موثق' : 'Verified Signatures' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-6">
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-1 bg-red-600 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            {locale === 'ar' ? 'انضم إلى الحركة اليوم' : 'Join the Movement Today'}
          </h2>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'كل عريضة تبدأ بصوت واحد. اجعل صوتك مسموعاً.'
              : 'Every petition starts with one voice. Make yours heard.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/petitions/create">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-12 h-16 text-lg shadow-xl shadow-red-600/20">
                {t('petitions.startPetition')}
              </Button>
            </Link>
            <Link href="/petitions">
              <Button size="lg" variant="outline" className="border-2 border-zinc-700 text-white hover:bg-zinc-800 font-bold px-12 h-16 text-lg">
                {t('petitions.discoverPetitions')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                    <span className="text-white font-black text-lg">3</span>
                  </div>
                  <div className="w-2 h-10 bg-red-600" />
                </div>
                <span className="text-xl font-black">3ARIDA</span>
              </div>
              <p className="text-zinc-500 text-sm">
                {locale === 'ar' ? 'منصة العرائض الشعبية' : 'The People\'s Petition Platform'}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">
                {locale === 'ar' ? 'روابط' : 'Links'}
              </h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><Link href="/petitions" className="hover:text-red-500 transition-colors">{t('nav.petitions')}</Link></li>
                <li><Link href="/pricing" className="hover:text-red-500 transition-colors">{t('nav.pricing')}</Link></li>
                <li><Link href="/about" className="hover:text-red-500 transition-colors">{t('nav.about')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">
                {locale === 'ar' ? 'قانوني' : 'Legal'}
              </h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><Link href="/privacy" className="hover:text-red-500 transition-colors">{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
                <li><Link href="/guidelines" className="hover:text-red-500 transition-colors">{locale === 'ar' ? 'الإرشادات' : 'Guidelines'}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">
                {locale === 'ar' ? 'اللغة' : 'Language'}
              </h4>
              <div className="flex gap-2">
                <Link href="/ui4" className="px-3 py-1 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-sm">
                  العربية
                </Link>
                <Link href="/fr/ui4" className="px-3 py-1 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-sm">
                  Français
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-600">
              © 2025 3arida. {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
            </p>
            <p className="text-xs text-zinc-700 uppercase tracking-wider">
              {locale === 'ar' ? 'صُنع بـ ❤️ للمغرب' : 'Made with ❤️ for Morocco'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
