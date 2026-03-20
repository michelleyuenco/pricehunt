import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { type OfficialPrice } from '../../application/hooks/useOfficialPrices';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';

const STORE_LABELS: Record<string, { zh: string; en: string }> = {
  wellcome:  { zh: '惠康', en: 'Wellcome' },
  parknshop: { zh: '百佳', en: 'PARKnSHOP' },
  jasons:    { zh: 'Market Place', en: 'Market Place by Jasons' },
  watsons:   { zh: '屈臣氏', en: 'Watsons' },
  mannings:  { zh: '萬寧', en: 'Mannings' },
  aeon:      { zh: 'AEON', en: 'AEON' },
  dchfood:   { zh: '大昌食品', en: 'DCH Food' },
  sasa:      { zh: '莎莎', en: 'Sa Sa' },
  lungfung:  { zh: '龍豐', en: 'Lung Fung' },
};

function getStoreLabel(key: string) {
  const s = STORE_LABELS[key];
  if (!s) return key;
  return `${s.zh} ${s.en}`;
}


interface StorePriceRowProps {
  storeKey: string;
  price: number;
  maxPrice: number;
  minPrice: number;
  isCheapest: boolean;
  currency: string;
}

function StorePriceRow({ storeKey, price, maxPrice, minPrice, isCheapest, currency }: StorePriceRowProps) {
  const range = maxPrice - minPrice;
  const barWidth = range > 0 ? 40 + ((price - minPrice) / range) * 55 : 80;

  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all ${
      isCheapest
        ? 'bg-green-500/10 border border-green-500/30'
        : 'bg-white/[0.03] border border-white/[0.06]'
    }`}>
      {/* Trophy / spacer */}
      <div className="w-5 text-center flex-shrink-0">
        {isCheapest ? <span className="text-base">🏆</span> : <span className="text-white/20 text-xs">·</span>}
      </div>

      {/* Store name */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCheapest ? 'text-white' : 'text-white/70'}`}>
          {getStoreLabel(storeKey)}
        </p>
      </div>

      {/* Price bar + number */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Bar */}
        <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden hidden sm:block">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isCheapest ? 'bg-green-400' : 'bg-white/30'}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>

        {/* Price */}
        <span className={`text-base font-bold tabular-nums min-w-[52px] text-right ${
          isCheapest
            ? 'text-green-400 text-lg'
            : 'text-white/70'
        }`}>
          {currency}{price.toFixed(1)}
        </span>

        {/* Badge */}
        {isCheapest && (
          <span className="text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5 whitespace-nowrap">
            最平
          </span>
        )}
      </div>
    </div>
  );
}

export function OfficialPricePage() {
  const { code } = useParams<{ code: string }>();
  const [product, setProduct] = useState<OfficialPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    getDoc(doc(db, 'officialPrices', code))
      .then(snap => {
        if (snap.exists()) {
          setProduct({ code: snap.id, ...snap.data() } as OfficialPrice);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-14 lg:pt-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-14 lg:pt-20">
        <PageHeader title="官方價格" showBack />
        <div className="px-4 py-12 text-center text-white/40">
          <div className="text-5xl mb-4">🔍</div>
          <p>找不到此產品 Product not found</p>
        </div>
      </div>
    );
  }

  const currency = product.currency ?? '$';

  // ── Compute store price data ──────────────────────────────────────────────
  const storePrices = product.storePrices ?? {};
  const allStoreKeys = Object.keys(STORE_LABELS);

  // Stores WITH price, sorted cheapest first
  const withPrice = Object.entries(storePrices)
    .sort((a, b) => a[1] - b[1]);
  const minPriceVal = withPrice.length > 0 ? withPrice[0][1] : 0;
  const maxPriceVal = withPrice.length > 0 ? withPrice[withPrice.length - 1][1] : 0;
  const cheapestKey = withPrice.length > 0 ? withPrice[0][0] : null;

  // Stores from product.stores that have NO price
  const withoutPrice = allStoreKeys.filter(
    k => product.stores?.[k as keyof typeof product.stores] && !storePrices[k]
  );

  // Known unavailable stores (not in product.stores at all)
  const noPriceKnown = allStoreKeys.filter(
    k => !product.stores?.[k as keyof typeof product.stores] && !storePrices[k]
  );

  // ── Savings tip ───────────────────────────────────────────────────────────
  let tip = '';
  if (withPrice.length >= 2) {
    const cheapestLabel = STORE_LABELS[withPrice[0][0]]?.zh ?? withPrice[0][0];
    const saving = (withPrice[withPrice.length - 1][1] - withPrice[0][1]).toFixed(1);
    tip = `${cheapestLabel}最平，慳 ${currency}${saving}`;
  } else if (withPrice.length === 1) {
    const cheapestLabel = STORE_LABELS[withPrice[0][0]]?.zh ?? withPrice[0][0];
    tip = `只有${cheapestLabel}有售，記住格價！`;
  }

  const hasStorePrices = withPrice.length > 0;
  const displayPrice = product.minPrice ?? (withPrice[0]?.[1] ?? null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      <PageHeader title="官方價格" showBack />

      <div className="px-4 py-8 max-w-3xl mx-auto lg:px-6 lg:py-12 space-y-6">

        {/* ── Hero Product Card ──────────────────────────────────────────── */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 lg:p-10">
          {product.brand && (
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-2">{product.brand}</p>
          )}
          <h2 className="font-bold text-white text-2xl lg:text-3xl leading-snug mb-6">{product.name}</h2>

          {displayPrice != null && (
            <div className="mb-4">
              <p className="text-xs text-white/30 mb-1">最低市場價格</p>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent leading-none">
                {currency}{displayPrice.toFixed(1)}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4 text-xs">
            <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/40">📦 {product.code}</span>
            {product.category && (
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/40">🏷️ {product.category}</span>
            )}
            {hasStorePrices && (
              <span className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-green-400">
                🏪 {withPrice.length} 間有售
              </span>
            )}
          </div>
        </div>

        {/* ── Store Price Comparison ─────────────────────────────────────── */}
        <div>
          <h3 className="font-bold text-white/80 text-sm mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>各商店價格 Store Prices</span>
          </h3>

          {hasStorePrices ? (
            <div className="space-y-2">
              {withPrice.map(([key, price]) => (
                <StorePriceRow
                  key={key}
                  storeKey={key}
                  price={price}
                  maxPrice={maxPriceVal}
                  minPrice={minPriceVal}
                  isCheapest={key === cheapestKey}
                  currency={currency}
                />
              ))}

              {(withoutPrice.length > 0 || noPriceKnown.length > 0) && (
                <>
                  <div className="flex items-center gap-3 py-2 px-4">
                    <div className="flex-1 border-t border-white/10" />
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">未有價格</span>
                    <div className="flex-1 border-t border-white/10" />
                  </div>
                  {[...withoutPrice, ...noPriceKnown].map(key => (
                    <div key={key} className="flex items-center gap-3 rounded-2xl px-4 py-3 opacity-35">
                      <div className="w-5" />
                      <p className="flex-1 text-sm text-white/40">{getStoreLabel(key)}</p>
                      <span className="text-white/30 text-sm font-medium">—</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            /* Fallback: old ✓/✗ store list if no storePrices */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(product.stores ?? {}).map(([key, available]) => (
                <div key={key} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${available ? 'bg-green-500/5 border border-green-500/20' : 'bg-white/2 border border-white/5 opacity-40'}`}>
                  <span className={available ? 'text-green-400' : 'text-white/20'}>{available ? '✓' : '✗'}</span>
                  <span className={`text-sm ${available ? 'text-white/80' : 'text-white/40'}`}>{getStoreLabel(key)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Savings Tip ───────────────────────────────────────────────── */}
        {tip && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-5 py-4">
            <p className="text-xs font-bold text-amber-400/80 mb-1">💡 格價小貼士</p>
            <p className="text-sm text-white/70">{tip}</p>
          </div>
        )}

        {/* ── Price Trend Placeholder ────────────────────────────────────── */}
        <div>
          <h3 className="font-bold text-white/80 text-sm mb-4 flex items-center gap-2">
            <span>📈</span>
            <span>價格走勢 Price Trend</span>
          </h3>

          <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 lg:p-8">
            {/* Decorative gradient chart line */}
            <div className="relative h-16 mb-4">
              <svg viewBox="0 0 300 60" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <path
                  d="M0,50 C30,45 60,38 90,35 C120,32 150,28 180,25 C210,22 240,20 270,18 L300,16 L300,60 L0,60 Z"
                  fill="url(#chartGrad)"
                />
                {/* Line */}
                <path
                  d="M0,50 C30,45 60,38 90,35 C120,32 150,28 180,25 C210,22 240,20 270,18 L300,16"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* End dot */}
                <circle cx="300" cy="16" r="3" fill="#10b981" opacity="0.8" />
              </svg>
            </div>

            <p className="text-xs text-white/30 text-center">
              每日更新 — 價格走勢即將推出<br />
              <span className="text-white/20">Daily updates — Price trend coming soon</span>
            </p>

            {/* Subtle overlay glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-green-500/5 blur-2xl rounded-full pointer-events-none" />
          </div>
        </div>

        {/* ── Source / Date ─────────────────────────────────────────────── */}
        <p className="text-xs text-white/20 text-center pt-2">
          資料來源 Source: 消費者委員會 Consumer Council
          {product.updatedAt && (
            <> · {new Date((product.updatedAt as { seconds: number }).seconds * 1000).toLocaleDateString('zh-HK')}</>
          )}
        </p>
      </div>
    </div>
  );
}
