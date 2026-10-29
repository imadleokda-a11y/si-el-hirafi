import { useState } from 'react';
import {
  User,
  Phone,
  Hammer,
  MapPin,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { supabase, type ArtisanInput } from '@/lib/supabase';
import { CITIES, SERVICE_TYPES } from '@/lib/constants';

type Props = {
  onBack: () => void;
};

export default function RegisterPage({ onBack }: Props) {
  const [form, setForm] = useState<ArtisanInput>({
    name: '',
    phone: '',
    whatsapp: '',
    service_type: '',
    city: '',
    photo_url: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.service_type.trim() ||
      !form.city.trim()
    ) {
      setError('عمّر جميع الحقول المطلوبة (*)');
      return;
    }

    setSubmitting(true);
    const payload: ArtisanInput = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp?.trim() || null,
      service_type: form.service_type.trim(),
      city: form.city.trim(),
      photo_url: form.photo_url?.trim() || null,
    };

    const { error: err } = await supabase.from('artisans').insert(payload);

    setSubmitting(false);

    if (err) {
      setError('ما قدرناش نسجلوك. عاود حاول من بعد.');
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            تسجلت بنجاح!
          </h2>
          <p className="text-gray-500 mb-6 leading-relaxed">
            تسجلت بنجاح. غادي نبان ديالك فالنتائج باش الكليان يقدر يتصل بيك ديريكت.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20"
          >
            الرجوع للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-blue-100 hover:text-white transition mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>الرجوع للرئيسية</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">سجل راسك كحرفي</h1>
          <p className="text-blue-100 text-sm sm:text-base">
            عمّر المعلومات وتسجل فالدليل باش الكليان يلقاك ويتصل بيك مباشرة.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <User className="w-4 h-4 inline ml-1" />
              الاسم *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="الاسم ديالك الكامل"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-right"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Hammer className="w-4 h-4 inline ml-1" />
              الحرفة *
            </label>
            <input
              type="text"
              list="service-list-register"
              value={form.service_type}
              onChange={(e) => setForm({ ...form, service_type: e.target.value })}
              placeholder="بلومبي، نجار، كهربائي..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-right"
            />
            <datalist id="service-list-register">
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <MapPin className="w-4 h-4 inline ml-1" />
              المدينة *
            </label>
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-right appearance-none bg-white cursor-pointer"
            >
              <option value="">اختار المدينة</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Phone className="w-4 h-4 inline ml-1" />
              رقم الهاتف *
            </label>
            <input
              type="tel"
              dir="ltr"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="06XXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-left"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <MessageCircle className="w-4 h-4 inline ml-1" />
              واتساب
            </label>
            <input
              type="tel"
              dir="ltr"
              value={form.whatsapp ?? ''}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="06XXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-left"
            />
            <p className="text-xs text-gray-400 mt-1">اختياري - إلى كان عندك واتساب</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              رابط الصورة (اختياري)
            </label>
            <input
              type="url"
              dir="ltr"
              value={form.photo_url ?? ''}
              onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-left"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span>سجل</span>
          </button>
        </div>
      </div>
    </div>
  );
}
