import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { STATIC_STORES } from '../../domain/constants/stores';
import { CITIES } from '../../domain/constants/cities';

export function StoresPage() {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const filteredStores = selectedCity === 'all'
    ? STATIC_STORES
    : STATIC_STORES.filter(s => s.city === selectedCity);

  const getCityFlag = (cityValue: string) => {
    const city = CITIES.find(c => c.value === cityValue);
    return city?.flag ?? '🌍';
  };

  const getCityLabel = (cityValue: string) => {
    const city = CITIES.find(c => c.value === cityValue);
    return city?.labelZh ?? cityValue;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14">
      <PageHeader title="商店目錄 Stores" subtitle="瀏覽各城市商店" />

      {/* City tabs */}
      <div className="bg-[#0A0A0A]/95 border-b border-white/10 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedCity('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCity === 'all'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/70 hover:bg-white/8'
              }`}
            >
              🌍 全部
            </button>
            {CITIES.map(city => (
              <button
                key={city.value}
                onClick={() => setSelectedCity(city.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCity === city.value
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                    : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/70 hover:bg-white/8'
                }`}
              >
                {city.flag} {city.labelZh}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto">
          <p className="text-sm text-white/30 mb-3">共 {filteredStores.length} 間商店</p>
          <div className="flex flex-col gap-3">
            {filteredStores.map(store => (
              <Link
                key={store.id}
                to={`/explore?store=${encodeURIComponent(store.nameZh)}`}
                className="block group"
              >
                <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center text-xl">
                        🏪
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          {store.nameZh}
                          {store.nameEn !== store.nameZh && (
                            <span className="font-normal text-white/40 text-sm"> · {store.nameEn}</span>
                          )}
                        </div>
                        <div className="text-sm text-white/40">
                          {getCityFlag(store.city)} {getCityLabel(store.city)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {store.mostRequestedTags && store.mostRequestedTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {store.mostRequestedTags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
