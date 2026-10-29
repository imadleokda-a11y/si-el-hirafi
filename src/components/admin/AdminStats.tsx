import { Users, MapPin, MessageSquareText, Star } from 'lucide-react';
import type { Artisan } from '@/lib/supabase';

type Props = {
  artisans: Artisan[];
  quoteRequests: number | null;
};

export default function AdminStats({ artisans, quoteRequests }: Props) {
  const cities = new Set(artisans.map((a) => a.city)).size;
  const featured = artisans.filter((a) => a.is_featured).length;

  const cards = [
    { label: 'مجموع الحرفيين', value: artisans.length, icon: Users, tone: 'bg-blue-50 text-blue-600' },
    { label: 'المدن', value: cities, icon: MapPin, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'طلبات الخدمة', value: quoteRequests ?? '-', icon: MessageSquareText, tone: 'bg-rose-50 text-rose-600' },
    { label: 'حرفيين مميزين', value: featured, icon: Star, tone: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${tone}`}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
