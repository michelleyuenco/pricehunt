import { type Category } from '../entities/Request';

export interface CategoryInfo {
  value: Category;
  labelZh: string;
  labelEn: string;
  emoji: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { value: 'food', labelZh: '食品', labelEn: 'Food', emoji: '🍱' },
  { value: 'drinks', labelZh: '飲料', labelEn: 'Drinks', emoji: '🥤' },
  { value: 'essentials', labelZh: '日用品', labelEn: 'Daily Essentials', emoji: '🧴' },
  { value: 'beauty', labelZh: '美妝', labelEn: 'Beauty', emoji: '💄' },
  { value: 'snacks', labelZh: '零食', labelEn: 'Snacks', emoji: '🍪' },
  { value: 'medicine', labelZh: '藥品', labelEn: 'Medicine', emoji: '💊' },
  { value: 'other', labelZh: '其他', labelEn: 'Other', emoji: '📦' },
];

export const getCategoryInfo = (value: Category): CategoryInfo =>
  CATEGORIES.find(c => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1];
