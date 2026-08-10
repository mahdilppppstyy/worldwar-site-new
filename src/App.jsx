import React, { useState } from 'react';
import { Check, Star, Users, TrendingUp, Zap, Shield, Globe, Smartphone } from 'lucide-react';

// نشانه‌ی طراحی: قاب‌های گوشه‌دار مثل پرونده‌های اطلاعاتی/نظامی طبقه‌بندی‌شده —
// هر کارت انگار روی میز فرماندهی مهر خورده و آماده‌ی بررسی است.
const CornerFrame = () => (
  <>
    <span className="pointer-events-none absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#C9A24B]/40 group-hover:border-[#C9A24B] transition-colors duration-300" />
    <span className="pointer-events-none absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#C9A24B]/40 group-hover:border-[#C9A24B] transition-colors duration-300" />
    <span className="pointer-events-none absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#C9A24B]/40 group-hover:border-[#C9A24B] transition-colors duration-300" />
    <span className="pointer-events-none absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#C9A24B]/40 group-hover:border-[#C9A24B] transition-colors duration-300" />
  </>
);

const Eyebrow = ({ children }) => (
  <div className="inline-flex items-center gap-2 mb-4">
    <span className="h-px w-6 bg-[#C9A24B]/60" />
    <span className="font-mono text-[11px] tracking-[0.25em] text-[#C9A24B] uppercase">{children}</span>
  </div>
);

export default function WorldWarSubscription() {
  const [tab, setTab] = useState('home');
  const [cart, setCart] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'pro',
      name: 'حرفه‌ای',
      price: '۴۹۹',
      period: 'ماهانه',
      description: 'برای بازی‌کنندگان جدی',
      color: 'from-[#4C7086] to-[#2F4A5C]',
      features: [
        '۵ امپراتوری',
        'بی‌محدود منابع درجه ۲',
        'پشتیبانی اولویتی ۲۴/۷',
        '۳ اتحاد',
        'آمار ۳۰ روزه',
        'نقشه‌های سفارشی',
        'تنظیمات پیشرفته',
        'ساخت سریع‌تر بنگاه و کارخونه',
        'اعلان‌های لحظه‌ای حمله و معامله',
        'بدون تبلیغات'
      ],
      cta: 'اشتراک گرفتن',
      popular: true
    },
    {
      id: 'elite',
      name: 'الیت',
      price: '۱۴۹۹',
      period: 'ماهانه',
      description: 'دسترسی کامل و تمام امکانات',
      color: 'from-[#C9A24B] to-[#8F6F26]',
      features: [
        '۱۵ امپراتوری',
        'بی‌محدود تمام منابع',
        'پشتیبانی تلفنی ۲۴/۷',
        'اتحادهای نامحدود',
        'آمار تاریخی کامل',
        'API دسترسی',
        'تنظیمات VIP',
        'نمایندگی قانونی',
        'رویدادهای سفارشی',
        'اولویت در صف سرور',
        'بج اختصاصی الیت',
        'تخفیف ۲۰٪ در فروشگاه'
      ],
      cta: 'کسب دسترسی الیت',
      popular: false
    }
  ];

  const features = [
    {
      icon: Globe,
      code: 'N.01',
      title: 'بازی جهانی',
      desc: 'با بازی‌کنندگان از سرتاسر جهان رقابت کنید'
    },
    {
      icon: TrendingUp,
      code: 'N.02',
      title: 'اقتصاد پیچیده',
      desc: 'مدیریت منابع، تولید و تجارت واقعی'
    },
    {
      icon: Shield,
      code: 'N.03',
      title: 'جنگ استراتژیک',
      desc: 'ایجاد کشتی‌های جنگی و اجرای عملیات نظامی'
    },
    {
      icon: Zap,
      code: 'N.04',
      title: 'دیپلماسی',
      desc: 'اتحاد، قرارداد و مذاکرات بین‌المللی'
    },
    {
      icon: Smartphone,
      code: 'N.05',
      title: 'موبایل سازگار',
      desc: 'تلگرام را بر روی هر دستگاهی استفاده کنید'
    },
    {
      icon: Users,
      code: 'N.06',
      title: 'انجمن فعال',
      desc: 'اتصال با هزاران بازی‌کننده دیگر'
    }
  ];

  const handleSubscribe = (plan) => {
    setCart(plan);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    alert(`اشتراک ${plans.find(p => p.id === cart.id).name} با موفقیت خریداری شد! \nلینک تلگرام برای شما ارسال شد.`);
    setShowPayment(false);
    setCart(null);
    setEmail('');
    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#12151A] text-[#E9E4D8] relative"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* بافت زمینه: شبکه‌ی محو مثل نقشه‌ی عملیات */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#C9A24B 1px, transparent 1px), linear-gradient(90deg, #C9A24B 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }}
      />

      {/* Header Navigation */}
      <nav className="fixed top-0 w-full bg-[#12151A]/90 backdrop-blur-md border-b border-[#C9A24B]/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm border-2 border-[#C9A24B] flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#C9A24B]" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-wide leading-none">WorldWar Bot</h1>
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#8D95A3]">STRATEGY // TELEGRAM</span>
            </div>
          </div>
          <div className="flex gap-8">
            {['home', 'features', 'pricing', 'dashboard'].map(item => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`font-bold text-sm tracking-wide pb-1 transition ${
                  tab === item ? 'text-[#C9A24B] border-b-2 border-[#C9A24B]' : 'text-[#8D95A3] hover:text-[#E9E4D8]'
                }`}
              >
                {item === 'home' && 'خانه'}
                {item === 'features' && 'ویژگی‌ها'}
                {item === 'pricing' && 'قیمت‌گذاری'}
                {item === 'dashboard' && 'داشبورد'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Home Section */}
      {tab === 'home' && (
        <>
          <div className="pt-40 pb-24 max-w-6xl mx-auto px-6 relative">
            <div className="text-center mb-20">
              <Eyebrow>DOSSIER // OPEN CAMPAIGN</Eyebrow>
              <h2 className="text-6xl md:text-7xl font-black mb-6 text-[#E9E4D8] leading-[1.1]">
                جنگ <span className="text-[#C9A24B]">جهانی</span>
              </h2>
              <p className="text-2xl text-[#c7c2b6] mb-6 font-medium">
                بزرگ‌ترین بازی سیاسی و نظامی در تلگرام
              </p>
              <p className="text-[#8D95A3] mb-12 max-w-2xl mx-auto leading-8">
                کشوری بنا کنید، سربازان بسیج کنید، با دیگر بازی‌کنندگان معاهده کنید و درخشش‌تان را در میدان نبرد ثابت کنید.
              </p>
              <button
                onClick={() => setTab('pricing')}
                className="px-10 py-4 bg-[#C9A24B] text-[#12151A] rounded-sm font-extrabold text-lg hover:bg-[#dbb75c] transition"
              >
                شروع کردن
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="group relative bg-[#1B2027] border border-[#C9A24B]/15 rounded-sm p-8">
                <CornerFrame />
                <Eyebrow>N.01 — راهنما</Eyebrow>
                <h3 className="text-2xl font-extrabold mb-5 text-[#E9E4D8]">🎮 طریقه بازی</h3>
                <ol className="space-y-3 text-[#c7c2b6]">
                  <li className="flex gap-3"><span className="text-[#C9A24B]">✓</span> ربات را در تلگرام شروع کنید</li>
                  <li className="flex gap-3"><span className="text-[#C9A24B]">✓</span> امپراتوری خود را ایجاد کنید</li>
                  <li className="flex gap-3"><span className="text-[#C9A24B]">✓</span> منابع را جمع‌آوری و تولید کنید</li>
                  <li className="flex gap-3"><span className="text-[#C9A24B]">✓</span> ارتش بسازید و حمله کنید</li>
                  <li className="flex gap-3"><span className="text-[#C9A24B]">✓</span> اتحادی تشکیل دهید یا انجمن‌ها برپا کنید</li>
                  <li className="flex gap-3"><span className="text-[#C9A24B]">✓</span> سودای جهانی برای تسلط‌گری بازی کنید</li>
                </ol>
              </div>
              <div className="group relative bg-[#1B2027] border border-[#4C7086]/25 rounded-sm p-8">
                <CornerFrame />
                <Eyebrow>N.02 — آمار زنده</Eyebrow>
                <h3 className="text-2xl font-extrabold mb-5 text-[#E9E4D8]">📊 آمار</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-[#8D95A3]/10 pb-3">
                    <span className="text-[#c7c2b6]">بازی‌کنندگان فعال</span>
                    <span className="font-mono font-bold text-[#C9A24B]">۲۳۵۴+ هزار</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#8D95A3]/10 pb-3">
                    <span className="text-[#c7c2b6]">اتحادها</span>
                    <span className="font-mono font-bold text-[#4C7086]">۱۲۰+ هزار</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#8D95A3]/10 pb-3">
                    <span className="text-[#c7c2b6]">جنگ‌های یومیه</span>
                    <span className="font-mono font-bold text-[#B4432F]">۴۸۰۰+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#c7c2b6]">میانگین وقت بازی</span>
                    <span className="font-mono font-bold text-[#E9E4D8]">۴ ساعت/روز</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Features Section */}
      {tab === 'features' && (
        <div className="pt-40 pb-24 max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <Eyebrow>DOSSIER // CAPABILITIES</Eyebrow>
            <h2 className="text-5xl font-black text-[#E9E4D8]">ویژگی‌های بازی</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group relative bg-[#1B2027] border border-[#C9A24B]/15 rounded-sm p-7 hover:border-[#C9A24B]/50 transition">
                  <CornerFrame />
                  <div className="flex items-center justify-between mb-5">
                    <Icon className="w-9 h-9 text-[#C9A24B]" />
                    <span className="font-mono text-[11px] text-[#8D95A3] tracking-widest">{feature.code}</span>
                  </div>
                  <h3 className="text-xl font-extrabold mb-2 text-[#E9E4D8]">{feature.title}</h3>
                  <p className="text-[#8D95A3] leading-7">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pricing Section */}
      {tab === 'pricing' && (
        <div className="pt-40 pb-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <Eyebrow>DOSSIER // ENLISTMENT</Eyebrow>
            <h2 className="text-5xl font-black mb-4 text-[#E9E4D8]">پلان‌های اشتراک</h2>
            <p className="text-[#8D95A3] text-lg">برای هر سطح بازی‌کننده مناسب</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 max-w-4xl mx-auto">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`group relative rounded-sm border overflow-hidden transition bg-[#1B2027] ${
                  plan.popular ? 'border-[#C9A24B]/60 md:scale-105 shadow-2xl shadow-[#C9A24B]/10' : 'border-[#8D95A3]/20 hover:border-[#C9A24B]/40'
                }`}
              >
                <CornerFrame />
                {plan.popular && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-1.5 bg-[#C9A24B] text-[#12151A] px-3 py-1 rounded-sm">
                      <Star className="w-3.5 h-3.5" />
                      <span className="font-mono font-bold text-[11px] tracking-wide">محبوب‌ترین</span>
                    </div>
                  </div>
                )}

                <div className={`bg-gradient-to-br ${plan.color} p-8 text-center pt-12`}>
                  <h3 className="text-2xl font-extrabold mb-2">{plan.name}</h3>
                  <p className="text-sm opacity-90">{plan.description}</p>
                </div>

                <div className="p-8 text-center border-b border-[#8D95A3]/10">
                  <div className="text-4xl font-black text-[#C9A24B] mb-1 font-mono">
                    {plan.price}<span className="text-lg mr-1">تومان</span>
                  </div>
                  <div className="text-sm text-[#8D95A3] font-mono tracking-wide">{plan.period}</div>
                </div>

                <ul className="p-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#C9A24B] flex-shrink-0 mt-0.5" />
                      <span className="text-[#c7c2b6] text-sm leading-6">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-8 pt-0">
                  <button
                    onClick={() => handleSubscribe(plan)}
                    className={`w-full py-3.5 rounded-sm font-extrabold transition bg-gradient-to-br ${plan.color} hover:shadow-lg`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="relative bg-[#1B2027] border border-[#C9A24B]/15 rounded-sm p-10">
            <Eyebrow>سؤالات متداول</Eyebrow>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 text-right">
              <div className="border-r-2 border-[#C9A24B]/30 pr-4">
                <h4 className="font-extrabold text-[#E9E4D8] mb-2">آیا می‌توانم پلان خود را تغییر دهم؟</h4>
                <p className="text-[#8D95A3] text-sm leading-7">بله، می‌توانید هر زمان ارتقا یا کاهش دهید.</p>
              </div>
              <div className="border-r-2 border-[#C9A24B]/30 pr-4">
                <h4 className="font-extrabold text-[#E9E4D8] mb-2">آیا تضمین بازگشت وجه وجود دارد؟</h4>
                <p className="text-[#8D95A3] text-sm leading-7">۳۰ روز تضمین بازگشت ۱۰۰٪ اگر راضی نباشید.</p>
              </div>
              <div className="border-r-2 border-[#C9A24B]/30 pr-4">
                <h4 className="font-extrabold text-[#E9E4D8] mb-2">آیا می‌توانم لغو کنم؟</h4>
                <p className="text-[#8D95A3] text-sm leading-7">بله، هر زمان بدون هیچ تعهدی می‌توانید اشتراک را لغو کنید.</p>
              </div>
              <div className="border-r-2 border-[#C9A24B]/30 pr-4">
                <h4 className="font-extrabold text-[#E9E4D8] mb-2">پشتیبانی از کجا به دست بیاورم؟</h4>
                <p className="text-[#8D95A3] text-sm leading-7">۲۴/۷ پشتیبانی: support@worldwar.bot</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Section */}
      {tab === 'dashboard' && (
        <div className="pt-40 pb-24 max-w-4xl mx-auto px-6">
          <div className="relative bg-[#1B2027] border border-[#C9A24B]/15 rounded-sm p-10">
            <CornerFrame />
            <Eyebrow>DOSSIER // PLAYER FILE</Eyebrow>
            <h2 className="text-3xl font-black mb-10 text-[#E9E4D8]">پنل کاربری</h2>

            <div className="space-y-6">
              <div className="bg-[#12151A] rounded-sm p-6 border border-[#8D95A3]/15">
                <h3 className="text-base font-extrabold text-[#C9A24B] mb-5 font-mono tracking-wide">اطلاعات اشتراک شما</h3>
                <div className="space-y-4 text-[#c7c2b6]">
                  <div className="flex justify-between border-b border-[#8D95A3]/10 pb-3">
                    <span>پلان فعلی</span>
                    <span className="font-mono font-bold text-[#C9A24B]">حرفه‌ای (Pro)</span>
                  </div>
                  <div className="flex justify-between border-b border-[#8D95A3]/10 pb-3">
                    <span>تاریخ شروع</span>
                    <span className="font-mono font-bold">۱۵ اردیبهشت ۱۴۰۳</span>
                  </div>
                  <div className="flex justify-between border-b border-[#8D95A3]/10 pb-3">
                    <span>تاریخ تجدید</span>
                    <span className="font-mono font-bold">۱۵ خرداد ۱۴۰۳</span>
                  </div>
                  <div className="flex justify-between">
                    <span>امپراتوری‌های فعال</span>
                    <span className="font-mono font-bold text-[#7C9A5B]">۳/۵</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#12151A] rounded-sm p-6 border border-[#8D95A3]/15">
                <h3 className="text-base font-extrabold text-[#4C7086] mb-5 font-mono tracking-wide">آمار بازی</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-black text-[#4C7086] font-mono">۴۲۳۸</div>
                    <div className="text-sm text-[#8D95A3] mt-1">سیاست‌گذاری</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#C9A24B] font-mono">۱۲۸</div>
                    <div className="text-sm text-[#8D95A3] mt-1">عملیات نظامی</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#7C9A5B] font-mono">۸۴</div>
                    <div className="text-sm text-[#8D95A3] mt-1">پیروزی</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#B4432F] font-mono">۳۲</div>
                    <div className="text-sm text-[#8D95A3] mt-1">شکست</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#12151A] rounded-sm p-6 border border-[#8D95A3]/15">
                <h3 className="text-base font-extrabold text-[#C9A24B] mb-5 font-mono tracking-wide">تاریخچه‌ی پرداخت</h3>
                <div className="space-y-3 text-[#c7c2b6] text-sm">
                  <div className="flex justify-between border-b border-[#8D95A3]/10 pb-2">
                    <span>پرداخت ۱۵ خرداد</span>
                    <span className="font-mono text-[#7C9A5B]">۴۹۹۰۰ تومان</span>
                  </div>
                  <div className="flex justify-between border-b border-[#8D95A3]/10 pb-2">
                    <span>پرداخت ۱۵ اردیبهشت</span>
                    <span className="font-mono text-[#7C9A5B]">۴۹۹۰۰ تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span>پرداخت ۱۵ اسفند</span>
                    <span className="font-mono text-[#7C9A5B]">۴۹۹۰۰ تومان</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3.5 bg-[#232933] hover:bg-[#2c333f] border border-[#8D95A3]/20 rounded-sm font-extrabold transition">
                مدیریت اشتراک
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && cart && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#1B2027] rounded-sm border border-[#C9A24B]/40 p-8 max-w-md w-full">
            <CornerFrame />
            <Eyebrow>تکمیل خریداری</Eyebrow>
            <h3 className="text-2xl font-black mb-6 text-[#E9E4D8]">پرداخت اشتراک</h3>

            <div className="bg-[#12151A] rounded-sm p-4 mb-6 border border-[#8D95A3]/15">
              <div className="flex justify-between">
                <span className="text-[#c7c2b6]">{cart.name}</span>
                <span className="font-mono font-bold text-[#C9A24B]">{cart.price} تومان</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-[#c7c2b6]">ایمیل</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#12151A] border border-[#8D95A3]/25 rounded-sm px-4 py-2.5 text-[#E9E4D8] focus:border-[#C9A24B] outline-none transition"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-2.5 bg-[#232933] hover:bg-[#2c333f] border border-[#8D95A3]/20 rounded-sm font-bold transition"
              >
                لغو
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 py-2.5 bg-[#C9A24B] text-[#12151A] rounded-sm font-extrabold hover:bg-[#dbb75c] transition disabled:opacity-50"
              >
                {loading ? 'درحال پردازش...' : 'پرداخت'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#C9A24B]/15 bg-[#0F1216] py-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-[#8D95A3] text-sm">
          <p className="font-mono tracking-wide">© ۱۴۰۳ WorldWar Bot • تمام حقوق محفوظ است</p>
          <p className="mt-3 space-x-1">
            <a href="#" className="hover:text-[#C9A24B] transition">شرایط استفاده</a>
            <span className="mx-2 text-[#8D95A3]/40">•</span>
            <a href="#" className="hover:text-[#C9A24B] transition">حریم خصوصی</a>
            <span className="mx-2 text-[#8D95A3]/40">•</span>
            <a href="#" className="hover:text-[#C9A24B] transition">تماس ما</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
