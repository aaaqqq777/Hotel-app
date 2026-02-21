// src/api/hotelsearch/hotelsearch.ts
import { apiClient } from '../config';
import type { Hotel, SearchParams, HotelDetail, Review, RoomType, Facility } from '../../types/hotel';
import { MOCK_HOTEL_IMAGES, MOCK_HOTEL_FACILITIES, MOCK_HOTEL_REVIEWS, MOCK_ROOM_TYPES, MOCK_ROOMS, MOCK_SEARCH_SUGGESTIONS, MOCK_HOTEL_DETAILS } from '../../data/hotelDetail';
import { MOCK_HOTELS } from '../../data/hotels';

// 后端接口请求参数
export interface HotelListParams {
  keyword?: string;
  city: string;
  star?: string;
  sort?: string;
  lng?: string;
  lat?: string;
  page?: string;
  limit?: string;
}

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

// 搜索酒店列表 (使用后端接口 GET /hotels)
export async function searchHotelList(params: HotelListParams): Promise<HotelListResponse> {
  try {
    const response = await apiClient.get('/hotels', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to search hotel list:', error);
    
    // ========== 模拟数据处理 ==========
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '10');
    
    // 根据参数过滤
    let filteredHotels = [...MOCK_HOTELS];
    
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.name.toLowerCase().includes(keyword) ||
        hotel.location.toLowerCase().includes(keyword)
      );
    }
    
    if (params.star) {
      const star = parseInt(params.star);
      filteredHotels = filteredHotels.filter(hotel => hotel.starLevel === star);
    }
    
    // 排序
    if (params.sort) {
      switch (params.sort) {
        case 'price-asc':
          filteredHotels.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredHotels.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredHotels.sort((a, b) => b.starLevel - a.starLevel);
          break;
      }
    }
    
    // 分页
    const total = filteredHotels.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pageData = filteredHotels.slice(startIndex, endIndex);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 转换为后端返回格式
    return {
      code: 200,
      data: {
        total,
        list: pageData.map(hotel => ({
          _id: hotel.id,
          name_cn: hotel.name,
          star_rating: hotel.starLevel,
          score: 4.5,
          cover_image: hotel.image,
          min_price: hotel.price,
          location: {
            address: hotel.location,
            city: params.city || '上海',
            district: ''
          }
        }))
      }
    };
  }
}

// 获取酒店详情
export async function getHotelDetail(hotelId: string): Promise<HotelDetail> {
  try {
    const response = await apiClient.get(`/hotels/${hotelId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get hotel detail:', error);
    // 返回模拟数据，根据酒店ID返回不同的详情
    const hotelDetail = MOCK_HOTEL_DETAILS[hotelId];
    if (hotelDetail) {
      return hotelDetail;
    }
    // 如果没有对应ID的酒店详情，返回默认数据
    return {
      id: hotelId,
      name: `豪华酒店 ${hotelId}`,
      imageUrl: MOCK_HOTEL_IMAGES[0],
      price: 1088,
      rating: 4.8,
      location: '上海市静安区',
      starLevel: 5,
      images: MOCK_HOTEL_IMAGES,
      reviewCount: 256,
      distance: '距离市中心3.5公里',
      mapUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hotel%20location%20map%20view&image_size=landscape_16_9',
      address: '上海市静安区南京西路1268号',
      phone: '021-12345678',
      description: '豪华酒店位于上海市中心，交通便利，设施齐全，服务周到，是商务旅行和休闲度假的理想选择。',
      facilities: MOCK_HOTEL_FACILITIES,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      minPrice: 1088,
      videoUrl: '',
      tags: [
        { icon: '🏢', text: '2020年开业' },
        { icon: '🎨', text: '新中式风' },
        { icon: '🅿️', text: '免费停车' },
        { icon: '🌊', text: '一线江景' },
        { icon: '🍵', text: '江景下午茶' },
      ]
    };
  }
}

// 获取酒店评价
export async function getHotelReviews(hotelId: string, page = 1, pageSize = 10): Promise<Review[]> {
  try {
    const response = await apiClient.get(`/hotels/${hotelId}/reviews`, {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get hotel reviews:', error);
    // 返回模拟数据
    return MOCK_HOTEL_REVIEWS;
  }
}

// 获取酒店房型
export async function getHotelRoomTypes(hotelId: string): Promise<RoomType[]> {
  try {
    const response = await apiClient.get(`/hotels/${hotelId}/room-types`);
    return response.data;
  } catch (error) {
    console.error('Failed to get hotel room types:', error);
    // 返回模拟数据
    return MOCK_ROOMS;
  }
}

// 获取酒店设施
export async function getHotelFacilities(hotelId: string): Promise<Facility[]> {
  try {
    const response = await apiClient.get(`/hotels/${hotelId}/facilities`);
    return response.data;
  } catch (error) {
    console.error('Failed to get hotel facilities:', error);
    // 返回模拟数据
    return MOCK_HOTEL_FACILITIES;
  }
}

// 获取搜索建议
export async function getSearchSuggestions(keyword: string): Promise<string[]> {
  try {
    const response = await apiClient.get('/hotels/suggestions', {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get search suggestions:', error);
    // 返回模拟数据
    return MOCK_SEARCH_SUGGESTIONS;
  }
}

// 搜索酒店
export async function searchHotels(params: SearchParams): Promise<Hotel[]> {
  try {
    const response = await apiClient.get('/hotels/search', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to search hotels:', error);
    // 返回模拟数据，匹配后端返回结构
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 转换为后端返回格式并映射为Hotel类型
    return MOCK_HOTELS.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      imageUrl: hotel.image,
      price: hotel.price,
      rating: 4.5,
      location: hotel.location,
      starLevel: hotel.starLevel,
      reviewCount: 100,
      distance: '距离市中心3公里',
      mapUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hotel%20location%20map%20view&image_size=landscape_16_9'
    }));
  }
}
