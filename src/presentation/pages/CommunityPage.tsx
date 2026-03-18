import { PageHeader } from '../components/PageHeader';
import { MOCK_USERS } from '../../infrastructure/data/mockUsers';
import { MOCK_REQUESTS } from '../../infrastructure/data/mockRequests';
import { MOCK_RESPONSES } from '../../infrastructure/data/mockResponses';
import { CITIES } from '../../domain/constants/cities';

const BADGE_INFO: Record<string, { label: string; desc: string }> = {
  '🏆': { label: 'First Response', desc: '首位回覆達人' },
  '📸': { label: 'Photo Pro', desc: '附圖片達人' },
  '⚡': { label: 'Speed Demon', desc: '閃電回覆達人' },
  '🎯': { label: '100 Answers', desc: '百問達人' },
};

export function CommunityPage() {
  // Sort users by responses given (descending), exclude current_user from leaderboard
  const leaderboard = [...MOCK_USERS]
    .filter(u => u.id !== 'current_user')
    .sort((a, b) => b.responsesGiven - a.responsesGiven);

  const totalRequests = MOCK_REQUESTS.length;
  const totalResponses = MOCK_RESPONSES.length;
  const citiesCovered = CITIES.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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

      {/* Badge legend */}
      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h3 className="font-bold text-charcoal text-base mb-3">🎖️ 成就徽章</h3>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {Object.entries(BADGE_INFO).map(([emoji, info]) => (
              <div key={emoji} className="card p-3 flex items-center gap-2">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <div className="text-sm font-semibold text-charcoal">{info.label}</div>
                  <div className="text-xs text-gray-500">{info.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <h3 className="font-bold text-charcoal text-base mb-3">🏅 貢獻者排行</h3>
          <div className="flex flex-col gap-3">
            {leaderboard.map((user, index) => (
              <div key={user.id} className="card p-4">
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-50 text-gray-400'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                  </div>

                  {/* Avatar */}
                  <div className="text-3xl flex-shrink-0">{user.avatarEmoji}</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-charcoal">{user.username}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span>💬 {user.responsesGiven} 回覆</span>
                      <span>👍 {user.helpfulVotes} 有用</span>
                    </div>
                    {user.badges && user.badges.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {user.badges.map(badge => (
                          <span
                            key={badge}
                            title={BADGE_INFO[badge]?.label ?? badge}
                            className="text-base"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Responses count */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-extrabold text-primary-600">{user.responsesGiven}</div>
                    <div className="text-xs text-gray-400">回覆數</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
