import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { searchHotelList } from '../api/hotel/hotelSearch';      // ← 修正
import { getHotelDetail, getHotelRoomTypes } from '../api/hotel/hotelDetail'; // ← 修正
import type { HotelListResponse } from '../api/hotel/hotelSearch';
import type { HotelSearchParams } from '../types/hotel';
import type { HotelListItem } from '../types/hotel';
import { getAdvertisements } from '../api/advertisement/advertisement';

export type { HotelSearchParams as HotelListParams, HotelListResponse };

// ─── 后端字段 → HotelListItem（唯一一份，不再重复） ───────────────────
// function mapHotel(hotel: any, city: string): HotelListItem {
//   return {
//     id:          hotel._id || '',
//     name:        hotel.name_cn || '未知酒店',
//     coverImage:  hotel.cover_image || '',
//     images:      [hotel.cover_image || ''],
//     starLevel:   hotel.star_rating || 0,
//     rating:      hotel.score || 0,
//     reviewCount: hotel.review_count || 0,
//     price: {
//       lowest:   hotel.min_price || 0,
//       original: hotel.original_price,
//       discount: hotel.discount,
//     },
//     location: {
//       city:     hotel.location?.city || city,
//       address:  hotel.location?.address || hotel.location?.district || '未知位置',
//       lat:      hotel.location?.lat || 0,
//       lng:      hotel.location?.lng || 0,
//       distance: hotel.location?.distance,
//     },
//     roomAvailability: {
//       hasAvailableRoom: hotel.room_availability?.has_available_room ?? true,
//       lowestRoomPrice:  hotel.room_availability?.lowest_room_price,
//     },
//     tags: hotel.tags || [],
//   };
// }
function mapHotel(hotel: any, city: string): HotelListItem {
  const rooms = Array.isArray(hotel.available_rooms)
    ? hotel.available_rooms.filter(
        (r: any) => r.status === 1 && r.is_published === true
      )
    : [];

  const lowestRoomPrice =
    rooms.length > 0
      ? Math.min(...rooms.map((r: any) => r.price))
      : undefined;

  return {
    id: hotel._id,
    name: hotel.name_cn,

    coverImage: hotel.cover_image,
    images: hotel.detail_images || [],

    starLevel: hotel.star_rating || 0,
    rating: hotel.score || 0,
    reviewCount: hotel.review_count || 0,

    price: {
      lowest: hotel.min_price || lowestRoomPrice || 0,
      discount: hotel.discount,
      original: rooms[0]?.original_price,
    },

    location: {
      city: hotel.city || city,
      address: hotel.address,
      lat: hotel.location?.coordinates?.[1] ?? 0,
      lng: hotel.location?.coordinates?.[0] ?? 0,
    },

    roomAvailability: {
      hasAvailableRoom: rooms.length > 0,
      lowestRoomPrice,
    },

    tags: hotel.tags || [],
  };
}
function mapResponse(response: HotelListResponse, city: string) {
  return {
    ...response,
    data: {
      ...response.data,
      list: (response.data?.list || [])
        .filter((h: any) => h && h._id)
        .map((h: any) => mapHotel(h, city)),
    },
  };
}

// ─── Query Keys ───────────────────────────────────────────────────────
export const queryKeys = {
  hotelList:     (params: any)    => ['hotels', 'list', params],
  hotelDetail:   (hotelId: string) => ['hotels', 'detail', hotelId],
  hotelRoomTypes:(hotelId: string) => ['hotels', 'roomTypes', hotelId],
  advertisements: ['advertisements'],
};

// ─── Hooks ────────────────────────────────────────────────────────────
// export function useHotelDetail(hotelId: string) {
//   return useQuery({
//     queryKey: queryKeys.hotelDetail(hotelId),

//     queryFn:  () => getHotelDetail(hotelId),
//   });
// }
export function useHotelDetail(hotelId: string) {
  return useQuery({
    queryKey: queryKeys.hotelDetail(hotelId),
    queryFn: () => {
      console.log('🔍 请求酒店详情，hotelId:', hotelId);  // ← 加这行
      return getHotelDetail(hotelId);
    },
  });
}

export function useHotelRoomTypes(hotelId: string, autoRefresh = false) {
  return useQuery({
    queryKey: queryKeys.hotelRoomTypes(hotelId),
    queryFn:  () => getHotelRoomTypes(hotelId),
    refetchInterval:           autoRefresh ? 30000 : false,
    refetchIntervalInBackground: autoRefresh,
  });
}

export function useAdvertisements() {
  return useQuery({
    queryKey: queryKeys.advertisements,
    queryFn:  () => getAdvertisements(),
  });
}

export function useHotelList(params: HotelSearchParams) {
  return useQuery({
    queryKey: queryKeys.hotelList(params),
    queryFn:  async () => {
      const response = await searchHotelList(params); // 内部已处理 mock 兜底
      return mapResponse(response, params.city);
    },
    staleTime: 2 * 60 * 1000,
    gcTime:    5 * 60 * 1000,
  });
}

export function useInfiniteHotelList(params: HotelSearchParams) {
  return useInfiniteQuery({
    queryKey:       ['hotels', 'infinite-list', params],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const page = typeof pageParam === 'number' ? pageParam : parseInt(String(pageParam)) || 1;
      const response = await searchHotelList({
        ...params,
        page,
        pageSize: params.pageSize || 10,
      });
      return mapResponse(response, params.city);
    },
    getNextPageParam: (lastPage: any, allPages) => {
      const total     = lastPage.data?.total || 0;
      const pageSize  = params.pageSize || 10;
      const totalPages = Math.ceil(total / pageSize);
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000,
    gcTime:    5 * 60 * 1000,
    retry: 1,
  });
}

export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  return {
    invalidateHotelList:      (params: any)    => queryClient.invalidateQueries({ queryKey: queryKeys.hotelList(params) }),
    invalidateHotelDetail:    (hotelId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.hotelDetail(hotelId) }),
    invalidateHotelRoomTypes: (hotelId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.hotelRoomTypes(hotelId) }),
    invalidateAll:            ()               => queryClient.invalidateQueries(),
  };
}