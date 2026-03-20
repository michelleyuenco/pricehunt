import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { CITIES } from '../../domain/constants/locations';
import { firestoreRepo } from '../../infrastructure/firebase/FirestoreRequestRepository';
import { useLanguage } from '../../application/context/LanguageContext';
import { BarChart3, MessageSquare, ThumbsUp, User } from 'lucide-react';

interface Leader {
  userId: string;
  userName: string;
  userPhoto: string;
  count: number;
  helpfulVotes: number;
}

export function CommunityPage() {
  const { t } = useLanguage();
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    firestoreRepo.getTotalCounts().then(({ requests, responses }) => {
      setTotalRequests(requests);
      setTotalResponses(responses);
    });

    const unsub = firestoreRepo.subscribeResponderLeaderboard(setLeaders);
    return unsub;
  }, []);

  const citiesCovered = CITIES.length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      <PageHeader title={t('community.title')} subtitle={t('community.subtitle')} />

      {/* Community stats */}
      <div className="relative px-4 py-6 overflow-hidden">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-40 bg-green-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto lg:px-4 relative">
          <h2 className="text-sm font-bold text-white/50 mb-4 uppercase tracking-widest flex items-center gap-2">
            <BarChart3 size={16} className="text-white/50" /> {t('community.stats.title')}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center lg:p-6">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent lg:text-4xl">
                {totalRequests}
              </div>
              <div className="text-xs text-white/40 mt-1 lg:text-sm">{t('community.stats.requests')}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center lg:p-6">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent lg:text-4xl">
                {totalResponses}
              </div>
              <div className="text-xs text-white/40 mt-1 lg:text-sm">{t('community.stats.responses')}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center lg:p-6">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent lg:text-4xl">
                {citiesCovered}
              </div>
              <div className="text-xs text-white/40 mt-1 lg:text-sm">{t('community.stats.cities')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-4 py-2 max-w-7xl mx-auto lg:px-8">
        <h3 className="font-bold text-white/80 text-base mb-3 tracking-tight">🏅 {t('community.leaderboard')}</h3>
        {leaders.length === 0 ? (
          <div className="card p-6 text-center max-w-lg mx-auto">
            <div className="flex justify-center mb-2 opacity-30">
              <MessageSquare size={40} className="text-white/40" />
            </div>
            <p className="font-medium text-white/50">{t('community.leaderboard.empty')}</p>
            <p className="text-sm mt-1 text-white/30">{t('community.leaderboard.emptyDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {leaders.map((leader, index) => (
              <div key={leader.userId} className={`card p-4 ${index === 0 ? 'border-amber-500/20 bg-amber-500/5' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    index === 0 ? 'bg-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]' :
                    index === 1 ? 'bg-white/10 text-white/60' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/5 text-white/30'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                  </div>

                  {leader.userPhoto && leader.userPhoto.startsWith('http') ? (
                    <img
                      src={leader.userPhoto}
                      alt="avatar"
                      className={`w-9 h-9 rounded-full flex-shrink-0 ring-1 ${index === 0 ? 'ring-amber-500/40' : 'ring-white/10'}`}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-green-500/20 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-green-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white">{leader.userName}</div>
                    <div className="flex items-center gap-3 text-xs text-white/30 mt-0.5">
                      <span className="flex items-center gap-1"><MessageSquare size={10} className="text-current" /> {leader.count} {t('community.leader.responses')}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={10} className="text-current" /> {leader.helpfulVotes} {t('community.leader.helpful')}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-extrabold text-green-400">{leader.count}</div>
                    <div className="text-xs text-white/30">{t('community.leader.count')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
