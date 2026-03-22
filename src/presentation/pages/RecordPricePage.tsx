import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Check, ChevronDown, X, Store, Package, DollarSign, Tag } from 'lucide-react';
import { useAuth } from '../../application/context/AuthContext';
import { useLanguage } from '../../application/context/LanguageContext';
import { useCreateRecord } from '../../application/hooks/usePriceRecords';
import { useMyRecords } from '../../application/hooks/usePriceRecords';
import { useStoreSearch, useProductSearch, addUnifiedStore, addUnifiedProduct, incrementStoreRecordCount, incrementProductRecordCount } from '../../application/hooks/useUnifiedSearch';
import { useMyReputation } from '../../application/hooks/useReputation';
import { getBadgeById } from '../../domain/constants/badges';
import { PageHeader } from '../components/PageHeader';
import type { UnifiedStore } from '../../shared/types/priceRecord';
import type { ProductSearchResult } from '../../application/hooks/useUnifiedSearch';

const CURRENCIES = ['HK$', 'NT$', '¥'];
const UNITS = [
  { key: 'record.perItem', fallback: 'per item' },
  { key: 'record.perKg', fallback: 'per kg' },
  { key: 'record.perPack', fallback: 'per pack' },
  { key: 'record.perBox', fallback: 'per box' },
  { key: 'record.perBottle', fallback: 'per bottle' },
  { key: 'record.perCan', fallback: 'per can' },
];

interface StorePickerProps {
  value: UnifiedStore | null;
  onChange: (store: UnifiedStore | null) => void;
  recentRecords: ReturnType<typeof useMyRecords>['records'];
}

function StorePicker({ value, onChange, recentRecords }: StorePickerProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [newBranch, setNewBranch] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const { results: searchResults, loading } = useStoreSearch(query);
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  // Recent stores from records
  const recentStoreMap = new Map<string, UnifiedStore>();
  for (const r of recentRecords) {
    if (r.storeId && !recentStoreMap.has(r.storeId)) {
      recentStoreMap.set(r.storeId, {
        id: r.storeId,
        brand: r.storeId,
        brandName: r.storeName,
        branchName: r.storeBranch,
        fullName: `${r.storeName} ${r.storeBranch}`.trim(),
        address: r.storeAddress,
        district: '',
        region: '',
        lat: null,
        lng: null,
        isVerified: false,
        createdBy: null,
        recordCount: 0,
      });
    }
  }
  const recentStores = Array.from(recentStoreMap.values()).slice(0, 3);

  const displayResults = query.trim() ? searchResults : recentStores;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (store: UnifiedStore) => {
    onChange(store);
    setQuery('');
    setOpen(false);
  };

  const handleAddNew = async () => {
    if (!newBrand.trim() || !user) return;
    const store: UnifiedStore = {
      id: `user_store_${Date.now()}`,
      brand: newBrand.toLowerCase().replace(/\s+/g, '_'),
      brandName: newBrand,
      branchName: newBranch,
      fullName: `${newBrand} ${newBranch}`.trim(),
      address: newAddress,
      district: '',
      region: '',
      lat: null,
      lng: null,
      isVerified: false,
      createdBy: user.uid,
      recordCount: 0,
    };
    try {
      await addUnifiedStore(store, user.uid);
    } catch (_) { /* ignore errors */ }
    onChange(store);
    setShowAddForm(false);
    setOpen(false);
    setNewBrand('');
    setNewBranch('');
    setNewAddress('');
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
          <button onClick={() => onChange(null)} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={16} className="text-current" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={t('record.storePlaceholder') || 'Search store...'}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/40 transition-all"
          />
        </div>
      )}

      {open && !value && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#0f0f0f]/95 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-xs text-white/30">搜尋中...</div>
          )}

          {!query.trim() && recentStores.length > 0 && (
            <div className="px-3 pt-2 pb-1">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-1 mb-1">{t('record.recent') || 'Recent'}</p>
              {recentStores.map(store => (
                <button
                  key={store.id}
                  onClick={() => handleSelect(store)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <Store size={14} className="text-white/40 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white/80">{store.brandName}</p>
                    {store.branchName && <p className="text-xs text-white/40">{store.branchName}</p>}
                  </div>
                </button>
              ))}
              <div className="border-t border-white/5 my-1" />
            </div>
          )}

          {displayResults.filter(s => !recentStoreMap.has(s.id) || query.trim()).map(store => (
            <button
              key={store.id}
              onClick={() => handleSelect(store)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <Store size={14} className="text-white/40 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-white/80">{store.brandName}</p>
                {store.branchName && <p className="text-xs text-white/40">{store.branchName}</p>}
                {store.address && <p className="text-[11px] text-white/25 truncate">{store.address}</p>}
              </div>
            </button>
          ))}

          {/* Add new store */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-green-400 hover:bg-green-500/5 transition-colors border-t border-white/5"
            >
              <Plus size={14} className="text-current" />
              <span>{t('record.addStore') || 'Add new store'}</span>
            </button>
          ) : (
            <div className="p-3 border-t border-white/5 space-y-2">
              <p className="text-xs font-semibold text-white/50 px-1">{t('record.addStore') || 'Add new store'}</p>
              <input
                value={newBrand}
                onChange={e => setNewBrand(e.target.value)}
                placeholder="商店名稱 / Store name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/30"
              />
              <input
                value={newBranch}
                onChange={e => setNewBranch(e.target.value)}
                placeholder="分店名稱 / Branch (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/30"
              />
              <input
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                placeholder="地址 / Address (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/30"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddNew}
                  disabled={!newBrand.trim()}
                  className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold py-2 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-40"
                >
                  <Check size={14} className="inline mr-1" />確認
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 bg-white/5 border border-white/10 text-white/50 text-sm rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={14} className="text-current" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ProductPickerProps {
  value: ProductSearchResult | null;
  onChange: (product: ProductSearchResult | null) => void;
  recentRecords: ReturnType<typeof useMyRecords>['records'];
}

function ProductPicker({ value, onChange, recentRecords }: ProductPickerProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const { results: searchResults, loading } = useProductSearch(query);
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  // Recent products from records
  const recentProductMap = new Map<string, ProductSearchResult>();
  for (const r of recentRecords) {
    if (r.productCode && !recentProductMap.has(r.productCode)) {
      recentProductMap.set(r.productCode, {
        code: r.productCode,
        name: r.productName,
        brand: r.productBrand,
        category: '',
        isOfficial: false,
      });
    }
  }
  const recentProducts = Array.from(recentProductMap.values()).slice(0, 3);
  const displayResults = query.trim() ? searchResults : recentProducts;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (product: ProductSearchResult) => {
    onChange(product);
    setQuery('');
    setOpen(false);
  };

  const handleAddNew = async () => {
    if (!newName.trim() || !user) return;
    let code = `U_${Date.now()}`;
    try {
      code = await addUnifiedProduct({
        code,
        name: newName,
        brand: newBrand,
        aliases: [],
        category: newCategory,
        isOfficial: false,
        createdBy: user.uid,
      }, user.uid);
    } catch (_) { /* ignore */ }
    onChange({ code, name: newName, brand: newBrand, category: newCategory, isOfficial: false });
    setShowAddForm(false);
    setOpen(false);
    setNewName('');
    setNewBrand('');
    setNewCategory('');
  };

  return (
    <div ref={ref} className="relative">
      {value ? (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
          <Package size={16} className="text-green-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{value.name}</p>
            {value.brand && <p className="text-xs text-white/50">{value.brand}</p>}
            {value.isOfficial && (
              <span className="inline-block mt-0.5 text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-full px-1.5 py-0.5">官方</span>
            )}
          </div>
          <button onClick={() => onChange(null)} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={16} className="text-current" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={t('record.productPlaceholder') || 'Search product...'}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/40 transition-all"
          />
        </div>
      )}

      {open && !value && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#0f0f0f]/95 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-xs text-white/30">搜尋中...</div>
          )}

          {!query.trim() && recentProducts.length > 0 && (
            <div className="px-3 pt-2 pb-1">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-1 mb-1">{t('record.recent') || 'Recent'}</p>
              {recentProducts.map(product => (
                <button
                  key={product.code}
                  onClick={() => handleSelect(product)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <Package size={14} className="text-white/40 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white/80">{product.name}</p>
                    {product.brand && <p className="text-xs text-white/40">{product.brand}</p>}
                  </div>
                </button>
              ))}
              <div className="border-t border-white/5 my-1" />
            </div>
          )}

          {displayResults.filter(p => !recentProductMap.has(p.code) || query.trim()).map(product => (
            <button
              key={product.code}
              onClick={() => handleSelect(product)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <Package size={14} className="text-white/40 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white/80">{product.name}</p>
                {product.brand && <p className="text-xs text-white/40">{product.brand}</p>}
                {product.isOfficial && (
                  <span className="text-[10px] text-blue-400">官方資料</span>
                )}
              </div>
              {product.minPrice != null && (
                <span className="text-xs text-green-400 font-semibold flex-shrink-0">
                  {product.currency}{product.minPrice?.toFixed?.(1)}起
                </span>
              )}
            </button>
          ))}

          {/* Add new product */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-green-400 hover:bg-green-500/5 transition-colors border-t border-white/5"
            >
              <Plus size={14} className="text-current" />
              <span>{t('record.addProduct') || 'Add new product'}</span>
            </button>
          ) : (
            <div className="p-3 border-t border-white/5 space-y-2">
              <p className="text-xs font-semibold text-white/50 px-1">{t('record.addProduct') || 'Add new product'}</p>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="產品名稱 / Product name *"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/30"
              />
              <input
                value={newBrand}
                onChange={e => setNewBrand(e.target.value)}
                placeholder="品牌 / Brand (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/30"
              />
              <input
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="分類 / Category (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/30"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddNew}
                  disabled={!newName.trim()}
                  className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold py-2 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-40"
                >
                  <Check size={14} className="inline mr-1" />確認
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 bg-white/5 border border-white/10 text-white/50 text-sm rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={14} className="text-current" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RecordPricePage() {
  const { user, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { create, creating } = useCreateRecord();
  const { records: myRecords } = useMyRecords();
  const { onRecordSaved } = useMyReputation();

  const [store, setStore] = useState<UnifiedStore | null>(null);
  const [product, setProduct] = useState<ProductSearchResult | null>(null);
  const [currency, setCurrency] = useState('HK$');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('per item');
  const [isOnSale, setIsOnSale] = useState(false);
  const [originalPrice, setOriginalPrice] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [newBadges, setNewBadges] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { signInWithGoogle(); return; }
    if (!store) { setError('請選擇商店'); return; }
    if (!product) { setError('請選擇產品'); return; }
    if (!price || isNaN(Number(price))) { setError('請輸入有效價格'); return; }

    setError('');
    try {
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
        unit,
        isOnSale,
        originalPrice: isOnSale && originalPrice ? Number(originalPrice) : null,
        note,
        photoUrl: null,
        location: { lat: store.lat, lng: store.lng },
      });

      // Background: update counters
      incrementStoreRecordCount(store.id).catch(() => {});
      incrementProductRecordCount(product.code, Number(price)).catch(() => {});

      // Update reputation and check for new badges
      const earnedBadges = await onRecordSaved().catch(() => [] as string[]);
      if (earnedBadges.length > 0) {
        setNewBadges(earnedBadges);
      }

      setSaved(true);
      setTimeout(() => {
        navigate(-1);
      }, earnedBadges.length > 0 ? 3000 : 1500);
    } catch (err) {
      setError('儲存失敗，請重試');
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-14 lg:pt-20">
        <PageHeader title={t('record.title') || '記錄價格'} showBack />
        <div className="px-4 py-12 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-white/60 mb-6">{t('create.signIn.desc')}</p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl"
          >
            {t('create.signIn.btn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      <PageHeader title={t('record.title') || '記錄價格'} showBack />

      {/* Success flash */}
      {saved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500/90 backdrop-blur-xl rounded-3xl px-8 py-6 shadow-2xl flex flex-col items-center gap-3 animate-in fade-in zoom-in">
            <Check size={40} className="text-white" />
            <p className="text-white font-bold text-xl">{t('record.saved') || '已儲存！'}</p>
            {newBadges.map(id => {
              const badge = getBadgeById(id);
              if (!badge) return null;
              return (
                <div key={id} className="bg-white/20 rounded-2xl px-4 py-2 text-center">
                  <p className="text-2xl">{badge.icon}</p>
                  <p className="text-white text-sm font-bold">🎉 {t('reputation.badgeEarned') || '你獲得了新徽章！'}</p>
                  <p className="text-white/80 text-xs">「{badge.nameZh}」 {badge.nameEn}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-lg mx-auto space-y-6">

        {/* Store section */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-2">
            <Store size={14} className="text-white/40" />
            <span>{t('record.store') || '商店'}</span>
            <span className="text-white/30 font-normal text-xs">Store</span>
          </label>
          <StorePicker value={store} onChange={setStore} recentRecords={myRecords} />
        </div>

        {/* Product section */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-2">
            <Package size={14} className="text-white/40" />
            <span>{t('record.product') || '產品'}</span>
            <span className="text-white/30 font-normal text-xs">Product</span>
          </label>
          <ProductPicker value={product} onChange={setProduct} recentRecords={myRecords} />
        </div>

        {/* Price section */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-2">
            <DollarSign size={14} className="text-white/40" />
            <span>{t('record.price') || '價格'}</span>
            <span className="text-white/30 font-normal text-xs">Price</span>
          </label>

          <div className="flex gap-2 mb-3">
            {/* Currency selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-3 pr-8 text-sm text-white focus:outline-none focus:border-green-500/40 cursor-pointer"
              >
                {CURRENCIES.map(c => (
                  <option key={c} value={c} className="bg-[#0f0f0f]">{c}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>

            {/* Price input */}
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.1"
              min="0"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/40 transition-all"
            />

            {/* Unit selector */}
            <div className="relative">
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-3 pr-8 text-sm text-white focus:outline-none focus:border-green-500/40 cursor-pointer"
              >
                {UNITS.map(u => (
                  <option key={u.key} value={t(u.key) || u.fallback} className="bg-[#0f0f0f]">
                    {t(u.key) || u.fallback}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* On sale toggle */}
          <button
            type="button"
            onClick={() => setIsOnSale(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
              isOnSale
                ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400'
                : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
            }`}
          >
            <Tag size={14} className="text-current" />
            <span>{t('record.onSale') || '特價中'} On sale</span>
            {isOnSale && <Check size={12} className="text-current" />}
          </button>

          {isOnSale && (
            <div className="mt-3">
              <label className="text-xs text-white/40 mb-1.5 block">{t('record.originalPrice') || '原價'} Original price</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/40">{currency}</span>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.1"
                  min="0"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="text-sm font-semibold text-white/70 mb-2 block">
            {t('record.note') || '備註'} <span className="text-white/30 font-normal text-xs">Note (optional)</span>
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="例如：快到期、特別優惠..."
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/40 transition-all resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <X size={14} className="text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={creating || saved}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-2xl text-base shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
        >
          {creating ? (
            <span className="text-sm">{t('common.loading') || '載入中...'}</span>
          ) : saved ? (
            <>
              <Check size={20} className="text-current" />
              <span>{t('record.saved') || '已儲存！'}</span>
            </>
          ) : (
            <>
              <Check size={20} className="text-current" />
              <span>{t('record.save') || '儲存記錄'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
