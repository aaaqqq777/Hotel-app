import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  getHotelDetail,
  getHotelRoomTypes,
  searchHotelList,
  type HotelListResponse,
} from '../api/hotelsearch/hotelsearch';
import type { HotelSearchParams as ApiHotelListParams } from '../types/hotel';

import { getAdvertisements } from '../api/advertisement/advertisement';

export type { ApiHotelListParams as HotelListParams, HotelListResponse };

export const queryKeys = {
  hotelList: (params: any) => ['hotels', 'list', params],
  hotelDetail: (hotelId: string) => ['hotels', 'detail', hotelId],
  hotelRoomTypes: (hotelId: string) => ['hotels', 'roomTypes', hotelId],
  advertisements: ['advertisements'],
};

export function useHotelDetail(hotelId: string) {
  return useQuery({
    queryKey: queryKeys.hotelDetail(hotelId),
    queryFn: () => getHotelDetail(hotelId),
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


export function useAdvertisements() {
  return useQuery({
    queryKey: queryKeys.advertisements,
    queryFn: () => getAdvertisements(),
  });
}



export function useHotelList(params: ApiHotelListParams) {
  return useQuery({
    queryKey: queryKeys.hotelList(params),
    queryFn: async () => {
      try {
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
        
        // 过滤掉无效的酒店数据并转换为前端期望的格式
        const validHotels = response.data.list?.filter((hotel: any) => 
          hotel && hotel._id
        ).map((hotel: any) => {
          // 将API响应格式转换为前端组件期望的格式
          return {
            id: hotel._id || '',
            name: hotel.name_cn || '未知酒店',
            coverImage: hotel.cover_image || '',
            images: [hotel.cover_image || ''], // 添加图片数组
            starLevel: hotel.star_rating || 0,
            rating: hotel.score || 0,
            reviewCount: hotel.review_count || 0,
            price: {
              lowest: hotel.min_price || 0,
              original: hotel.original_price,
              discount: hotel.discount
            },
            location: {
              city: hotel.location?.city || params.city || '上海',
              address: hotel.location?.address || hotel.location?.district || '未知位置',
              lat: hotel.location?.lat || 0,
              lng: hotel.location?.lng || 0,
              distance: hotel.location?.distance
            },
            roomAvailability: {
              hasAvailableRoom: hotel.room_availability?.has_available_room || true,
              lowestRoomPrice: hotel.room_availability?.lowest_room_price
            },
            tags: hotel.tags || []
          };
        }) || [];
        
        return {
          ...response,
          data: {
            ...response.data,
            list: validHotels
          }
        };
      } catch (error) {
        console.error('获取酒店列表失败:', error);
        // 返回模拟数据
        try {
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
          
          // 过滤掉无效的酒店数据并转换为前端期望的格式
            const validHotels = response.data.list?.filter((hotel: any) => 
              hotel && hotel._id
            ).map((hotel: any) => {
              // 将API响应格式转换为前端组件期望的格式
              return {
                id: hotel._id || '',
                name: hotel.name_cn || '未知酒店',
                coverImage: hotel.cover_image || '',
                images: [hotel.cover_image || ''], // 添加图片数组
                starLevel: hotel.star_rating || 0,
                rating: hotel.score || 0,
                reviewCount: hotel.review_count || 0,
                price: {
                  lowest: hotel.min_price || 0,
                  original: hotel.original_price,
                  discount: hotel.discount
                },
                location: {
                  city: hotel.location?.city || params.city || '上海',
                  address: hotel.location?.address || hotel.location?.district || '未知位置',
                  lat: hotel.location?.lat || 0,
                  lng: hotel.location?.lng || 0,
                  distance: hotel.location?.distance
                },
                roomAvailability: {
                  hasAvailableRoom: hotel.room_availability?.has_available_room || true,
                  lowestRoomPrice: hotel.room_availability?.lowest_room_price
                },
                tags: hotel.tags || []
              };
            }) || [];
            
            return {
              ...response,
              data: {
                ...response.data,
                list: validHotels
              }
            };
        } catch (innerError) {
          console.error('获取模拟数据也失败:', innerError);
          // 如果连模拟数据都失败了，返回空数据
          return {
            code: 200,
            data: {
              total: 0,
              list: []
            }
          };
        }
      }
    },
    staleTime: 2 * 60 * 1000, // 2分钟
    gcTime: 5 * 60 * 1000, // 5分钟 - React Query v5 使用 gcTime 替代 cacheTime
  });
}

export function useInfiniteHotelList(params: ApiHotelListParams) {
  return useInfiniteQuery({
    queryKey: ['hotels', 'infinite-list', params],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const pageNum = typeof pageParam === 'number' ? pageParam : parseInt(pageParam as string) || 1;
        const response = await searchHotelList({
          ...params,
          page: pageNum,
          pageSize: params.pageSize || 10,
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
        
        // 过滤掉无效的酒店数据并转换为前端期望的格式
        const validHotels = response.data.list?.filter((hotel: any) => 
          hotel && hotel._id
        ).map((hotel: any) => {
          // 将API响应格式转换为前端组件期望的格式
          return {
            id: hotel._id || '',
            name: hotel.name_cn || '未知酒店',
            coverImage: hotel.cover_image || '',
            images: [hotel.cover_image || ''], // 添加图片数组
            starLevel: hotel.star_rating || 0,
            rating: hotel.score || 0,
            reviewCount: hotel.review_count || 0,
            price: {
              lowest: hotel.min_price || 0,
              original: hotel.original_price,
              discount: hotel.discount
            },
            location: {
              city: hotel.location?.city || params.city || '上海',
              address: hotel.location?.address || hotel.location?.district || '未知位置',
              lat: hotel.location?.lat || 0,
              lng: hotel.location?.lng || 0,
              distance: hotel.location?.distance
            },
            roomAvailability: {
              hasAvailableRoom: hotel.room_availability?.has_available_room || true,
              lowestRoomPrice: hotel.room_availability?.lowest_room_price
            },
            tags: hotel.tags || []
          };
        }) || [];
        
        return {
          ...response,
          data: {
            ...response.data,
            list: validHotels
          }
        };
      } catch (error) {
        console.error('获取分页酒店列表失败:', error);
        // 不要抛出错误，而是返回模拟数据
        // 再次调用 searchHotelList 来获取模拟数据（因为错误处理逻辑在 searchHotelList 中）
        // 注意：searchHotelList 在捕获到错误时会自动返回模拟数据
        try {
          const pageNum = typeof pageParam === 'number' ? pageParam : parseInt(pageParam as string) || 1;
          const response = await searchHotelList({
            ...params,
            page: pageNum,
            pageSize: params.pageSize || 10,
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
          
          // 过滤掉无效的酒店数据并转换为前端期望的格式
            const validHotels = response.data.list?.filter((hotel: any) => 
              hotel && hotel._id
            ).map((hotel: any) => {
              // 将API响应格式转换为前端组件期望的格式
              return {
                id: hotel._id || '',
                name: hotel.name_cn || '未知酒店',
                coverImage: hotel.cover_image || '',
                images: [hotel.cover_image || ''], // 添加图片数组
                starLevel: hotel.star_rating || 0,
                rating: hotel.score || 0,
                reviewCount: hotel.review_count || 0,
                price: {
                  lowest: hotel.min_price || 0,
                  original: hotel.original_price,
                  discount: hotel.discount
                },
                location: {
                  city: hotel.location?.city || params.city || '上海',
                  address: hotel.location?.address || hotel.location?.district || '未知位置',
                  lat: hotel.location?.lat || 0,
                  lng: hotel.location?.lng || 0,
                  distance: hotel.location?.distance
                },
                roomAvailability: {
                  hasAvailableRoom: hotel.room_availability?.has_available_room || true,
                  lowestRoomPrice: hotel.room_availability?.lowest_room_price
                },
                tags: hotel.tags || []
              };
            }) || [];
            
            return {
              ...response,
              data: {
                ...response.data,
                list: validHotels
              }
            };
        } catch (innerError) {
          console.error('获取模拟数据也失败:', innerError);
          // 如果连模拟数据都失败了，返回空数据
          return {
            code: 200,
            data: {
              total: 0,
              list: []
            }
          };
        }
      }
    },
    getNextPageParam: (lastPage: any, allPages) => {
      const currentPage = allPages.length;
      const total = lastPage.data?.total || 0;
      const pageSize = params.pageSize || 10;
      const totalPages = Math.ceil(total / pageSize);
      
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2分钟
    gcTime: 5 * 60 * 1000, // 5分钟 - React Query v5 使用 gcTime 替代 cacheTime
    retry: 1, // 失败时重试1次
  });
}

export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateHotelList: (params: any) => queryClient.invalidateQueries({ queryKey: queryKeys.hotelList(params) }),
    invalidateHotelDetail: (hotelId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.hotelDetail(hotelId) }),
    invalidateHotelRoomTypes: (hotelId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.hotelRoomTypes(hotelId) }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
}
