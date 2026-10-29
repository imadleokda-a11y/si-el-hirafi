import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, MapPin, ArrowLeft, Hammer, User, Loader2, Star, MessageCircle } from 'lucide-react';
import { supabase, type Artisan } from '@/lib/supabase';
import { PLACEHOLDER_PHOTOS } from '@/lib/constants';
import Seo from '@/components/Seo';
import { SITE_URL } from '@/lib/constants';

export default function ArtisanDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from('artisans')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError(true);
        } else {
          setArtisan(data as Artisan);
        }
        setLoading(false);
      });
  }, [slug]);

  const photo = artisan
    ? artisan.photo_url || PLACEHOLDER_PHOTOS[0]
    : PLACEHOLDER_PHOTOS[0];

  const seoTitle = artisan
    ? `${artisan.name} - ${artisan.service_type} في ${artisan.city} | سي الحرفي`
    : 'حرفي مغربي | سي الحرفي';

  const seoDesc = artisan
    ? `${artisan.name} ${artisan.service_type} في ${artisan.city}, المغرب. اتصل مباشرة أو راسل عبر واتساب. Artisan marocain, moroccan crafts.`
    : 'دليل الحرفيين المغاربة. Moroccan artisan, artisan marocain, zellige, pottery, tapis marocain.';

  const jsonLd = artisan
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: artisan.name,
        telephone: artisan.phone,
        image: photo,
        address: {
          '@type': 'PostalAddress',
          addressLocality: artisan.city,
          addressCountry: 'MA',
        },
        areaServed: 'Morocco',
        description: `${artisan.name} - ${artisan.service_type} في ${artisan.city}`,
        url: `${SITE_URL}/artisan/${slug}`,
      }
    : undefined;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
        <p className="text-sm">كنقراو...</p>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <Seo title="حرفي غير موجود | سي الحرفي" description="الصفحة المطلوبة غير موجودة" path="/artisan" />
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Hammer className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-xl font-bold text-gray-700 mb-2">ما لقينا هذا الحرفي</h1>
        <p className="text-gray-400 text-sm mb-6">ربما تم حذفه أو أن الرابط غير صحيح.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          الرجوع للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Seo title={seoTitle} description={seoDesc} path={`/artisan/${slug}`} jsonLd={jsonLd} />

      <div className="max-w-2xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition mb-4 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>الرجوع للرئيسية</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="relative h-64 sm:h-72 bg-gray-100">
            <img
              src={photo}
              alt={`${artisan.name} - ${artisan.service_type} في ${artisan.city}`}
              className="w-full h-full object-cover"
            />
            {artisan.is_featured && (
              <div className="absolute top-4 left-4 bg-[#FFD700] text-black rounded-full px-3 py-1 text-sm font-bold shadow-sm flex items-center gap-1">
                <Star className="w-4 h-4 fill-black" />
                مميز
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm">
              {artisan.service_type}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{artisan.name}</h1>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{artisan.city}</span>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              {artisan.service_type} - Artisan marocain في {artisan.city}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {artisan.name} حرفي مغربي متخصص في {artisan.service_type} في مدينة {artisan.city}.
              تواصل مباشرة عبر الهاتف أو واتساب بدون وسيط. Moroccan crafts, artisan marocain.
            </p>

            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg px-4 py-3 mb-6">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span dir="ltr" className="font-medium tracking-wide text-lg">
                {artisan.phone}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-amber-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1 text-amber-600 mb-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`w-4 h-4 ${n <= artisan.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">التقييم {artisan.rating}/5</p>
              </div>
              <div className="bg-blue-50 rounded-xl px-4 py-3">
                <p className="text-2xl font-bold text-blue-700">{artisan.completed_jobs}</p>
                <p className="text-sm text-gray-600">خدمة منجزة</p>
              </div>
            </div>

            {artisan.gallery_urls.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-3">من أعماله</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {artisan.gallery_urls.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt={`من أعمال ${artisan.name}`}
                      loading="lazy"
                      className="w-full aspect-square rounded-xl object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <a
              href={`tel:${artisan.phone.replace(/\s/g, '')}`}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition shadow-md shadow-green-600/20 mb-3"
            >
              <Phone className="w-5 h-5" />
              <span>اتصل دابا</span>
            </a>
            <a
              href={`https://wa.me/212${(artisan.whatsapp ?? artisan.phone).replace(/\s/g, '').replace(/^0/, '')}?text=السلام عليكم، لقيت نمرتك فدليل الحرفيين`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition"
            >
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.05 4.94A9.82 9.82 0 0012.04 2C6.58 2 2.13 6.42 2.13 11.85c0 1.74.45 3.43 1.32 4.92L2.05 22l5.39-1.41a9.8 9.8 0 004.6 1.17h.01c5.46 0 9.91-4.42 9.91-9.86a9.77 9.77 0 00-2.91-6.96z" />
              </svg>
              تواصل عبر واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
