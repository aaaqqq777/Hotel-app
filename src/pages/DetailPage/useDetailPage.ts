import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  star_rating: 0,
  brand: '',
  hotelType: '',
  coverImage: '',
  images: [],
  videoUrl: '',
  description: '酒店详情加载中...',
  location: {
    address: '地址加载中...',
    city: '',
    district: '',
    businessZone: '',
    lat: 0,
    lng: 0,
  },
  contact: { phone: '' },
  checkInTime: '15:00',
  checkOutTime: '12:00',
  facilities: [],
  services: [],
  tags: [],
  reviewTags: [],
  score: 0,
  reviewCount: 0,
};
export function useDetailPage() {
  // useDetailPage.ts 中
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get('id') || '1';

  // 从 URL 读取日期，有默认值
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [checkInDate, setCheckInDate] = useState(
    searchParams.get('checkInDate') || today.toISOString().split('T')[0]
  );
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams.get('checkOutDate') || tomorrow.toISOString().split('T')[0]
  );
  const [roomCount, setRoomCount] = useState(
    parseInt(searchParams.get('roomCount') || '1', 10)
  );
  const [guestCount, setGuestCount] = useState(
    parseInt(searchParams.get('guestCount') || '1', 10)
  );
  const navigate = useNavigate(); // 需要导入
  const handleroomCountChange = useCallback((roomCount: number, guestCount: number) => {
    setRoomCount(roomCount);
    setGuestCount(guestCount);
    // 同步到 URL
    const sp = new URLSearchParams(window.location.search);
    sp.set('roomCount', roomCount.toString());
    sp.set('guestCount', guestCount.toString());
    navigate(`/detailpage?${sp.toString()}`, { replace: true });
  }, [navigate]);

  const handleDateChange = useCallback((checkIn: string, checkOut: string) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
    // 同步到 URL
    const sp = new URLSearchParams(window.location.search);
    sp.set('checkInDate', checkIn);
    sp.set('checkOutDate', checkOut);
    navigate(`/detailpage?${sp.toString()}`, { replace: true });
  }, [navigate]);

 
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
    roomCount,
    guestCount,
    // Refs
    roomListRef,

    // 事件处理
    handleRoomSelect,
    handleServiceTagSelect,
    handleViewRooms,
    handleContactHotel,
    handleDateChange,
    handleroomCountChange};
}