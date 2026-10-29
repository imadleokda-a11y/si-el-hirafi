import { useState, type ChangeEvent } from 'react';
import {
  X,
  Plus,
  Loader2,
  User,
  Phone,
  MessageCircle,
  Hammer,
  MapPin,
  Star,
  ImagePlus,
  Trash2,
} from 'lucide-react';
import { supabase, type Artisan, type ArtisanInput } from '@/lib/supabase';
import { CITIES, SERVICE_TYPES } from '@/lib/constants';
import { slugifyAscii, ensureUniqueSlug } from '@/lib/slugify';
import { uploadArtisanPhoto } from '@/lib/artisanPhotos';

type Props = {
  artisan: Artisan | null;
  existingSlugs: string[];
  onClose: () => void;
  onSaved: () => void;
};

const GALLERY_SLOTS = 4;

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white';

const fieldLabel = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function ArtisanFormModal({ artisan, existingSlugs, onClose, onSaved }: Props) {
  const isEdit = artisan !== null;
  const [name, setName] = useState(artisan?.name ?? '');
  const [phone, setPhone] = useState(artisan?.phone ?? '');
  const [whatsapp, setWhatsapp] = useState(artisan?.whatsapp ?? '');
  const [serviceType, setServiceType] = useState(artisan?.service_type ?? '');
  const [city, setCity] = useState(artisan?.city ?? '');
  const [rating, setRating] = useState(artisan?.rating ?? 0);
  const [completedJobs, setCompletedJobs] = useState(String(artisan?.completed_jobs ?? 0));
  const [photoUrl, setPhotoUrl] = useState(artisan?.photo_url ?? '');
  const [gallery, setGallery] = useState<string[]>(() => {
    const existing = artisan?.gallery_urls ?? [];
    return Array.from({ length: GALLERY_SLOTS }, (_, i) => existing[i] ?? '');
  });
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handlePhotoPick = async (e: ChangeEvent<HTMLInputElement>, slot: 'profile' | number) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const key = slot === 'profile' ? 'profile' : `gallery-${slot}`;
    setUploadingSlot(key);
    setFormError(null);
    try {
      const url = await uploadArtisanPhoto(file);
      if (slot === 'profile') {
        setPhotoUrl(url);
      } else {
        setGallery((prev) => prev.map((g, i) => (i === slot ? url : g)));
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'ما قدرناش نرفعو الصورة.');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!name.trim() || !phone.trim() || !serviceType.trim() || !city.trim()) {
      setFormError('عمّر جميع الحقول المطلوبة.');
      return;
    }
    const jobs = Number(completedJobs);
    if (!Number.isInteger(jobs) || jobs < 0) {
      setFormError('عدد الخدمات المنجزة خاصو يكون رقم صحيح.');
      return;
    }

    const payload: ArtisanInput = {
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || null,
      service_type: serviceType.trim(),
      city: city.trim(),
      photo_url: photoUrl.trim() || null,
      rating,
      completed_jobs: jobs,
      gallery_urls: gallery.filter((g) => g !== ''),
    };

    setSubmitting(true);
    const { error } = isEdit
      ? await supabase.from('artisans').update(payload).eq('id', artisan.id)
      : await supabase
          .from('artisans')
          .insert({
            ...payload,
            slug: ensureUniqueSlug(slugifyAscii(name.trim(), city.trim()), existingSlugs),
          });
    setSubmitting(false);

    if (error) {
      setFormError(isEdit ? 'ما قدرناش نسجلو التعديلات. عاود حاول.' : 'ما قدرناش نزيدو الحرفي. عاود حاول.');
      return;
    }
    onSaved();
  };

  const busy = submitting || uploadingSlot !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'تعديل الحرفي' : 'زيد حرفي جديد'}</h2>
          <button
            onClick={onClose}
            aria-label="سد"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{formError}</div>
          )}

          <div>
            <span className={fieldLabel}>الصورة الشخصية</span>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {photoUrl ? (
                  <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition">
                {uploadingSlot === 'profile' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                <span>{photoUrl ? 'بدّل الصورة' : 'رفع صورة'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={busy}
                  onChange={(e) => handlePhotoPick(e, 'profile')}
                />
              </label>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  حيد الصورة
                </button>
              )}
            </div>
          </div>

          <div>
            <label className={fieldLabel}>
              <User className="w-4 h-4 inline ml-1" />
              اسم الحرفي *
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={fieldLabel}>
                <Phone className="w-4 h-4 inline ml-1" />
                الهاتف *
              </label>
              <input type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06XXXXXXXX" className={`${inputClass} text-left`} />
            </div>
            <div>
              <label className={fieldLabel}>
                <MessageCircle className="w-4 h-4 inline ml-1" />
                واتساب
              </label>
              <input type="tel" dir="ltr" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="06XXXXXXXX" className={`${inputClass} text-left`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={fieldLabel}>
                <Hammer className="w-4 h-4 inline ml-1" />
                نوع الخدمة *
              </label>
              <input type="text" list="service-list-admin" value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="بلومبي..." className={inputClass} />
              <datalist id="service-list-admin">
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={fieldLabel}>
                <MapPin className="w-4 h-4 inline ml-1" />
                المدينة *
              </label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="">اختار المدينة</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={fieldLabel}>
                <Star className="w-4 h-4 inline ml-1" />
                التقييم
              </span>
              <div className="flex items-center gap-1" role="radiogroup" aria-label="التقييم">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} نجوم`}
                    onClick={() => setRating(rating === n ? 0 : n)}
                    className="p-0.5 transition hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${n <= rating ? 'fill-[#FFD700] text-[#FFD700]' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={fieldLabel}>الخدمات المنجزة</label>
              <input type="number" min={0} value={completedJobs} onChange={(e) => setCompletedJobs(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <span className={fieldLabel}>معرض الأعمال (حتى 4 صور)</span>
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden">
                  {url ? (
                    <>
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGallery((prev) => prev.map((g, idx) => (idx === i ? '' : g)))}
                        className="absolute top-1 left-1 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                        aria-label="حيد الصورة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 cursor-pointer transition">
                      {uploadingSlot === `gallery-${i}` ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={busy}
                        onChange={(e) => handlePhotoPick(e, i)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              إلغي
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              <span>{isEdit ? 'سجل التعديلات' : 'زيد'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
