import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchHotelList, fetchNextPageHotelList, type HotelListQueryParams } from '../../../api/modules/hotelList';
import type { HotelListItem } from '../../../types/hotel';

export function useHotelListData() {
  const [searchParams] = useSearchParams();
  
  // 从URL参数获取搜索参数
  const location = searchParams.get('city') || searchParams.get('location') || '上海';
  const keyword = searchParams.get('keyword') || '';
  const tagsStr = searchParams.get('tags') || '';
  const datesStr = searchParams.get('dates') || '';
  const roomCountParam = searchParams.get('roomCount') || '1';
  const guestCountParam = searchParams.get('guestCount') || '1';
  
  // 状态管理
  const [hotels, setHotels] = useState<HotelListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [pageSize] = useState(5);
  const [roomCount, setRoomCount] = useState<number>(1);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // 解析日期参数
  const formattedDateRange = useMemo(() => {
    // 首先尝试从单独的checkInDate和checkOutDate参数获取
    const checkInDateParam = searchParams.get('checkInDate');
    const checkOutDateParam = searchParams.get('checkOutDate');
    
    if (checkInDateParam && checkOutDateParam) {
      try {
        const checkIn = new Date(checkInDateParam);
        const checkOut = new Date(checkOutDateParam);
        if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime())) {
          const formatDate = (date: Date) => {
            return `${date.getMonth() + 1}/${date.getDate()}`;
          };
          return `住${formatDate(checkIn)} 离${formatDate(checkOut)}`;
        }
      } catch (error) {
        console.error('Failed to parse checkInDate/checkOutDate:', error);
      }
    }
    
    // 如果单独的日期参数不可用，尝试解析dates数组格式
    if (!checkInDateParam || !checkOutDateParam) {
      if (datesStr) {
        try {
          const dates = JSON.parse(datesStr);
          if (Array.isArray(dates) && dates.length === 2) {
            const checkIn = new Date(dates[0]);
            const checkOut = new Date(dates[1]);
            if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime())) {
              const formatDate = (date: Date) => {
                return `${date.getMonth() + 1}/${date.getDate()}`;
              };
              return `住${formatDate(checkIn)} 离${formatDate(checkOut)}`;
            }
          }
        } catch (error) {
          console.error('Failed to parse dates array:', error);
        }
      }
    }
    
    return '';
  }, [datesStr, searchParams]);
  
  // 合并搜索参数中的标签和用户选中的快捷标签
  const allSelectedTags = useMemo(() => {
    let searchTags: string[] = [];
    try {
      searchTags = JSON.parse(tagsStr);
      if (!Array.isArray(searchTags)) {
        searchTags = [];
      }
    } catch (error) {
      searchTags = tagsStr ? tagsStr.split(',').filter(Boolean) : [];
    }
    return [...new Set([...searchTags, ...selectedTags])]
  }, [tagsStr, selectedTags])
  
  // 同步URL参数到本地状态
  useEffect(() => {
    const roomCountFromUrl = parseInt(roomCountParam) || 1;
    const guestCountFromUrl = parseInt(guestCountParam) || 1;
    setRoomCount(roomCountFromUrl);
    setGuestCount(guestCountFromUrl);
  }, [roomCountParam, guestCountParam]);
  
  // 构建API参数
  const buildApiParams = useCallback((): HotelListQueryParams => {
    // 从URL参数获取日期 - 尝试两种格式：dates数组格式或单独的checkInDate/checkOutDate
    let checkInDate = searchParams.get('checkInDate') || '';
    let checkOutDate = searchParams.get('checkOutDate') || '';
    
    // 如果没有单独的日期参数，尝试解析dates数组格式
    if (!checkInDate || !checkOutDate) {
      if (datesStr) {
        try {
          const dates = JSON.parse(datesStr);
          if (Array.isArray(dates) && dates.length === 2) {
            checkInDate = dates[0];
            checkOutDate = dates[1];
          }
        } catch (error) {
          console.error('Failed to parse dates array for API params:', error);
        }
      }
    }
    
    const params: HotelListQueryParams = {
      city: location,
      keyword: keyword || undefined,
      checkInDate,
      checkOutDate,
      page: '1',
      limit: pageSize.toString(),
      roomCount: roomCount.toString(),
      guestCount: guestCount.toString(),
    };
    
    console.log('🔍 buildApiParams 生成的参数:', params);
    return params;
  }, [location, keyword, datesStr, pageSize, roomCount, guestCount, searchParams]);
  
  // 加载第一页数据
  const loadFirstPage = useCallback(async () => {
    console.log('🔍 loadFirstPage 开始加载第一页');
    setIsLoading(true);
    setIsInitialLoading(true);
    try {
      const apiParams = buildApiParams();
      console.log('🔍 loadFirstPage 调用API参数:', apiParams);
      const result = await fetchHotelList(apiParams);
      console.log('🔍 loadFirstPage API响应结果:', result);
      
      setHotels(result.hotels);
      setCurrentPage(1);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load hotels:', error);
      setHotels([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [buildApiParams]);
  
  // 加载更多数据
  const loadMoreHotels = useCallback(async () => {
    console.log('🔍 loadMoreHotels 开始加载更多数据', { isLoading, hasMore, currentPage });
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const apiParams = buildApiParams();
      console.log('🔍 loadMoreHotels 调用API参数:', apiParams, '当前页:', currentPage);
      const result = await fetchNextPageHotelList(apiParams, currentPage);
      console.log('🔍 loadMoreHotels API响应结果:', result);
      
      setHotels(prev => [...prev, ...result.hotels]);
      setCurrentPage(prev => prev + 1);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load more hotels:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, buildApiParams, currentPage]);
  
  // 提供访问状态和方法的接口
  return {
    hotels,
    isLoading,
    isInitialLoading,
    hasMore,
    loadFirstPage,
    loadMoreHotels,
    location,
    keyword,
    formattedDateRange,
    roomCount,
    guestCount,
    setRoomCount,
    setGuestCount,
    selectedTags,
    setSelectedTags,
    allSelectedTags,
  };
}