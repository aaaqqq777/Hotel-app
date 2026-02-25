import { apiClient } from '../config'; // 这个现在应该使用 /api 前缀并被代理到后端
import type { RoomType,HotelDetail ,HotelSearchParams} from '../../types/hotel';
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
//   roomCount?: string | number;
//   guestCount?: string | number;
//   checkInDate?: string;
//   checkOutDate?: string;
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

// 搜索酒店列表 (使用后端接口 GET /api/hotels)
export async function searchHotelList(params: HotelSearchParams): Promise<HotelListResponse> {
  console.log('🔍 searchHotelList API调用参数:', params);
  try {
    const response = await apiClient.get('/api/hotels', { params });
    console.log('✅ searchHotelList API响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to search hotel list:', error);
    
    // ========== 模拟数据处理 ==========
    const page = params.page || 1;
    const limit = params.pageSize || 10;
    
    // 根据参数过滤
    let filteredHotels = [...MOCK_HOTELS];
    
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.name.toLowerCase().includes(keyword) ||
        hotel.location.address.toLowerCase().includes(keyword)
      );
    }
    
    if (params.starLevels) {
      // const star = parseInt(params.starLevels);
      filteredHotels = filteredHotels.filter(hotel => hotel.starLevel === params.starLevels);
    }
    
    // 价格筛选
    if (params.minPrice || params.maxPrice) {
      const minPrice = params.minPrice ? params.minPrice : 0;
      const maxPrice = params.maxPrice ? params.maxPrice : Infinity;
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.price.lowest >= minPrice && hotel.price.lowest <= maxPrice
      );
    }
    

    
    // 排序 
    if (params.sortBy !== '') {
      switch (params.sortBy) {
        case 'price':
          filteredHotels.sort((a, b) => a.price.lowest - b.price.lowest);
          break;
        case 'distance':
          filteredHotels.sort((a, b) => a.location.lat*a.location.lat+a.location.lng*a.location.lng - b.location.lat*b.location.lat-b.location.lng*b.location.lng);
          break;
        case 'rating':
          filteredHotels.sort((a, b) => b.rating - a.rating);
          break;
        case 'star':
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
          score: hotel.rating,
          cover_image: hotel.coverImage,
          min_price: hotel.price.lowest,
          original_price: hotel.price.original,
          discount: hotel.price.discount,
          location: {
            address: hotel.location.address,
            city: hotel.location.city,
            district: '',
            lat: hotel.location.lat,
            lng: hotel.location.lng,
            distance: hotel.location.distance
          },
          room_availability: {
            has_available_room: hotel.roomAvailability.hasAvailableRoom,
            lowest_room_price: hotel.roomAvailability.lowestRoomPrice
          },
          review_count: hotel.reviewCount,
          tags: hotel.tags
        }))
      }
    };
  }
}

// 获取酒店详情
export async function getHotelDetail(hotelId: string): Promise<HotelDetail> {
  try {
    const response = await apiClient.get(`/api/hotels/${hotelId}`);
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
      starLevel: 5,
      brand: "豪华品牌",
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: '',
      description: '豪华酒店位于上海市中心，交通便利，设施齐全，服务周到，是商务旅行和休闲度假的理想选择。',
      location: {
        address: '上海市静安区南京西路1268号',
        lat: 31.230393,
        lng: 121.473701
      },
      contact: {
        phone: '021-12345678'
      },
      checkInTime: '15:00',
      checkOutTime: '12:00',
      facilities: [],
      rating: 4.5,
      reviewCount: 100
    };
  }
}

// 后端房型数据结构


// 获取酒店房型
export async function getHotelRoomTypes(hotelId: string): Promise<RoomType[]> {
  try {
    const response = await apiClient.get(`/api/hotels/${hotelId}/room-types`);
    
    // 转换后端数据为 RoomType 格式
    const backendData: RoomType[] = response.data;
    
    return backendData.map(room => ({
      ...room,
      image: room.image || '', // 确保 image 字段存在
    }));
  } catch (error) {
    console.error('Failed to get hotel room types:', error);
    // 返回模拟数据 - 根据酒店ID返回对应房型
    return MOCK_ROOMS_BY_HOTEL[hotelId] || [];
  }
}
