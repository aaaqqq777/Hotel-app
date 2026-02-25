import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { HotelSearchParams } from '../../../types/hotel';

export function useHotelSearchParamFromURL() {
  const [searchParams] = useSearchParams();
  
  // 从 URL 参数解析酒店搜索参数
  const parseSearchParams = (): HotelSearchParams => {
    const city = searchParams.get('city') || '上海';
    const keyword = searchParams.get('keyword') || undefined;
    const checkInDate = searchParams.get('checkInDate') || undefined;
    const checkOutDate = searchParams.get('checkOutDate') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    const starLevelsStr = searchParams.get('starLevels');
    const starLevels = starLevelsStr ? Number(starLevelsStr) : undefined;
    const brandsStr = searchParams.get('brands');
    const brands = brandsStr ? brandsStr.split(',') : undefined;

    const roomCount = searchParams.get('roomCount') ? parseInt(searchParams.get('roomCount')!) : 1;
    const guestCount = searchParams.get('guestCount') ? parseInt(searchParams.get('guestCount')!) : 1;
    const sortBy = searchParams.get('sortBy') as 'price' | 'distance' | 'rating' | 'star' | null || undefined;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 10;
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined;
    
    return {
      city,
      keyword,
      checkInDate: checkInDate || '',
      checkOutDate: checkOutDate || '',
      minPrice,
      maxPrice,
      starLevels,
      brands,
      roomCount,
      guestCount,
      sortBy,
      sortOrder,
      page,
      pageSize,
      lat,
      lng,
    };
  };

  const [params, setParams] = useState<HotelSearchParams>(() => parseSearchParams());

  useEffect(() => {
    setParams(parseSearchParams());
  }, [searchParams]);

  return params;
}