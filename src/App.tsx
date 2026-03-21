import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './application/context/AuthContext';
import { LanguageProvider, type Language } from './application/context/LanguageContext';
import { Navbar } from './presentation/components/Navbar';
import { FloatingButton } from './presentation/components/FloatingButton';
import { HomePage } from './presentation/pages/HomePage';
import { ExplorePage } from './presentation/pages/ExplorePage';
import { RequestDetailPage } from './presentation/pages/RequestDetailPage';
import { CreateRequestPage } from './presentation/pages/CreateRequestPage';
import { StoresPage } from './presentation/pages/StoresPage';
import { CommunityPage } from './presentation/pages/CommunityPage';
import { MyRequestsPage } from './presentation/pages/MyRequestsPage';
import { AllPricesPage } from './presentation/pages/AllPricesPage';
import { OfficialPricePage } from './presentation/pages/OfficialPricePage';
import { BlogPage } from './presentation/pages/BlogPage';
import { BlogArticlePage } from './presentation/pages/BlogArticlePage';
import { RecordPricePage } from './presentation/pages/RecordPricePage';
import { MyRecordsPage } from './presentation/pages/MyRecordsPage';

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
      <div className="min-h-screen bg-[#050505] dot-grid noise-overlay pb-20 lg:pb-0 lg:pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/request/:id" element={<RequestDetailPage />} />
          <Route path="/request/new" element={<CreateRequestPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
          <Route path="/prices" element={<AllPricesPage />} />
          <Route path="/official-price/:code" element={<OfficialPricePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
          <Route path="/record" element={<RecordPricePage />} />
          <Route path="/my-records" element={<MyRecordsPage />} />
        </Routes>
        <Navbar />
        <FloatingButton />
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
          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Locale-prefixed routes */}
          <Route path="/:lang/*" element={<LocaleWrapper />} />

          {/* Backward compat: catch-all redirects old URLs to locale-prefixed */}
          <Route path="*" element={<Navigate to={`/${defaultLang}/`} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
