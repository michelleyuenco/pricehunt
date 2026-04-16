import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './application/context/AuthContext';
import { LanguageProvider, type Language } from './application/context/LanguageContext';
import { Navbar } from './presentation/components/Navbar';
import { HomePage } from './presentation/pages/HomePage';
import { RecordPricePage } from './presentation/pages/RecordPricePage';
import { MyRecordsPage } from './presentation/pages/MyRecordsPage';
import { ProductDetailPage } from './presentation/pages/ProductDetailPage';

function getDefaultLang(): Language {
  try {
    const saved = localStorage.getItem('gaakgaa-lang');
    if (saved === 'en' || saved === 'zh') return saved;
  } catch {}
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('en') ? 'en' : 'zh';
}

function LocaleWrapper() {
  const { lang: urlLang } = useParams();
  const validLang: Language = (urlLang === 'en' || urlLang === 'zh') ? urlLang : 'zh';

  return (
    <LanguageProvider initialLang={validLang}>
      <div className="min-h-screen bg-[#050505]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/record" element={<RecordPricePage />} />
          <Route path="/my-records" element={<MyRecordsPage />} />
          <Route path="/product/:code" element={<ProductDetailPage />} />
        </Routes>
        <Navbar />
      </div>
    </LanguageProvider>
  );
}

function RootRedirect() {
  const defaultLang = getDefaultLang();
  return <Navigate to={`/${defaultLang}/`} replace />;
}

function App() {
  const defaultLang = getDefaultLang();

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/:lang/*" element={<LocaleWrapper />} />
          <Route path="*" element={<Navigate to={`/${defaultLang}/`} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
