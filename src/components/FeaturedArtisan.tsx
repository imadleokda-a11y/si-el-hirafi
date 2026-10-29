import { Star, Hammer, MapPin, MessageCircle } from 'lucide-react';

export default function FeaturedArtisan() {
  return (
    <div className="mx-4 my-6 p-5 rounded-[20px] bg-[#FFF9C4] border-2 border-[#FFD700] shadow-[0_8px_30px_rgba(255,215,0,0.2)] relative max-w-md sm:max-w-lg mx-auto">
      <div className="absolute -top-3 right-6 bg-[#FFD700] text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
        مميز <Star className="w-4 h-4 fill-black" />
      </div>
      <div className="text-center pt-2">
        <div className="w-24 h-24 mx-auto rounded-full border-4 border-[#FFD700] bg-white flex items-center justify-center text-4xl">
          👷
        </div>
        <h2 className="text-2xl font-bold mt-3 text-[#3E2723]">عبد الرحيم</h2>
        <p className="flex items-center justify-center gap-2 mt-2 text-gray-700">
          <Hammer className="w-5 h-5 text-[#FFB300]" /> بناي محترف
        </p>
        <p className="flex items-center justify-center gap-2 mt-1 text-gray-700">
          <MapPin className="w-5 h-5 text-[#FFB300]" /> أكادير
        </p>

        <div className="flex items-center justify-center gap-1 mt-3">
          <span className="text-[#FFB300]">★★★★★</span>
          <span className="text-sm">4.9 (120 تقييم)</span>
        </div>
        <a
          href="https://wa.me/212629065883?text=السلام عليكم، لقيت نمرتك فدليل الحرفيين"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all block"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.05 4.94A9.82 9.82 0 0012.04 2C6.58 2 2.13 6.42 2.13 11.85c0 1.74.45 3.43 1.32 4.92L2.05 22l5.39-1.41a9.8 9.8 0 004.6 1.17h.01c5.46 0 9.91-4.42 9.91-9.86a9.77 9.77 0 00-2.91-6.96z"/></svg>
          تواصل عبر واتساب
        </a>
      </div>
    </div>
  );
}
