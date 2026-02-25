export interface HotelSearchParams {
  city: string;
  keyword?: string;

  checkInDate: string;
  checkOutDate: string;

  minPrice?: number;
  maxPrice?: number;
  roomCount?: number;
  guestCount?: number;
  
  starLevels?: number;
  brands?: string[];
  score?: number;
  sortBy?: 'price' | 'distance' | 'rating' | 'star' | '';
  sortOrder?: 'asc' | 'desc';

  page: number;
  pageSize: number;

  lat?: number;
  lng?: number;
  tags?: string[];
}

export interface HotelListItem {
  id: string;
  name: string;

  coverImage: string;
  images?: string[];

  starLevel: number;
  rating: number;
  reviewCount: number;

  price: {
    lowest: number;
    original?: number;
    discount?: number;
  };

  location: {
    city: string;
    address: string;
    lat: number;
    lng: number;
    distance?: number; // 单位米，后端计算
  };

  roomAvailability: {
    hasAvailableRoom: boolean;
    lowestRoomPrice?: number;
  };

  tags?: string[]; // "近地铁 / 新开业 / 含早餐"
}

export interface HotelFilterParams {
  keyword?: string;
  starLevel?: string;
  priceRange?: string;
  tags?: string[];
}

export type SortType = 'price-asc' | 'price-desc' | 'rating' | 'default';

export interface HotelDetail {
  id: string;
  name: string;

  starLevel: number;
  brand?: string;

  images: string[];
  videoUrl?: string;

  description: string;

  location: {
    address: string;
    lat: number;
    lng: number;
  };

  contact: {
    phone?: string;
  };

  checkInTime: string;
  checkOutTime: string;

  facilities: string[];

  rating?: number;
  reviewCount: number;
}

export interface RoomType {
  id: string;
  name: string;
  area: number;
  image: string;
  maxOccupancy: number;

  price: {
    current: number;
    original?: number;
    discount?: number;
  };

  availability: {
    remaining: number;
    isSoldOut: boolean;
  };
  description?: string;
  tags?: string[];
}
//advertisement
export interface BannerData {
  id: string
  imageUrl: string
  title: string
  description: string
  hotelId: string
}