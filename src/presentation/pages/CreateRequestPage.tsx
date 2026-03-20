import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRequest } from '../../application/hooks/useRequests';
import { useStoreNames } from '../../application/hooks/useStores';
import { useOfficialPriceSearch } from '../../application/hooks/useOfficialPrices';
import { PageHeader } from '../components/PageHeader';
import { CATEGORIES } from '../../domain/constants/categories';
import { getFlagForLocation } from '../../domain/constants/locations';
import { LocationSelector } from '../components/LocationSelector';
import { StoreLocationPicker } from '../components/StoreLocationPicker';
import { useAuth } from '../../application/context/AuthContext';
import { useLanguage } from '../../application/context/LanguageContext';
import { type MainCategory, type Urgency } from '../../domain/entities/Request';
import { type StoreLocation } from '../../domain/constants/storeLocations';
import { REGIONS } from '../../domain/constants/locations';
import {
  Lock, PartyPopper, Package, MapPin, Settings, BarChart3, Zap, Store,
  ClipboardList, X, Check
} from 'lucide-react';

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

/** Get localized location label */
function getLocalizedLocationLabel(locationValue: string, lang: string): string {
  for (const r of REGIONS) {
    if (r.value === locationValue) return lang === 'zh' ? r.labelZh : r.labelEn;
    for (const sr of r.subRegions) {
      if (sr.value === locationValue) return lang === 'zh' ? sr.labelZh : sr.labelEn;
      for (const d of sr.districts) {
        if (d.value === locationValue) return lang === 'zh' ? d.labelZh : d.labelEn;
      }
    }
  }
  return locationValue;
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
  const { lang, t } = useLanguage();

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

  const anyStoreLabel = (locationValue: string) => {
    const label = getLocalizedLocationLabel(locationValue, lang);
    return lang === 'zh' ? `${label}任一商店` : `Any store in ${label}`;
  };

  const handleQuickSubmit = async () => {
    if (!user) { await signInWithGoogle(); return; }
    if (!form.productName) return;
    setSubmitting(true);
    const req = await create({
      userId: user.uid,
      userName: user.displayName ?? (lang === 'zh' ? '用戶' : 'User'),
      userPhoto: user.photoURL ?? '',
      username: user.displayName ?? (lang === 'zh' ? '用戶' : 'User'),
      avatarEmoji: user.photoURL ?? '👤',
      ...form,
      city: form.location,
      storeName: form.storeName || anyStoreLabel(form.location),
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
      userName: user.displayName ?? (lang === 'zh' ? '用戶' : 'User'),
      userPhoto: user.photoURL ?? '',
      username: user.displayName ?? (lang === 'zh' ? '用戶' : 'User'),
      avatarEmoji: user.photoURL ?? '👤',
      ...form,
      city: form.location,
      storeName: form.anyStoreInCity
        ? anyStoreLabel(form.location)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
        <PageHeader title={t('create.title')} showBack />
        <div className="px-4 py-12 max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4 opacity-60">
            <Lock size={64} className="text-white/40" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t('create.signIn.title')}</h2>
          <p className="text-white/40 mb-6 text-sm">{t('create.signIn.desc')}</p>
          <button
            onClick={signInWithGoogle}
            className="btn-primary px-8 py-3"
          >
            {t('create.signIn.btn')}
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
        <PageHeader title={t('create.success.title')} />
        <div className="px-4 py-8 max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <PartyPopper size={72} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t('create.success.title')}</h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            {t('create.success.desc')}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/request/${newRequestId}`)}
              className="btn-primary w-full"
            >
              {t('create.success.view')}
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary w-full"
            >
              {t('create.success.home')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      <PageHeader title={t('create.title')} showBack />

      {/* Quick Mode card */}
      <div className="px-4 pt-4 max-w-2xl mx-auto">
        <div className={`card p-5 space-y-4 border-2 transition-all duration-200 ${mode === 'quick' ? 'border-green-500/30' : 'border-white/10'}`}>
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-amber-400" />
            <h3 className="font-bold text-white">{t('create.quick.title')}</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              {t('create.quick.product')} <span className="text-red-400">*</span>
            </label>
            <input
              value={form.productName}
              onChange={e => update('productName', e.target.value)}
              placeholder={t('create.quick.productPlaceholder')}
              className="input-field"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/60 mb-1.5">{t('create.quick.store')}</label>
              <input
                value={form.storeName}
                onChange={e => { update('storeName', e.target.value); setStoreInput(e.target.value); }}
                placeholder={t('create.quick.storePlaceholder')}
                className="input-field"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/60 mb-1.5">{t('create.quick.city')}</label>
              <select
                value={form.location}
                onChange={e => update('location', e.target.value)}
                className="input-field"
              >
                <option value="hongkong">🇭🇰 {t('loc.hongkong')}</option>
                <option value="taiwan">🇹🇼 {t('loc.taiwan')}</option>
              </select>
            </div>
          </div>

          <button
            onClick={mode === 'quick' ? handleQuickSubmit : undefined}
            disabled={!form.productName || submitting}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? t('create.quick.submitting') : t('create.quick.submit')}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === 'quick' ? 'full' : 'quick')}
            className="w-full text-center text-sm text-white/40 hover:text-white/60 transition-colors py-1"
          >
            {mode === 'quick' ? t('create.quick.expand') : t('create.quick.collapse')}
          </button>
        </div>
      </div>

      {/* Full form */}
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
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.4)] glow-pulse'
                        : step > s
                        ? 'bg-green-500/30 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-white/30 border border-white/10'
                    }`}
                  >
                    {step > s ? <Check size={12} className="text-current" /> : s}
                  </div>
                  <span className={`text-xs font-medium ${step === s ? 'text-white' : 'text-white/30'}`}>
                    {s === 1 ? t('create.step.info') : s === 2 ? t('create.step.location') : t('create.step.options')}
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
                <div className="card p-5 lg:p-8 space-y-4 gradient-border">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Package size={18} className="text-white/70" />
                    <span>{t('create.step1.title')}</span>
                  </h3>

                  <div className="relative">
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      {t('create.step1.name')} <span className="text-red-400">*</span>
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
                      placeholder={t('create.step1.name.placeholder')}
                      className="input-field"
                      required
                    />
                    {showPriceSuggestions && officialSuggestions.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 bg-[#111111] border border-green-500/20 rounded-xl shadow-2xl mt-1 overflow-hidden">
                        <div className="px-3 py-2 text-[10px] text-green-400/60 font-semibold uppercase tracking-widest border-b border-white/5 flex items-center gap-1.5">
                          <BarChart3 size={12} className="text-current" /> {t('create.step1.officialPrices')}
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
                    {selectedOfficialPrice && selectedOfficialPrice.minPrice != null && (
                      <div className="mt-2 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                        <BarChart3 size={14} className="text-green-400" />
                        <p className="text-xs text-green-400">
                          {t('create.step1.officialMin')}: <strong>{selectedOfficialPrice.currency}{selectedOfficialPrice.minPrice.toFixed(1)}</strong>
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">{t('create.step1.brand')}</label>
                    <input
                      value={form.brand}
                      onChange={e => update('brand', e.target.value)}
                      placeholder={t('create.step1.brand.placeholder')}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">{t('create.step1.desc')}</label>
                    <textarea
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      placeholder={t('create.step1.desc.placeholder')}
                      className="input-field resize-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">{t('create.step1.category')}</label>
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
                          <span>{lang === 'zh' ? cat.labelZh : cat.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.category !== 'other' && (() => {
                    const selectedCat = CATEGORIES.find(c => c.value === form.category);
                    if (!selectedCat || selectedCat.subCategories.length === 0) return null;
                    return (
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-1.5">
                          {t('create.step1.subCategory')}
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
                              {lang === 'zh' ? sub.labelZh : sub.labelEn}
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
                  {t('create.step1.next')}
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="card p-5 lg:p-8 space-y-4 gradient-border">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <MapPin size={18} className="text-white/70" />
                    <span>{t('create.step2.title')}</span>
                  </h3>

                  <LocationSelector
                    label={t('create.step2.location')}
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
                      <div className="text-sm font-medium text-white">{t('create.step2.anyStore')}</div>
                      <div className="text-xs text-white/40">{t('create.step2.anyStoreDesc')}</div>
                    </div>
                  </div>

                  {!form.anyStoreInCity && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-white/60 mb-1.5">
                        {t('create.step2.storeName')} <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={storeInput}
                        onChange={e => {
                          setStoreInput(e.target.value);
                          update('storeName', e.target.value);
                          setShowSuggestions(true);
                          setSelectedStoreLocation(null);
                        }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder={t('create.step2.storeName.placeholder')}
                        className="input-field"
                      />
                      {showSuggestions && storeSuggestions.length > 0 && (
                        <div className="absolute z-10 left-0 right-0 bg-[#111111] border border-white/10 rounded-xl shadow-2xl mt-1 overflow-hidden">
                          {storeSuggestions.slice(0, 6).map(name => (
                            <button
                              key={name}
                              type="button"
                              className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors flex items-center gap-2"
                              onClick={() => {
                                setStoreInput(name);
                                update('storeName', name);
                                setShowSuggestions(false);
                                setSelectedStoreLocation(null);
                              }}
                            >
                              <Store size={14} className="text-white/40 flex-shrink-0" /> {name}
                            </button>
                          ))}
                        </div>
                      )}
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
                    <label className="block text-sm font-medium text-white/60 mb-1.5">{t('create.step2.district')}</label>
                    <input
                      value={form.district}
                      onChange={e => update('district', e.target.value)}
                      placeholder={t('create.step2.district.placeholder')}
                      className="input-field"
                    />
                  </div>

                  {selectedStoreLocation && (
                    <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
                      <MapPin size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-green-400">{selectedStoreLocation.name}</p>
                        <p className="text-xs text-green-400/70 leading-snug">{selectedStoreLocation.address}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedStoreLocation(null)}
                        className="text-white/30 hover:text-white/60 flex-shrink-0 mt-0.5"
                      >
                        <X size={14} className="text-current" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">{t('create.step2.prev')}</button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!form.anyStoreInCity && !form.storeName}
                    className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    {t('create.step2.next')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="card p-5 lg:p-8 space-y-4 gradient-border">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Settings size={18} className="text-white/70" />
                    <span>{t('create.step3.title')}</span>
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">{t('create.step3.urgency')}</label>
                    <div className="flex gap-3">
                      {[
                        { value: 'normal' as Urgency, label: t('create.step3.normal'), icon: '🟢' },
                        { value: 'urgent' as Urgency, label: t('create.step3.urgent'), icon: null, isZap: true },
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
                          {opt.isZap ? <Zap size={16} className="text-current" /> : <span>{opt.icon}</span>}
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">{t('create.step3.note')}</label>
                    <textarea
                      value={form.note}
                      onChange={e => update('note', e.target.value)}
                      placeholder={t('create.step3.note.placeholder')}
                      className="input-field resize-none"
                      rows={2}
                    />
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm space-y-2">
                    <div className="font-semibold text-white/80 mb-2 flex items-center gap-2">
                      <ClipboardList size={16} className="text-white/60" />
                      {t('create.step3.summary')}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">{t('create.step3.product')}</span>
                      <span className="font-medium text-white">{form.productName}</span>
                    </div>
                    {form.subCategory && (
                      <div className="flex justify-between">
                        <span className="text-white/40">{t('create.step3.subcat')}</span>
                        <span className="font-medium text-white">
                          {(() => {
                            const cat = CATEGORIES.find(c => c.value === form.category);
                            const sub = cat?.subCategories.find(s => s.value === form.subCategory);
                            return sub ? (lang === 'zh' ? sub.labelZh : sub.labelEn) : form.subCategory;
                          })()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-white/40">{t('create.step3.store')}</span>
                      <span className="font-medium text-white">
                        {form.anyStoreInCity
                          ? anyStoreLabel(form.location)
                          : form.storeName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">{t('create.step3.city')}</span>
                      <span className="font-medium text-white">
                        {getFlagForLocation(form.location)} {getLocalizedLocationLabel(form.location, lang)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1">{t('create.step3.prev')}</button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-accent flex-1 disabled:opacity-40 glow-pulse"
                  >
                    {submitting ? t('create.step3.submitting') : t('create.step3.submit')}
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
