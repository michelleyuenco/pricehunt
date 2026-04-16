import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Check, ChevronDown, X, Store, Package,
  DollarSign, Tag, Camera,
} from 'lucide-react';
import { useAuth } from '../../application/context/AuthContext';
import { useLanguage } from '../../application/context/LanguageContext';
import { useCreateRecord, useMyRecords } from '../../application/hooks/usePriceRecords';
import { usePhotoUpload } from '../../application/hooks/usePhotoUpload';
import {
  useStoreSearch, useProductSearch,
  addUnifiedStore, addUnifiedProduct,
  incrementStoreRecordCount, incrementProductRecordCount,
} from '../../application/hooks/useUnifiedSearch';
import { PhotoUpload } from '../components/PhotoUpload';
import { PageHeader } from '../components/PageHeader';
import type { UnifiedStore } from '../../shared/types/priceRecord';
import type { ProductSearchResult } from '../../application/hooks/useUnifiedSearch';

const CURRENCIES = ['HK$', 'NT$', '¥'];

// ── Store Picker ──────────────────────────────────────────────────────────────

function StorePicker({ value, onChange, recentRecords }: {
  value: UnifiedStore | null;
  onChange: (store: UnifiedStore | null) => void;
  recentRecords: ReturnType<typeof useMyRecords>['records'];
}) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [newBranch, setNewBranch] = useState('');
  const { results: searchResults, loading } = useStoreSearch(query);
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  const recentStoreMap = new Map<string, UnifiedStore>();
  for (const r of recentRecords) {
    if (r.storeId && !recentStoreMap.has(r.storeId)) {
      recentStoreMap.set(r.storeId, {
        id: r.storeId, brand: r.storeId, brandName: r.storeName,
        branchName: r.storeBranch, fullName: `${r.storeName} ${r.storeBranch}`.trim(),
        address: r.storeAddress, district: '', region: '',
        lat: null, lng: null, isVerified: false, createdBy: null, recordCount: 0,
      });
    }
  }
  const recentStores = Array.from(recentStoreMap.values()).slice(0, 3);
  const displayResults = query.trim() ? searchResults : recentStores;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (store: UnifiedStore) => { onChange(store); setQuery(''); setOpen(false); };

  const handleAddNew = async () => {
    if (!newBrand.trim() || !user) return;
    const store: UnifiedStore = {
      id: `user_store_${Date.now()}`, brand: newBrand.toLowerCase().replace(/\s+/g, '_'),
      brandName: newBrand, branchName: newBranch, fullName: `${newBrand} ${newBranch}`.trim(),
      address: '', district: '', region: '', lat: null, lng: null,
      isVerified: false, createdBy: user.uid, recordCount: 0,
    };
    try { await addUnifiedStore(store, user.uid); } catch { /* ignore */ }
    onChange(store); setShowAdd(false); setOpen(false); setNewBrand(''); setNewBranch('');
  };

  return (
    <div ref={ref} className="relative">
      {value ? (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
          <Store size={16} className="text-green-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{value.brandName}</p>
            {value.branchName && <p className="text-xs text-white/50">{value.branchName}</p>}
          </div>
          <button onClick={() => onChange(null)} className="text-white/30 hover:text-white/60"><X size={16} /></button>
        </div>
      ) : (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={t('record.storePlaceholder') || 'Search store...'}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/40 transition-all"
          />
        </div>
      )}

      {open && !value && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[55] bg-[#0f0f0f]/95 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden max-h-[40vh] overflow-y-auto">
          {loading && <div className="px-4 py-3 text-xs text-white/30">搜尋中...</div>}
          {!query.trim() && recentStores.length > 0 && (
            <div className="px-3 pt-2 pb-1">
              <p className="text-[10px] font-semibold text-white/30 uppercase px-1 mb-1">{t('record.recent') || 'Recent'}</p>
            </div>
          )}
          {displayResults.map(store => (
            <button key={store.id} onClick={() => handleSelect(store)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <Store size={14} className="text-white/40 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-white/80">{store.brandName}</p>
                {store.branchName && <p className="text-xs text-white/40">{store.branchName}</p>}
              </div>
            </button>
          ))}
          {!showAdd ? (
            <button onClick={() => setShowAdd(true)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-green-400 hover:bg-green-500/5 border-t border-white/5"
            >
              <Plus size={14} /> <span>{t('record.addStore') || 'Add new store'}</span>
            </button>
          ) : (
            <div className="p-3 border-t border-white/5 space-y-2">
              <input value={newBrand} onChange={e => setNewBrand(e.target.value)}
                placeholder="商店名稱 / Store name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/30" />
              <input value={newBranch} onChange={e => setNewBranch(e.target.value)}
                placeholder="分店 / Branch (optional)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/30" />
              <div className="flex gap-2">
                <button onClick={handleAddNew} disabled={!newBrand.trim()}
                  className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold py-2 rounded-lg disabled:opacity-40"
                ><Check size={14} className="inline mr-1" />確認</button>
                <button onClick={() => setShowAdd(false)}
                  className="px-3 bg-white/5 border border-white/10 text-white/50 text-sm rounded-lg"
                ><X size={14} /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Product Picker ────────────────────────────────────────────────────────────

function ProductPicker({ value, onChange, recentRecords }: {
  value: ProductSearchResult | null;
  onChange: (product: ProductSearchResult | null) => void;
  recentRecords: ReturnType<typeof useMyRecords>['records'];
}) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const { results: searchResults, loading } = useProductSearch(query);
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  const recentProductMap = new Map<string, ProductSearchResult>();
  for (const r of recentRecords) {
    if (r.productCode && !recentProductMap.has(r.productCode)) {
      recentProductMap.set(r.productCode, {
        code: r.productCode, name: r.productName, brand: r.productBrand,
        category: '', isOfficial: false,
      });
    }
  }
  const recentProducts = Array.from(recentProductMap.values()).slice(0, 3);
  const displayResults = query.trim() ? searchResults : recentProducts;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (product: ProductSearchResult) => { onChange(product); setQuery(''); setOpen(false); };

  const handleAddNew = async () => {
    if (!newName.trim() || !user) return;
    let code = `U_${Date.now()}`;
    try {
      code = await addUnifiedProduct({
        code, name: newName, brand: newBrand, aliases: [],
        category: '', isOfficial: false, createdBy: user.uid,
      }, user.uid);
    } catch { /* ignore */ }
    onChange({ code, name: newName, brand: newBrand, category: '', isOfficial: false });
    setShowAdd(false); setOpen(false); setNewName(''); setNewBrand('');
  };

  return (
    <div ref={ref} className="relative">
      {value ? (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
          <Package size={16} className="text-green-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{value.name}</p>
            {value.brand && <p className="text-xs text-white/50">{value.brand}</p>}
          </div>
          <button onClick={() => onChange(null)} className="text-white/30 hover:text-white/60"><X size={16} /></button>
        </div>
      ) : (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={t('record.productPlaceholder') || 'Search product...'}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/40 transition-all"
          />
        </div>
      )}

      {open && !value && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[55] bg-[#0f0f0f]/95 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden max-h-[40vh] overflow-y-auto">
          {loading && <div className="px-4 py-3 text-xs text-white/30">搜尋中...</div>}
          {!query.trim() && recentProducts.length > 0 && (
            <div className="px-3 pt-2 pb-1">
              <p className="text-[10px] font-semibold text-white/30 uppercase px-1 mb-1">{t('record.recent') || 'Recent'}</p>
            </div>
          )}
          {displayResults.map(product => (
            <button key={product.code} onClick={() => handleSelect(product)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <Package size={14} className="text-white/40 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white/80">{product.name}</p>
                {product.brand && <p className="text-xs text-white/40">{product.brand}</p>}
              </div>
              {product.minPrice != null && (
                <span className="text-xs text-green-400 font-semibold flex-shrink-0">
                  {product.currency}{product.minPrice?.toFixed?.(1)}起
                </span>
              )}
            </button>
          ))}
          {!showAdd ? (
            <button onClick={() => setShowAdd(true)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-green-400 hover:bg-green-500/5 border-t border-white/5"
            >
              <Plus size={14} /> <span>{t('record.addProduct') || 'Add new product'}</span>
            </button>
          ) : (
            <div className="p-3 border-t border-white/5 space-y-2">
              <input value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="產品名稱 / Product name *" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/30" />
              <input value={newBrand} onChange={e => setNewBrand(e.target.value)}
                placeholder="品牌 / Brand (optional)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/30" />
              <div className="flex gap-2">
                <button onClick={handleAddNew} disabled={!newName.trim()}
                  className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold py-2 rounded-lg disabled:opacity-40"
                ><Check size={14} className="inline mr-1" />確認</button>
                <button onClick={() => setShowAdd(false)}
                  className="px-3 bg-white/5 border border-white/10 text-white/50 text-sm rounded-lg"
                ><X size={14} /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Record Price Page ─────────────────────────────────────────────────────────

export function RecordPricePage() {
  const { user, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { create, creating } = useCreateRecord();
  const { records: myRecords } = useMyRecords();
  const { upload: uploadPhoto, uploading: photoUploading } = usePhotoUpload();

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [store, setStore] = useState<UnifiedStore | null>(null);
  const [product, setProduct] = useState<ProductSearchResult | null>(null);
  const [currency, setCurrency] = useState('HK$');
  const [price, setPrice] = useState('');
  const [isOnSale, setIsOnSale] = useState(false);
  const [originalPrice, setOriginalPrice] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { signInWithGoogle(); return; }
    if (!product) { setError(t('record.error.product') || '請選擇產品'); return; }
    if (!price || isNaN(Number(price))) { setError(t('record.error.price') || '請輸入有效價格'); return; }
    if (!store) { setError(t('record.error.store') || '請選擇商店'); return; }

    setError('');
    try {
      let photoUrl: string | null = null;
      if (photo) {
        photoUrl = await uploadPhoto(photo, user.uid);
      }

      await create({
        productCode: product.code,
        productName: product.name,
        productBrand: product.brand,
        storeId: store.id,
        storeName: store.brandName,
        storeBranch: store.branchName,
        storeAddress: store.address,
        price: Number(price),
        currency,
        unit: 'per item',
        isOnSale,
        originalPrice: isOnSale && originalPrice ? Number(originalPrice) : null,
        note,
        photoUrl,
        location: { lat: store.lat, lng: store.lng },
      });

      incrementStoreRecordCount(store.id).catch(() => {});
      incrementProductRecordCount(product.code, Number(price)).catch(() => {});

      setSaved(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(t('record.error.save') || '儲存失敗，請重試');
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-[#0A0A0A] pt-[calc(env(safe-area-inset-top)+3.5rem)] lg:pt-20">
        <PageHeader title={t('record.title') || '記錄價格'} showBack />
        <div className="px-4 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Camera size={36} className="text-green-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">{t('record.signIn.title') || '登入後記錄價格'}</h2>
          <p className="text-sm text-white/40 mb-6 max-w-xs mx-auto">
            {t('record.signIn.desc') || '登入帳號後即可開始記錄和分享超市價格'}
          </p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.35)] active:scale-95 transition-all"
          >
            {t('common.signIn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0A0A0A] pb-28 pt-[calc(env(safe-area-inset-top)+3.5rem)] lg:pb-8 lg:pt-20">
      <PageHeader title={t('record.title') || '記錄價格'} showBack />

      {/* Success overlay */}
      {saved && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="bg-green-500/90 backdrop-blur-xl rounded-3xl px-10 py-8 shadow-2xl flex flex-col items-center gap-3">
            <Check size={48} className="text-white" />
            <p className="text-white font-bold text-xl">{t('record.saved') || '已儲存！'}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-lg mx-auto space-y-5">

        {/* Photo upload — first and prominent */}
        <div>
          <label className="text-sm font-semibold text-white/70 mb-2 block flex items-center gap-2">
            <Camera size={14} className="text-green-400" />
            <span>{t('record.photo') || '產品照片'}</span>
            <span className="text-white/30 font-normal text-xs">Photo</span>
          </label>
          <PhotoUpload
            value={photo}
            preview={photoPreview}
            onChange={(f, p) => { setPhoto(f); setPhotoPreview(p); }}
            uploading={photoUploading}
          />
        </div>

        {/* Product */}
        <div>
          <label className="text-sm font-semibold text-white/70 mb-2 block flex items-center gap-2">
            <Package size={14} className="text-white/40" />
            <span>{t('record.product') || '產品'}</span>
            <span className="text-red-400 text-xs">*</span>
          </label>
          <ProductPicker value={product} onChange={setProduct} recentRecords={myRecords} />
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-semibold text-white/70 mb-2 block flex items-center gap-2">
            <DollarSign size={14} className="text-white/40" />
            <span>{t('record.price') || '價格'}</span>
            <span className="text-red-400 text-xs">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-3.5 pr-8 text-sm text-white focus:outline-none focus:border-green-500/40 cursor-pointer"
              >
                {CURRENCIES.map(c => (
                  <option key={c} value={c} className="bg-[#0f0f0f]">{c}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.1"
              min="0"
              inputMode="decimal"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-2xl font-bold text-white placeholder:text-white/15 focus:outline-none focus:border-green-500/40 transition-all"
            />
          </div>

          {/* On sale toggle */}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOnSale(v => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                isOnSale
                  ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400'
                  : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
              }`}
            >
              <Tag size={14} /> {t('record.onSale') || '特價中'}
              {isOnSale && <Check size={12} />}
            </button>
            {isOnSale && (
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-white/30">{currency}</span>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value)}
                  placeholder={t('record.originalPrice') || '原價'}
                  step="0.1"
                  min="0"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/30"
                />
              </div>
            )}
          </div>
        </div>

        {/* Store */}
        <div>
          <label className="text-sm font-semibold text-white/70 mb-2 block flex items-center gap-2">
            <Store size={14} className="text-white/40" />
            <span>{t('record.store') || '商店'}</span>
            <span className="text-red-400 text-xs">*</span>
          </label>
          <StorePicker value={store} onChange={setStore} recentRecords={myRecords} />
        </div>

        {/* Note */}
        <div>
          <label className="text-sm font-semibold text-white/70 mb-2 block">
            {t('record.note') || '備註'} <span className="text-white/30 font-normal text-xs">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={t('record.notePlaceholder') || '例如：快到期、特別優惠...'}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/40 transition-all resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <X size={14} className="text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={creating || saved || photoUploading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-2xl text-base shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
        >
          {creating || photoUploading ? (
            <span>{photoUploading ? (t('record.uploading') || '上傳照片中...') : (t('common.loading') || '載入中...')}</span>
          ) : (
            <>
              <Check size={20} />
              <span>{t('record.save') || '儲存記錄'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
