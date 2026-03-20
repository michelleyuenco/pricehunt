import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './application/context/AuthContext';
import { Navbar } from './presentation/components/Navbar';
import { HomePage } from './presentation/pages/HomePage';
import { ExplorePage } from './presentation/pages/ExplorePage';
import { RequestDetailPage } from './presentation/pages/RequestDetailPage';
import { CreateRequestPage } from './presentation/pages/CreateRequestPage';
import { StoresPage } from './presentation/pages/StoresPage';
import { CommunityPage } from './presentation/pages/CommunityPage';
import { MyRequestsPage } from './presentation/pages/MyRequestsPage';
import { OfficialPricePage } from './presentation/pages/OfficialPricePage';
import { BlogPage } from './presentation/pages/BlogPage';
import { BlogArticlePage } from './presentation/pages/BlogArticlePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0A0A0A]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/request/:id" element={<RequestDetailPage />} />
            <Route path="/request/new" element={<CreateRequestPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/my-requests" element={<MyRequestsPage />} />
            <Route path="/official-price/:code" element={<OfficialPricePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogArticlePage />} />
          </Routes>
          <Navbar />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
