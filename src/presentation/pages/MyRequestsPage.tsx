import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { RequestCard } from '../components/RequestCard';
import { FloatingButton } from '../components/FloatingButton';
import { MOCK_REQUESTS } from '../../infrastructure/data/mockRequests';

// Treat 'u1' as the current logged-in user
const CURRENT_USER_ID = 'u1';

type FilterTab = 'all' | 'waiting' | 'answered';

export function MyRequestsPage() {
  const [tab, setTab] = useState<FilterTab>('all');

  const myRequests = MOCK_REQUESTS.filter(r => r.userId === CURRENT_USER_ID);

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
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="我的需求 My Requests" subtitle="查看你發起的格價需求" />

      {/* Stats summary */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          <div className="text-center">
            <div className="text-xl font-bold text-primary-600">{myRequests.length}</div>
            <div className="text-xs text-gray-500">全部需求</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="text-xl font-bold text-orange-500">{waitingCount}</div>
            <div className="text-xs text-gray-500">待回覆</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{answeredCount}</div>
            <div className="text-xs text-gray-500">已回覆</div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-lg mx-auto flex gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{t.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab === t.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📋</div>
              <p className="font-medium">
                {tab === 'all' ? '還沒有格價需求' : tab === 'waiting' ? '沒有待回覆的需求' : '沒有已回覆的需求'}
              </p>
              {tab === 'all' && (
                <Link
                  to="/request/new"
                  className="mt-4 inline-flex items-center gap-2 bg-primary-500 text-white font-bold px-5 py-2.5 rounded-xl active:scale-95 transition-all duration-150"
                >
                  <span>＋</span>
                  <span>發起第一個格價需求</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map(r => (
                <RequestCard key={r.id} request={r} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingButton />
    </div>
  );
}
