import { type StoreLocation, getStoreLocations, STORE_LOCATIONS } from '../../domain/constants/storeLocations';

interface Props {
  brand: string;         // e.g. "wellcome"
  district?: string;     // e.g. "kwun_tong"
  region?: string;       // e.g. "hongkong"
  onSelect: (location: StoreLocation) => void;
  selectedId?: string;
}

export function StoreLocationPicker({ brand, district, region, onSelect, selectedId }: Props) {
  // Get stores matching brand; optionally filter by district or region
  let matches = getStoreLocations(brand, district);

  // If no district-exact match, fall back to all stores for that brand in that region
  if (matches.length === 0 && region) {
    matches = STORE_LOCATIONS.filter(
      s => s.brand.toLowerCase() === brand.toLowerCase() && s.region === region
    );
  }

  // If still no match, just show all for the brand
  if (matches.length === 0) {
    matches = STORE_LOCATIONS.filter(
      s => s.brand.toLowerCase() === brand.toLowerCase()
    );
  }

  if (matches.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-green-400/70 font-semibold uppercase tracking-widest flex items-center gap-1.5">
        <span>📍</span>
        <span>選擇分店 Select Branch</span>
      </p>
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
        {matches.map(loc => {
          const isSelected = selectedId === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onSelect(loc)}
              className={`w-full text-left rounded-xl border p-3 transition-all duration-200 ${
                isSelected
                  ? 'border-green-500/50 bg-green-500/15 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold leading-tight ${isSelected ? 'text-green-400' : 'text-white/80'}`}>
                    📍 {loc.name}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5 leading-snug line-clamp-2">{loc.address}</p>
                  {loc.hours && (
                    <p className="text-xs text-white/30 mt-0.5">🕐 {loc.hours}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 font-semibold px-2 py-0.5 rounded-full">
                      ✓ 已選
                    </span>
                  ) : (
                    <span className="text-xs bg-white/5 text-white/40 border border-white/10 font-medium px-2 py-0.5 rounded-full hover:bg-white/10 hover:text-white/60 transition-colors">
                      選擇
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
