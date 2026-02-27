import type { HotelDetail, RoomType } from "../../types/hotel";
import { MOCK_HOTEL_DETAIL, MOCK_ROOM_TYPES } from "../MOCK/hotels";

// 导出酒店详情数据
export const MOCK_HOTEL_DETAILS: Record<string, HotelDetail> = {
  "1": MOCK_HOTEL_DETAIL,
  "2": {
    id: "2",
    name: "上海浦东丽思卡尔顿酒店",
    star_rating: 5,
    brand: "丽思卡尔顿",
    images: [
      "https://images.unsplash.com/photo-1584218896971-bf6d30b3fmpl?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d2ef20d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://example.com/hotel-video-2.mp4",
    description: "上海浦东丽思卡尔顿酒店位于陆家嘴金融区的核心地带，坐拥黄浦江和上海天际线的壮丽景色。酒店提供顶级的住宿体验、精致的餐饮选择和卓越的服务，是商务和休闲旅客的理想之选。",
    location: {
      address: "陆家嘴世纪大道2001号",
      lat: 31.236277,
      lng: 121.505742
    },
    contact: {
      phone: "021-2020-1888"
    },
    checkInTime: "15:00",
    checkOutTime: "12:00",
    facilities: [],
    score: 4.7,
    reviewCount: 987
  },
  "3": {
    id: "3",
    name: "上海静安香格里拉大酒店",
    star_rating: 5,
    brand: "香格里拉",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099456?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584284642094-413534496f75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://example.com/hotel-video-3.mp4",
    description: "上海静安香格里拉大酒店位于繁华的静安区，周边购物、餐饮和娱乐设施一应俱全。酒店以其标志性的亚洲式待客之道和现代化的设施，为您提供难忘的住宿体验。",
    location: {
      address: "延安中路1218号",
      lat: 31.231705,
      lng: 121.454211
    },
    contact: {
      phone: "021-6253-8888"
    },
    checkInTime: "14:00",
    checkOutTime: "12:00",
    facilities: [],
    score: 4.6,
    reviewCount: 1562
  },
  "4": {
    id: "4",
    name: "上海新天地朗廷酒店",
    star_rating: 5,
    brand: "朗廷",
    images: [
      "https://images.unsplash.com/photo-1590846406698-4d8d6440ae76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618826237711-79d840e35cbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://example.com/hotel-video-4.mp4",
    description: "上海新天地朗廷酒店坐落于时尚的新天地地区，融合了经典优雅与现代奢华。酒店设计灵感源自巴黎左岸的艺术气息，为您提供独特的住宿体验。",
    location: {
      address: "黄陂南路380弄1号",
      lat: 31.228719,
      lng: 121.476937
    },
    contact: {
      phone: "021-3366-9999"
    },
    checkInTime: "15:00",
    checkOutTime: "12:00",
    facilities: [],
    score: 4.5,
    reviewCount: 876
  },
  "5": {
    id: "5",
    name: "上海素凯泰酒店",
    star_rating: 5,
    brand: "素凯泰",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590846406698-4d8d6440ae76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://example.com/hotel-video-5.mp4",
    description: "上海素凯泰酒店将泰国传统工艺与现代奢华完美结合，为宾客提供独特而难忘的住宿体验。酒店位于繁华的淮海路商业区，地理位置优越。",
    location: {
      address: "威海路380号",
      lat: 31.234182,
      lng: 121.461541
    },
    contact: {
      phone: "021-3398-8888"
    },
    checkInTime: "15:00",
    checkOutTime: "12:00",
    facilities: [],
    score: 4.7,
    reviewCount: 756
  },
  "6": {
    id: "6",
    name: "上海建业里嘉佩乐酒店",
    star_rating: 5,
    brand: "嘉佩乐",
    images: [
      "https://images.unsplash.com/photo-1590846406698-4d8d6440ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584284642094-413534496f76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://example.com/hotel-video-6.mp4",
    description: "上海建业里嘉佩乐酒店坐落于历史悠久的建业里，是沪上唯一的全别墅酒店。酒店巧妙地将上海石库门建筑风格与法式优雅相结合，呈现独特的奢华体验。",
    location: {
      address: "建国西路23号",
      lat: 31.212234,
      lng: 121.454098
    },
    contact: {
      phone: "021-3307-8888"
    },
    checkInTime: "15:00",
    checkOutTime: "12:00",
    facilities: [],
    score: 4.9,
    reviewCount: 1423
  }
};

// 房型数据按酒店ID分组
export const MOCK_ROOMS_BY_HOTEL: Record<string, RoomType[]> = {
  "1": MOCK_ROOM_TYPES,
  "2": [
    {
      id: "2-r1",
      name: "浦东江景房",
      area: 55,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      maxOccupancy: 2,
      price: {
        current: 2158,
        original: 2588,
        discount: 0.83
      },
      availability: {
        remaining: 2,
        isSoldOut: false
      },
      tags: ["黄浦江景", "落地窗", "行政待遇"]
    },
    {
      id: "2-r2",
      name: "丽思卡尔顿套房",
      area: 80,
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      maxOccupancy: 3,
      price: {
        current: 4288,
        original: 5188,
        discount: 0.83
      },
      availability: {
        remaining: 1,
        isSoldOut: false
      },
      tags: ["独立客厅", "餐厅", "私人管家"]
    }
  ],
  "3": [
    {
      id: "3-r1",
      name: "静安城景房",
      area: 45,
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      maxOccupancy: 2,
      price: {
        current: 1488,
        original: 1788,
        discount: 0.83
      },
      availability: {
        remaining: 4,
        isSoldOut: false
      },
      tags: ["城市景观", "免费WiFi", "迷你吧"]
    },
    {
      id: "3-r2",
      name: "香格里拉行政房",
      area: 60,
      image: "https://images.unsplash.com/photo-1590490360182-c33d2ef20d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      maxOccupancy: 2,
      price: {
        current: 2288,
        original: 2688,
        discount: 0.85
      },
      availability: {
        remaining: 3,
        isSoldOut: false
      },
      tags: ["行政酒廊", "免费早餐", "会议室"]
    }
  ]
};

// 模拟酒店设施
export const MOCK_HOTEL_FACILITIES = [
  { id: "1", name: "游泳池", icon: "🏊" },
  { id: "2", name: "健身房", icon: "💪" },
  { id: "3", name: "免费WiFi", icon: "📶" },
  { id: "4", name: "餐厅", icon: "🍽️" },
  { id: "5", name: "酒吧", icon: "🍸" },
  { id: "6", name: "水疗中心", icon: "💆" },
  { id: "7", name: "停车场", icon: "🅿️" },
  { id: "8", name: "商务中心", icon: "💼" },
  { id: "9", name: "儿童乐园", icon: "🎠" },
  { id: "10", name: "会议室", icon: "👥" }
];

// 模拟酒店评价
export const MOCK_HOTEL_REVIEWS = [
  { id: "1", userId: "user1", userName: "张三", score: 5, comment: "酒店环境优美，服务态度很好，下次还会再来！", date: "2023-10-15" },
  { id: "2", userId: "user2", userName: "李四", score: 4, comment: "位置很好，交通方便，房间干净整洁。", date: "2023-10-10" },
  { id: "3", userId: "user3", userName: "王五", score: 5, comment: "设施完善，员工专业热情，是一次愉快的住宿体验。", date: "2023-10-05" },
  { id: "4", userId: "user4", userName: "赵六", score: 4, comment: "早餐丰富多样，床铺舒适，值得推荐。", date: "2023-09-28" }
];

// 模拟搜索建议
export const MOCK_SEARCH_SUGGESTIONS = [
  "上海外滩华尔道夫酒店",
  "上海浦东丽思卡尔顿酒店",
  "上海静安香格里拉大酒店",
  "上海新天地朗廷酒店",
  "上海素凯泰酒店",
  "上海建业里嘉佩乐酒店",
  "外滩酒店",
  "陆家嘴酒店",
  "静安酒店",
  "新天地酒店"
];

// 模拟酒店图片
export const MOCK_HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1590846406698-4d8d6440ae76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618826237711-79d840e35cbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

// 模拟服务标签
export const MOCK_SERVICES = [
  { id: "1", name: "免费WiFi", icon: "📶" },
  { id: "2", name: "免费停车", icon: "🅿️" },
  { id: "3", name: "健身房", icon: "💪" },
  { id: "4", name: "游泳池", icon: "🏊" },
  { id: "5", name: "餐厅", icon: "🍽️" },
  { id: "6", name: "SPA", icon: "💆" },
  { id: "7", name: "商务中心", icon: "💼" },
  { id: "8", name: "儿童乐园", icon: "🎠" }
];