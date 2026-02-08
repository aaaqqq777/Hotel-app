// src/types/hotel.ts

// 酒店对象的类型
export interface Hotel {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  rating: number;
}

// 搜索参数的类型
export interface SearchParams {
  city?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  // ... 其他参数
}
