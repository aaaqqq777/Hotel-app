import styles from './DetailPage.module.css';
import Header from './components/Header/Header';
import ImageSection from './components/ImageSection/ImageSection';
import HotelDetails from './components/HotelDetails/HotelDetails';
import DateSelection from './components/DateSelection/DateSelection';
import ServiceTags from './components/ServiceTags/ServiceTags';
import RoomList from './components/RoomList/RoomList';
import BottomBar from './components/BottomBar/BottomBar';
import { useDetailPage } from './useDetailPage';

function DetailPage() {
  const {
    currentHotelDetail,
    hotelRoomTypes,
    serviceTags,
    minPrice,
    checkInDate,
    checkOutDate,
    showBottomBar,
    roomListRef,
    handleRoomSelect,
    handleServiceTagSelect,
    handleViewRooms,
    handleContactHotel,
  } = useDetailPage();

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
          address={currentHotelDetail.location?.address || ''}
          distance={''}
          tags={[]}
        />

        {/* 日期选择 */}
        <DateSelection checkInDate={checkInDate} checkOutDate={checkOutDate} />

        {/* 服务标签 */}
        {/* <ServiceTags tags={serviceTags} onTagSelect={handleServiceTagSelect} /> */}

        {/* 房型列表 */}
        <div ref={roomListRef}>
          <RoomList rooms={hotelRoomTypes || []} onRoomSelect={handleRoomSelect} />
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomBar
        minPrice={minPrice}
        onViewRooms={handleViewRooms}
        onContactHotel={handleContactHotel}
        visible={showBottomBar}
      />
    </div>
  );
}

export default DetailPage;