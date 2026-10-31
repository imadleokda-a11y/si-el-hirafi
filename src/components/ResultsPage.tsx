import { useEffect, useState } from 'react';
import { Phone, MapPin, Search, ArrowLeft, Hammer, User, Loader2, MessageCircle, Star } from 'lucide-react';
import { supabase, type Artisan } from '@/lib/supabase';
import { CITIES, SERVICE_TYPES, PLACEHOLDER_PHOTOS } from '@/lib/constants';
import Seo from '@/components/Seo';

type Props = {
  initialService: string;
  initialCity: string;
  onBack: () => void;
  onSelectArtisan?: (slug: string) => void;
};

export default function ResultsPage({ initialService, initialCity, onBack, onSelectArtisan }: Props) {
  const [service, setService] = useState(initialService);
  const [city, setCity] = useState(initialCity);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtisans = async (svc: string, c: string) => {
    setLoading(true);
    setError(null);

    let query = supabase.from('artisans').select('*').order('created_at', { ascending: false });

    if (svc) {
      query = query.ilike('service_type', `%${svc}%`);
    }
    if (c) {
      query = query.ilike('city', `%${c}%`);
    }

    try {
      const { data, error: err } = await query;

      if (err) {
        console.error('Loading search results failed:', err);
        setError('ما قدرناش نجيبو النتائج. عاود حاول.');
        setArtisans([]);
      } else {
        const sorted = [...(data ?? [])].sort(
          (a, b) => Number(b.is_featured) - Number(a.is_featured)
        );
        setArtisans(sorted);
      }
    } catch (err) {
      console.error('Search request threw:', err);
      setError('ما قدرناش نجيبو النتائج. عاود حاول.');
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans(initialService, initialCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialService, initialCity]);

  const handleSearch = () => {
    fetchArtisans(service.trim(), city);
  };

  const getPhoto = (artisan: Artisan, index: number) => {
    if (artisan.photo_url) return artisan.photo_url;
    return PLACEHOLDER_PHOTOS[index % PLACEHOLDER_PHOTOS.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Seo
        title={`${initialService || 'حرفيين'} في ${initialCity || 'المغرب'} | سي الحرفي - Artisan Marocain`}
        description={`دليل ${initialService || 'الحرفيين'} في ${initialCity || 'المغرب'}. Moroccan crafts, artisan marocain, zellige, pottery, tapis marocain.`}
        path="/results"
      />
      {/* Search header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition mb-3 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>الرجوع للرئيسية</span>
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                list="service-list-2"
                value={service}
                onChange={(e) => setService(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="نوع الخدمة..."
                className="w-full pr-11 pl-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-right"
              />
              <datalist id="service-list-2">
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div className="relative sm:w-48">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pr-11 pl-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-right appearance-none bg-white cursor-pointer"
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
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition"
            >
              <Search className="w-5 h-5" />
              <span>قلّب</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Results count */}
        {!loading && !error && (
          <div className="mb-6">
            <h1 className="text-lg font-bold text-gray-900">
              {artisans.length > 0
                ? `${artisans.length} حرفي${artisans.length > 10 ? '' : 'ين'} ${
                    service ? `فـ ${service}` : ''
                  } ${city ? `فـ ${city}` : ''}`
                : 'ما لقينا حتى حرفي'}
            </h1>
            <h2 className="text-sm text-gray-500 mt-1">
              Artisan marocain, moroccan crafts - {service || 'all services'} in {city || 'Morocco'}
            </h2>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
            <p className="text-sm">كنقلبو ليك...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={handleSearch}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition text-sm font-medium"
            >
              عاود حاول
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && artisans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Hammer className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              ما كاينش حرفيين بهاد المعايير
            </h3>
            <p className="text-gray-400 text-sm">
              بدّل نوع الخدمة أو المدينة وعاود قلّب.
            </p>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && artisans.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {artisans.map((artisan, i) => (
              <div
                key={artisan.id}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                {/* Photo */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={getPhoto(artisan, i)}
                    alt={`${artisan.name} - ${artisan.service_type} (artisan marocain) في ${artisan.city}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                    {artisan.service_type}
                  </div>
                  {artisan.is_featured && (
                    <div className="absolute top-3 left-3 bg-[#FFD700] text-black rounded-full px-2.5 py-1 text-xs font-bold shadow-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-black" />
                      مميز
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg truncate">{artisan.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{artisan.city}</span>
                      </div>
                    </div>
                  </div>

                  {artisan.slug && onSelectArtisan && (
                    <button
                      onClick={() => onSelectArtisan(artisan.slug!)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 text-right transition"
                    >
                      صف الحرفي ←
                    </button>
                  )}

                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-4 bg-gray-50 rounded-lg px-3 py-2">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span dir="ltr" className="font-medium tracking-wide">
                      {artisan.phone}
                    </span>
                  </div>

                  <a
                    href={`tel:${artisan.phone.replace(/\s/g, '')}`}
                    className="mt-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 rounded-xl transition shadow-md shadow-green-600/20"
                  >
                    <Phone className="w-5 h-5" />
                    <span>اتصل دابا</span>
                  </a>
                  <a
                    href={`https://wa.me/212${artisan.phone.replace(/^0/, '')}?text=السلام عليكم، لقيت نمرتك فدليل الحرفيين`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.05 4.94A9.82 9.82 0 0012.04 2C6.58 2 2.13 6.42 2.13 11.85c0 1.74.45 3.43 1.32 4.92L2.05 22l5.39-1.41a9.8 9.8 0 004.6 1.17h.01c5.46 0 9.91-4.42 9.91-9.86a9.77 9.77 0 00-2.91-6.96z"/></svg>
                    تواصل عبر واتساب
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
