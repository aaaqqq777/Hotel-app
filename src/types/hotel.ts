export interface HotelSearchParams {
  city: string;
  keyword?: string;

  checkInDate: string;
  checkOutDate: string;

  minPrice?: number;
  maxPrice?: number;
  roomCount?: number;
  guestCount?: number;
  
  star_rating?: number;
  brand?: string;
  score?: number;
  sortBy?: 'min_price' | 'distance' | 'score' | 'star_rating' | '';
  sortOrder?: 'asc' | 'desc' | '';

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
  score?: number;
  star_rating: number;

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
  services?: string[];
  tags?: string[]; // "近地铁 / 新开业 / 含早餐"
}

export interface HotelFilterParams {
  keyword?: string;
  starLevel?: string;
  priceRange?: string;
  tags?: string[];
}

export type SortType = 'price-asc' | 'price-desc' | 'star_rating' | 'default';


export interface HotelDetail {
  id: string;
  name: string;
  star_rating: number;
  brand?: string;
  hotelType?: string;

  coverImage?: string;
  images: string[];
  videoUrl?: string;

  description: string;

  location: {
    address: string;
    city?: string;
    district?: string;
    businessZone?: string;
    lat: number;
    lng: number;
  };

  contact: {
    phone?: string;
  };

  checkInTime: string;
  checkOutTime: string;

  facilities: string[];
  services?: string[];
  tags?: string[];
  reviewTags?: string[];
  minPrice?: number;
  discount?: number;

  score?: number;
  reviewCount: number;
}

export interface RoomType {
  id: string;
  name: string;
  area: number;
  image: string;
  images?: string[];
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
  bedType?: string;
  hasBathtub?: boolean;
  windowStatus?: string;
  breakfast?: string;
  facilities?: string[];
}
export interface BannerData {
  id: string
  imageUrl: string
  title: string
  description: string
  hotelId: string
}