// import { apiClient } from '../config';
import { api as apiClient} from '../index';
import type { HotelDetail, RoomType } from '../../types/hotel';
import { MOCK_HOTEL_DETAILS } from '../../data/MOCK/hotelDetail';
import { MOCK_ROOMS_BY_HOTEL } from '../../data/MOCK/hotels';
//注释请问api;;
export async function getHotelDetail(hotelId: string): Promise<HotelDetail> {
  try {
    const response = await apiClient.get(`/api/hotels/${hotelId}`);
// // const response = await apiClient.get(`/api/hotels/699ea83b3323af91f345bc90/`);
    // const response = await apiClient.get(`/api/hotels`);
    console.log('🔍 getHotelDetail 原始响应:', response.data);  // ← 加这行
    // const hotel = response.data?.data?.hotel;
    const hotel = response.data?.hotel || response.data?.data?.hotel;
    if (!hotel) {
      throw new Error('hotel data missing');
    }

    // service 层 getHotelDetail 返回补充
    return {
      id: hotel._id,
      name: hotel.name_cn,
      brand: hotel.brand,
      star_rating: hotel.star_rating,
      hotelType: hotel.hotel_type,          // 新增

      coverImage: hotel.cover_image,        // 新增：单独保留封面
      images: [
        hotel.cover_image,
        ...(hotel.detail_images || []),
      ].filter(Boolean),

      videoUrl: '',
      description: hotel.services?.join('，') || '',

      location: {
        address: hotel.address,
        city: hotel.city,                    // 新增
        district: hotel.district,            // 新增
        businessZone: hotel.business_zone,   // 新增
        lat: hotel.location?.coordinates?.[1] ?? 0,
        lng: hotel.location?.coordinates?.[0] ?? 0,
      },

      contact: { phone: '' },
      checkInTime: '15:00',
      checkOutTime: '12:00',

      facilities: hotel.services || [],
      services: hotel.services || [],        // 新增
      tags: hotel.tags || [],                // 新增
      reviewTags: hotel.review_tags || [],   // 新增
      minPrice: hotel.min_price,             // 新增
      discount: hotel.discount,              // 新增

      score: hotel.score ?? 0,
      reviewCount: hotel.review_count ?? 0,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ 酒店详情请求失败，使用 mock 数据:', error);
      const detail = MOCK_HOTEL_DETAILS[hotelId];
      if (detail) return detail;
    }
    throw error;
  }
}
export async function getHotelRoomTypes(hotelId: string): Promise<RoomType[]> {
  try {
    const response = await apiClient.get(`/api/rooms/hotel/${hotelId}/published`);
    
    // const response = await apiClient.get(`/api/rooms/hotel/${hotelId}`);
    console.log('🔍 getHotelRoomTypes 原始响应:', response.data);

    // const rooms = response.data?.data?.list || [];

    // 改后
    const rooms = response.data?.list || response.data?.data?.list || [];
    return rooms.map((room: any) => ({
      id: room._id,
      name: room.title,
      image: room.images?.[0] || '',
      images: room.images || [],
      description: `${room.bed_type} ${room.area}m² ${room.max_guests}人入住`,
      tags: [
        room.breakfast,
        room.window_status,
        room.has_bathtub ? '有浴缸' : null,
      ].filter(Boolean),
      price: {
        current: room.price || 0,
        original: room.original_price,
        discount: room.original_price ? room.price / room.original_price : undefined,
      },
      availability: {
        remaining: room.total_count ?? 0,
        isSoldOut: room.total_count === 0,
      },
      facilities: room.facilities || [],
      bedType: room.bed_type,
      area: room.area,
      maxGuests: room.max_guests,
    }));
  } catch (error) {
    console.error(`❌ [API] 房型请求失败:`, error);
    
    console.warn(`⚠️ [MOCK] 尝试加载酒店 ${hotelId} 的 mock 房型数据...`);
    const mockRooms = MOCK_ROOMS_BY_HOTEL[hotelId];
    
    if (mockRooms && Array.isArray(mockRooms) && mockRooms.length > 0) {
      console.log(`✅ [MOCK] 成功返回 ${mockRooms.length} 个房型`);
      return mockRooms;
    }
    
    return [];
  }
}