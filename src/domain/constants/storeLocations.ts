export interface StoreLocation {
  id: string;
  brand: string;          // matches Consumer Council data
  brandZh: string;
  brandEn: string;
  name: string;           // branch name
  address: string;        // full Chinese address
  addressEn?: string;     // optional English address
  district: string;       // district code matching location hierarchy
  region: string;         // "hongkong" or "taiwan"
  lat: number;
  lng: number;
  phone?: string;
  hours?: string;
}

export const STORE_LOCATIONS: StoreLocation[] = [
  // ─── 惠康 Wellcome ──────────────────────────────────────────────────────────
  {
    id: 'wellcome-kwun-tong-001',
    brand: 'wellcome', brandZh: '惠康', brandEn: 'Wellcome',
    name: '觀塘 apm 店',
    address: '九龍觀塘道418號apm購物中心地庫1樓',
    addressEn: 'LG1, apm, 418 Kwun Tong Road, Kwun Tong, Kowloon',
    district: 'kwun_tong', region: 'hongkong',
    lat: 22.3127, lng: 114.2256, hours: '07:00-23:00',
  },
  {
    id: 'wellcome-wan-chai-001',
    brand: 'wellcome', brandZh: '惠康', brandEn: 'Wellcome',
    name: '銅鑼灣 SOGO 附近店',
    address: '香港銅鑼灣怡和街28號地下',
    addressEn: 'G/F, 28 Yee Wo Street, Causeway Bay, Hong Kong',
    district: 'wan_chai', region: 'hongkong',
    lat: 22.2808, lng: 114.1836, hours: '07:00-23:00',
  },
  {
    id: 'wellcome-yau-tsim-mong-001',
    brand: 'wellcome', brandZh: '惠康', brandEn: 'Wellcome',
    name: '旺角新世紀廣場店',
    address: '九龍旺角砵蘭街394號新世紀廣場2樓',
    addressEn: '2/F, New Age Plaza, 394 Portland Street, Mong Kok, Kowloon',
    district: 'yau_tsim_mong', region: 'hongkong',
    lat: 22.3207, lng: 114.1696, hours: '07:00-23:00',
  },
  {
    id: 'wellcome-sha-tin-001',
    brand: 'wellcome', brandZh: '惠康', brandEn: 'Wellcome',
    name: '沙田新城市廣場店',
    address: '新界沙田正街5號新城市廣場1期地庫',
    addressEn: 'Basement, Phase 1, New Town Plaza, 5 Shatin Centre Street, Sha Tin, NT',
    district: 'sha_tin', region: 'hongkong',
    lat: 22.3832, lng: 114.1880, hours: '07:00-23:00',
  },
  {
    id: 'wellcome-tsuen-wan-001',
    brand: 'wellcome', brandZh: '惠康', brandEn: 'Wellcome',
    name: '荃灣荃新天地店',
    address: '新界荃灣青山公路荃灣段199號荃新天地2樓',
    addressEn: '2/F, Maritime Square, 199 Castle Peak Road, Tsuen Wan, NT',
    district: 'tsuen_wan', region: 'hongkong',
    lat: 22.3700, lng: 114.1115, hours: '07:00-23:00',
  },
  {
    id: 'wellcome-sai-kung-001',
    brand: 'wellcome', brandZh: '惠康', brandEn: 'Wellcome',
    name: '將軍澳 PopCorn 店',
    address: '新界將軍澳唐德街9號PopCorn商場地庫1樓',
    addressEn: 'LG1, PopCorn, 9 Tong Tak Street, Tseung Kwan O, NT',
    district: 'sai_kung', region: 'hongkong',
    lat: 22.3065, lng: 114.2598, hours: '07:00-23:00',
  },
  {
    id: 'wellcome-eastern-001',
    brand: 'wellcome', brandZh: '惠康', brandEn: 'Wellcome',
    name: '北角和富中心店',
    address: '香港北角和富道18號和富中心地下',
    addressEn: 'G/F, Provident Centre, 18 Wharf Road, North Point, Hong Kong',
    district: 'eastern', region: 'hongkong',
    lat: 22.2920, lng: 114.2010, hours: '07:00-23:00',
  },
  {
    id: 'wellcome-yuen-long-001',
    brand: 'wellcome', brandZh: '惠康', brandEn: 'Wellcome',
    name: '元朗 YOHO MALL 店',
    address: '新界元朗朗日路9號YOHO MALL地庫1樓',
    addressEn: 'LG1, YOHO MALL, 9 Long Yat Road, Yuen Long, NT',
    district: 'yuen_long', region: 'hongkong',
    lat: 22.4452, lng: 114.0340, hours: '07:00-23:00',
  },

  // ─── 百佳 PARKnSHOP ──────────────────────────────────────────────────────────
  {
    id: 'parknshop-kwun-tong-001',
    brand: 'parknshop', brandZh: '百佳', brandEn: 'PARKnSHOP',
    name: '觀塘裕民坊店',
    address: '九龍觀塘裕民坊1號裕民坊廣場地庫',
    addressEn: 'Basement, Yumin Square, 1 Yue Man Square, Kwun Tong, Kowloon',
    district: 'kwun_tong', region: 'hongkong',
    lat: 22.3112, lng: 114.2232, hours: '07:30-22:30',
  },
  {
    id: 'parknshop-wan-chai-001',
    brand: 'parknshop', brandZh: '百佳', brandEn: 'PARKnSHOP',
    name: '灣仔太原街店',
    address: '香港灣仔太原街40號地下',
    addressEn: 'G/F, 40 Tai Yuen Street, Wan Chai, Hong Kong',
    district: 'wan_chai', region: 'hongkong',
    lat: 22.2775, lng: 114.1738, hours: '07:00-23:00',
  },
  {
    id: 'parknshop-yau-tsim-mong-001',
    brand: 'parknshop', brandZh: '百佳', brandEn: 'PARKnSHOP',
    name: '旺角朗豪坊店',
    address: '九龍旺角亞皆老街8號朗豪坊地庫',
    addressEn: 'Basement, Langham Place, 8 Argyle Street, Mong Kok, Kowloon',
    district: 'yau_tsim_mong', region: 'hongkong',
    lat: 22.3186, lng: 114.1683, hours: '08:00-23:00',
  },
  {
    id: 'parknshop-sha-tin-001',
    brand: 'parknshop', brandZh: '百佳', brandEn: 'PARKnSHOP',
    name: '沙田連城廣場店',
    address: '新界沙田大涌橋路21號連城廣場地庫1樓',
    addressEn: 'LG1, Citylink Plaza, 21 Tai Chung Kiu Road, Sha Tin, NT',
    district: 'sha_tin', region: 'hongkong',
    lat: 22.3775, lng: 114.1872, hours: '07:30-22:30',
  },
  {
    id: 'parknshop-tsuen-wan-001',
    brand: 'parknshop', brandZh: '百佳', brandEn: 'PARKnSHOP',
    name: '荃灣路德圍店',
    address: '新界荃灣路德圍33號地下',
    addressEn: 'G/F, 33 Luk Yeung Street, Tsuen Wan, NT',
    district: 'tsuen_wan', region: 'hongkong',
    lat: 22.3720, lng: 114.1185, hours: '07:00-23:00',
  },
  {
    id: 'parknshop-tai-po-001',
    brand: 'parknshop', brandZh: '百佳', brandEn: 'PARKnSHOP',
    name: '大埔廣場店',
    address: '新界大埔廣場地庫',
    addressEn: 'Basement, Tai Po Mega Mall, Tai Po, NT',
    district: 'tai_po', region: 'hongkong',
    lat: 22.4503, lng: 114.1689, hours: '07:30-22:30',
  },
  {
    id: 'parknshop-tuen-mun-001',
    brand: 'parknshop', brandZh: '百佳', brandEn: 'PARKnSHOP',
    name: '屯門 V City 店',
    address: '新界屯門屯利街1號V City購物中心1樓',
    addressEn: '1/F, V City, 1 Tuen Lee Street, Tuen Mun, NT',
    district: 'tuen_mun', region: 'hongkong',
    lat: 22.3955, lng: 113.9735, hours: '08:00-22:30',
  },
  {
    id: 'parknshop-sai-kung-001',
    brand: 'parknshop', brandZh: '百佳', brandEn: 'PARKnSHOP',
    name: '將軍澳東港城店',
    address: '新界將軍澳廣明苑廣場地下',
    addressEn: 'G/F, Metro City Plaza, Tseung Kwan O, NT',
    district: 'sai_kung', region: 'hongkong',
    lat: 22.3152, lng: 114.2538, hours: '07:30-23:00',
  },

  // ─── Market Place by Jasons ──────────────────────────────────────────────────
  {
    id: 'marketplace-central-001',
    brand: 'marketplace', brandZh: 'Market Place', brandEn: 'Market Place by Jasons',
    name: '金鐘太古廣場店',
    address: '香港金鐘金鐘道88號太古廣場地庫1樓',
    addressEn: 'LG1, Pacific Place, 88 Queensway, Admiralty, Hong Kong',
    district: 'central_western', region: 'hongkong',
    lat: 22.2773, lng: 114.1656, hours: '08:00-22:00',
  },
  {
    id: 'marketplace-central-002',
    brand: 'marketplace', brandZh: 'Market Place', brandEn: 'Market Place by Jasons',
    name: '中環 IFC 店',
    address: '香港中環港景街1號國際金融中心商場地庫1樓',
    addressEn: 'LG1, IFC Mall, 1 Harbour View Street, Central, Hong Kong',
    district: 'central_western', region: 'hongkong',
    lat: 22.2858, lng: 114.1578, hours: '08:30-21:30',
  },
  {
    id: 'marketplace-wan-chai-001',
    brand: 'marketplace', brandZh: 'Market Place', brandEn: 'Market Place by Jasons',
    name: '銅鑼灣時代廣場店',
    address: '香港銅鑼灣勿地臣街1號時代廣場地庫1樓',
    addressEn: 'LG1, Times Square, 1 Matheson Street, Causeway Bay, Hong Kong',
    district: 'wan_chai', region: 'hongkong',
    lat: 22.2790, lng: 114.1826, hours: '08:00-22:00',
  },
  {
    id: 'marketplace-yau-tsim-mong-001',
    brand: 'marketplace', brandZh: 'Market Place', brandEn: 'Market Place by Jasons',
    name: '尖沙咀海港城店',
    address: '九龍尖沙咀廣東道3-27號海港城海洋中心地庫',
    addressEn: 'Basement, Ocean Centre, Harbour City, 3-27 Canton Road, Tsim Sha Tsui, Kowloon',
    district: 'yau_tsim_mong', region: 'hongkong',
    lat: 22.2996, lng: 114.1680, hours: '08:00-22:00',
  },
  {
    id: 'marketplace-kowloon-city-001',
    brand: 'marketplace', brandZh: 'Market Place', brandEn: 'Market Place by Jasons',
    name: '九龍塘又一城店',
    address: '九龍九龍塘達之路80號又一城地庫2樓',
    addressEn: 'LG2, Festival Walk, 80 Tat Chee Avenue, Kowloon Tong, Kowloon',
    district: 'kowloon_city', region: 'hongkong',
    lat: 22.3372, lng: 114.1758, hours: '08:00-22:00',
  },

  // ─── 屈臣氏 Watsons (HK) ─────────────────────────────────────────────────────
  {
    id: 'watsons-wan-chai-001',
    brand: 'watsons', brandZh: '屈臣氏', brandEn: 'Watsons',
    name: '銅鑼灣 SOGO 店',
    address: '香港銅鑼灣軒尼詩道555號崇光百貨地庫1樓',
    addressEn: 'LG1, SOGO, 555 Hennessy Road, Causeway Bay, Hong Kong',
    district: 'wan_chai', region: 'hongkong',
    lat: 22.2803, lng: 114.1843, hours: '09:00-22:00',
  },
  {
    id: 'watsons-yau-tsim-mong-001',
    brand: 'watsons', brandZh: '屈臣氏', brandEn: 'Watsons',
    name: '旺角朗豪坊店',
    address: '九龍旺角亞皆老街8號朗豪坊3樓',
    addressEn: '3/F, Langham Place, 8 Argyle Street, Mong Kok, Kowloon',
    district: 'yau_tsim_mong', region: 'hongkong',
    lat: 22.3183, lng: 114.1686, hours: '09:30-22:30',
  },
  {
    id: 'watsons-sha-tin-001',
    brand: 'watsons', brandZh: '屈臣氏', brandEn: 'Watsons',
    name: '沙田新城市店',
    address: '新界沙田正街5號新城市廣場1期3樓',
    addressEn: '3/F, New Town Plaza Phase 1, 5 Shatin Centre Street, Sha Tin, NT',
    district: 'sha_tin', region: 'hongkong',
    lat: 22.3830, lng: 114.1878, hours: '09:30-22:30',
  },
  {
    id: 'watsons-yau-tsim-mong-002',
    brand: 'watsons', brandZh: '屈臣氏', brandEn: 'Watsons',
    name: '尖沙咀海港城店',
    address: '九龍尖沙咀廣東道17號海港城海洋中心2樓',
    addressEn: '2/F, Ocean Centre, Harbour City, 17 Canton Road, Tsim Sha Tsui, Kowloon',
    district: 'yau_tsim_mong', region: 'hongkong',
    lat: 22.2994, lng: 114.1682, hours: '09:30-22:00',
  },
  {
    id: 'watsons-tsuen-wan-001',
    brand: 'watsons', brandZh: '屈臣氏', brandEn: 'Watsons',
    name: '荃灣悅來坊店',
    address: '新界荃灣大壩街悅來坊2樓',
    addressEn: '2/F, Riviera Plaza, Tsuen Wan, NT',
    district: 'tsuen_wan', region: 'hongkong',
    lat: 22.3730, lng: 114.1177, hours: '09:30-22:30',
  },
  {
    id: 'watsons-kwun-tong-001',
    brand: 'watsons', brandZh: '屈臣氏', brandEn: 'Watsons',
    name: '觀塘 apm 店',
    address: '九龍觀塘道418號apm購物中心3樓',
    addressEn: '3/F, apm, 418 Kwun Tong Road, Kwun Tong, Kowloon',
    district: 'kwun_tong', region: 'hongkong',
    lat: 22.3125, lng: 114.2259, hours: '09:30-22:30',
  },

  // ─── 萬寧 Mannings ───────────────────────────────────────────────────────────
  {
    id: 'mannings-wan-chai-001',
    brand: 'mannings', brandZh: '萬寧', brandEn: 'Mannings',
    name: '銅鑼灣世貿中心店',
    address: '香港銅鑼灣港灣道28號世界貿易中心地下',
    addressEn: 'G/F, World Trade Centre, 28 Harbour Road, Wan Chai, Hong Kong',
    district: 'wan_chai', region: 'hongkong',
    lat: 22.2794, lng: 114.1820, hours: '09:00-22:00',
  },
  {
    id: 'mannings-yau-tsim-mong-001',
    brand: 'mannings', brandZh: '萬寧', brandEn: 'Mannings',
    name: '旺角新世紀廣場店',
    address: '九龍旺角砵蘭街394號新世紀廣場地庫',
    addressEn: 'Basement, New Age Plaza, 394 Portland Street, Mong Kok, Kowloon',
    district: 'yau_tsim_mong', region: 'hongkong',
    lat: 22.3208, lng: 114.1698, hours: '09:30-22:30',
  },
  {
    id: 'mannings-sha-tin-001',
    brand: 'mannings', brandZh: '萬寧', brandEn: 'Mannings',
    name: '沙田新城市店',
    address: '新界沙田正街5號新城市廣場1期2樓',
    addressEn: '2/F, New Town Plaza Phase 1, 5 Shatin Centre Street, Sha Tin, NT',
    district: 'sha_tin', region: 'hongkong',
    lat: 22.3831, lng: 114.1882, hours: '09:30-22:30',
  },
  {
    id: 'mannings-yau-tsim-mong-002',
    brand: 'mannings', brandZh: '萬寧', brandEn: 'Mannings',
    name: '尖沙咀 iSQUARE 店',
    address: '九龍尖沙咀彌敦道63號iSQUARE 4樓',
    addressEn: '4/F, iSQUARE, 63 Nathan Road, Tsim Sha Tsui, Kowloon',
    district: 'yau_tsim_mong', region: 'hongkong',
    lat: 22.2985, lng: 114.1719, hours: '09:30-22:30',
  },
  {
    id: 'mannings-kwun-tong-001',
    brand: 'mannings', brandZh: '萬寧', brandEn: 'Mannings',
    name: '觀塘 apm 店',
    address: '九龍觀塘道418號apm購物中心2樓',
    addressEn: '2/F, apm, 418 Kwun Tong Road, Kwun Tong, Kowloon',
    district: 'kwun_tong', region: 'hongkong',
    lat: 22.3126, lng: 114.2257, hours: '09:30-22:30',
  },
  {
    id: 'mannings-tsuen-wan-001',
    brand: 'mannings', brandZh: '萬寧', brandEn: 'Mannings',
    name: '荃灣荃新天地店',
    address: '新界荃灣青山公路荃灣段199號荃新天地1樓',
    addressEn: '1/F, Maritime Square, 199 Castle Peak Road, Tsuen Wan, NT',
    district: 'tsuen_wan', region: 'hongkong',
    lat: 22.3702, lng: 114.1117, hours: '09:30-22:30',
  },

  // ─── AEON ────────────────────────────────────────────────────────────────────
  {
    id: 'aeon-wong-tai-sin-001',
    brand: 'aeon', brandZh: 'AEON', brandEn: 'AEON',
    name: '黃大仙中心店',
    address: '九龍黃大仙龍翔道80號黃大仙中心北館地庫',
    addressEn: 'Basement, North Wing, Wong Tai Sin Centre, 80 Lung Cheung Road, Wong Tai Sin, Kowloon',
    district: 'wong_tai_sin', region: 'hongkong',
    lat: 22.3413, lng: 114.1947, hours: '08:00-22:30',
  },
  {
    id: 'aeon-tuen-mun-001',
    brand: 'aeon', brandZh: 'AEON', brandEn: 'AEON',
    name: '屯門市廣場店',
    address: '新界屯門屯門市廣場地庫',
    addressEn: 'Basement, Tuen Mun Town Plaza, Tuen Mun, NT',
    district: 'tuen_mun', region: 'hongkong',
    lat: 22.3945, lng: 113.9752, hours: '08:00-22:30',
  },
  {
    id: 'aeon-kwai-tsing-001',
    brand: 'aeon', brandZh: 'AEON', brandEn: 'AEON',
    name: '大窩口悅來坊店',
    address: '新界荃灣大窩口邨商場地庫',
    addressEn: 'Basement, Tai Wo Hau Estate Shopping Centre, Kwai Tsing, NT',
    district: 'kwai_tsing', region: 'hongkong',
    lat: 22.3630, lng: 114.1278, hours: '08:30-22:00',
  },
  {
    id: 'aeon-sai-kung-001',
    brand: 'aeon', brandZh: 'AEON', brandEn: 'AEON',
    name: '將軍澳康城店',
    address: '新界將軍澳康城路1號PopCorn 2商場地庫',
    addressEn: 'Basement, PopCorn 2, 1 Kong Cheung Road, Tseung Kwan O, NT',
    district: 'sai_kung', region: 'hongkong',
    lat: 22.2980, lng: 114.2722, hours: '08:00-22:30',
  },
  {
    id: 'aeon-tsuen-wan-001',
    brand: 'aeon', brandZh: 'AEON', brandEn: 'AEON',
    name: '荃灣廣場店',
    address: '新界荃灣眾安街荃灣廣場地庫1樓',
    addressEn: 'LG1, Tsuen Wan Plaza, Chung On Street, Tsuen Wan, NT',
    district: 'tsuen_wan', region: 'hongkong',
    lat: 22.3737, lng: 114.1213, hours: '08:00-22:30',
  },

  // ─── 大昌食品 DCH Food ────────────────────────────────────────────────────────
  {
    id: 'dchfood-eastern-001',
    brand: 'dchfood', brandZh: '大昌食品', brandEn: 'DCH Food',
    name: '北角北角匯店',
    address: '香港北角英皇道633號北角匯1樓',
    addressEn: '1/F, Java Road 633, North Point, Hong Kong',
    district: 'eastern', region: 'hongkong',
    lat: 22.2915, lng: 114.2065, hours: '08:00-22:00',
  },
  {
    id: 'dchfood-kwun-tong-001',
    brand: 'dchfood', brandZh: '大昌食品', brandEn: 'DCH Food',
    name: '觀塘裕民坊店',
    address: '九龍觀塘裕民坊裕民坊廣場地下',
    addressEn: 'G/F, Yue Man Square, Kwun Tong, Kowloon',
    district: 'kwun_tong', region: 'hongkong',
    lat: 22.3110, lng: 114.2230, hours: '08:00-22:00',
  },
  {
    id: 'dchfood-tsuen-wan-001',
    brand: 'dchfood', brandZh: '大昌食品', brandEn: 'DCH Food',
    name: '荃灣西店',
    address: '新界荃灣荃景圍荃灣西站商場地下',
    addressEn: 'G/F, Tsuen Wan West Station Commercial Area, NT',
    district: 'tsuen_wan', region: 'hongkong',
    lat: 22.3677, lng: 114.1076, hours: '08:00-22:00',
  },
  {
    id: 'dchfood-sha-tin-001',
    brand: 'dchfood', brandZh: '大昌食品', brandEn: 'DCH Food',
    name: '沙田石門店',
    address: '新界沙田安睦街1號石門薈地下',
    addressEn: 'G/F, 1 On Muk Street, Shek Mun, Sha Tin, NT',
    district: 'sha_tin', region: 'hongkong',
    lat: 22.3913, lng: 114.2017, hours: '08:00-22:00',
  },

  // ─── 莎莎 SaSa ───────────────────────────────────────────────────────────────
  {
    id: 'sasa-wan-chai-001',
    brand: 'sasa', brandZh: '莎莎', brandEn: 'SaSa',
    name: '銅鑼灣東角道店',
    address: '香港銅鑼灣東角道26-28號地下',
    addressEn: 'G/F, 26-28 East Point Road, Causeway Bay, Hong Kong',
    district: 'wan_chai', region: 'hongkong',
    lat: 22.2797, lng: 114.1855, hours: '10:00-22:30',
  },
  {
    id: 'sasa-yau-tsim-mong-001',
    brand: 'sasa', brandZh: '莎莎', brandEn: 'SaSa',
    name: '旺角西洋菜南街店',
    address: '九龍旺角西洋菜南街43-49號地下',
    addressEn: 'G/F, 43-49 Sai Yeung Choi Street South, Mong Kok, Kowloon',
    district: 'yau_tsim_mong', region: 'hongkong',
    lat: 22.3200, lng: 114.1685, hours: '10:00-22:30',
  },
  {
    id: 'sasa-yau-tsim-mong-002',
    brand: 'sasa', brandZh: '莎莎', brandEn: 'SaSa',
    name: '尖沙咀加連威老道店',
    address: '九龍尖沙咀加連威老道28-30號地下',
    addressEn: 'G/F, 28-30 Cameron Road, Tsim Sha Tsui, Kowloon',
    district: 'yau_tsim_mong', region: 'hongkong',
    lat: 22.2970, lng: 114.1740, hours: '10:00-22:30',
  },
  {
    id: 'sasa-sha-tin-001',
    brand: 'sasa', brandZh: '莎莎', brandEn: 'SaSa',
    name: '沙田新城市店',
    address: '新界沙田正街5號新城市廣場1期1樓',
    addressEn: '1/F, New Town Plaza Phase 1, 5 Shatin Centre Street, Sha Tin, NT',
    district: 'sha_tin', region: 'hongkong',
    lat: 22.3833, lng: 114.1880, hours: '10:00-22:30',
  },

  // ─── 龍豐 Lung Fung ──────────────────────────────────────────────────────────
  {
    id: 'lungfung-yau-tsim-mong-001',
    brand: 'lungfung', brandZh: '龍豐', brandEn: 'Lung Fung',
    name: '旺角花園街店',
    address: '九龍旺角花園街179-181號地下',
    addressEn: 'G/F, 179-181 Fa Yuen Street, Mong Kok, Kowloon',
    district: 'yau_tsim_mong', region: 'hongkong',
    lat: 22.3225, lng: 114.1714, hours: '08:00-22:00',
  },
  {
    id: 'lungfung-sham-shui-po-001',
    brand: 'lungfung', brandZh: '龍豐', brandEn: 'Lung Fung',
    name: '深水埗福華街店',
    address: '九龍深水埗福華街228號地下',
    addressEn: 'G/F, 228 Fuk Wa Street, Sham Shui Po, Kowloon',
    district: 'sham_shui_po', region: 'hongkong',
    lat: 22.3296, lng: 114.1612, hours: '08:00-22:00',
  },
  {
    id: 'lungfung-kwun-tong-001',
    brand: 'lungfung', brandZh: '龍豐', brandEn: 'Lung Fung',
    name: '觀塘物華街店',
    address: '九龍觀塘物華街25-27號地下',
    addressEn: 'G/F, 25-27 Mat Wah Street, Kwun Tong, Kowloon',
    district: 'kwun_tong', region: 'hongkong',
    lat: 22.3118, lng: 114.2245, hours: '08:00-22:00',
  },
  {
    id: 'lungfung-tsuen-wan-001',
    brand: 'lungfung', brandZh: '龍豐', brandEn: 'Lung Fung',
    name: '荃灣川龍街店',
    address: '新界荃灣川龍街42號地下',
    addressEn: 'G/F, 42 Chuen Lung Street, Tsuen Wan, NT',
    district: 'tsuen_wan', region: 'hongkong',
    lat: 22.3768, lng: 114.1198, hours: '08:00-22:00',
  },

  // ─── 全聯 PX Mart ─────────────────────────────────────────────────────────────
  {
    id: 'pxmart-taipei-city-001',
    brand: 'pxmart', brandZh: '全聯', brandEn: 'PX Mart',
    name: '台北信義店',
    address: '台北市信義區信義路五段15號',
    addressEn: '15 Xinyi Road Section 5, Xinyi District, Taipei City',
    district: 'taipei_city', region: 'taiwan',
    lat: 25.0336, lng: 121.5640, hours: '07:00-23:00',
  },
  {
    id: 'pxmart-taipei-city-002',
    brand: 'pxmart', brandZh: '全聯', brandEn: 'PX Mart',
    name: '台北大安店',
    address: '台北市大安區忠孝東路四段97號',
    addressEn: '97 Zhongxiao East Road Section 4, Da-an District, Taipei City',
    district: 'taipei_city', region: 'taiwan',
    lat: 25.0415, lng: 121.5515, hours: '07:00-23:00',
  },
  {
    id: 'pxmart-taipei-city-003',
    brand: 'pxmart', brandZh: '全聯', brandEn: 'PX Mart',
    name: '台北中山店',
    address: '台北市中山區南京東路二段137號',
    addressEn: '137 Nanjing East Road Section 2, Zhongshan District, Taipei City',
    district: 'taipei_city', region: 'taiwan',
    lat: 25.0527, lng: 121.5315, hours: '07:00-23:00',
  },
  {
    id: 'pxmart-new-taipei-001',
    brand: 'pxmart', brandZh: '全聯', brandEn: 'PX Mart',
    name: '新北板橋店',
    address: '新北市板橋區文化路一段266號',
    addressEn: '266 Wenhua Road Section 1, Banqiao District, New Taipei City',
    district: 'new_taipei', region: 'taiwan',
    lat: 25.0122, lng: 121.4625, hours: '07:00-23:00',
  },
  {
    id: 'pxmart-taichung-001',
    brand: 'pxmart', brandZh: '全聯', brandEn: 'PX Mart',
    name: '台中西屯店',
    address: '台中市西屯區台灣大道三段251號',
    addressEn: '251 Taiwan Boulevard Section 3, Xitun District, Taichung City',
    district: 'taichung', region: 'taiwan',
    lat: 24.1637, lng: 120.6430, hours: '07:00-23:00',
  },
  {
    id: 'pxmart-kaohsiung-001',
    brand: 'pxmart', brandZh: '全聯', brandEn: 'PX Mart',
    name: '高雄三民店',
    address: '高雄市三民區民族一路388號',
    addressEn: '388 Minzu 1st Road, Sanmin District, Kaohsiung City',
    district: 'kaohsiung', region: 'taiwan',
    lat: 22.6503, lng: 120.3168, hours: '07:00-23:00',
  },

  // ─── 家樂福 Carrefour ─────────────────────────────────────────────────────────
  {
    id: 'carrefour-taipei-city-001',
    brand: 'carrefour', brandZh: '家樂福', brandEn: 'Carrefour',
    name: '台北內湖店',
    address: '台北市內湖區成功路四段2號',
    addressEn: '2 Chenggong Road Section 4, Neihu District, Taipei City',
    district: 'taipei_city', region: 'taiwan',
    lat: 25.0643, lng: 121.5895, hours: '07:00-23:00',
  },
  {
    id: 'carrefour-taipei-city-002',
    brand: 'carrefour', brandZh: '家樂福', brandEn: 'Carrefour',
    name: '台北桂林店',
    address: '台北市萬華區桂林路1號',
    addressEn: '1 Guilin Road, Wanhua District, Taipei City',
    district: 'taipei_city', region: 'taiwan',
    lat: 25.0411, lng: 121.5083, hours: '07:00-23:00',
  },
  {
    id: 'carrefour-new-taipei-001',
    brand: 'carrefour', brandZh: '家樂福', brandEn: 'Carrefour',
    name: '新北中和店',
    address: '新北市中和區景平路400號',
    addressEn: '400 Jingping Road, Zhonghe District, New Taipei City',
    district: 'new_taipei', region: 'taiwan',
    lat: 24.9960, lng: 121.5025, hours: '07:00-23:00',
  },
  {
    id: 'carrefour-taichung-001',
    brand: 'carrefour', brandZh: '家樂福', brandEn: 'Carrefour',
    name: '台中文心店',
    address: '台中市南屯區文心路一段359號',
    addressEn: '359 Wenxin Road Section 1, Nantun District, Taichung City',
    district: 'taichung', region: 'taiwan',
    lat: 24.1390, lng: 120.6460, hours: '07:00-23:00',
  },
  {
    id: 'carrefour-kaohsiung-001',
    brand: 'carrefour', brandZh: '家樂福', brandEn: 'Carrefour',
    name: '高雄鼎山店',
    address: '高雄市三民區鼎山街941號',
    addressEn: '941 Dingshan Street, Sanmin District, Kaohsiung City',
    district: 'kaohsiung', region: 'taiwan',
    lat: 22.6637, lng: 120.3245, hours: '07:00-23:00',
  },

  // ─── 好市多 Costco ────────────────────────────────────────────────────────────
  {
    id: 'costco-taipei-city-001',
    brand: 'costco', brandZh: '好市多', brandEn: 'Costco',
    name: '台北內湖店',
    address: '台北市內湖區舊宗路二段550號',
    addressEn: '550 Jiuzong Road Section 2, Neihu District, Taipei City',
    district: 'taipei_city', region: 'taiwan',
    lat: 25.0750, lng: 121.5780, hours: '10:00-21:30',
  },
  {
    id: 'costco-new-taipei-001',
    brand: 'costco', brandZh: '好市多', brandEn: 'Costco',
    name: '新北中和店',
    address: '新北市中和區立德街148號',
    addressEn: '148 Lide Street, Zhonghe District, New Taipei City',
    district: 'new_taipei', region: 'taiwan',
    lat: 24.9978, lng: 121.5143, hours: '10:00-21:30',
  },
  {
    id: 'costco-taichung-001',
    brand: 'costco', brandZh: '好市多', brandEn: 'Costco',
    name: '台中南屯店',
    address: '台中市南屯區文心南路100號',
    addressEn: '100 Wenxin South Road, Nantun District, Taichung City',
    district: 'taichung', region: 'taiwan',
    lat: 24.1268, lng: 120.6402, hours: '10:00-21:30',
  },
  {
    id: 'costco-kaohsiung-001',
    brand: 'costco', brandZh: '好市多', brandEn: 'Costco',
    name: '高雄大順店',
    address: '高雄市三民區大順一路752號',
    addressEn: '752 Dashun 1st Road, Sanmin District, Kaohsiung City',
    district: 'kaohsiung', region: 'taiwan',
    lat: 22.6572, lng: 120.3088, hours: '10:00-21:30',
  },

  // ─── 屈臣氏 Watsons (Taiwan) ─────────────────────────────────────────────────
  {
    id: 'watsons-tw-taipei-city-001',
    brand: 'watsons_tw', brandZh: '屈臣氏', brandEn: 'Watsons Taiwan',
    name: '台北忠孝店',
    address: '台北市大安區忠孝東路四段181號',
    addressEn: '181 Zhongxiao East Road Section 4, Da-an District, Taipei City',
    district: 'taipei_city', region: 'taiwan',
    lat: 25.0413, lng: 121.5540, hours: '09:30-22:00',
  },
  {
    id: 'watsons-tw-taipei-city-002',
    brand: 'watsons_tw', brandZh: '屈臣氏', brandEn: 'Watsons Taiwan',
    name: '台北西門店',
    address: '台北市萬華區西寧南路75號',
    addressEn: '75 Xining South Road, Wanhua District, Taipei City',
    district: 'taipei_city', region: 'taiwan',
    lat: 25.0420, lng: 121.5080, hours: '09:30-22:30',
  },
  {
    id: 'watsons-tw-taichung-001',
    brand: 'watsons_tw', brandZh: '屈臣氏', brandEn: 'Watsons Taiwan',
    name: '台中中港店',
    address: '台中市西屯區台灣大道二段260號',
    addressEn: '260 Taiwan Boulevard Section 2, Xitun District, Taichung City',
    district: 'taichung', region: 'taiwan',
    lat: 24.1725, lng: 120.6355, hours: '09:30-22:00',
  },
  {
    id: 'watsons-tw-kaohsiung-001',
    brand: 'watsons_tw', brandZh: '屈臣氏', brandEn: 'Watsons Taiwan',
    name: '高雄中山店',
    address: '高雄市新興區中山一路147號',
    addressEn: '147 Zhongshan 1st Road, Xinxing District, Kaohsiung City',
    district: 'kaohsiung', region: 'taiwan',
    lat: 22.6297, lng: 120.3017, hours: '09:30-22:00',
  },

  // ─── 康是美 Cosmed ────────────────────────────────────────────────────────────
  {
    id: 'cosmed-taipei-city-001',
    brand: 'cosmed', brandZh: '康是美', brandEn: 'Cosmed',
    name: '台北忠孝店',
    address: '台北市大安區忠孝東路四段45號',
    addressEn: '45 Zhongxiao East Road Section 4, Da-an District, Taipei City',
    district: 'taipei_city', region: 'taiwan',
    lat: 25.0419, lng: 121.5455, hours: '09:00-22:30',
  },
  {
    id: 'cosmed-taipei-city-002',
    brand: 'cosmed', brandZh: '康是美', brandEn: 'Cosmed',
    name: '台北信義店',
    address: '台北市信義區松壽路9號威秀影城地下1樓',
    addressEn: 'B1, Vieshow Cinemas, 9 Songshou Road, Xinyi District, Taipei City',
    district: 'taipei_city', region: 'taiwan',
    lat: 25.0360, lng: 121.5645, hours: '09:00-22:30',
  },
  {
    id: 'cosmed-taichung-001',
    brand: 'cosmed', brandZh: '康是美', brandEn: 'Cosmed',
    name: '台中公益店',
    address: '台中市西區公益路68號',
    addressEn: '68 Gongyi Road, West District, Taichung City',
    district: 'taichung', region: 'taiwan',
    lat: 24.1525, lng: 120.6688, hours: '09:00-22:00',
  },
  {
    id: 'cosmed-kaohsiung-001',
    brand: 'cosmed', brandZh: '康是美', brandEn: 'Cosmed',
    name: '高雄五福店',
    address: '高雄市新興區五福二路57號',
    addressEn: '57 Wufu 2nd Road, Xinxing District, Kaohsiung City',
    district: 'kaohsiung', region: 'taiwan',
    lat: 22.6266, lng: 120.3007, hours: '09:00-22:00',
  },
];

/**
 * Get store locations for a specific brand and optionally filter by district.
 */
export function getStoreLocations(brand: string, district?: string): StoreLocation[] {
  return STORE_LOCATIONS.filter(s => {
    const brandMatch = s.brand.toLowerCase() === brand.toLowerCase();
    if (!brandMatch) return false;
    if (district) return s.district === district;
    return true;
  });
}

/**
 * Get store locations for a specific region.
 */
export function getStoreLocationsByRegion(region: string): StoreLocation[] {
  return STORE_LOCATIONS.filter(s => s.region === region);
}

/**
 * Find a store location by its ID.
 */
export function findStoreLocationById(id: string): StoreLocation | undefined {
  return STORE_LOCATIONS.find(s => s.id === id);
}

/**
 * Get distinct brands available in a given region.
 */
export function getBrandsForRegion(region: string): string[] {
  const brands = new Set(
    STORE_LOCATIONS.filter(s => s.region === region).map(s => s.brand)
  );
  return Array.from(brands);
}
