import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useRequestDetail } from '../../application/hooks/useRequests';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatRelativeTime } from '../../shared/utils/formatDate';
import { formatPrice } from '../../shared/utils/formatPrice';
import { getCategoryInfo } from '../../domain/constants/categories';
import { getCityInfo } from '../../domain/constants/cities';
import { useAuth } from '../../application/context/AuthContext';
import { type Availability, type Currency } from '../../domain/entities/Response';

const availabilityLabels: Record<Availability, { zh: string; cls: string }> = {
  in_stock: { zh: '✅ 有貨', cls: 'text-green-400 bg-green-500/10 border border-green-500/20' },
  out_of_stock: { zh: '❌ 缺貨', cls: 'text-red-400 bg-red-500/10 border border-red-500/20' },
  limited: { zh: '⚠️ 少量', cls: 'text-amber-400 bg-amber-500/10 border border-amber-500/20' },
};

const CURRENCIES: Currency[] = ['HK$', 'NT$', 'S$', '¥'];

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { request, responses, loading, addResponse, markHelpful } = useRequestDetail(id ?? '');
  const { user, signInWithGoogle } = useAuth();

  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<Currency>('HK$');
  const [availability, setAvailability] = useState<Availability>('in_stock');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { await signInWithGoogle(); return; }
    if (!request || !price) return;
    setSubmitting(true);
    await addResponse({
      requestId: request.id,
      userId: user.uid,
      userName: user.displayName ?? '用戶',
      userPhoto: user.photoURL ?? '',
      username: user.displayName ?? '用戶',
      avatarEmoji: user.photoURL ?? '👤',
      price: parseFloat(price),
      currency,
      availability,
      storeConfirmed: request.storeName,
      note: note || undefined,
    });
    setPrice('');
    setNote('');
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleVote = async (responseId: string) => {
    if (votedIds.has(responseId)) return;
    await markHelpful(responseId);
    setVotedIds(prev => new Set([...prev, responseId]));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14">
        <PageHeader title="需求詳情" showBack />
        <LoadingSpinner />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14">
        <PageHeader title="需求詳情" showBack />
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-30">😕</div>
          <p className="text-white/40">找不到此需求</p>
        </div>
      </div>
    );
  }

  const category = getCategoryInfo(request.category);
  const city = getCityInfo(request.city);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14">
      <PageHeader title="需求詳情" showBack />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Request card */}
        <div className="card p-5">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              {request.avatarEmoji && request.avatarEmoji.startsWith('http') ? (
                <img src={request.avatarEmoji} alt="avatar" className="w-8 h-8 rounded-full ring-1 ring-white/10" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/20 flex items-center justify-center text-lg">
                  {request.avatarEmoji || '👤'}
                </div>
              )}
              <div>
                <span className="font-semibold text-white">{request.username}</span>
                <div className="text-xs text-white/30">{formatRelativeTime(request.createdAt)}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {request.urgency === 'urgent' && (
                <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 font-semibold px-2 py-0.5 rounded-full">
                  ⚡ 急需
                </span>
              )}
              {request.status === 'waiting' ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                  <span className="text-amber-400">等待中</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                  <span className="text-green-400">已回覆</span>
                </span>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
            {request.productName}
            {request.brand && <span className="font-normal text-white/40 text-base"> · {request.brand}</span>}
          </h2>
          {request.description && (
            <p className="text-sm text-white/50 mb-3">{request.description}</p>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-white/30 mb-0.5">商店</div>
              <div className="font-semibold text-white">🏪 {request.storeName}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-white/30 mb-0.5">城市</div>
              <div className="font-semibold text-white">
                {city?.flag} {city?.labelZh ?? request.city}
                {request.district && ` · ${request.district}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded-lg">
              {category.emoji} {category.labelZh}
            </span>
          </div>

          {request.note && (
            <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
              📝 {request.note}
            </div>
          )}
        </div>

        {/* Responses */}
        <div>
          <h3 className="font-bold text-white/80 text-base mb-3 flex items-center gap-2 tracking-tight">
            <span>💬</span>
            <span>格價回覆</span>
            <span className="text-sm font-normal text-white/30">({responses.length})</span>
          </h3>

          {responses.length === 0 ? (
            <div className="card p-6 text-center">
              <div className="text-4xl mb-2 opacity-30">🙋</div>
              <p className="font-medium text-white/50">還沒有人回覆</p>
              <p className="text-sm mt-1 text-white/30">你去逛店時，幫忙記錄一下價格吧！</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {responses.map(res => {
                const avail = availabilityLabels[res.availability];
                const voted = votedIds.has(res.id);
                return (
                  <div key={res.id} className="card p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {res.avatarEmoji && res.avatarEmoji.startsWith('http') ? (
                          <img src={res.avatarEmoji} alt="avatar" className="w-7 h-7 rounded-full ring-1 ring-white/10" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                            {res.avatarEmoji || '👤'}
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-sm text-white">{res.username}</span>
                          <div className="text-xs text-white/30">{formatRelativeTime(res.createdAt)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {formatPrice(res.price, res.currency)}
                        </div>
                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${avail.cls}`}>
                          {avail.zh}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-white/40 mb-2">📍 {res.storeConfirmed}</div>
                    {res.note && <p className="text-sm text-white/60 mb-3">{res.note}</p>}
                    <button
                      onClick={() => handleVote(res.id)}
                      className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
                        voted
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60'
                      }`}
                    >
                      <span>👍</span>
                      <span>有幫助 ({res.helpfulVotes})</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add response form */}
        <div className="card p-5">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <span>📝</span>
            <span>提供格價資訊</span>
          </h3>

          {!user ? (
            <div className="text-center py-4">
              <p className="text-sm text-white/40 mb-3">登入後才能提交格價資訊</p>
              <button onClick={signInWithGoogle} className="btn-primary px-6">
                Google 登入 Sign In
              </button>
            </div>
          ) : (
            <>
              {submitted && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-3 mb-4 text-sm font-medium">
                  ✅ 感謝您的回覆！已成功提交。
                </div>
              )}

              <form onSubmit={handleSubmitResponse} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    價格 Price <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value as Currency)}
                      className="text-sm border border-white/10 rounded-xl px-3 py-3 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 w-20"
                    >
                      {CURRENCIES.map(c => (
                        <option key={c} value={c} className="bg-[#111111]">{c}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      placeholder="輸入價格"
                      className="input-field flex-1"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">庫存狀態</label>
                  <div className="flex gap-2">
                    {(['in_stock', 'out_of_stock', 'limited'] as Availability[]).map(a => {
                      const info = availabilityLabels[a];
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setAvailability(a)}
                          className={`flex-1 text-sm py-2 px-2 rounded-xl border font-medium transition-all duration-200 ${
                            availability === a
                              ? 'border-green-500/50 bg-green-500/20 text-green-400'
                              : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                          }`}
                        >
                          {info.zh}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">備注（選填）</label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="例如：現正特價、快要缺貨..."
                    className="input-field resize-none"
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !price}
                  className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {submitting ? '提交中...' : '提交格價資訊'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
