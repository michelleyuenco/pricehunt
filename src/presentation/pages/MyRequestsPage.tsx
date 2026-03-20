import { useState } from 'react';
import { LocaleLink } from '../components/LocaleLink';
import { PageHeader } from '../components/PageHeader';
import { RequestCard } from '../components/RequestCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../../application/context/AuthContext';
import { useUserRequests } from '../../application/hooks/useRequests';
import { useLanguage } from '../../application/context/LanguageContext';
import { Lock, ClipboardList, Plus } from 'lucide-react';

type FilterTab = 'all' | 'waiting' | 'answered';

export function MyRequestsPage() {
  const { user, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState<FilterTab>('all');
  const { requests: myRequests, loading } = useUserRequests(user?.uid ?? '');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
        <PageHeader title={t('my.title')} subtitle={t('my.subtitle')} />
        <div className="px-4 py-12 max-w-lg mx-auto text-center">
          <div className="flex justify-center mb-4 opacity-30">
            <Lock size={64} className="text-white/40" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t('my.signIn')}</h2>
          <p className="text-white/40 mb-6 text-sm">{t('my.signIn.desc')}</p>
          <button onClick={signInWithGoogle} className="btn-primary px-8 py-3">
            {t('my.signIn.btn')}
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
    { key: 'all', label: t('my.filter.all'), count: myRequests.length },
    { key: 'waiting', label: t('my.filter.waiting'), count: waitingCount },
    { key: 'answered', label: t('my.filter.answered'), count: answeredCount },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      <PageHeader title={t('my.title')} subtitle={t('my.subtitle')} />

      {/* Stats summary */}
      <div className="border-b border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto lg:px-4 flex items-center justify-around lg:justify-start lg:gap-12">
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{myRequests.length}</div>
            <div className="text-xs text-white/40">{t('my.stats.all')}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-xl font-bold text-amber-400">{waitingCount}</div>
            <div className="text-xs text-white/40">{t('my.stats.waiting')}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{answeredCount}</div>
            <div className="text-xs text-white/40">{t('my.stats.answered')}</div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-white/10 px-4 py-2">
        <div className="max-w-7xl mx-auto lg:px-4 flex gap-1">
          {tabs.map(t_ => (
            <button
              key={t_.key}
              onClick={() => setTab(t_.key)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t_.key
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <span>{t_.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab === t_.key
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/5 text-white/30'
              }`}>
                {t_.count}
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
            <div className="flex justify-center mb-4 opacity-30">
              <ClipboardList size={48} className="text-white/40" />
            </div>
            <p className="font-medium text-white/50">
              {tab === 'all' ? t('my.empty') : tab === 'waiting' ? t('my.empty.waiting') : t('my.empty.answered')}
            </p>
            {tab === 'all' && (
              <LocaleLink
                to="/request/new"
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 transition-all duration-200"
              >
                <Plus size={16} className="text-current" />
                <span>{t('my.emptyBtn')}</span>
              </LocaleLink>
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

    </div>
  );
}
