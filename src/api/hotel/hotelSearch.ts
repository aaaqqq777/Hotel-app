import { apiClient } from '../config';
import type { HotelSearchParams } from '../../types/hotel';
import { getMockHotelList } from '../../data/MOCK/hotellist/mockHotelService';

// 后端响应结构
export interface HotelListResponse {
  code: number;
  data: {
    total: number;
    list: Array<{
      _id: string;
      name_cn: string;
      star_rating: number;
      score: number;
      cover_image: string;
      min_price: number;
      original_price?: number;
      discount?: number;
      location: {
        address?: string;
        city?: string;
        district?: string;
        lat: number;
        lng: number;
        distance?: number;
        [key: string]: any;
      };
      room_availability: {
        has_available_room: boolean;
        lowest_room_price?: number;
      };
      review_count?: number;
      tags?: string[];
    }>;
  };
}

export async function searchHotelList(
  params: HotelSearchParams
): Promise<HotelListResponse> {
  console.log('🔍 searchHotelList 请求参数:', params);
  try {
    const response = await apiClient.get('/api/hotels', { params });
    console.log('✅ searchHotelList 响应:', response.data);
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ API 请求失败，开发环境使用 mock 数据:', error);
      await new Promise(resolve => setTimeout(resolve, 800));
      return getMockHotelList(params);
    }
    console.error('❌ searchHotelList 请求失败:', error);
    throw error;
  }
}