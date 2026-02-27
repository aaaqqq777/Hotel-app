import { useMemo, useState, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteHotelList } from '../../../hooks/useHotelQueries';
import type { HotelListItem } from '../../../types/hotel';
import { useHotelSearchParamFromURL } from './useHotelSearchParamFromURL';

export function useHotelListData() {
  const navigate = useNavigate();
  const urlParams = useHotelSearchParamFromURL();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // ── 用 react-query 替换手动 fetch ──────────────────────────
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading: isInitialLoading,
  } = useInfiniteHotelList(urlParams);
    // 把分页数据拍平成列表
  const hotels = useMemo<HotelListItem[]>(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.list ?? []);
  }, [data]);
  // console.log('获取到的酒店列表数据:', hotels);
  const hasMore = hasNextPage ?? false;
  const isLoading = isFetching || isFetchingNextPage;

  // ── 房间/人数写回 URL ──────────────────────────────────────
  const setRoomCount = useCallback((count: number) => {
    const sp = new URLSearchParams(window.location.search);
    sp.set('roomCount', String(count));
    navigate(`/hotellist?${sp.toString()}`, { replace: true });
  }, [navigate]);

  const setGuestCount = useCallback((count: number) => {
    const sp = new URLSearchParams(window.location.search);
    sp.set('guestCount', String(count));
    navigate(`/hotellist?${sp.toString()}`, { replace: true });
  }, [navigate]);

  // ── 格式化日期显示 ─────────────────────────────────────────
  const formattedDateRange = useMemo(() => {
    const fmt = (s: string) => {
      const d = new Date(s);
      return isNaN(d.getTime()) ? '' : `${d.getMonth() + 1}/${d.getDate()}`;
    };
    const checkIn  = fmt(urlParams.checkInDate);
    const checkOut = fmt(urlParams.checkOutDate);
    return checkIn && checkOut ? `住${checkIn} 离${checkOut}` : '';
  }, [urlParams.checkInDate, urlParams.checkOutDate]);

  return {
    hotels,
    isLoading,
    isInitialLoading,
    hasMore,
    // react-query 版本：加载更多直接调 fetchNextPage
    loadFirstPage:  () => {}, // 由 URL 参数变化自动触发，无需手动调用
    loadMoreHotels: fetchNextPage,
    location:    urlParams.city,
    keyword:     urlParams.keyword,
    formattedDateRange,
    roomCount:   urlParams.roomCount ?? 1,
    guestCount:  urlParams.guestCount ?? 1,
    setRoomCount,
    setGuestCount,
    selectedTags,
    setSelectedTags,
    allSelectedTags: selectedTags,
  };
}