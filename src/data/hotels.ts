import type { HotelListItem, HotelDetail, RoomType } from "../types/hotel";

// 模拟酒店列表数据
export const MOCK_HOTELS: HotelListItem[] = [
  {
    id: "1",
    name: "上海外滩华尔道夫酒店",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    starLevel: 5,
    rating: 4.8,
    reviewCount: 1245,
    price: {
      lowest: 1288,
      original: 1588,
      discount: 0.81,
    },
    location: {
      city: "上海",
      address: "黄浦区中山东一路2号",
      lat: 31.233999,
      lng: 121.491203,
      distance: 1200
    },
    roomAvailability: {
      hasAvailableRoom: true,
      lowestRoomPrice: 1288
    },
    tags: ["近外滩", "江景房", "含早餐"]
  },
  {
    id: "2",
    name: "上海浦东丽思卡尔顿酒店",
    coverImage: "https://images.unsplash.com/photo-1584218896971-bf6d30b3fmpl?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584218896971-bf6d30b3fmpl?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d2ef20d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    starLevel: 5,
    rating: 4.7,
    reviewCount: 987,
    price: {
      lowest: 2158,
      original: 2588,
      discount: 0.83,
    },
    location: {
      city: "上海",
      address: "陆家嘴世纪大道2001号",
      lat: 31.236277,
      lng: 121.505742,
      distance: 800
    },
    roomAvailability: {
      hasAvailableRoom: true,
      lowestRoomPrice: 2158
    },
    tags: ["陆家嘴", "高空景观", "行政酒廊"]
  },
  {
    id: "3",
    name: "上海静安香格里拉大酒店",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099456?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099456?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584284642094-413534496f75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    starLevel: 5,
    rating: 4.6,
    reviewCount: 1562,
    price: {
      lowest: 1488,
      original: 1788,
      discount: 0.83
    },
    location: {
      city: "上海",
      address: "延安中路1218号",
      lat: 31.231705,
      lng: 121.454211,
      distance: 3500
    },
    roomAvailability: {
      hasAvailableRoom: true,
      lowestRoomPrice: 1488
    },
    tags: ["静安区", "健身中心", "室内泳池"]
  },
  {
    id: "4",
    name: "上海新天地朗廷酒店",
    coverImage: "https://images.unsplash.com/photo-1590846406698-4d8d6440ae76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1590846406698-4d8d6440ae76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618826237711-79d840e35cbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    starLevel: 5,
    rating: 4.5,
    reviewCount: 876,
    price: {
      lowest: 1688,
      original: 1988,
      discount: 0.85
    },
    location: {
      city: "上海",
      address: "黄陂南路380弄1号",
      lat: 31.228719,
      lng: 121.476937,
      distance: 2200
    },
    roomAvailability: {
      hasAvailableRoom: true,
      lowestRoomPrice: 1688
    },
    tags: ["新天地", "英式风情", "下午茶"]
  },
  {
    id: "5",
    name: "上海素凯泰酒店",
    coverImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    starLevel: 5,
    rating: 4.7,
    reviewCount: 756,
    price: {
      lowest: 1888,
      original: 2288,
      discount: 0.83
    },
    location: {
      city: "上海",
      address: "威海路380号",
      lat: 31.234182,
      lng: 121.461541,
      distance: 1800
    },
    roomAvailability: {
      hasAvailableRoom: false,
      lowestRoomPrice: 1888
    },
    tags: ["淮海路", "泰式奢华", "屋顶酒吧"]
  },
  {
    id: "6",
    name: "上海建业里嘉佩乐酒店",
    coverImage: "https://images.unsplash.com/photo-1590846406698-4d8d6440ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1590846406698-4d8d6440ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584284642094-413534496f76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    starLevel: 5,
    rating: 4.9,
    reviewCount: 1423,
    price: {
      lowest: 2988,
      original: 3588,
      discount: 0.83
    },
    location: {
      city: "上海",
      address: "建国西路23号",
      lat: 31.212234,
      lng: 121.454098,
      distance: 4200
    },
    roomAvailability: {
      hasAvailableRoom: true,
      lowestRoomPrice: 2988
    },
    tags: ["石库门建筑", "独栋别墅", "管家服务"]
  }
];

// 模拟酒店详情数据
export const MOCK_HOTEL_DETAIL: HotelDetail = {
  id: "1",
  name: "上海外滩华尔道夫酒店",
  starLevel: 5,
  brand: "华尔道夫",
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590846406698-4d8d6440ae76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  videoUrl: "https://example.com/hotel-video.mp4",
  description: "上海外滩华尔道夫酒店坐落于上海外滩，拥有百年历史的地标建筑与现代奢华设施完美融合。酒店毗邻繁华的南京路步行街和外滩，地理位置优越，是探索上海这座迷人城市的理想下榻之所。",
  location: {
    address: "黄浦区中山东一路2号",
    lat: 31.233999,
    lng: 121.491203
  },
  contact: {
    phone: "021-6322-9988"
  },
  checkInTime: "15:00",
  checkOutTime: "12:00",
  facilities: [],
  rating: 4.8,
  reviewCount: 1245
};

// 模拟房型数据
export const MOCK_ROOM_TYPES: RoomType[] = [
  {
    id: "r1",
    name: "豪华城景房",
    area: 40,
    image: "https://images.unsplash.com/photo-1618826237711-79d840e35cbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    maxOccupancy: 2,
    price: {
      current: 1288,
      original: 1588,
      discount: 0.81
    },
    availability: {
      remaining: 5,
      isSoldOut: false
    },
    tags: ["免费WiFi", "迷你吧", "浴缸"]
  },
  {
    id: "r2",
    name: "行政江景房",
    area: 50,
    image: "https://images.unsplash.com/photo-1590846406698-4d8d6440ae76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    maxOccupancy: 2,
    price: {
      current: 1888,
      original: 2288,
      discount: 0.82
    },
    availability: {
      remaining: 3,
      isSoldOut: false
    },
    tags: ["黄浦江景", "行政待遇", "独立起居室"]
  },
  {
    id: "r3",
    name: "华尔道夫套房",
    area: 70,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    maxOccupancy: 3,
    price: {
      current: 3288,
      original: 3988,
      discount: 0.82
    },
    availability: {
      remaining: 1,
      isSoldOut: false
    },
    tags: ["独立卧室", "客厅", "私人管家"]
  }
];

// 快速筛选标签
export const QUICK_TAGS = [
  { value: '近地铁', label: '近地铁' },
  { value: '含早餐', label: '含早餐' },
  { value: '免费停车', label: '免费停车' },
  { value: '游泳池', label: '游泳池' },
  { value: '健身房', label: '健身房' },
  { value: '行政酒廊', label: '行政酒廊' },
  { value: '江景房', label: '江景房' },
  { value: '亲子酒店', label: '亲子酒店' }
];