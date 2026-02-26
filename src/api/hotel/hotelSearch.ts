// import { apiClient } from '../config';
// import type { HotelSearchParams } from '../../types/hotel';
import { getMockHotelList } from '../../data/MOCK/hotellist/mockHotelService';
import { api } from '../index';
import type { HotelSearchParams } from '../../types/hotel';

export interface HotelListResponse {
  code: number;
  data: {
    total: number;
    list: any[];
  };
}

// export async function searchHotelList(
//   params: HotelSearchParams
// ): Promise<HotelListResponse> {
//   try {
//     // return await api.get('/api/hotels/search', { params });
    
//     return await api.get('/api/hot', { params });
//   } catch (error) {
//     console.error('❌ searchHotelList 请求失败:', error);
//     throw error;
//   }
// }
// 后端响应结构
// export interface HotelListResponse {
//   code: number;
//   data: {
//     total: number;
//     list: Array<{
//       _id: string;
//       name_cn: string;
//       star_rating: number;
//       score: number;
//       cover_image: string;
//       min_price: number;
//       discount?: number;
//       review_count?: number;
//       tags?: string[];

//       city?: string;
//       address?: string;

//       location?: {
//         type: 'Point';
//         coordinates: [number, number]; // [lng, lat]
//       };

//       available_rooms?: Array<{
//         price: number;
//         original_price?: number;
//         status: number;
//         is_published: boolean;
//       }>;
//     }>;
//   };
// }



export async function searchHotelList(
  params: HotelSearchParams
): Promise<HotelListResponse> {
  console.log('🔍 searchHotelList 请求参数:', params);
  try {
    const response = await api.get('/api/hotels/search', { params });
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