// src/hooks/useHotelSearch.ts
import { useQuery } from '@tanstack/react-query';
import { hotelApi } from '../api/modules';
import type { HotelListParams } from '../api/modules/hotel';
import type { Hotel } from '../data/types';
import { useCallback } from 'react';

// 主页搜索数据类型定义
export interface HomeSearchData {
  searchType: 'domestic' | 'overseas' | 'hourly' | 'bnb';
  city?: string;
  country?: string;
  keyword?: string;
  dates?: [Date, Date];
  brand?: string;
  priceRange?: [number, number];
  tags?: string[];
  roomCount?: number;
  guestCount?: number;
}

// 将主页搜索数据转换为API参数
const convertHomeSearchToApiParams = (searchData: Partial<HomeSearchData>): HotelListParams => {
  const params: HotelListParams = {
    city: searchData.city || '上海',
    roomCount: searchData.roomCount || 1,
    guestCount: searchData.guestCount || 1,
  };

  // 添加日期参数
  if (searchData.dates) {
    const [startDate, endDate] = searchData.dates;
    params.startDate = startDate.toISOString().split('T')[0];
    params.endDate = endDate.toISOString().split('T')[0];
  }

  // 添加关键词
  if (searchData.keyword) {
    params.keyword = searchData.keyword;
  }

  // 添加品牌筛选
  if (searchData.brand && searchData.brand !== '不限') {
    // 假设品牌信息存储在star字段中
    params.star = searchData.brand;
  }

  // 添加价格范围
  if (searchData.priceRange) {
    const [min, max] = searchData.priceRange;
    if (min > 0) params.minPrice = min.toString();
    if (max > 0) params.maxPrice = max.toString();
  }

  return params;
};

// 使用主页搜索数据获取酒店列表
export const useHotelSearch = (searchData: Partial<HomeSearchData>) => {
  const apiParams = convertHomeSearchToApiParams(searchData);

  return useQuery({
    queryKey: ['home-search-hotels', apiParams],
    queryFn: async () => {
      try {
        const response = await hotelApi.searchHotels(apiParams);
        
        // 转换API响应数据为本地Hotel类型
        if (response.data?.list) {
          const convertedList: Hotel[] = response.data.list.map(item => ({
            id: item._id,
            name: item.name_cn,
            location: item.location?.address || item.location?.district || '',
            price: item.min_price,
            starLevel: item.star_rating,
            image: item.cover_image,
            tags: [],
            description: `${item.name_cn}，提供优质住宿体验`,
            rating: item.score || 0,
            reviewCount: Math.floor(Math.random() * 3000) + 100,
            hotelType: item.star_rating >= 5 ? '豪华型' : item.star_rating >= 4 ? '舒适型' : '经济型',
            locationInfo: `${item.location?.district || '市区'} | 近商圈`,
            hasVideo: Math.random() > 0.5,
            discountPrice: item.min_price * 0.85,
            discountAmount: item.min_price * 0.15,
            discountTag: '立减券'
          }));

          return {
            total: response.data.total,
            list: convertedList
          };
        }
        
        return { total: 0, list: [] };
      } catch (error) {
        console.error('主页搜索酒店失败:', error);
        // 返回空数据作为兜底
        return { total: 0, list: [] };
      }
    },
    staleTime: 2 * 60 * 1000, // 2分钟内视为新鲜数据
    retry: 1, // 失败时重试1次
    enabled: !!searchData.city || !!searchData.country, // 只有在有城市或国家信息时才启用查询
  });
};

// 主页搜索工具函数
export const useHomeSearchTools = () => {
  // 日期格式化函数
  const formatDate = useCallback((date: Date): string => {
    return date.toISOString().split('T')[0];
  }, []);

  // 验证和设置默认搜索数据
  const validateAndDefaultData = useCallback((data: Partial<HomeSearchData>) => {
    const validatedData = { ...data };
    
    // 确保国内搜索有城市值
    if (validatedData.searchType === 'domestic' && !validatedData.city) {
      validatedData.city = '上海';
    }
    
    // 确保有日期范围（钟点房除外）
    if (validatedData.searchType !== 'hourly' && !validatedData.dates) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      validatedData.dates = [today, tomorrow];
    }

    // 确保房间数和人数有默认值
    if (!validatedData.roomCount) validatedData.roomCount = 1;
    if (!validatedData.guestCount) validatedData.guestCount = 1;
    
    return validatedData;
  }, []);

  return {
    formatDate,
    validateAndDefaultData
  };
};