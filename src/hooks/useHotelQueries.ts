import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  getHotelDetail,
  getHotelReviews,
  getHotelRoomTypes,
  getHotelFacilities,
  searchHotels,
  searchHotelList,
  type HotelListParams as ApiHotelListParams,
  type HotelListResponse,
} from '../api/hotelsearch/hotelsearch';
import type { SearchParams } from '../types/hotel';
import { getAdvertisements } from '../api/advertisement/advertisement';

export type { ApiHotelListParams as HotelListParams, HotelListResponse };

export const queryKeys = {
  hotelList: (params: any) => ['hotels', 'list', params],
  hotelDetail: (hotelId: string) => ['hotels', 'detail', hotelId],
  hotelReviews: (hotelId: string, page?: number, pageSize?: number) => ['hotels', 'reviews', hotelId, page, pageSize],
  hotelRoomTypes: (hotelId: string) => ['hotels', 'roomTypes', hotelId],
  hotelFacilities: (hotelId: string) => ['hotels', 'facilities', hotelId],
  advertisements: ['advertisements'],
  search: (params: SearchParams) => ['hotels', 'search', params],
};

export function useHotelDetail(hotelId: string) {
  return useQuery({
    queryKey: queryKeys.hotelDetail(hotelId),
    queryFn: () => getHotelDetail(hotelId),
  });
}

export function useHotelReviews(hotelId: string, page?: number, pageSize?: number) {
  return useQuery({
    queryKey: queryKeys.hotelReviews(hotelId, page, pageSize),
    queryFn: () => getHotelReviews(hotelId, page, pageSize),
  });
}

export function useHotelRoomTypes(hotelId: string, autoRefresh = false) {
  return useQuery({
    queryKey: queryKeys.hotelRoomTypes(hotelId),
    queryFn: () => getHotelRoomTypes(hotelId),
    refetchInterval: autoRefresh ? 30000 : false,
    refetchIntervalInBackground: autoRefresh,
  });
}

export function useHotelFacilities(hotelId: string) {
  return useQuery({
    queryKey: queryKeys.hotelFacilities(hotelId),
    queryFn: () => getHotelFacilities(hotelId),
  });
}

export function useAdvertisements() {
  return useQuery({
    queryKey: queryKeys.advertisements,
    queryFn: () => getAdvertisements(),
  });
}

export function useSearchHotels(params: SearchParams) {
  return useQuery({
    queryKey: queryKeys.search(params),
    queryFn: () => searchHotels(params),
    enabled: !!params,
  });
}

export function useHotelList(params: HotelListParams) {
  return useQuery({
    queryKey: queryKeys.hotelList(params),
    queryFn: async () => {
      const response = await searchHotelList(params);
      
      // 确保响应数据结构正确
      if (!response.data) {
        return {
          code: response.code || 200,
          data: {
            total: 0,
            list: []
          }
        };
      }
      
      // 过滤掉无效的酒店数据
      const validHotels = response.data.list?.filter((hotel: any) => 
        hotel && hotel._id
      ) || [];
      
      return {
        ...response,
        data: {
          ...response.data,
          list: validHotels
        }
      };
    },
    staleTime: 2 * 60 * 1000, // 2分钟
    cacheTime: 5 * 60 * 1000, // 5分钟
  });
}

export function useInfiniteHotelList(params: HotelListParams) {
  return useInfiniteQuery({
    queryKey: ['hotels', 'infinite-list', params],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await searchHotelList({
          ...params,
          page: pageParam.toString(),
          limit: params.limit || '10',
        });
        
        // 确保响应数据结构正确
        if (!response.data) {
          return {
            code: response.code || 200,
            data: {
              total: 0,
              list: []
            }
          };
        }
        
        // 过滤掉无效的酒店数据
        const validHotels = response.data.list?.filter((hotel: any) => 
          hotel && hotel._id
        ) || [];
        
        return {
          ...response,
          data: {
            ...response.data,
            list: validHotels
          }
        };
      } catch (error) {
        console.error('获取分页酒店列表失败:', error);
        // 抛出错误让React Query能够正确处理错误状态
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const total = lastPage.data?.total || 0;
      const limit = parseInt(params.limit || '10');
      const totalPages = Math.ceil(total / limit);
      
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2分钟
    cacheTime: 5 * 60 * 1000, // 5分钟
    retry: 1, // 失败时重试1次
  });
}

export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateHotelList: (params: any) => queryClient.invalidateQueries({ queryKey: queryKeys.hotelList(params) }),
    invalidateHotelDetail: (hotelId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.hotelDetail(hotelId) }),
    invalidateHotelRoomTypes: (hotelId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.hotelRoomTypes(hotelId) }),
    invalidateSearch: (params: SearchParams) => queryClient.invalidateQueries({ queryKey: queryKeys.search(params) }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
}
