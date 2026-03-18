/**
 * Hierarchical Location System
 * Level 1: Region (香港, 台灣)
 * Level 2: Sub-region (港島, 九龍, 新界 / 北部, 中部, 南部)
 * Level 3: District (中西區, 灣仔區... / 台北市, 新北市...)
 *
 * Users can select at any level. Filtering cascades down:
 * - Select "九龍" → includes all 九龍 districts
 * - Select "油尖旺區" → only that district
 */

export interface District {
  value: string;
  labelZh: string;
  labelEn: string;
}

export interface SubRegion {
  value: string;
  labelZh: string;
  labelEn: string;
  districts: District[];
}

export interface Region {
  value: string;
  labelZh: string;
  labelEn: string;
  flag: string;
  currency: string;
  subRegions: SubRegion[];
}

export const REGIONS: Region[] = [
  {
    value: 'hongkong', labelZh: '香港', labelEn: 'Hong Kong', flag: '🇭🇰', currency: 'HK$',
    subRegions: [
      {
        value: 'hk_island', labelZh: '港島', labelEn: 'Hong Kong Island',
        districts: [
          { value: 'central_western', labelZh: '中西區', labelEn: 'Central & Western' },
          { value: 'wan_chai', labelZh: '灣仔區', labelEn: 'Wan Chai' },
          { value: 'eastern', labelZh: '東區', labelEn: 'Eastern' },
          { value: 'southern', labelZh: '南區', labelEn: 'Southern' },
        ],
      },
      {
        value: 'kowloon', labelZh: '九龍', labelEn: 'Kowloon',
        districts: [
          { value: 'yau_tsim_mong', labelZh: '油尖旺區', labelEn: 'Yau Tsim Mong' },
          { value: 'sham_shui_po', labelZh: '深水埗區', labelEn: 'Sham Shui Po' },
          { value: 'kowloon_city', labelZh: '九龍城區', labelEn: 'Kowloon City' },
          { value: 'wong_tai_sin', labelZh: '黃大仙區', labelEn: 'Wong Tai Sin' },
          { value: 'kwun_tong', labelZh: '觀塘區', labelEn: 'Kwun Tong' },
        ],
      },
      {
        value: 'new_territories', labelZh: '新界', labelEn: 'New Territories',
        districts: [
          { value: 'tsuen_wan', labelZh: '荃灣區', labelEn: 'Tsuen Wan' },
          { value: 'tuen_mun', labelZh: '屯門區', labelEn: 'Tuen Mun' },
          { value: 'yuen_long', labelZh: '元朗區', labelEn: 'Yuen Long' },
          { value: 'north', labelZh: '北區', labelEn: 'North' },
          { value: 'tai_po', labelZh: '大埔區', labelEn: 'Tai Po' },
          { value: 'sha_tin', labelZh: '沙田區', labelEn: 'Sha Tin' },
          { value: 'sai_kung', labelZh: '西貢區', labelEn: 'Sai Kung' },
          { value: 'kwai_tsing', labelZh: '葵青區', labelEn: 'Kwai Tsing' },
          { value: 'islands', labelZh: '離島區', labelEn: 'Islands' },
        ],
      },
    ],
  },
  {
    value: 'taiwan', labelZh: '台灣', labelEn: 'Taiwan', flag: '🇹🇼', currency: 'NT$',
    subRegions: [
      {
        value: 'tw_north', labelZh: '北部', labelEn: 'Northern Taiwan',
        districts: [
          { value: 'taipei_city', labelZh: '台北市', labelEn: 'Taipei City' },
          { value: 'new_taipei', labelZh: '新北市', labelEn: 'New Taipei City' },
          { value: 'keelung', labelZh: '基隆市', labelEn: 'Keelung' },
          { value: 'taoyuan', labelZh: '桃園市', labelEn: 'Taoyuan' },
          { value: 'hsinchu', labelZh: '新竹市', labelEn: 'Hsinchu' },
        ],
      },
      {
        value: 'tw_central', labelZh: '中部', labelEn: 'Central Taiwan',
        districts: [
          { value: 'taichung', labelZh: '台中市', labelEn: 'Taichung' },
          { value: 'changhua', labelZh: '彰化縣', labelEn: 'Changhua' },
          { value: 'nantou', labelZh: '南投縣', labelEn: 'Nantou' },
          { value: 'yunlin', labelZh: '雲林縣', labelEn: 'Yunlin' },
          { value: 'miaoli', labelZh: '苗栗縣', labelEn: 'Miaoli' },
        ],
      },
      {
        value: 'tw_south', labelZh: '南部', labelEn: 'Southern Taiwan',
        districts: [
          { value: 'tainan', labelZh: '台南市', labelEn: 'Tainan' },
          { value: 'kaohsiung', labelZh: '高雄市', labelEn: 'Kaohsiung' },
          { value: 'chiayi', labelZh: '嘉義市', labelEn: 'Chiayi' },
          { value: 'pingtung', labelZh: '屏東縣', labelEn: 'Pingtung' },
        ],
      },
      {
        value: 'tw_east', labelZh: '東部', labelEn: 'Eastern Taiwan',
        districts: [
          { value: 'yilan', labelZh: '宜蘭縣', labelEn: 'Yilan' },
          { value: 'hualien', labelZh: '花蓮縣', labelEn: 'Hualien' },
          { value: 'taitung', labelZh: '台東縣', labelEn: 'Taitung' },
        ],
      },
    ],
  },
];

// ── Utility Functions ──

/** Get all district values under a region */
export function getDistrictsForRegion(regionValue: string): string[] {
  const region = REGIONS.find(r => r.value === regionValue);
  if (!region) return [];
  return region.subRegions.flatMap(sr => sr.districts.map(d => d.value));
}

/** Get all district values under a sub-region */
export function getDistrictsForSubRegion(subRegionValue: string): string[] {
  for (const region of REGIONS) {
    const sr = region.subRegions.find(s => s.value === subRegionValue);
    if (sr) return sr.districts.map(d => d.value);
  }
  return [];
}

/** Given any location value (region, subRegion, or district), return all matching district values */
export function resolveLocationToDistricts(locationValue: string): string[] {
  // Check if it's a region
  const asRegion = getDistrictsForRegion(locationValue);
  if (asRegion.length > 0) return asRegion;
  // Check if it's a sub-region
  const asSubRegion = getDistrictsForSubRegion(locationValue);
  if (asSubRegion.length > 0) return asSubRegion;
  // Must be a district itself
  return [locationValue];
}

/** Get the display label for any location value */
export function getLocationLabel(value: string): string {
  for (const region of REGIONS) {
    if (region.value === value) return region.labelZh;
    for (const sr of region.subRegions) {
      if (sr.value === value) return sr.labelZh;
      for (const d of sr.districts) {
        if (d.value === value) return d.labelZh;
      }
    }
  }
  return value;
}

/** Get the currency for a location value */
export function getCurrencyForLocation(value: string): string {
  for (const region of REGIONS) {
    if (region.value === value) return region.currency;
    for (const sr of region.subRegions) {
      if (sr.value === value) return region.currency;
      for (const d of sr.districts) {
        if (d.value === value) return region.currency;
      }
    }
  }
  return 'HK$';
}

/** Get region flag for a location value */
export function getFlagForLocation(value: string): string {
  for (const region of REGIONS) {
    if (region.value === value) return region.flag;
    for (const sr of region.subRegions) {
      if (sr.value === value) return region.flag;
      for (const d of sr.districts) {
        if (d.value === value) return region.flag;
      }
    }
  }
  return '';
}

// ── Backward Compatibility ──
// Old code uses CITIES + getCityInfo. Map to new structure.

export interface CityInfo {
  value: string;
  labelZh: string;
  labelEn: string;
  currency: string;
  flag: string;
}

/** Flat list of all regions + subregions + districts for backward compat */
export const CITIES: CityInfo[] = REGIONS.flatMap(r => [
  { value: r.value, labelZh: r.labelZh, labelEn: r.labelEn, currency: r.currency, flag: r.flag },
  ...r.subRegions.flatMap(sr => [
    { value: sr.value, labelZh: `${r.labelZh} · ${sr.labelZh}`, labelEn: `${sr.labelEn}`, currency: r.currency, flag: r.flag },
    ...sr.districts.map(d => ({
      value: d.value, labelZh: `${sr.labelZh} · ${d.labelZh}`, labelEn: d.labelEn, currency: r.currency, flag: r.flag,
    })),
  ]),
]);

export const getCityInfo = (value: string): CityInfo | undefined =>
  CITIES.find(c => c.value === value);
