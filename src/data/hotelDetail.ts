/**
 * 酒店详情页模拟数据
 * 便于后期从后端 API 替换
 */

// 酒店图片
export const MOCK_HOTEL_IMAGES = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20with%20modern%20architecture%20at%20night&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20lobby%20with%20chandelier&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20room%20with%20king%20bed&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20bathroom%20with%20bathtub&image_size=landscape_16_9',
];

// 酒店设施
export const MOCK_HOTEL_FACILITIES = [
  { icon: '🏊', name: '游泳池' },
  { icon: '🏋️', name: '健身房' },
  { icon: '🍽️', name: '餐厅' },
  { icon: '☕', name: '咖啡厅' },
  { icon: '🧹', name: '洗衣服务' },
  { icon: '📞', name: '叫醒服务' },
  { icon: '🅿️', name: '停车场' },
  { icon: '📶', name: '免费WiFi' },
  { icon: '🚪', name: '24小时前台' },
  { icon: '🧳', name: '行李寄存' },
];

// 酒店评价
export const MOCK_HOTEL_REVIEWS = [
  {
    id: '1',
    userName: '张先生',
    date: '2026-02-18',
    rating: 5,
    content: '酒店环境非常好，服务态度也很棒，房间干净整洁，交通便利，下次还会再来。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hotel%20room%20interior%20clean%20modern&image_size=landscape_16_9',
    ],
  },
  {
    id: '2',
    userName: '李女士',
    date: '2026-02-17',
    rating: 4,
    content: '酒店位置不错，房间宽敞，设施齐全，就是早餐种类可以再丰富一些。',
  },
];

// 房型类型
export const MOCK_ROOM_TYPES = [
  { id: '1', name: '豪华大床房', description: '1张1.8米大床，45㎡', price: 1088 },
  { id: '2', name: '豪华双床房', description: '2张1.2米单人床，45㎡', price: 1088 },
  { id: '3', name: '行政大床房', description: '1张1.8米大床，55㎡，行政礼遇', price: 1388 },
];

// 服务标签
export const MOCK_SERVICES = [
  { id: '1', name: '含早餐' },
  { id: '2', name: '免费取消' },
  { id: '3', name: '立即确认' },
  { id: '4', name: '接送服务' },
  { id: '5', name: '洗衣服务' },
  { id: '6', name: '叫醒服务' },
];

// 搜索建议
export const MOCK_SEARCH_SUGGESTIONS = ['上海', '北京', '广州', '深圳', '杭州', '成都'];

// 房型列表
export const MOCK_ROOMS = [
  {
    id: '1',
    name: '豪华大床房',
    description: '1张1.8米大床，45㎡，豪华装修，独立卫浴，免费WiFi，液晶电视，迷你吧',
    price: 1088,
    originalPrice: 1288,
    discount: 8.5,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20king%20room%20with%20one%20bed&image_size=landscape_16_9',
    tags: ['含早餐', '立即确认', '免费取消'],
  },
  {
    id: '2',
    name: '豪华双床房',
    description: '2张1.2米单人床，45㎡，豪华装修，独立卫浴，免费WiFi，液晶电视，迷你吧',
    price: 1088,
    originalPrice: 1288,
    discount: 8.5,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hotel%20twin%20room%20with%20two%20beds&image_size=landscape_16_9',
    tags: ['含早餐', '立即确认', '免费取消'],
  },
  {
    id: '3',
    name: '行政大床房',
    description: '1张1.8米大床，55㎡，行政楼层，豪华装修，独立卫浴，免费WiFi，液晶电视，迷你吧，行政礼遇',
    price: 1388,
    originalPrice: 1688,
    discount: 8.2,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=executive%20hotel%20room%20luxury&image_size=landscape_16_9',
    tags: ['含早餐', '立即确认', '免费取消', '行政礼遇'],
  },
];
