import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './presentation/components/Navbar';
import { HomePage } from './presentation/pages/HomePage';
import { ExplorePage } from './presentation/pages/ExplorePage';
import { RequestDetailPage } from './presentation/pages/RequestDetailPage';
import { CreateRequestPage } from './presentation/pages/CreateRequestPage';
import { StoresPage } from './presentation/pages/StoresPage';
import { CommunityPage } from './presentation/pages/CommunityPage';
import { MyRequestsPage } from './presentation/pages/MyRequestsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/request/:id" element={<RequestDetailPage />} />
          <Route path="/request/new" element={<CreateRequestPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
        </Routes>
        <Navbar />
      </div>
    </BrowserRouter>
  );
}

export default App;
