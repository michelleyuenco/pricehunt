import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { type OfficialPrice } from '../../application/hooks/useOfficialPrices';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';

const STORE_LABELS: Record<string, string> = {
  wellcome:  '惠康 Wellcome',
  parknshop: '百佳 ParknShop',
  jasons:    'Market Place by Jasons',
  watsons:   '屈臣氏 Watsons',
  mannings:  '萬寧 Mannings',
  aeon:      'AEON',
  dchfood:   '大昌食品 DCH Food',
  sasa:      '莎莎 Sa Sa',
  lungfung:  '龍豐 Lung Fung',
};

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

  const storeEntries = Object.entries(product.stores ?? {});
  const availableStores = storeEntries.filter(([, v]) => v);
  const unavailableStores = storeEntries.filter(([, v]) => !v);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      <PageHeader title="官方價格" showBack />

      <div className="px-4 py-6 max-w-3xl mx-auto lg:px-6">
        {/* Product Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 lg:p-8">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/40 mb-1">{product.brand}</p>
              <h2 className="font-bold text-white text-base leading-snug lg:text-xl">{product.name}</h2>
            </div>
            {product.minPrice != null && (
              <div className="text-right shrink-0">
                <p className="text-2xl font-extrabold text-green-400 lg:text-4xl">
                  {product.currency}{product.minPrice.toFixed(1)}
                </p>
                <p className="text-[10px] text-white/30">最低價 min</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/40">
              📦 {product.code}
            </span>
            {product.category && (
              <span className="bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/40">
                🏷️ {product.category}
              </span>
            )}
            <span className="bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1 text-green-400">
              🏪 {availableStores.length} 間商店
            </span>
          </div>
        </div>

        {/* Store Availability */}
        <h3 className="font-bold text-white/70 text-sm mb-3 flex items-center gap-2">
          <span>🏪</span>
          <span>商店供應情況</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {availableStores.map(([key]) => (
            <div key={key} className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3">
              <span className="text-green-400 text-base">✓</span>
              <span className="text-sm text-white/80">{STORE_LABELS[key] ?? key}</span>
            </div>
          ))}
          {unavailableStores.map(([key]) => (
            <div key={key} className="flex items-center gap-3 bg-white/2 border border-white/5 rounded-xl px-4 py-3 opacity-40">
              <span className="text-white/20 text-base">✗</span>
              <span className="text-sm text-white/40">{STORE_LABELS[key] ?? key}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/20 text-center">
          資料來源 Source: 消費者委員會 Consumer Council<br />
          {product.updatedAt && `Updated: ${new Date((product.updatedAt as { seconds: number }).seconds * 1000).toLocaleDateString('zh-HK')}`}
        </p>
      </div>
    </div>
  );
}
