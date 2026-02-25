// src/api/modules/hotel.ts
import { api } from '../index';
import type { HotelSearchParams, HotelDetail,RoomType } from '../../types/hotel';
import { MOCK_HOTELS } from '../../data/hotels';
import { MOCK_HOTEL_DETAILS, MOCK_ROOMS_BY_HOTEL } from '../../data/hotelDetail';

// 后端接口请求参数
// export interface HotelListParams {
//   keyword?: string;
//   city: string;
//   star?: string;
//   sort?: string;
//   lng?: string;
//   lat?: string;
//   page?: string;
//   limit?: string;
//   minPrice?: string;
//   maxPrice?: string;
//   startDate?: string;
//   endDate?: string;
//   roomCount?: number;
//   guestCount?: number;
// }

// 后端接口响应数据结构
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
      location: {
        address?: string;
        city?: string;
        district?: string;
        [key: string]: any;
      };
    }>;
  };
}

// 酒店搜索API
export const hotelApi = {
  // 搜索酒店列表
  searchHotels: async (params: HotelSearchParams): Promise<HotelListResponse> => {
    try {
      return await api.get('/api/hotels/search', { params });
    } catch (error) {
      console.error('搜索酒店失败:', error);
      // 返回模拟数据，需要将本地MOCK_HOTELS转换为后端API格式
      const convertedHotels = MOCK_HOTELS.map(hotel => ({
        _id: hotel.id,
        name_cn: hotel.name,
        star_rating: hotel.starLevel,
        score: hotel.rating,
        cover_image: hotel.coverImage || hotel.images?.[0] || '',
        min_price: typeof hotel.price === 'object' ? hotel.price.lowest : hotel.price,
        location: {
          address: typeof hotel.location === 'object' ? hotel.location.address : hotel.location || '',
          city: params.city || '上海',
          district: ''
        }
      }));
      
      return {
        code: 200,
        data: {
          total: MOCK_HOTELS.length,
          list: convertedHotels
        }
      };
    }
  },

  // 获取酒店详情
  getHotelDetail: async (hotelId: string): Promise<HotelDetail> => {
    try {
      return await api.get(`/api/hotels/${hotelId}`);
    } catch (error) {
      console.error('获取酒店详情失败:', error);
      return MOCK_HOTEL_DETAILS[hotelId] || MOCK_HOTEL_DETAILS['1'];
    }
  },

  // 获取酒店房型
  getHotelRooms: async (hotelId: string): Promise<RoomType[]> => {
    try {
      return await api.get(`/api/hotels/${hotelId}/rooms`);
    } catch (error) {
      console.error('获取酒店房型失败:', error);
      return MOCK_ROOMS_BY_HOTEL[hotelId] || [];
    }
  },

  // // 获取酒店评论
  // getHotelReviews: async (hotelId: string): Promise<Review[]> => {
  //   try {
  //     return await api.get(`/api/hotels/${hotelId}/reviews`);
  //   } catch (error) {
  //     console.error('获取酒店评论失败:', error);
  //     return MOCK_HOTEL_REVIEWS;
  //   }
  // },

  // // 获取酒店设施
  // getHotelFacilities: async (hotelId: string): Promise<Facility[]> => {
  //   try {
  //     return await api.get(`/api/hotels/${hotelId}/facilities`);
  //   } catch (error) {
  //     console.error('获取酒店设施失败:', error);
  //     return MOCK_HOTEL_FACILITIES;
  //   }
  // }
};
