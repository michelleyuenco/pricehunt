import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { MOCK_STORES } from '../../infrastructure/data/mockStores';
import { CITIES } from '../../domain/constants/cities';

export function StoresPage() {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const filteredStores = selectedCity === 'all'
    ? MOCK_STORES
    : MOCK_STORES.filter(s => s.city === selectedCity);

  const getCityFlag = (cityValue: string) => {
    const city = CITIES.find(c => c.value === cityValue);
    return city?.flag ?? '🌍';
  };

  const getCityLabel = (cityValue: string) => {
    const city = CITIES.find(c => c.value === cityValue);
    return city?.labelZh ?? cityValue;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="商店目錄 Stores" subtitle="瀏覽各城市商店" />

      {/* City tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedCity('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCity === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🌍 全部
            </button>
            {CITIES.map(city => (
              <button
                key={city.value}
                onClick={() => setSelectedCity(city.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCity === city.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          <p className="text-sm text-gray-500 mb-3">共 {filteredStores.length} 間商店</p>
          <div className="flex flex-col gap-3">
            {filteredStores.map(store => (
              <Link
                key={store.id}
                to={`/explore?store=${encodeURIComponent(store.nameZh)}`}
                className="block"
              >
                <div className="card p-4 hover:shadow-md transition-shadow duration-200 active:scale-[0.99]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-xl">
                        🏪
                      </div>
                      <div>
                        <div className="font-bold text-charcoal">
                          {store.nameZh}
                          {store.nameEn !== store.nameZh && (
                            <span className="font-normal text-gray-500 text-sm"> · {store.nameEn}</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getCityFlag(store.city)} {getCityLabel(store.city)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">{store.requestCount}</div>
                      <div className="text-xs text-gray-400">格價需求</div>
                    </div>
                  </div>
                  {store.mostRequestedTags && store.mostRequestedTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {store.mostRequestedTags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
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
