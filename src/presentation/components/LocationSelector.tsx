import { useState } from 'react';
import { REGIONS } from '../../domain/constants/locations';

interface LocationSelectorProps {
  value: string;           // current selected location value (any level)
  onChange: (value: string) => void;
  label?: string;
}

/**
 * Hierarchical location selector.
 * Level 1: Region buttons (香港 / 台灣)
 * Level 2: Sub-region chips (港島 / 九龍 / 新界)
 * Level 3: District chips (中西區 / 灣仔區 ...)
 *
 * User can stop at any level. Selecting a higher level clears lower selections.
 */
export function LocationSelector({ value, onChange, label }: LocationSelectorProps) {
  const [expandedRegion, setExpandedRegion] = useState<string>(() => {
    // Auto-expand if value is a sub-region or district
    for (const r of REGIONS) {
      if (r.value === value) return r.value;
      for (const sr of r.subRegions) {
        if (sr.value === value) return r.value;
        for (const d of sr.districts) {
          if (d.value === value) return r.value;
        }
      }
    }
    return '';
  });

  const [expandedSubRegion, setExpandedSubRegion] = useState<string>(() => {
    for (const r of REGIONS) {
      for (const sr of r.subRegions) {
        if (sr.value === value) return sr.value;
        for (const d of sr.districts) {
          if (d.value === value) return sr.value;
        }
      }
    }
    return '';
  });

  const handleRegionClick = (regionValue: string) => {
    if (expandedRegion === regionValue) {
      // Clicking same region = select at region level
      onChange(regionValue);
    } else {
      setExpandedRegion(regionValue);
      setExpandedSubRegion('');
      onChange(regionValue);
    }
  };

  const handleSubRegionClick = (srValue: string) => {
    if (expandedSubRegion === srValue) {
      onChange(srValue);
    } else {
      setExpandedSubRegion(srValue);
      onChange(srValue);
    }
  };

  const selectedRegion = REGIONS.find(r => r.value === expandedRegion);
  const selectedSubRegion = selectedRegion?.subRegions.find(sr => sr.value === expandedSubRegion);

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-white/60">{label}</label>
      )}

      {/* Level 1: Regions */}
      <div className="flex gap-2">
        {REGIONS.map(r => (
          <button
            key={r.value}
            type="button"
            onClick={() => handleRegionClick(r.value)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              expandedRegion === r.value
                ? 'border-green-500/50 bg-green-500/20 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
            }`}
          >
            <span className="text-lg">{r.flag}</span>
            <span>{r.labelZh}</span>
          </button>
        ))}
      </div>

      {/* Level 2: Sub-regions */}
      {selectedRegion && (
        <div className="space-y-2">
          <div className="text-xs text-white/30 pl-1">
            {value === expandedRegion ? `已選：全${selectedRegion.labelZh}` : '選擇地區 ↓'}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedRegion.subRegions.map(sr => (
              <button
                key={sr.value}
                type="button"
                onClick={() => handleSubRegionClick(sr.value)}
                className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${
                  expandedSubRegion === sr.value
                    ? 'border-green-500/50 bg-green-500/15 text-green-400'
                    : value === sr.value
                    ? 'border-green-500/30 bg-green-500/10 text-green-300'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/8'
                }`}
              >
                {sr.labelZh}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Level 3: Districts */}
      {selectedSubRegion && (
        <div className="space-y-2">
          <div className="text-xs text-white/30 pl-1">
            {value === expandedSubRegion ? `已選：全${selectedSubRegion.labelZh}` : '選擇分區 ↓'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedSubRegion.districts.map(d => (
              <button
                key={d.value}
                type="button"
                onClick={() => onChange(d.value)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
                  value === d.value
                    ? 'border-green-500/50 bg-green-500/20 text-green-400'
                    : 'border-white/10 bg-white/[0.03] text-white/40 hover:border-white/15 hover:text-white/60'
                }`}
              >
                {d.labelZh}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selection summary */}
      {value && (
        <div className="text-xs text-green-400/70 pl-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          已選：{(() => {
            for (const r of REGIONS) {
              if (r.value === value) return `${r.flag} ${r.labelZh}（全部地區）`;
              for (const sr of r.subRegions) {
                if (sr.value === value) return `${r.flag} ${r.labelZh} · ${sr.labelZh}（全部分區）`;
                for (const d of sr.districts) {
                  if (d.value === value) return `${r.flag} ${sr.labelZh} · ${d.labelZh}`;
                }
              }
            }
            return value;
          })()}
        </div>
      )}
    </div>
  );
}
