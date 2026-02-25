import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useHotelDetail,
  useHotelRoomTypes
} from '../../hooks/useHotelQueries';
import { MOCK_SERVICES } from '../../data/MOCK/hotelDetail';
import type { HotelDetail } from '../../types/hotel';

/** 默认酒店详情（数据未加载时的占位） */
const DEFAULT_HOTEL_DETAIL: HotelDetail = {
  id: '0',
  name: '加载中...',
  starLevel: 0,
  brand: '',
  images: [],
  videoUrl: '',
  description: '酒店详情加载中...',
  location: {
    address: '地址加载中...',
    lat: 0,
    lng: 0,
  },
  contact: {
    phone: '',
  },
  checkInTime: '15:00',
  checkOutTime: '12:00',
  facilities: [],
  rating: 0,
  reviewCount: 0,
};

export function useDetailPage() {
  // ───────── URL 参数 ─────────
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get('id') || '1';

  // ───────── 日期状态 ─────────
  const [checkInDate] = useState('2026-02-20');
  const [checkOutDate] = useState('2026-02-21');

  // ───────── 底部栏显隐 ─────────
  const [showBottomBar, setShowBottomBar] = useState(true);
  const lastScrollTopRef = useRef(0);

  // ───────── DOM Refs ─────────
  const roomListRef = useRef<HTMLDivElement>(null);

  // ───────── API 数据 ─────────
  const { data: hotelDetail } = useHotelDetail(hotelId);
  const {
    data: hotelRoomTypes,
    isLoading: isLoadingRooms,
    error: roomsError,
  } = useHotelRoomTypes(hotelId);

  // ───────── 进入页面时滚动到顶部 ─────────
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ───────── 调试日志 ─────────
  useEffect(() => {
    console.log(`[DetailPage] hotelId: ${hotelId}`);
    console.log(`[DetailPage] hotelRoomTypes:`, hotelRoomTypes);
    console.log(`[DetailPage] isLoadingRooms:`, isLoadingRooms);
    console.log(`[DetailPage] roomsError:`, roomsError);
  }, [hotelId, hotelRoomTypes, isLoadingRooms, roomsError]);

  // ───────── 滚动监听 ─────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTopRef.current && scrollTop > 100) {
        setShowBottomBar(false);
      } else {
        setShowBottomBar(true);
      }

      lastScrollTopRef.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ───────── 事件处理 ─────────
  const handleRoomSelect = useCallback((roomId: string) => {
    console.log('Selected room:', roomId);
  }, []);

  const handleServiceTagSelect = useCallback((tagId: string) => {
    console.log('Selected service tag:', tagId);
  }, []);

  const handleViewRooms = useCallback(() => {
    roomListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleContactHotel = useCallback(() => {
    console.log('Contact hotel');
  }, []);

  // ───────── 派生数据 ─────────
  const currentHotelDetail = hotelDetail || DEFAULT_HOTEL_DETAIL;

  const minPrice = useMemo(() => {
    if (hotelRoomTypes && hotelRoomTypes.length > 0) {
      return Math.min(...hotelRoomTypes.map((room) => room.price.current));
    }
    return 0;
  }, [hotelRoomTypes]);

  const serviceTags = MOCK_SERVICES;

  return {
    // 数据
    currentHotelDetail,
    hotelRoomTypes,
    serviceTags,
    minPrice,
    checkInDate,
    checkOutDate,
    showBottomBar,

    // Refs
    roomListRef,

    // 事件处理
    handleRoomSelect,
    handleServiceTagSelect,
    handleViewRooms,
    handleContactHotel,
  };
}