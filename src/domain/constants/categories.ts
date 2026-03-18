import { type MainCategory } from '../entities/Request';

/** @deprecated kept for backward compatibility */
export type Category = MainCategory;

export interface SubCategoryInfo {
  value: string;
  labelZh: string;
  labelEn: string;
}

export interface CategoryInfo {
  value: MainCategory;
  labelZh: string;
  labelEn: string;
  emoji: string;
  subCategories: SubCategoryInfo[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    value: 'food', labelZh: '食品', labelEn: 'Food', emoji: '🍱',
    subCategories: [
      { value: 'eggs', labelZh: '雞蛋', labelEn: 'Eggs' },
      { value: 'rice', labelZh: '米', labelEn: 'Rice' },
      { value: 'noodles', labelZh: '麵條/即食麵', labelEn: 'Noodles / Instant Noodles' },
      { value: 'bread', labelZh: '麵包', labelEn: 'Bread' },
      { value: 'meat', labelZh: '肉類', labelEn: 'Meat' },
      { value: 'seafood', labelZh: '海鮮', labelEn: 'Seafood' },
      { value: 'frozen', labelZh: '冷凍食品', labelEn: 'Frozen Food' },
      { value: 'canned', labelZh: '罐頭', labelEn: 'Canned Food' },
      { value: 'condiments', labelZh: '調味料/醬料', labelEn: 'Condiments / Sauces' },
      { value: 'tofu', labelZh: '豆腐/豆製品', labelEn: 'Tofu / Soy Products' },
      { value: 'dairy', labelZh: '乳製品', labelEn: 'Dairy' },
      { value: 'oil', labelZh: '食用油', labelEn: 'Cooking Oil' },
      { value: 'food_other', labelZh: '其他食品', labelEn: 'Other Food' },
    ],
  },
  {
    value: 'drinks', labelZh: '飲料', labelEn: 'Drinks', emoji: '🥤',
    subCategories: [
      { value: 'milk', labelZh: '鮮奶/牛奶', labelEn: 'Fresh Milk' },
      { value: 'soymilk', labelZh: '豆漿/豆奶', labelEn: 'Soy Milk' },
      { value: 'tea', labelZh: '茶飲', labelEn: 'Tea' },
      { value: 'coffee', labelZh: '咖啡', labelEn: 'Coffee' },
      { value: 'juice', labelZh: '果汁', labelEn: 'Juice' },
      { value: 'water', labelZh: '礦泉水', labelEn: 'Water' },
      { value: 'sports', labelZh: '運動飲料', labelEn: 'Sports Drinks' },
      { value: 'soda', labelZh: '汽水/碳酸飲料', labelEn: 'Soda' },
      { value: 'alcohol', labelZh: '酒類', labelEn: 'Alcohol' },
      { value: 'drinks_other', labelZh: '其他飲料', labelEn: 'Other Drinks' },
    ],
  },
  {
    value: 'essentials', labelZh: '日用品', labelEn: 'Daily Essentials', emoji: '🧴',
    subCategories: [
      { value: 'tissue', labelZh: '紙巾/衛生紙', labelEn: 'Tissue / Toilet Paper' },
      { value: 'laundry', labelZh: '洗衣液/洗衣粉', labelEn: 'Laundry Detergent' },
      { value: 'dish', labelZh: '洗碗精', labelEn: 'Dish Soap' },
      { value: 'cleaner', labelZh: '清潔用品', labelEn: 'Cleaning Products' },
      { value: 'wrap', labelZh: '保鮮膜/鋁箔紙', labelEn: 'Plastic Wrap / Foil' },
      { value: 'trash_bags', labelZh: '垃圾袋', labelEn: 'Trash Bags' },
      { value: 'batteries', labelZh: '電池', labelEn: 'Batteries' },
      { value: 'essentials_other', labelZh: '其他日用品', labelEn: 'Other Essentials' },
    ],
  },
  {
    value: 'beauty', labelZh: '美妝', labelEn: 'Beauty', emoji: '💄',
    subCategories: [
      { value: 'skincare', labelZh: '護膚品', labelEn: 'Skincare' },
      { value: 'makeup', labelZh: '化妝品', labelEn: 'Makeup' },
      { value: 'lipcare', labelZh: '唇膏/護唇', labelEn: 'Lip Care' },
      { value: 'shampoo', labelZh: '洗髮精/護髮', labelEn: 'Shampoo / Hair Care' },
      { value: 'bodycare', labelZh: '沐浴/身體護理', labelEn: 'Body Care' },
      { value: 'sunscreen', labelZh: '防曬', labelEn: 'Sunscreen' },
      { value: 'mask', labelZh: '面膜', labelEn: 'Face Mask' },
      { value: 'eyecare', labelZh: '眼部護理', labelEn: 'Eye Care' },
      { value: 'beauty_other', labelZh: '其他美妝', labelEn: 'Other Beauty' },
    ],
  },
  {
    value: 'snacks', labelZh: '零食', labelEn: 'Snacks', emoji: '🍪',
    subCategories: [
      { value: 'chips', labelZh: '薯片/洋芋片', labelEn: 'Chips / Crisps' },
      { value: 'chocolate', labelZh: '朱古力/巧克力', labelEn: 'Chocolate' },
      { value: 'candy', labelZh: '糖果', labelEn: 'Candy' },
      { value: 'cookies', labelZh: '餅乾', labelEn: 'Cookies / Biscuits' },
      { value: 'nuts', labelZh: '堅果', labelEn: 'Nuts' },
      { value: 'dried', labelZh: '果乾/肉乾', labelEn: 'Dried Snacks' },
      { value: 'icecream', labelZh: '雪糕/冰淇淋', labelEn: 'Ice Cream' },
      { value: 'snacks_other', labelZh: '其他零食', labelEn: 'Other Snacks' },
    ],
  },
  {
    value: 'medicine', labelZh: '藥品', labelEn: 'Medicine', emoji: '💊',
    subCategories: [
      { value: 'cold', labelZh: '感冒藥', labelEn: 'Cold Medicine' },
      { value: 'pain', labelZh: '止痛藥', labelEn: 'Pain Relief' },
      { value: 'stomach', labelZh: '腸胃藥', labelEn: 'Stomach Medicine' },
      { value: 'vitamins', labelZh: '維他命/保健品', labelEn: 'Vitamins / Supplements' },
      { value: 'firstaid', labelZh: '急救用品', labelEn: 'First Aid' },
      { value: 'medicine_other', labelZh: '其他藥品', labelEn: 'Other Medicine' },
    ],
  },
  {
    value: 'other', labelZh: '其他', labelEn: 'Other', emoji: '📦',
    subCategories: [],
  },
];

export const getCategoryInfo = (value: string): CategoryInfo =>
  CATEGORIES.find(c => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1];

export const getSubCategoryLabel = (mainCat: string, subCat: string): string => {
  const cat = CATEGORIES.find(c => c.value === mainCat);
  if (!cat) return subCat;
  const sub = cat.subCategories.find(s => s.value === subCat);
  return sub ? sub.labelZh : subCat;
};
