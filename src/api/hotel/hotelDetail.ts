import { apiClient } from '../config';
import type { HotelDetail, RoomType } from '../../types/hotel';
import { MOCK_HOTEL_DETAILS } from '../../data/MOCK/hotelDetail';
import { MOCK_ROOMS_BY_HOTEL } from '../../data/MOCK/hotels';

export async function getHotelDetail(hotelId: string): Promise<HotelDetail> {
  try {
    const response = await apiClient.get(`/api/hotels/${hotelId}`);
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ 酒店详情请求失败，使用 mock 数据:', error);
      const detail = MOCK_HOTEL_DETAILS[hotelId];
      if (detail) return detail;

      return {
        id: hotelId,
        name: `豪华酒店 ${hotelId}`,
        starLevel: 5,
        brand: '豪华品牌',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
        ],
        videoUrl: '',
        description: '豪华酒店位于上海市中心，交通便利，设施齐全。',
        location: {
          address: '上海市静安区南京西路1268号',
          lat: 31.230393,
          lng: 121.473701,
        },
        contact: { phone: '021-12345678' },
        checkInTime: '15:00',
        checkOutTime: '12:00',
        facilities: [],
        rating: 4.5,
        reviewCount: 100,
      };
    }
    console.error('❌ getHotelDetail 请求失败:', error);
    throw error;
  }
}

export async function getHotelRoomTypes(hotelId: string): Promise<RoomType[]> {
  try {
    console.log(`🔄 [API] 请求房型数据: /api/hotels/${hotelId}/room-types`);
    const response = await apiClient.get(`/api/hotels/${hotelId}/room-types`);
    const rooms = Array.isArray(response.data) ? response.data : response.data?.data || [];
    
    console.log(`✅ [API] 从后端获取 ${rooms.length} 个房型`);
    
    return rooms.map((room: any) => ({
      ...room,
      image: room.image || '',
      price: {
        current: room.price?.current || 0,
        original: room.price?.original,
        discount: room.price?.discount,
      },
      availability: {
        remaining: room.availability?.remaining ?? 0,
        isSoldOut: room.availability?.isSoldOut ?? false,
      },
    }));
  } catch (error) {
    console.error(`❌ [API] 房型请求失败:`, error);
    
    // 始终使用 mock 数据作为后备方案（开发和生产）
    console.warn(`⚠️ [MOCK] 尝试加载酒店 ${hotelId} 的 mock 房型数据...`);
    console.log(`[DEBUG] MOCK_ROOMS_BY_HOTEL 数据:`, MOCK_ROOMS_BY_HOTEL);
    
    const mockRooms = MOCK_ROOMS_BY_HOTEL[hotelId];
    
    if (mockRooms && Array.isArray(mockRooms) && mockRooms.length > 0) {
      console.log(`✅ [MOCK] 成功返回 ${mockRooms.length} 个房型 (酒店ID: ${hotelId})`);
      return mockRooms;
    }
    
    console.warn(`❌ [MOCK] 酒店 ${hotelId} 找不到 mock 房型数据。可用的酒店ID:`, Object.keys(MOCK_ROOMS_BY_HOTEL));
    return [];
  }
}