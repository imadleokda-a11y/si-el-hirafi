import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Phone,
  MapPin,
  Hammer,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Search,
  Star,
  LogOut,
  Pencil,
  Upload,
} from 'lucide-react';
import { supabase, type Artisan } from '@/lib/supabase';
import { PLACEHOLDER_PHOTOS } from '@/lib/constants';
import AdminStats from '@/components/admin/AdminStats';
import ArtisanFormModal from '@/components/admin/ArtisanFormModal';
import ArtisanCsvImportModal from '@/components/admin/ArtisanCsvImportModal';

type Props = {
  onBack: () => void;
  onLogout: () => void;
};

type ModalState = { type: 'none' } | { type: 'form'; artisan: Artisan | null } | { type: 'csv' };

export default function AdminPage({ onBack, onLogout }: Props) {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  const fetchArtisans = async () => {
    setError(null);
    const [artisansRes, leadsRes] = await Promise.all([
      supabase.from('artisans').select('*').order('created_at', { ascending: false }),
      supabase.rpc('count_service_leads'),
    ]);
    if (artisansRes.error) {
      setError('ما قدرناش نجيبو الحرفيين.');
    } else {
      setArtisans(artisansRes.data ?? []);
    }
    setQuoteRequests(leadsRes.error ? null : Number(leadsRes.data));
    setLoading(false);
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  const closeModal = () => setModal({ type: 'none' });

  const handleSaved = () => {
    closeModal();
    fetchArtisans();
  };

  const handleDelete = async (artisan: Artisan) => {
    if (!window.confirm(`واش متأكد بغيتي تمسح "${artisan.name}"؟`)) return;

    const { error: err } = await supabase.from('artisans').delete().eq('id', artisan.id);
    if (err) {
      setError('ما قدرناش نمسحو الحرفي.');
      return;
    }
    fetchArtisans();
  };

  const handleToggleFeatured = async (artisan: Artisan) => {
    const next = !artisan.is_featured;
    const { error: err } = await supabase
      .from('artisans')
      .update({ is_featured: next, payment_status: next ? 'paid' : 'pending' })
      .eq('id', artisan.id);
    if (err) {
      setError('ما قدرناش نبدلو حالة التمييز.');
      return;
    }
    fetchArtisans();
  };

  const filteredArtisans = artisans.filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.service_type.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q)
    );
  });

  const getPhoto = (artisan: Artisan, index: number) => {
    if (artisan.photo_url) return artisan.photo_url;
    return PLACEHOLDER_PHOTOS[index % PLACEHOLDER_PHOTOS.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition mb-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>الرجوع للرئيسية</span>
          </button>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-sky-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold">لوحة التحكم</h1>
                <p className="text-slate-300 text-sm">إدارة الحرفيين والخدمات</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setModal({ type: 'csv' })}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl transition"
                title="استيراد CSV"
              >
                <Upload className="w-5 h-5" />
                <span className="hidden sm:inline">استيراد CSV</span>
              </button>
              <button
                onClick={() => setModal({ type: 'form', artisan: null })}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">زيد حرفي</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-red-600/20"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {!loading && !error && (
          <AdminStats artisans={artisans} quoteRequests={quoteRequests} />
        )}

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="قلّب على حرفي (الاسم، الخدمة، المدينة)..."
            className="w-full pr-11 pl-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-right bg-white"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
            <p className="text-sm">كنقراو...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && filteredArtisans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Hammer className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              {search ? 'ما لقينا حتى نتيجة' : 'ما كاين حتى حرفي'}
            </h3>
            <p className="text-gray-400 text-sm">
              {search ? 'بدّل كلمة البحث.' : 'بدا بزيادة أول حرفي.'}
            </p>
          </div>
        )}

        {!loading && !error && filteredArtisans.length > 0 && (
          <div className="space-y-3">
            {filteredArtisans.map((artisan, i) => (
              <div
                key={artisan.id}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition p-3"
              >
                <img
                  src={getPhoto(artisan, i)}
                  alt={artisan.name}
                  loading="lazy"
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 truncate">{artisan.name}</h3>
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold rounded-full px-2 py-0.5 flex-shrink-0">
                      {artisan.service_type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {artisan.city}
                    </span>
                    <span className="flex items-center gap-1" dir="ltr">
                      <Phone className="w-3.5 h-3.5" />
                      {artisan.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                      {artisan.rating}/5 · {artisan.completed_jobs} خدمة
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleFeatured(artisan)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      artisan.is_featured
                        ? 'bg-[#FFD700] text-black hover:bg-[#FFC700]'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={artisan.is_featured ? 'إلغاء التمييز' : 'تفعيل مميز'}
                  >
                    <Star className={`w-4 h-4 ${artisan.is_featured ? 'fill-black' : ''}`} />
                    <span className="hidden md:inline">{artisan.is_featured ? 'مميز' : 'تفعيل مميز'}</span>
                  </button>
                  <button
                    onClick={() => setModal({ type: 'form', artisan })}
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                    title="تعديل"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(artisan)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-red-500 hover:bg-red-50 transition"
                    title="مسح"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.type === 'form' && (
        <ArtisanFormModal
          artisan={modal.artisan}
          existingSlugs={artisans.map((a) => a.slug).filter((s): s is string => Boolean(s))}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}

      {modal.type === 'csv' && (
        <ArtisanCsvImportModal
          existingSlugs={artisans.map((a) => a.slug).filter((s): s is string => Boolean(s))}
          onClose={closeModal}
          onImported={handleSaved}
        />
      )}
    </div>
  );
}
