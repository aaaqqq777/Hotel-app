import { searchHotelList, type HotelListResponse } from '../hotel/hotelSearch';
import type { HotelSearchParams } from '../../types/hotel';
import type { HotelListItem } from '../../types/hotel';

// 定义用于URL查询参数的类型（字符串类型）
export interface HotelListQueryParams {
  city: string;
  keyword?: string;
  checkInDate?: string;
  checkOutDate?: string;
  star?: string;
  sort?: string;
  page?: string;
  limit?: string;
  roomCount?: string;
  guestCount?: string;
  lat?: string;
  lng?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
}

// 获取酒店列表
export async function fetchHotelList(params: HotelListQueryParams): Promise<{ hotels: HotelListItem[], total: number, hasMore: boolean }> {
  console.log('🔍 fetchHotelList 调用参数 (URL参数格式):', params);
  try {
    // 将查询参数转换为API所需格式（转换为数字类型）
    const apiParams: HotelSearchParams = {
      city: params.city,
      keyword: params.keyword,
      checkInDate: params.checkInDate || '',
      checkOutDate: params.checkOutDate || '',
      page: parseInt(params.page || '1'),
      pageSize: parseInt(params.limit || '10'),
      roomCount: params.roomCount ? parseInt(params.roomCount) : undefined,
      guestCount: params.guestCount ? parseInt(params.guestCount) : undefined,
      // 转换其他参数
      lat: params.lat ? parseFloat(params.lat) : undefined,
      lng: params.lng ? parseFloat(params.lng) : undefined,
      minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
      sortBy: params.sortBy as any || undefined,
      sortOrder: params.sortOrder as any || undefined,
    };
    
    console.log('🔍 fetchHotelList 转换后的API参数:', apiParams);
    const response: HotelListResponse = await searchHotelList(apiParams);
    
    // 数据转换：将API响应格式转换为前端组件期望的格式
    const hotels: HotelListItem[] = response.data.list.map(item => ({
      id: item._id,
      name: item.name_cn,
      coverImage: item.cover_image,
      images: [item.cover_image], // 添加图片数组
      starLevel: item.star_rating,
      rating: item.score,
      reviewCount: item.review_count || 0,
      price: {
        lowest: item.min_price,
        original: item.original_price,
        discount: item.discount
      },
      location: {
        city: item.location?.city || params.city || '上海',
        address: item.location?.address || item.location?.district || '地址不详',
        lat: item.location?.lat || 0,
        lng: item.location?.lng || 0,
        distance: item.location?.distance
      },
      roomAvailability: {
        hasAvailableRoom: item.room_availability?.has_available_room || true,
        lowestRoomPrice: item.room_availability?.lowest_room_price
      },
      tags: item.tags || []
    }));

    const currentPage = parseInt(params.page || '1');
    const currentLimit = parseInt(params.limit || '10');
    const hasMore = (currentPage * currentLimit) < response.data.total;

    return {
      hotels,
      total: response.data.total,
      hasMore
    };
  } catch (error) {
    console.error('Failed to fetch hotel list:', error);
    throw error;
  }
}

// 获取下一页酒店列表
export async function fetchNextPageHotelList(params: HotelListQueryParams, currentPage: number): Promise<{ hotels: HotelListItem[], total: number, hasMore: boolean }> {
  console.log('🔍 fetchNextPageHotelList 调用参数 (URL参数格式):', params, '当前页:', currentPage);
  try {
    const nextPageParams = {
      ...params,
      page: (currentPage + 1).toString(),
    };

    console.log('🔍 fetchNextPageHotelList 下一页参数:', nextPageParams);
    return await fetchHotelList(nextPageParams);
  } catch (error) {
    console.error('Failed to fetch next page hotel list:', error);
    throw error;
  }
}