import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { HotelSearchParams } from '../../../types/hotel';

function parse(searchParams: URLSearchParams): HotelSearchParams {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const score = searchParams.get('score') ? parseFloat(searchParams.get('score')!) : undefined;
  
  return {
    city:         searchParams.get('city') || '上海',
    keyword:      searchParams.get('keyword') || undefined,
    checkInDate:  searchParams.get('checkInDate') || fmt(today),
    checkOutDate: searchParams.get('checkOutDate') || fmt(tomorrow),
    minPrice:     searchParams.get('minPrice')   ? Number(searchParams.get('minPrice'))   : undefined,
    maxPrice:     searchParams.get('maxPrice')   ? Number(searchParams.get('maxPrice'))   : undefined,
    starLevels:   searchParams.get('starLevels') ? Number(searchParams.get('starLevels')) : undefined,
    brands:       searchParams.get('brands')     ? searchParams.get('brands')!.split(',') : undefined,
    roomCount:    searchParams.get('roomCount')  ? Number(searchParams.get('roomCount'))  : 1,
    guestCount:   searchParams.get('guestCount') ? Number(searchParams.get('guestCount')) : 1,
    sortBy:       (searchParams.get('sortBy') as HotelSearchParams['sortBy']) || undefined,
    sortOrder:    (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    page:         searchParams.get('page')     ? Number(searchParams.get('page'))     : 1,
    pageSize:     searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10,
    lat:          searchParams.get('lat') ? Number(searchParams.get('lat')) : undefined,
    lng:          searchParams.get('lng') ? Number(searchParams.get('lng')) : undefined,
    score,
  };
}

export function useHotelSearchParamFromURL() {
  const [searchParams] = useSearchParams();
  const [params, setParams] = useState<HotelSearchParams>(() => parse(searchParams));

  useEffect(() => {
    setParams(parse(searchParams));
  }, [searchParams]);

  return params;
}