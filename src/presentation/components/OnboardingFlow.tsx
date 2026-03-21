import { useState } from 'react';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { type OfficialPrice } from '../../application/hooks/useOfficialPrices';
import { useSubscriptions } from '../../application/hooks/useSubscriptions';
import { useLanguage } from '../../application/context/LanguageContext';
import { CATEGORIES } from '../../domain/constants/categories';
import { Heart, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const STORE_OPTIONS = [
  { key: 'wellcome', zh: '惠康', en: 'Wellcome' },
  { key: 'parknshop', zh: '百佳', en: 'PARKnSHOP' },
  { key: 'jasons', zh: 'Market Place', en: 'Market Place' },
  { key: 'watsons', zh: '屈臣氏', en: 'Watsons' },
  { key: 'mannings', zh: '萬寧', en: 'Mannings' },
  { key: 'aeon', zh: 'AEON', en: 'AEON' },
  { key: 'dchfood', zh: '大昌食品', en: 'DCH Food' },
  { key: 'sasa', zh: '莎莎', en: 'Sa Sa' },
  { key: 'lungfung', zh: '龍豐', en: 'Lung Fung' },
];

const CAT_OPTIONS = CATEGORIES.filter(c => c.value !== 'other');

function getCheapestStore(storePrices?: Record<string, number>): string | null {
  if (!storePrices || Object.keys(storePrices).length === 0) return null;
  const cheapest = Object.entries(storePrices).reduce((a, b) => a[1] <= b[1] ? a : b);
  const found = STORE_OPTIONS.find(s => s.key === cheapest[0]);
  return found ? found.zh : cheapest[0];
}

interface OnboardingFlowProps {
  onDismiss?: () => void;
}

export function OnboardingFlow({ onDismiss }: OnboardingFlowProps) {
  const { t, lang } = useLanguage();
  const { setPreferences, completeOnboarding, subscribe } = useSubscriptions();

  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<OfficialPrice[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  function toggleCat(val: string) {
    setSelectedCategories(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  }

  function toggleStore(key: string) {
    setSelectedStores(prev =>
      prev.includes(key) ? prev.filter(v => v !== key) : [...prev, key]
    );
  }

  function toggleProduct(code: string) {
    setSelectedProducts(prev =>
      prev.includes(code) ? prev.filter(v => v !== code) : [...prev, code]
    );
  }

  async function loadSuggested() {
    setLoadingProducts(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'officialPrices'), orderBy('updatedAt', 'desc'), limit(300))
      );
      const all = snap.docs.map(d => ({ code: d.id, ...d.data() } as OfficialPrice));

      const filtered = all.filter(p => {
        const catMatch = selectedCategories.length === 0 ||
          selectedCategories.some(c => p.category?.toLowerCase().includes(c));
        const storeMatch = selectedStores.length === 0 ||
          selectedStores.some(s => p.stores?.[s as keyof typeof p.stores]);
        return catMatch && storeMatch;
      }).slice(0, 20);

      setSuggestedProducts(filtered);
    } catch (e) {
      console.error('loadSuggested error:', e);
    } finally {
      setLoadingProducts(false);
    }
  }

  function goNext() {
    if (animating) return;
    if (step === 1) {
      if (selectedCategories.length === 0) return;
      setAnimating(true);
      setTimeout(() => { setStep(2); setAnimating(false); }, 200);
    } else if (step === 2) {
      if (selectedStores.length === 0) return;
      setPreferences(selectedCategories, selectedStores);
      setAnimating(true);
      loadSuggested().then(() => {
        setTimeout(() => { setStep(3); setAnimating(false); }, 200);
      });
    }
  }

  function goPrev() {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setStep(s => s - 1); setAnimating(false); }, 200);
  }

  async function handleDone() {
    // Subscribe to selected products
    for (const code of selectedProducts) {
      await subscribe(code);
    }
    await completeOnboarding();
    onDismiss?.();
  }

  async function handleSkip() {
    await completeOnboarding();
    onDismiss?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg mx-4 bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-200 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
        style={{ maxHeight: '90vh' }}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`transition-all duration-300 rounded-full ${
                  s === step
                    ? 'w-6 h-2 bg-green-400'
                    : s < step
                    ? 'w-2 h-2 bg-green-600'
                    : 'w-2 h-2 bg-white/20'
                }`}
              />
            ))}
            <span className="text-xs text-white/30 ml-1">{step}/3</span>
          </div>
          <button
            onClick={handleSkip}
            className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
          >
            {t('onboarding.skip')} <X size={12} className="text-current" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>

          {/* Step 1: Categories */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-1">{t('onboarding.step1.title')}</h2>
              <p className="text-sm text-white/40 mb-5">{t('onboarding.step1.subtitle')}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {CAT_OPTIONS.map(cat => {
                  const active = selectedCategories.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      onClick={() => toggleCat(cat.value)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                        active
                          ? 'bg-green-500/20 border-green-500/60 text-green-300 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/25 hover:text-white/80'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{lang === 'zh' ? cat.labelZh : cat.labelEn}</span>
                      {active && <Check size={12} className="text-green-400" />}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={goNext}
                disabled={selectedCategories.length === 0}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  selectedCategories.length > 0
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-95'
                    : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                }`}
              >
                {t('onboarding.next')} <ChevronRight size={16} className="text-current" />
              </button>
            </div>
          )}

          {/* Step 2: Stores */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-1">{t('onboarding.step2.title')}</h2>
              <p className="text-sm text-white/40 mb-5">{t('onboarding.step2.subtitle')}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {STORE_OPTIONS.map(store => {
                  const active = selectedStores.includes(store.key);
                  return (
                    <button
                      key={store.key}
                      onClick={() => toggleStore(store.key)}
                      className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                        active
                          ? 'bg-green-500/20 border-green-500/60 text-green-300 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/25 hover:text-white/80'
                      }`}
                    >
                      {lang === 'zh' ? store.zh : store.en}
                      {active && <Check size={10} className="inline ml-1 text-green-400" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  className="flex-shrink-0 py-3.5 px-4 rounded-2xl font-bold text-sm border border-white/10 bg-white/5 text-white/50 hover:text-white/70 transition-all flex items-center gap-1"
                >
                  <ChevronLeft size={16} className="text-current" />
                </button>
                <button
                  onClick={goNext}
                  disabled={selectedStores.length === 0}
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                    selectedStores.length > 0
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-95'
                      : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                  }`}
                >
                  {t('onboarding.next')} <ChevronRight size={16} className="text-current" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Subscribe to products */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-1">{t('onboarding.step3.title')}</h2>
              <p className="text-sm text-white/40 mb-5">{t('onboarding.step3.subtitle')}</p>

              {loadingProducts ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                </div>
              ) : suggestedProducts.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-sm">
                  找不到相關產品 — No products found
                </div>
              ) : (
                <div className="space-y-2 mb-5">
                  {suggestedProducts.map(p => {
                    const picked = selectedProducts.includes(p.code);
                    const cheapest = getCheapestStore(p.storePrices);
                    return (
                      <div
                        key={p.code}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all duration-200 ${
                          picked
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-white/[0.03] border-white/[0.06] hover:border-white/15'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/30 truncate">{p.brand}</p>
                          <p className="text-sm font-medium text-white/90 line-clamp-1">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.minPrice != null && (
                              <span className="text-xs font-bold text-green-400">${p.minPrice.toFixed(1)}</span>
                            )}
                            {cheapest && (
                              <span className="text-[10px] text-white/30">{cheapest}</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleProduct(p.code)}
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
                            picked
                              ? 'bg-green-500/20 border-green-500/60 text-green-400 scale-110'
                              : 'bg-white/5 border-white/15 text-white/30 hover:border-green-500/40 hover:text-green-400'
                          }`}
                        >
                          <Heart size={14} className={picked ? 'fill-green-400 text-green-400' : 'text-current'} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  className="flex-shrink-0 py-3.5 px-4 rounded-2xl font-bold text-sm border border-white/10 bg-white/5 text-white/50 hover:text-white/70 transition-all flex items-center"
                >
                  <ChevronLeft size={16} className="text-current" />
                </button>
                <button
                  onClick={handleDone}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-95 transition-all duration-200"
                >
                  {t('onboarding.done')} {selectedProducts.length > 0 && `(${selectedProducts.length})`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
