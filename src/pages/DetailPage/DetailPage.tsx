import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './DetailPage.module.css';
import Header from './components/Header/Header';
import ImageSection from './components/ImageSection/ImageSection';
import HotelDetails from './components/HotelDetails/HotelDetails';
import HotelFacilities from './components/HotelFacilities/HotelFacilities';
import HotelReviews from './components/HotelReviews/HotelReviews';
import HotelLocation from './components/HotelLocation/HotelLocation';
import DateSelection from './components/DateSelection/DateSelection';
import RoomSelection from './components/RoomSelection/RoomSelection';
import ServiceTags from './components/ServiceTags/ServiceTags';
import RoomList from './components/RoomList/RoomList';
import BottomBar from './components/BottomBar/BottomBar';
import { useApiWithParams } from '../../hooks/useApi';
import {
  getHotelDetail,
  getHotelReviews,
  getHotelRoomTypes,
  getHotelFacilities
} from '../../api/hotelsearch/hotelsearch';
import { MOCK_SERVICES } from '../../data/hotelDetail';

function DetailPage() {
  // 获取URL参数
  const [searchParams] = useSearchParams();

  // 状态管理
  const [checkInDate] = useState('2026-02-20');
  const [checkOutDate] = useState('2026-02-21');
  const [selectedRoomId, setSelectedRoomId] = useState('1');

  // 获取酒店ID
  const hotelId = searchParams.get('id') || '1'; // 默认酒店ID为1

  // 使用API获取酒店数据
  const { data: hotelDetail, loading: detailLoading, error: detailError } = useApiWithParams(
    getHotelDetail,
    [hotelId]
  );

  const { data: hotelReviews } = useApiWithParams(
    getHotelReviews,
    [hotelId]
  );

  const { data: hotelRoomTypes } = useApiWithParams(
    getHotelRoomTypes,
    [hotelId]
  );

  const { data: hotelFacilities } = useApiWithParams(
    getHotelFacilities,
    [hotelId]
  );

  // 处理房型选择
  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    console.log('Selected room:', roomId);
  };

  // 处理服务标签选择
  const handleServiceTagSelect = (tagId: string) => {
    console.log('Selected service tag:', tagId);
  };

  // 处理查看房型
  const handleViewRooms = () => {
    console.log('View all rooms');
  };

  // 处理联系酒店
  const handleContactHotel = () => {
    console.log('Contact hotel');
  };

  // 为数据提供默认值，确保即使数据尚未加载，也能渲染组件布局
  const defaultHotelDetail = {
    id: '0',
    name: '加载中...',
    starLevel: 0,
    rating: 0,
    reviewCount: 0,
    address: '',
    distance: '',
    images: [],
    videoUrl: '',
    tags: [],
    minPrice: 0,
    mapUrl: ''
  };

  // 使用默认数据或真实数据
  const currentHotelDetail = hotelDetail || defaultHotelDetail;
  const currentHotelReviews = hotelReviews || [];
  const currentHotelRoomTypes = hotelRoomTypes || [];
  const currentHotelFacilities = hotelFacilities || [];

  // 服务标签（这里可以从API获取，目前使用默认值）
  const serviceTags = MOCK_SERVICES;

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <Header hotelName={currentHotelDetail.name} />

      {/* 图片展示 */}
      <ImageSection 
        images={currentHotelDetail.images || []} 
        videoUrl={currentHotelDetail.videoUrl} 
      />

      <div className={styles.content}>
        {/* 酒店详情 */}
        <HotelDetails 
          hotelName={currentHotelDetail.name} 
          starRating={currentHotelDetail.starLevel} 
          rating={currentHotelDetail.rating} 
          reviewCount={currentHotelDetail.reviewCount || 0} 
          address={currentHotelDetail.address} 
          distance={currentHotelDetail.distance || ''} 
          tags={currentHotelDetail.tags} 
        />

        {/* 酒店设施 */}
        <HotelFacilities facilities={currentHotelFacilities} />

        {/* 酒店评价 */}
        <HotelReviews 
          rating={currentHotelDetail.rating} 
          reviewCount={currentHotelDetail.reviewCount || 0} 
          reviews={currentHotelReviews} 
        />

        {/* 酒店位置 */}
        <HotelLocation 
          address={currentHotelDetail.address} 
          distance={currentHotelDetail.distance || ''} 
          mapUrl={currentHotelDetail.mapUrl} 
        />

        {/* 日期选择 */}
        <DateSelection checkInDate={checkInDate} checkOutDate={checkOutDate} />

        {/* 房型选择 */}
        <RoomSelection 
          roomTypes={currentHotelRoomTypes} 
          selectedRoomId={selectedRoomId} 
          onRoomSelect={handleRoomSelect} 
        />

        {/* 服务标签 */}
        <ServiceTags 
          tags={serviceTags} 
          onTagSelect={handleServiceTagSelect} 
        />

        {/* 房型列表 */}
        <RoomList 
          rooms={currentHotelRoomTypes} 
          onRoomSelect={handleRoomSelect} 
        />
      </div>

      {/* 底部导航栏 */}
      <BottomBar 
        minPrice={currentHotelDetail.minPrice || 0} 
        onViewRooms={handleViewRooms} 
        onContactHotel={handleContactHotel} 
      />
    </div>
  );
}

export default DetailPage;
