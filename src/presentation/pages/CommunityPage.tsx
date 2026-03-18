import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { CITIES } from '../../domain/constants/locations';
import { firestoreRepo } from '../../infrastructure/firebase/FirestoreRequestRepository';

interface Leader {
  userId: string;
  userName: string;
  userPhoto: string;
  count: number;
  helpfulVotes: number;
}

export function CommunityPage() {
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
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14">
      <PageHeader title="社群 Community" subtitle="格價獵人排行榜" />

      {/* Community stats */}
      <div className="relative px-4 py-6 overflow-hidden">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-40 bg-green-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-lg mx-auto relative">
          <h2 className="text-sm font-bold text-white/50 mb-4 uppercase tracking-widest">📊 社群統計</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {totalRequests}
              </div>
              <div className="text-xs text-white/40 mt-1">格價需求</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {totalResponses}
              </div>
              <div className="text-xs text-white/40 mt-1">格價回覆</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {citiesCovered}
              </div>
              <div className="text-xs text-white/40 mt-1">涵蓋城市</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-4 py-2">
        <div className="max-w-lg mx-auto">
          <h3 className="font-bold text-white/80 text-base mb-3 tracking-tight">🏅 貢獻者排行</h3>
          {leaders.length === 0 ? (
            <div className="card p-6 text-center">
              <div className="text-4xl mb-2 opacity-30">🙋</div>
              <p className="font-medium text-white/50">還沒有回覆者</p>
              <p className="text-sm mt-1 text-white/30">成為第一個格價獵人！</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
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
                      <div className="w-9 h-9 rounded-full bg-green-500/20 border border-green-500/20 flex items-center justify-center text-xl flex-shrink-0">👤</div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white">{leader.userName}</div>
                      <div className="flex items-center gap-3 text-xs text-white/30 mt-0.5">
                        <span>💬 {leader.count} 回覆</span>
                        <span>👍 {leader.helpfulVotes} 有用</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-extrabold text-green-400">{leader.count}</div>
                      <div className="text-xs text-white/30">回覆數</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
