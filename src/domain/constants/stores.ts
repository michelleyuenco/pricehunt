import { type Store } from '../entities/Store';

export const STATIC_STORES: Store[] = [
  // Hong Kong
  { id: 's14', nameZh: '百佳', nameEn: 'PARKnSHOP', city: 'hongkong', requestCount: 0, responseCount: 0, mostRequestedTags: ['進口食品', '日用品'] },
  { id: 's15', nameZh: '惠康', nameEn: 'Wellcome', city: 'hongkong', requestCount: 0, responseCount: 0, mostRequestedTags: ['生鮮', '飲料'] },
  { id: 's16', nameZh: '萬寧', nameEn: 'Mannings', city: 'hongkong', requestCount: 0, responseCount: 0, mostRequestedTags: ['美妝', '藥品'] },
  { id: 's17', nameZh: '屈臣氏', nameEn: 'Watsons', city: 'hongkong', requestCount: 0, responseCount: 0, mostRequestedTags: ['美妝', '保養品'] },
  { id: 's18', nameZh: '759阿信屋', nameEn: '759 Store', city: 'hongkong', requestCount: 0, responseCount: 0, mostRequestedTags: ['日本食品', '進口零食'] },
  { id: 's19', nameZh: '日本城', nameEn: 'Japan Home', city: 'hongkong', requestCount: 0, responseCount: 0, mostRequestedTags: ['日式日用品', '廚具'] },
  { id: 's25', nameZh: 'AEON', nameEn: 'AEON', city: 'hongkong', requestCount: 0, responseCount: 0, mostRequestedTags: ['日用品', '食品'] },
  { id: 's26', nameZh: '城市超市', nameEn: 'CitySuper', city: 'hongkong', requestCount: 0, responseCount: 0, mostRequestedTags: ['進口食品', '有機食品'] },
  // Taipei
  { id: 's1', nameZh: '全聯', nameEn: 'PX Mart', city: 'taipei', requestCount: 0, responseCount: 0, mostRequestedTags: ['牛奶', '衛生紙', '洗衣精'] },
  { id: 's2', nameZh: '家樂福', nameEn: 'Carrefour', city: 'taipei', requestCount: 0, responseCount: 0, mostRequestedTags: ['進口食品', '零食', '清潔用品'] },
  { id: 's3', nameZh: '7-Eleven', nameEn: '7-Eleven', city: 'taipei', requestCount: 0, responseCount: 0, mostRequestedTags: ['飲料', '泡麵', '點心'] },
  { id: 's4', nameZh: '全家', nameEn: 'FamilyMart', city: 'taipei', requestCount: 0, responseCount: 0, mostRequestedTags: ['飲料', '便當', '甜點'] },
  { id: 's5', nameZh: '大潤發', nameEn: 'RT-Mart', city: 'taipei', requestCount: 0, responseCount: 0, mostRequestedTags: ['日用品', '食品', '電器'] },
  { id: 's6', nameZh: '好市多', nameEn: 'Costco', city: 'taipei', requestCount: 0, responseCount: 0, mostRequestedTags: ['進口商品', '大包裝', '零食'] },
  { id: 's7', nameZh: '屈臣氏', nameEn: 'Watsons', city: 'taipei', requestCount: 0, responseCount: 0, mostRequestedTags: ['美妝', '保養品', '藥品'] },
  // Tokyo
  { id: 's20', nameZh: 'ドンキ', nameEn: 'Don Quijote', city: 'tokyo', requestCount: 0, responseCount: 0, mostRequestedTags: ['零食', '美妝', '電器'] },
  { id: 's21', nameZh: 'ローソン', nameEn: 'Lawson', city: 'tokyo', requestCount: 0, responseCount: 0, mostRequestedTags: ['便當', '飲料', '點心'] },
  { id: 's22', nameZh: 'セブン', nameEn: '7-Eleven', city: 'tokyo', requestCount: 0, responseCount: 0, mostRequestedTags: ['飲料', '泡麵'] },
  { id: 's23', nameZh: 'マツキヨ', nameEn: 'Matsumoto Kiyoshi', city: 'tokyo', requestCount: 0, responseCount: 0, mostRequestedTags: ['藥品', '美妝', '保健品'] },
  // Singapore
  { id: 's27', nameZh: 'FairPrice', nameEn: 'NTUC FairPrice', city: 'singapore', requestCount: 0, responseCount: 0, mostRequestedTags: ['日用品', '食品'] },
  { id: 's28', nameZh: 'Cold Storage', nameEn: 'Cold Storage', city: 'singapore', requestCount: 0, responseCount: 0, mostRequestedTags: ['進口食品', '生鮮'] },
];

export const STORE_NAMES = STATIC_STORES.map(s => s.nameZh);
