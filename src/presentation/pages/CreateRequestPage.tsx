import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRequest } from '../../application/hooks/useRequests';
import { useStoreNames } from '../../application/hooks/useStores';
import { PageHeader } from '../components/PageHeader';
import { CATEGORIES } from '../../domain/constants/categories';
import { CITIES } from '../../domain/constants/cities';
import { useAuth } from '../../application/context/AuthContext';
import { type Category, type Urgency } from '../../domain/entities/Request';

type Step = 1 | 2 | 3;

interface FormData {
  productName: string;
  brand: string;
  description: string;
  category: Category;
  storeName: string;
  city: string;
  district: string;
  anyStoreInCity: boolean;
  urgency: Urgency;
  note: string;
}

const initialForm: FormData = {
  productName: '',
  brand: '',
  description: '',
  category: 'other',
  storeName: '',
  city: 'hongkong',
  district: '',
  anyStoreInCity: false,
  urgency: 'normal',
  note: '',
};

export function CreateRequestPage() {
  const navigate = useNavigate();
  const { create } = useCreateRequest();
  const storeNames = useStoreNames();
  const { user, signInWithGoogle } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [newRequestId, setNewRequestId] = useState('');
  const [success, setSuccess] = useState(false);
  const [storeInput, setStoreInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const storeSuggestions = storeNames.filter(n =>
    n.toLowerCase().includes(storeInput.toLowerCase()) && storeInput.length > 0
  );

  const handleSubmit = async () => {
    if (!user) { await signInWithGoogle(); return; }
    if (!form.productName || (!form.anyStoreInCity && !form.storeName)) return;
    setSubmitting(true);
    const req = await create({
      userId: user.uid,
      userName: user.displayName ?? '用戶',
      userPhoto: user.photoURL ?? '',
      username: user.displayName ?? '用戶',
      avatarEmoji: user.photoURL ?? '👤',
      ...form,
      storeName: form.anyStoreInCity
        ? `${CITIES.find(c => c.value === form.city)?.labelZh ?? form.city}任一商店`
        : form.storeName,
      tipEnabled: false,
    });
    setNewRequestId(req.id);
    setSuccess(true);
    setSubmitting(false);
  };

  // Not signed in gate
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 pt-14">
        <PageHeader title="發起格價需求" showBack />
        <div className="px-4 py-12 max-w-lg mx-auto text-center">
          <div className="text-6xl mb-4">🔑</div>
          <h2 className="text-xl font-bold text-charcoal mb-2">請先登入</h2>
          <p className="text-gray-500 mb-6 text-sm">Please sign in to create a price request.</p>
          <button
            onClick={signInWithGoogle}
            className="btn-primary px-8 py-3"
          >
            Google 登入 Sign In
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 pt-14">
        <PageHeader title="發起成功！" />
        <div className="px-4 py-8 max-w-lg mx-auto text-center">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">需求已發出！</h2>
          <p className="text-gray-600 mb-6">
            等待格價獵人幫你回報價格。<br />
            通常在 1 小時內會有人回覆！
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/request/${newRequestId}`)}
              className="btn-primary w-full"
            >
              查看需求頁面
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary w-full"
            >
              回到首頁
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-14">
      <PageHeader title="發起格價需求" showBack />

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          {([1, 2, 3] as Step[]).map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  step === s
                    ? 'bg-primary-500 text-white'
                    : step > s
                    ? 'bg-primary-200 text-primary-700'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              <span className={`text-xs font-medium ${step === s ? 'text-charcoal' : 'text-gray-400'}`}>
                {s === 1 ? '商品資訊' : s === 2 ? '商店位置' : '附加設定'}
              </span>
              {s < 3 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="card p-4 space-y-4">
              <h3 className="font-bold text-charcoal flex items-center gap-2">
                <span>📦</span>
                <span>什麼商品？</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.productName}
                  onChange={e => update('productName', e.target.value)}
                  placeholder="例如：義美小泡芙 / Product name"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">品牌 Brand（選填）</label>
                <input
                  value={form.brand}
                  onChange={e => update('brand', e.target.value)}
                  placeholder="例如：義美、光泉..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品描述（選填）</label>
                <textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="規格、容量、口味等..."
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => update('category', cat.value)}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border-2 transition-all text-xs font-medium ${
                        form.category === cat.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span>{cat.labelZh}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.productName}
              className="btn-primary w-full disabled:opacity-50"
            >
              下一步：商店位置 →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="card p-4 space-y-4">
              <h3 className="font-bold text-charcoal flex items-center gap-2">
                <span>📍</span>
                <span>在哪裡？</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                <div className="grid grid-cols-2 gap-2">
                  {CITIES.map(city => (
                    <button
                      key={city.value}
                      type="button"
                      onClick={() => update('city', city.value)}
                      className={`flex items-center gap-2 py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.city === city.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <span>{city.flag}</span>
                      <span>{city.labelZh}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <button
                  type="button"
                  onClick={() => update('anyStoreInCity', !form.anyStoreInCity)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                    form.anyStoreInCity ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                      form.anyStoreInCity ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
                <div>
                  <div className="text-sm font-medium text-charcoal">此城市任一商店都可以</div>
                  <div className="text-xs text-gray-500">Any store in this city</div>
                </div>
              </div>

              {!form.anyStoreInCity && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商店名稱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={storeInput}
                    onChange={e => {
                      setStoreInput(e.target.value);
                      update('storeName', e.target.value);
                      setShowSuggestions(true);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="例如：百佳、惠康..."
                    className="input-field"
                  />
                  {showSuggestions && storeSuggestions.length > 0 && (
                    <div className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                      {storeSuggestions.slice(0, 6).map(name => (
                        <button
                          key={name}
                          type="button"
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                          onClick={() => {
                            setStoreInput(name);
                            update('storeName', name);
                            setShowSuggestions(false);
                          }}
                        >
                          🏪 {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地區（選填）</label>
                <input
                  value={form.district}
                  onChange={e => update('district', e.target.value)}
                  placeholder="例如：旺角、灣仔、尖沙咀..."
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">← 上一步</button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.anyStoreInCity && !form.storeName}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="card p-4 space-y-4">
              <h3 className="font-bold text-charcoal flex items-center gap-2">
                <span>⚙️</span>
                <span>附加設定</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">緊急程度</label>
                <div className="flex gap-3">
                  {[
                    { value: 'normal' as Urgency, label: '一般 Normal', emoji: '🟢' },
                    { value: 'urgent' as Urgency, label: '急需 Urgent', emoji: '⚡' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('urgency', opt.value)}
                      className={`flex-1 flex items-center gap-2 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                        form.urgency === opt.value
                          ? opt.value === 'urgent'
                            ? 'border-red-400 bg-red-50 text-red-700'
                            : 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <span>{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">給回報者的話（選填）</label>
                <textarea
                  value={form.note}
                  onChange={e => update('note', e.target.value)}
                  placeholder="例如：想確認是否有打折、要買幾箱..."
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                <div className="font-semibold text-gray-700 mb-2">📋 需求摘要</div>
                <div className="flex justify-between">
                  <span className="text-gray-500">商品</span>
                  <span className="font-medium">{form.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">商店</span>
                  <span className="font-medium">
                    {form.anyStoreInCity
                      ? `${CITIES.find(c => c.value === form.city)?.labelZh}任一商店`
                      : form.storeName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">城市</span>
                  <span className="font-medium">
                    {CITIES.find(c => c.value === form.city)?.labelZh}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">← 上一步</button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-accent flex-1 disabled:opacity-50"
              >
                {submitting ? '發送中...' : '🚀 發起需求！'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
