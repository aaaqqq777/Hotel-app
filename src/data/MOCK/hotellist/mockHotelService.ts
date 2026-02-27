import type { HotelSearchParams } from '../../../types/hotel';
// import type { HotelListResponse } from '../../../api/hotel/hotelDetail';
import { MOCK_HOTELS } from '../hotels';

export interface HotelListResponse {
  code: number;
  data: {
    total: number;
    list:any[]; // 这里可以根据实际数据结构定义更具体的类型
  };
}

export function getMockHotelList(params: HotelSearchParams): HotelListResponse {
  const page = params.page || 1;
  const limit = params.pageSize || 10;

  let filteredHotels = [...MOCK_HOTELS];

  // // 关键词过滤
  // if (params.keyword) {
  //   const keyword = params.keyword.toLowerCase();
  //   filteredHotels = filteredHotels.filter(hotel =>
  //     hotel.name.toLowerCase().includes(keyword) ||
  //     hotel.location.address.toLowerCase().includes(keyword)
  //   );
  // }

  // 星级过滤
  if (params.star_rating) {
    filteredHotels = filteredHotels.filter(
      hotel => hotel.star_rating === params.star_rating
    );
  }

  // 价格过滤
  if (params.minPrice || params.maxPrice) {
    const min = params.minPrice ?? 0;
    const max = params.maxPrice ?? Infinity;
    filteredHotels = filteredHotels.filter(
      hotel => hotel.price.lowest >= min && hotel.price.lowest <= max
    );
  }

  // 品牌过滤
  if (params.brand?.length) {
    filteredHotels = filteredHotels.filter(
      hotel => hotel.name.includes(params.brand!)
    );
  }

  // 排序
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'min_price':
        filteredHotels.sort((a, b) =>
          params.sortOrder === 'desc'
            ? b.price.lowest - a.price.lowest
            : a.price.lowest - b.price.lowest
        );
        break;

      case 'distance':
        // 基于用户坐标计算距离
        if (params.lat && params.lng) {
          filteredHotels.sort((a, b) => {
            const distA =
              Math.pow(a.location.lat - params.lat!, 2) +
              Math.pow(a.location.lng - params.lng!, 2);
            const distB =
              Math.pow(b.location.lat - params.lat!, 2) +
              Math.pow(b.location.lng - params.lng!, 2);
            return distA - distB;
          });
        }
        break;

      case 'score':
        filteredHotels.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
        break;

      case 'star_rating':
        filteredHotels.sort((a, b) => b.star_rating - a.star_rating);
        break;
    }
  }

  // 分页
  const total = filteredHotels.length;
  const startIndex = (page - 1) * limit;
  const pageData = filteredHotels.slice(startIndex, startIndex + limit);

  // 模拟网络延迟（仅开发环境）—— 注意：调用方需要 await
  return {
    code: 200,
    data: {
      total,
      list: pageData.map(hotel => ({
        _id: hotel.id,
        name_cn: hotel.name,
        star_rating: hotel.star_rating,
        score: hotel.score,
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
          distance: hotel.location.distance,
        },
        room_availability: {
          has_available_room: hotel.roomAvailability.hasAvailableRoom,
          lowest_room_price: hotel.roomAvailability.lowestRoomPrice,
        },
        review_count: hotel.reviewCount,
        tags: hotel.tags,
      })),
    },
  };
}