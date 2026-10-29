import { Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Hammer className="w-4 h-4 text-white" />
          </div>
          <span>© 2026 Si Hrafi - جميع الحقوق محفوظة</span>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/privacy" className="text-gray-500 hover:text-blue-600 transition">
            سياسة الخصوصية
          </Link>
          <Link to="/terms" className="text-gray-500 hover:text-blue-600 transition">
            شروط الاستخدام
          </Link>
        </nav>
      </div>
    </footer>
  );
}
