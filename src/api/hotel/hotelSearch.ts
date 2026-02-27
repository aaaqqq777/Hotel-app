
import { api } from '../index';
import type { HotelSearchParams} from '../../types/hotel';

export interface HotelListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  list: any[]; // 这里可以根据实际数据结构定义更具体的类型
}

export async function searchHotelList(
  params: HotelSearchParams
): Promise<HotelListResponse> {
  console.log('🔍 searchHotelList 请求参数:', params);
  try {
    const response = await api.get('/api/hotels/search', { params });
    return response.data;
  } catch (error) {
    // if (import.meta.env.DEV) {
    //   console.warn('⚠️ API 请求失败，开发环境使用 mock 数据:', error);
    //   await new Promise(resolve => setTimeout(resolve, 800));
    //   return getMockHotelList(params);
    // }
    console.error('❌ searchHotelList 请求失败:', error);
    throw error;
  }
}