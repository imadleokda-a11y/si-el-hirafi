import { Search, Hammer, ShieldCheck, Phone, ArrowRight, MapPin, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { CITIES, SERVICE_TYPES, SITE_URL } from '@/lib/constants';
import FeaturedArtisan from '@/components/FeaturedArtisan';
import Seo from '@/components/Seo';
import LeadRequestModal from '@/components/LeadRequestModal';

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'سي الحرفي - Moroccan Artisan Directory',
  description: 'Discover authentic Moroccan artisans in Marrakech, Fes, Chefchaouen. Zellige, pottery, leather, carpets. دليل الحرفيين المغاربة.',
  url: SITE_URL,
  inLanguage: 'ar',
  areaServed: 'Morocco',
};

type Props = {
  onSearch: (service: string, city: string) => void;
  onRegister: () => void;
};

export default function HomePage({ onSearch, onRegister }: Props) {
  const [service, setService] = useState('');
  const [city, setCity] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);

  const handleSearch = () => {
    onSearch(service.trim(), city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Seo
        title="Moroccan Artisan | دليل الصناع التقليديين المغاربة | Artisans du Maroc"
        description="Discover authentic Moroccan artisans in Marrakech, Fes, Chefchaouen. Zellige, pottery, leather, carpets. دليل الحرفيين المغاربة."
        path="/"
        jsonLd={HOME_JSON_LD}
      />
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Hammer className="w-4 h-4" />
            <span>دليل الحرفيين والخدمات في المغرب</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-4 tracking-tight">
            سي الحرفي
            <br />
            <span className="text-sky-200">لقى معلم ثقة حداك فدقائق</span>
          </h1>

          <p className="text-sky-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Artisan marocain, moroccan crafts, zellige, pottery, tapis marocain.
            آلاف الحرفيين المغاربة، نمرتهم وواتسابهم قدامك، بلا سمسار بلا تعقيد.
          </p>

          {/* Register CTA */}
          <button
            onClick={onRegister}
            className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition shadow-lg mb-8 text-base"
          >
            <UserPlus className="w-5 h-5" />
            <span>سجل راسك كحرفي</span>
          </button>

          {/* Search box */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-gray-800">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Service search */}
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  list="service-list"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="أشنو الخدمة بغيتي؟ (بلومبي، صباغ...)"
                  className="w-full pr-11 pl-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-right text-gray-900 placeholder:text-gray-400"
                />
                <datalist id="service-list">
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              {/* City dropdown */}
              <div className="relative sm:w-52">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pr-11 pl-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-right text-gray-900 appearance-none bg-white cursor-pointer"
                >
                  <option value="">كل المدن</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20"
              >
                <Search className="w-5 h-5" />
                <span>قلّب</span>
              </button>
            </div>
          </div>

          {/* Free quote CTA */}
          <button
            onClick={() => setShowLeadForm(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl transition shadow-xl shadow-green-900/30 mt-6 text-lg hover:-translate-y-0.5"
          >
            <Hammer className="w-5 h-5" />
            <span>طلب دوفي فابور - مجانا</span>
          </button>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-8 mt-10 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-200" />
              <span>حرفيين موثوقين</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-sky-200" />
              <span>اتصال مباشر</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-200" />
              <span>+20 مدينة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured promo banner */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-center max-w-md sm:max-w-lg mx-auto">
        <p className="text-sm font-bold text-green-800">بغيتي تولي مميز بحال عبد الرحيم وتبان هو الأول؟ ⭐</p>
        <a
          href="https://wa.me/212629065883?text=السلام، بغيت نولي حرفي مميز فالموقع"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block bg-[#25D366] text-white px-6 py-2 rounded-full text-sm font-bold"
        >
          تواصل معنا عبر واتساب
        </a>
      </div>

      {/* Featured Artisan */}
      <FeaturedArtisan />

      {/* Popular services */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
          الخدمات الأكثر طلباً - Moroccan Crafts & Artisan Marocain
        </h2>
        <p className="text-gray-500 text-center mb-8">اختار خدمة وابدا تقلب</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {SERVICE_TYPES.slice(0, 8).map((s) => (
            <button
              key={s}
              onClick={() => onSearch(s, '')}
              className="group flex flex-col items-center gap-2 bg-white border border-gray-100 hover:border-blue-300 hover:shadow-lg rounded-2xl p-4 sm:p-6 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition">
                <Hammer className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-blue-700">
                {s}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition" />
            </button>
          ))}
        </div>
      </div>

      {showLeadForm && <LeadRequestModal onClose={() => setShowLeadForm(false)} />}
    </div>
  );
}
