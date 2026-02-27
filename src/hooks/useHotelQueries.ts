import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { searchHotelList } from '../api/hotel/hotelSearch';      // ← 修正
import { getHotelDetail, getHotelRoomTypes } from '../api/hotel/hotelDetail'; // ← 修正
import type { HotelListResponse } from '../api/hotel/hotelSearch';
import type { HotelSearchParams } from '../types/hotel';
import type { HotelListItem } from '../types/hotel';
import { getAdvertisements } from '../api/advertisement/advertisement';

export type { HotelSearchParams as HotelListParams, HotelListResponse };

// ─── mapHotel：返回类型是单个 HotelListItem ───────────────────
function mapHotel(hotel: any, city: string): HotelListItem {
  console.log('mapHotel', hotel);
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
    score: hotel.score || 0,
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
    services: hotel.services || [],
    tags: hotel.tags || [],
  };
}

// ─── mapResponse：匹配后端 {total, page, limit, totalPages, list} ──

function mapResponse(response: any, city: string) {
  const list = Array.isArray(response.list) ? response.list : [];
  return {
    total:      response.total ?? 0,
    totalPages: response.totalPages ?? 1,
    list: list
      .filter((h: any) => h && h._id)
      .map((h: any) => mapHotel(h, city)),
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
      const totalPages = lastPage.totalPages || 1;
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