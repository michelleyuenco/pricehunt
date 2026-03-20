import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRequest } from '../../application/hooks/useRequests';
import { useStoreNames } from '../../application/hooks/useStores';
import { useOfficialPriceSearch } from '../../application/hooks/useOfficialPrices';
import { PageHeader } from '../components/PageHeader';
import { CATEGORIES } from '../../domain/constants/categories';
import { getLocationLabel, getFlagForLocation } from '../../domain/constants/locations';
import { LocationSelector } from '../components/LocationSelector';
import { StoreLocationPicker } from '../components/StoreLocationPicker';
import { useAuth } from '../../application/context/AuthContext';
import { type MainCategory, type Urgency } from '../../domain/entities/Request';
import { type StoreLocation } from '../../domain/constants/storeLocations';

/** Map a store name (Chinese or English) to its brand code */
function storeToBrandCode(storeName: string): string {
  const name = storeName.toLowerCase();
  if (name.includes('惠康') || name.includes('wellcome')) return 'wellcome';
  if (name.includes('百佳') || name.includes('parknshop') || name.includes('park n shop')) return 'parknshop';
  if (name.includes('market place') || name.includes('marketplace') || name.includes('jasons')) return 'marketplace';
  if (name.includes('屈臣氏') || name.includes('watsons')) return 'watsons';
  if (name.includes('萬寧') || name.includes('mannings')) return 'mannings';
  if (name.includes('aeon')) return 'aeon';
  if (name.includes('大昌') || name.includes('dch')) return 'dchfood';
  if (name.includes('莎莎') || name.includes('sasa')) return 'sasa';
  if (name.includes('龍豐') || name.includes('lung fung')) return 'lungfung';
  if (name.includes('全聯') || name.includes('px mart') || name.includes('pxmart')) return 'pxmart';
  if (name.includes('家樂福') || name.includes('carrefour')) return 'carrefour';
  if (name.includes('好市多') || name.includes('costco')) return 'costco';
  if (name.includes('康是美') || name.includes('cosmed')) return 'cosmed';
  return '';
}

type Step = 1 | 2 | 3;
type Mode = 'quick' | 'full';

interface FormData {
  productName: string;
  brand: string;
  description: string;
  category: MainCategory;
  subCategory: string;
  storeName: string;
  location: string;
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
  subCategory: '',
  storeName: '',
  location: 'hongkong',
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

  const [mode, setMode] = useState<Mode>('quick');
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [newRequestId, setNewRequestId] = useState('');
  const [success, setSuccess] = useState(false);
  const [storeInput, setStoreInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPriceSuggestions, setShowPriceSuggestions] = useState(false);
  const [selectedOfficialPrice, setSelectedOfficialPrice] = useState<{ name: string; minPrice: number | null; currency: string } | null>(null);
  const [selectedStoreLocation, setSelectedStoreLocation] = useState<StoreLocation | null>(null);

  const { results: officialSuggestions } = useOfficialPriceSearch(
    showPriceSuggestions ? form.productName : ''
  );

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const storeSuggestions = storeNames.filter(n =>
    n.toLowerCase().includes(storeInput.toLowerCase()) && storeInput.length > 0
  );

  const handleQuickSubmit = async () => {
    if (!user) { await signInWithGoogle(); return; }
    if (!form.productName) return;
    setSubmitting(true);
    const req = await create({
      userId: user.uid,
      userName: user.displayName ?? '用戶',
      userPhoto: user.photoURL ?? '',
      username: user.displayName ?? '用戶',
      avatarEmoji: user.photoURL ?? '👤',
      ...form,
      city: form.location,
      storeName: form.storeName || `${getLocationLabel(form.location)}任一商店`,
      anyStoreInCity: !form.storeName,
      subCategory: undefined,
      tipEnabled: false,
      storeLocationId: selectedStoreLocation?.id,
      storeAddress: selectedStoreLocation?.address,
      storeLat: selectedStoreLocation?.lat,
      storeLng: selectedStoreLocation?.lng,
    });
    setNewRequestId(req.id);
    setSuccess(true);
    setSubmitting(false);
  };

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
      city: form.location,
      storeName: form.anyStoreInCity
        ? `${getLocationLabel(form.location)}任一商店`
        : form.storeName,
      subCategory: form.subCategory || undefined,
      tipEnabled: false,
      storeLocationId: selectedStoreLocation?.id,
      storeAddress: selectedStoreLocation?.address,
      storeLat: selectedStoreLocation?.lat,
      storeLng: selectedStoreLocation?.lng,
    });
    setNewRequestId(req.id);
    setSuccess(true);
    setSubmitting(false);
  };

  // Not signed in gate
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
        <PageHeader title="發起格價需求" showBack />
        <div className="px-4 py-12 max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4 opacity-60">🔑</div>
          <h2 className="text-xl font-bold text-white mb-2">請先登入</h2>
          <p className="text-white/40 mb-6 text-sm">Please sign in to create a price request.</p>
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
      <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
        <PageHeader title="發起成功！" />
        <div className="px-4 py-8 max-w-2xl mx-auto text-center">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">需求已發出！</h2>
          <p className="text-white/50 mb-8 leading-relaxed">
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
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      <PageHeader title="發起格價需求" showBack />

      {/* Quick Mode card */}
      <div className="px-4 pt-4 max-w-2xl mx-auto">
        <div className={`card p-5 space-y-4 border-2 transition-all duration-200 ${mode === 'quick' ? 'border-green-500/30' : 'border-white/10'}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h3 className="font-bold text-white">快速格價 Quick Price Check</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              產品名稱 <span className="text-red-400">*</span>
            </label>
            <input
              value={form.productName}
              onChange={e => update('productName', e.target.value)}
              placeholder="例如：義美小泡芙 / Product name"
              className="input-field"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/60 mb-1.5">商店名稱（選填）</label>
              <input
                value={form.storeName}
                onChange={e => { update('storeName', e.target.value); setStoreInput(e.target.value); }}
                placeholder="例如：百佳、惠康..."
                className="input-field"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/60 mb-1.5">城市</label>
              <select
                value={form.location}
                onChange={e => update('location', e.target.value)}
                className="input-field"
              >
                <option value="hongkong">🇭🇰 香港</option>
                <option value="taiwan">🇹🇼 台灣</option>
              </select>
            </div>
          </div>

          <button
            onClick={mode === 'quick' ? handleQuickSubmit : undefined}
            disabled={!form.productName || submitting}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? '發送中...' : '🚀 發出請求'}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === 'quick' ? 'full' : 'quick')}
            className="w-full text-center text-sm text-white/40 hover:text-white/60 transition-colors py-1"
          >
            {mode === 'quick' ? '想填更多？ 展開完整表單 ↓' : '▲ 收起完整表單'}
          </button>
        </div>
      </div>

      {/* Full form — shown when mode === 'full' */}
      {mode === 'full' && (
        <>
      {/* Step indicator */}
      <div className="bg-[#0A0A0A]/95 border-b border-white/10 px-4 py-3 mt-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {([1, 2, 3] as Step[]).map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-200 ${
                  step === s
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                    : step > s
                    ? 'bg-green-500/30 text-green-400 border border-green-500/30'
                    : 'bg-white/5 text-white/30 border border-white/10'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              <span className={`text-xs font-medium ${step === s ? 'text-white' : 'text-white/30'}`}>
                {s === 1 ? '商品資訊' : s === 2 ? '商店位置' : '附加設定'}
              </span>
              {s < 3 && <div className="flex-1 h-px bg-white/10 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="card p-5 lg:p-8 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>📦</span>
                <span>什麼商品？</span>
              </h3>

              <div className="relative">
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  商品名稱 <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.productName}
                  onChange={e => {
                    update('productName', e.target.value);
                    setShowPriceSuggestions(true);
                    setSelectedOfficialPrice(null);
                  }}
                  onFocus={() => setShowPriceSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowPriceSuggestions(false), 200)}
                  placeholder="例如：義美小泡芙 / Product name"
                  className="input-field"
                  required
                />
                {/* Official price suggestions */}
                {showPriceSuggestions && officialSuggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 bg-[#111111] border border-green-500/20 rounded-xl shadow-2xl mt-1 overflow-hidden">
                    <div className="px-3 py-2 text-[10px] text-green-400/60 font-semibold uppercase tracking-widest border-b border-white/5">
                      📊 官方價格參考 Official Prices
                    </div>
                    {officialSuggestions.slice(0, 5).map(p => (
                      <button
                        key={p.code}
                        type="button"
                        className="w-full text-left px-3 py-2.5 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors flex items-center justify-between gap-2"
                        onMouseDown={() => {
                          update('productName', p.name);
                          if (p.brand) update('brand', p.brand);
                          setSelectedOfficialPrice({ name: p.name, minPrice: p.minPrice, currency: p.currency });
                          setShowPriceSuggestions(false);
                        }}
                      >
                        <div className="min-w-0">
                          <p className="text-xs text-white/40 truncate">{p.brand}</p>
                          <p className="text-sm text-white/80 leading-snug line-clamp-1">{p.name}</p>
                        </div>
                        {p.minPrice != null && (
                          <span className="shrink-0 text-sm font-bold text-green-400">
                            {p.currency}{p.minPrice.toFixed(1)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {/* Selected official price hint */}
                {selectedOfficialPrice && selectedOfficialPrice.minPrice != null && (
                  <div className="mt-2 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                    <span className="text-green-400 text-sm">📊</span>
                    <p className="text-xs text-green-400">
                      官方最低價 Official min: <strong>{selectedOfficialPrice.currency}{selectedOfficialPrice.minPrice.toFixed(1)}</strong>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">品牌 Brand（選填）</label>
                <input
                  value={form.brand}
                  onChange={e => update('brand', e.target.value)}
                  placeholder="例如：義美、光泉..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">商品描述（選填）</label>
                <textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="規格、容量、口味等..."
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">分類</label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => { update('category', cat.value); update('subCategory', ''); }}
                      className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all duration-200 text-xs font-medium ${
                        form.category === cat.value
                          ? 'border-green-500/50 bg-green-500/20 text-green-400'
                          : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/8'
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span>{cat.labelZh}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-category selector */}
              {form.category !== 'other' && (() => {
                const selectedCat = CATEGORIES.find(c => c.value === form.category);
                if (!selectedCat || selectedCat.subCategories.length === 0) return null;
                return (
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      細分類別 Sub-category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCat.subCategories.map(sub => (
                        <button
                          key={sub.value}
                          type="button"
                          onClick={() => update('subCategory', form.subCategory === sub.value ? '' : sub.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                            form.subCategory === sub.value
                              ? 'border-green-500/50 bg-green-500/20 text-green-400'
                              : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/8'
                          }`}
                        >
                          {sub.labelZh}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.productName}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              下一步：商店位置 →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="card p-5 lg:p-8 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>📍</span>
                <span>在哪裡？</span>
              </h3>

              <LocationSelector
                label="地區 Location"
                value={form.location}
                onChange={(v) => update('location', v)}
              />

              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => update('anyStoreInCity', !form.anyStoreInCity)}
                  className={`w-12 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${
                    form.anyStoreInCity
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                      : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                      form.anyStoreInCity ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
                <div>
                  <div className="text-sm font-medium text-white">此城市任一商店都可以</div>
                  <div className="text-xs text-white/40">Any store in this city</div>
                </div>
              </div>

              {!form.anyStoreInCity && (
                <div className="relative">
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    商店名稱 <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={storeInput}
                    onChange={e => {
                      setStoreInput(e.target.value);
                      update('storeName', e.target.value);
                      setShowSuggestions(true);
                      // Reset store location when store changes
                      setSelectedStoreLocation(null);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="例如：百佳、惠康..."
                    className="input-field"
                  />
                  {showSuggestions && storeSuggestions.length > 0 && (
                    <div className="absolute z-10 left-0 right-0 bg-[#111111] border border-white/10 rounded-xl shadow-2xl mt-1 overflow-hidden">
                      {storeSuggestions.slice(0, 6).map(name => (
                        <button
                          key={name}
                          type="button"
                          className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                          onClick={() => {
                            setStoreInput(name);
                            update('storeName', name);
                            setShowSuggestions(false);
                            setSelectedStoreLocation(null);
                          }}
                        >
                          🏪 {name}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Store location picker — shown when a recognized brand is selected */}
                  {form.storeName && storeToBrandCode(form.storeName) && (
                    <StoreLocationPicker
                      brand={storeToBrandCode(form.storeName)}
                      district={form.district || undefined}
                      region={form.location}
                      selectedId={selectedStoreLocation?.id}
                      onSelect={loc => setSelectedStoreLocation(prev => prev?.id === loc.id ? null : loc)}
                    />
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">地區（選填）</label>
                <input
                  value={form.district}
                  onChange={e => update('district', e.target.value)}
                  placeholder="例如：旺角、灣仔、尖沙咀..."
                  className="input-field"
                />
              </div>

              {/* Selected store location confirmation */}
              {selectedStoreLocation && (
                <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
                  <span className="text-green-400 text-sm mt-0.5">📍</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-green-400">{selectedStoreLocation.name}</p>
                    <p className="text-xs text-green-400/70 leading-snug">{selectedStoreLocation.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStoreLocation(null)}
                    className="text-white/30 hover:text-white/60 text-xs flex-shrink-0 mt-0.5"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">← 上一步</button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.anyStoreInCity && !form.storeName}
                className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="card p-5 lg:p-8 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>⚙️</span>
                <span>附加設定</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">緊急程度</label>
                <div className="flex gap-3">
                  {[
                    { value: 'normal' as Urgency, label: '一般 Normal', emoji: '🟢' },
                    { value: 'urgent' as Urgency, label: '急需 Urgent', emoji: '⚡' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('urgency', opt.value)}
                      className={`flex-1 flex items-center gap-2 py-3 px-4 rounded-xl border font-medium text-sm transition-all duration-200 ${
                        form.urgency === opt.value
                          ? opt.value === 'urgent'
                            ? 'border-amber-500/50 bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                            : 'border-green-500/50 bg-green-500/20 text-green-400'
                          : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                      }`}
                    >
                      <span>{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">給回報者的話（選填）</label>
                <textarea
                  value={form.note}
                  onChange={e => update('note', e.target.value)}
                  placeholder="例如：想確認是否有打折、要買幾箱..."
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm space-y-2">
                <div className="font-semibold text-white/80 mb-2">📋 需求摘要</div>
                <div className="flex justify-between">
                  <span className="text-white/40">商品</span>
                  <span className="font-medium text-white">{form.productName}</span>
                </div>
                {form.subCategory && (
                  <div className="flex justify-between">
                    <span className="text-white/40">細分類</span>
                    <span className="font-medium text-white">
                      {CATEGORIES.find(c => c.value === form.category)?.subCategories.find(s => s.value === form.subCategory)?.labelZh}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/40">商店</span>
                  <span className="font-medium text-white">
                    {form.anyStoreInCity
                      ? `${getLocationLabel(form.location)}任一商店`
                      : form.storeName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">城市</span>
                  <span className="font-medium text-white">
                    {getFlagForLocation(form.location)} {getLocationLabel(form.location)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">← 上一步</button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-accent flex-1 disabled:opacity-40"
              >
                {submitting ? '發送中...' : '🚀 發起需求！'}
              </button>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
