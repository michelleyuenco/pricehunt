import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { CITIES } from '../../domain/constants/cities';
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
    <div className="min-h-screen bg-gray-50 pb-24 pt-14">
      <PageHeader title="社群 Community" subtitle="格價獵人排行榜" />

      {/* Community stats */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 px-4 py-6 text-white">
        <div className="max-w-lg mx-auto">
          <h2 className="text-lg font-bold mb-4 opacity-90">📊 社群統計</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold">{totalRequests}</div>
              <div className="text-xs opacity-80 mt-0.5">格價需求</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold">{totalResponses}</div>
              <div className="text-xs opacity-80 mt-0.5">格價回覆</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold">{citiesCovered}</div>
              <div className="text-xs opacity-80 mt-0.5">涵蓋城市</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h3 className="font-bold text-charcoal text-base mb-3">🏅 貢獻者排行</h3>
          {leaders.length === 0 ? (
            <div className="card p-6 text-center text-gray-400">
              <div className="text-4xl mb-2">🙋</div>
              <p className="font-medium">還沒有回覆者</p>
              <p className="text-sm mt-1">成為第一個格價獵人！</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {leaders.map((leader, index) => (
                <div key={leader.userId} className="card p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                    </div>

                    {leader.userPhoto && leader.userPhoto.startsWith('http') ? (
                      <img src={leader.userPhoto} alt="avatar" className="w-9 h-9 rounded-full flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xl flex-shrink-0">👤</div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-charcoal">{leader.userName}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span>💬 {leader.count} 回覆</span>
                        <span>👍 {leader.helpfulVotes} 有用</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-extrabold text-primary-600">{leader.count}</div>
                      <div className="text-xs text-gray-400">回覆數</div>
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
