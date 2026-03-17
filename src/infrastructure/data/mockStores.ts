import { type Store } from '../../domain/entities/Store';

export const MOCK_STORES: Store[] = [
  // Taipei
  { id: 's1', nameZh: '全聯', nameEn: 'PX Mart', city: 'taipei', requestCount: 342, responseCount: 289, mostRequestedTags: ['牛奶', '衛生紙', '洗衣精'] },
  { id: 's2', nameZh: '家樂福', nameEn: 'Carrefour', city: 'taipei', requestCount: 215, responseCount: 187, mostRequestedTags: ['進口食品', '零食', '清潔用品'] },
  { id: 's3', nameZh: '7-Eleven', nameEn: '7-Eleven', city: 'taipei', requestCount: 178, responseCount: 165, mostRequestedTags: ['飲料', '泡麵', '點心'] },
  { id: 's4', nameZh: '全家', nameEn: 'FamilyMart', city: 'taipei', requestCount: 156, responseCount: 142, mostRequestedTags: ['飲料', '便當', '甜點'] },
  { id: 's5', nameZh: '大潤發', nameEn: 'RT-Mart', city: 'taipei', requestCount: 198, responseCount: 165, mostRequestedTags: ['日用品', '食品', '電器'] },
  { id: 's6', nameZh: '好市多', nameEn: 'Costco', city: 'taipei', requestCount: 267, responseCount: 234, mostRequestedTags: ['進口商品', '大包裝', '零食'] },
  { id: 's7', nameZh: '頂好', nameEn: 'Wellcome', city: 'taipei', requestCount: 89, responseCount: 76, mostRequestedTags: ['生鮮', '日用品'] },
  { id: 's8', nameZh: '屈臣氏', nameEn: "Watsons", city: 'taipei', requestCount: 145, responseCount: 128, mostRequestedTags: ['美妝', '保養品', '藥品'] },
  { id: 's9', nameZh: '康是美', nameEn: 'Cosmed', city: 'taipei', requestCount: 132, responseCount: 118, mostRequestedTags: ['美妝', '藥品', '保健品'] },
  // Taichung
  { id: 's10', nameZh: '全聯', nameEn: 'PX Mart', city: 'taichung', requestCount: 201, responseCount: 178, mostRequestedTags: ['牛奶', '衛生紙'] },
  { id: 's11', nameZh: '家樂福', nameEn: 'Carrefour', city: 'taichung', requestCount: 143, responseCount: 122, mostRequestedTags: ['進口食品', '清潔用品'] },
  // Kaohsiung
  { id: 's12', nameZh: '全聯', nameEn: 'PX Mart', city: 'kaohsiung', requestCount: 189, responseCount: 163, mostRequestedTags: ['日用品', '食品'] },
  { id: 's13', nameZh: '好市多', nameEn: 'Costco', city: 'kaohsiung', requestCount: 221, responseCount: 198, mostRequestedTags: ['大包裝', '進口商品'] },
  // Hong Kong
  { id: 's14', nameZh: '百佳', nameEn: 'PARKnSHOP', city: 'hongkong', requestCount: 198, responseCount: 176, mostRequestedTags: ['進口食品', '日用品'] },
  { id: 's15', nameZh: '惠康', nameEn: 'Wellcome', city: 'hongkong', requestCount: 167, responseCount: 145, mostRequestedTags: ['生鮮', '飲料'] },
  { id: 's16', nameZh: '萬寧', nameEn: 'Mannings', city: 'hongkong', requestCount: 134, responseCount: 119, mostRequestedTags: ['美妝', '藥品'] },
  { id: 's17', nameZh: '屈臣氏', nameEn: "Watsons", city: 'hongkong', requestCount: 121, responseCount: 108, mostRequestedTags: ['美妝', '保養品'] },
  { id: 's18', nameZh: '759阿信屋', nameEn: '759 Store', city: 'hongkong', requestCount: 89, responseCount: 78, mostRequestedTags: ['日本食品', '進口零食'] },
  { id: 's19', nameZh: '日本城', nameEn: 'Japan Home', city: 'hongkong', requestCount: 67, responseCount: 58, mostRequestedTags: ['日式日用品', '廚具'] },
  // Tokyo
  { id: 's20', nameZh: 'ドンキ', nameEn: 'Don Quijote', city: 'tokyo', requestCount: 234, responseCount: 210, mostRequestedTags: ['零食', '美妝', '電器'] },
  { id: 's21', nameZh: 'ローソン', nameEn: 'Lawson', city: 'tokyo', requestCount: 145, responseCount: 132, mostRequestedTags: ['便當', '飲料', '點心'] },
  { id: 's22', nameZh: 'セブン', nameEn: '7-Eleven', city: 'tokyo', requestCount: 178, responseCount: 165, mostRequestedTags: ['飲料', '泡麵'] },
  { id: 's23', nameZh: 'マツキヨ', nameEn: 'Matsumoto Kiyoshi', city: 'tokyo', requestCount: 198, responseCount: 176, mostRequestedTags: ['藥品', '美妝', '保健品'] },
  // Singapore
  { id: 's24', nameZh: 'FairPrice', nameEn: 'FairPrice', city: 'singapore', requestCount: 167, responseCount: 145, mostRequestedTags: ['日用品', '生鮮'] },
  { id: 's25', nameZh: 'Cold Storage', nameEn: 'Cold Storage', city: 'singapore', requestCount: 123, responseCount: 109, mostRequestedTags: ['進口食品', '生鮮'] },
  { id: 's26', nameZh: 'Mustafa Centre', nameEn: 'Mustafa Centre', city: 'singapore', requestCount: 89, responseCount: 78, mostRequestedTags: ['日用品', '零食'] },
  { id: 's27', nameZh: 'Don Don Donki', nameEn: 'Don Don Donki', city: 'singapore', requestCount: 112, responseCount: 98, mostRequestedTags: ['日本食品', '零食', '美妝'] },
];
