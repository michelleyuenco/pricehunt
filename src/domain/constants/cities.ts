export interface CityInfo {
  value: string;
  labelZh: string;
  labelEn: string;
  currency: string;
  flag: string;
}

export const CITIES: CityInfo[] = [
  { value: 'taipei', labelZh: '台北', labelEn: 'Taipei', currency: 'NT$', flag: '🇹🇼' },
  { value: 'taichung', labelZh: '台中', labelEn: 'Taichung', currency: 'NT$', flag: '🇹🇼' },
  { value: 'kaohsiung', labelZh: '高雄', labelEn: 'Kaohsiung', currency: 'NT$', flag: '🇹🇼' },
  { value: 'tainan', labelZh: '台南', labelEn: 'Tainan', currency: 'NT$', flag: '🇹🇼' },
  { value: 'hongkong', labelZh: '香港', labelEn: 'Hong Kong', currency: 'HK$', flag: '🇭🇰' },
  { value: 'singapore', labelZh: '新加坡', labelEn: 'Singapore', currency: 'S$', flag: '🇸🇬' },
  { value: 'tokyo', labelZh: '東京', labelEn: 'Tokyo', currency: '¥', flag: '🇯🇵' },
];

export const getCityInfo = (value: string): CityInfo | undefined =>
  CITIES.find(c => c.value === value);
