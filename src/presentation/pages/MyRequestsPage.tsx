import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { RequestCard } from '../components/RequestCard';
import { FloatingButton } from '../components/FloatingButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../../application/context/AuthContext';
import { useUserRequests } from '../../application/hooks/useRequests';

type FilterTab = 'all' | 'waiting' | 'answered';

export function MyRequestsPage() {
  const { user, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState<FilterTab>('all');
  const { requests: myRequests, loading } = useUserRequests(user?.uid ?? '');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
        <PageHeader title="我的需求 My Requests" subtitle="查看你發起的格價需求" />
        <div className="px-4 py-12 max-w-lg mx-auto text-center">
          <div className="text-6xl mb-4 opacity-30">🔑</div>
          <h2 className="text-xl font-bold text-white mb-2">請先登入</h2>
          <p className="text-white/40 mb-6 text-sm">Sign in to view your price requests.</p>
          <button onClick={signInWithGoogle} className="btn-primary px-8 py-3">
            Google 登入 Sign In
          </button>
        </div>
      </div>
    );
  }

  const filtered = tab === 'all'
    ? myRequests
    : myRequests.filter(r => r.status === tab);

  const waitingCount = myRequests.filter(r => r.status === 'waiting').length;
  const answeredCount = myRequests.filter(r => r.status === 'answered').length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: myRequests.length },
    { key: 'waiting', label: '待回覆', count: waitingCount },
    { key: 'answered', label: '已回覆', count: answeredCount },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      <PageHeader title="我的需求 My Requests" subtitle="查看你發起的格價需求" />

      {/* Stats summary */}
      <div className="border-b border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto lg:px-4 flex items-center justify-around lg:justify-start lg:gap-12">
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{myRequests.length}</div>
            <div className="text-xs text-white/40">全部需求</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-xl font-bold text-amber-400">{waitingCount}</div>
            <div className="text-xs text-white/40">待回覆</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{answeredCount}</div>
            <div className="text-xs text-white/40">已回覆</div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-white/10 px-4 py-2">
        <div className="max-w-7xl mx-auto lg:px-4 flex gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.key
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <span>{t.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab === t.key
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/5 text-white/30'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 max-w-7xl mx-auto lg:px-8">
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 opacity-30">📋</div>
            <p className="font-medium text-white/50">
              {tab === 'all' ? '還沒有格價需求' : tab === 'waiting' ? '沒有待回覆的需求' : '沒有已回覆的需求'}
            </p>
            {tab === 'all' && (
              <Link
                to="/request/new"
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 transition-all duration-200"
              >
                <span>＋</span>
                <span>發起第一個格價需求</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(r => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </div>

      <FloatingButton />
    </div>
  );
}
