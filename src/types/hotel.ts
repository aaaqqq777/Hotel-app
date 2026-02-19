// src/types/hotel.ts

// 酒店对象的类型
export interface Hotel {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  rating: number;
  location: string;
  starLevel: number;
  images?: string[];
  reviewCount?: number;
  distance?: string;
  mapUrl?: string;
}

// 酒店详情类型
export interface HotelDetail extends Hotel {
  address: string;
  phone: string;
  description: string;
  facilities: Facility[];
  checkInTime: string;
  checkOutTime: string;
  minPrice?: number;
  videoUrl?: string;
  tags?: Array<{
    icon: string;
    text: string;
  }>;
}

// 设施类型
export interface Facility {
  id: string;
  name: string;
  icon: string;
}

// 评价类型
export interface Review {
  id: string;
  userName: string;
  date: string;
  rating: number;
  content: string;
  images?: string[];
}

// 房型类型
export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  tags?: string[];
  maxOccupancy: number;
  area: number;
}

// 搜索参数的类型
export interface SearchParams {
  city?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  starLevel?: number;
  priceMin?: number;
  priceMax?: number;
  facilities?: string[];
  // ... 其他参数
}
