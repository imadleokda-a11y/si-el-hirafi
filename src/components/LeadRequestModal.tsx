import { useState } from 'react';
import { X, Loader2, Hammer, MapPin, FileText, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CITIES, SERVICE_TYPES } from '@/lib/constants';

type Props = {
  onClose: () => void;
};

const PHONE_PATTERN = /^[5-7][0-9]{8}$/;

export default function LeadRequestModal({ onClose }: Props) {
  const [serviceType, setServiceType] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [localPhone, setLocalPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const digits = localPhone.replace(/\s/g, '');
    if (!serviceType.trim() || !city || !description.trim()) {
      setFormError('عمّر جميع الحقول المطلوبة.');
      return;
    }
    if (!PHONE_PATTERN.test(digits)) {
      setFormError('رقم الهاتف خاصو يكون 9 أرقام بعد +212 (مثلاً 612345678).');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('service_leads').insert({
      service_type: serviceType.trim(),
      city,
      description: description.trim(),
      phone: `+212${digits}`,
    });
    setSubmitting(false);

    if (error) {
      setFormError('ما قدرناش نصيفطو الطلب. عاود حاول.');
      return;
    }
    setDone(true);
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-right bg-white';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">طلب دوفي فابور - مجانا</h2>
            <p className="text-sm text-gray-500">قول لينا أشنو بغيتي، ونوصلك بالحرفي المناسب.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="سد"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">تم استلام طلبك</h3>
            <p className="text-gray-500 text-sm mb-6">غادي نتواصلو معاك فأقرب وقت باش نلقاو ليك الحرفي المناسب.</p>
            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              سد
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Hammer className="w-4 h-4 inline ml-1" />
                نوع الخدمة *
              </label>
              <input
                type="text"
                list="lead-service-list"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="بلومبي، صباغ، زليج..."
                className={inputClass}
              />
              <datalist id="lead-service-list">
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
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
                <FileText className="w-4 h-4 inline ml-1" />
                وصف المشروع *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="شرح ليّ شنو خاصك، مثلاً: تصليح حمام كامل..."
                className={`${inputClass} resize-none`}
              />
              <p className="text-xs text-gray-400 mt-1 text-left">{description.length}/1000</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Phone className="w-4 h-4 inline ml-1" />
                رقم الهاتف *
              </label>
              <div dir="ltr" className="flex items-stretch rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 overflow-hidden bg-white">
                <span className="flex items-center px-3 bg-gray-50 text-gray-600 font-medium border-r border-gray-200">
                  +212
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={localPhone}
                  onChange={(e) => setLocalPhone(e.target.value)}
                  placeholder="612345678"
                  className="flex-1 px-4 py-2.5 outline-none text-left tracking-wide"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-800">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>🔒 معلوماتك محمية بترخيص CNDP ولن يتم مشاركة رقمك</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3.5 rounded-xl transition shadow-md shadow-green-600/20 disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>صيفط الطلب مجانا</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
