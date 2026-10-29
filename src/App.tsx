import { Home, Hammer, ShieldCheck, UserPlus } from 'lucide-react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams, useLocation, Navigate } from 'react-router-dom';
import HomePage from '@/components/HomePage';
import ResultsPage from '@/components/ResultsPage';
import AdminPage from '@/components/AdminPage';
import RegisterPage from '@/components/RegisterPage';
import LoginPage from '@/components/LoginPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import ArtisanDetailPage from '@/components/ArtisanDetailPage';
import Footer from '@/components/Footer';
import PrivacyPage from '@/components/PrivacyPage';
import TermsPage from '@/components/TermsPage';

function HomePageRoute() {
  const navigate = useNavigate();
  return (
    <HomePage
      onSearch={(service, city) => {
        const params = new URLSearchParams();
        if (service) params.set('service', service);
        if (city) params.set('city', city);
        navigate(`/results?${params.toString()}`);
      }}
      onRegister={() => navigate('/register')}
    />
  );
}

function ResultsPageRoute() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  return (
    <ResultsPage
      initialService={params.get('service') ?? ''}
      initialCity={params.get('city') ?? ''}
      onBack={() => navigate('/')}
      onSelectArtisan={(slug) => navigate(`/artisan/${slug}`)}
    />
  );
}

function RegisterPageRoute() {
  const navigate = useNavigate();
  return <RegisterPage onBack={() => navigate('/')} />;
}

function AdminPageRoute() {
  const navigate = useNavigate();
  return (
    <AdminPage
      onBack={() => navigate('/')}
      onLogout={() => {
        localStorage.removeItem('isAdmin');
        navigate('/');
      }}
    />
  );
}

function Shell() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans antialiased">
      {!isLogin && (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 font-bold text-gray-900"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Hammer className="w-5 h-5 text-white" />
              </div>
              <span className="text-base">سي الحرفي</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition text-gray-500 hover:bg-gray-100"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">الرئيسية</span>
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition text-gray-500 hover:bg-gray-100"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">سجل راسك كحرفي</span>
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition text-gray-500 hover:bg-gray-100"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">لوحة التحكم</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<HomePageRoute />} />
        <Route path="/results" element={<ResultsPageRoute />} />
        <Route path="/register" element={<RegisterPageRoute />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/artisan/:slug" element={<ArtisanDetailPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPageRoute />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isLogin && <Footer />}

      {!isLogin && (
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="https://wa.me/212629065883?text=السلام، بغيت نسول على الاشتراك المميز"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center text-white text-2xl"
          >
            💬
          </a>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
