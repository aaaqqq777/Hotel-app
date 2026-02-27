import styles from './DetailPage.module.css';
import Header from './components/Header/Header';
import ImageSection from './components/ImageSection/ImageSection';
import HotelDetails from './components/HotelDetails/HotelDetails';
import DateSelection from './components/DateSelection/DateSelection';
// import ServiceTags from './components/ServiceTags/ServiceTags';
import RoomList from './components/RoomList/RoomList';
import BottomBar from './components/BottomBar/BottomBar';
import { useDetailPage } from './useDetailPage';

function DetailPage() {
  const {
    currentHotelDetail,
    hotelRoomTypes,
    // serviceTags,
    minPrice,
    checkInDate,
    checkOutDate,
    roomCount,
    guestCount,
    handleroomCountChange,
    showBottomBar,
    roomListRef,
    handleRoomSelect,
    // handleServiceTagSelect,
    handleViewRooms,
    handleContactHotel,
    handleDateChange,
  } = useDetailPage();
  
  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <Header hotelName={currentHotelDetail.name} />

      {/* 所有内容统一在 content 内，共享左右边距 */}
      <div className={styles.content}>
        {/* 图片轮播 */}
        <ImageSection
          images={currentHotelDetail.images || []}
          videoUrl={currentHotelDetail.videoUrl}
        />

        {/* 酒店详情 */}
        <HotelDetails
          hotelName={currentHotelDetail.name}
          starRating={currentHotelDetail.star_rating}
          score={currentHotelDetail.score}
          reviewCount={currentHotelDetail.reviewCount || 0}
          address={currentHotelDetail.location?.address || ''}
          distance={''}
          tags={currentHotelDetail.tags?.map(tag => ({ icon: '', text: tag })) || []}
        />

        {/* 日期选择 */}
        <DateSelection
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          onDateChange={handleDateChange}
          roomCount={roomCount}
          guestCount={guestCount}
          onRoomGuestChange={handleroomCountChange}
        />
        {/* 服务标签 */}
        {/* <ServiceTags tags={serviceTags} onTagSelect={handleServiceTagSelect} /> */}

        {/* 房型列表 */}
        <div ref={roomListRef}>
          <RoomList rooms={hotelRoomTypes || []} onRoomSelect={handleRoomSelect} />
        </div>
      </div>

      {/* 底部栏 */}
      {/* <BottomBar
        minPrice={minPrice}
        onViewRooms={handleViewRooms}
        onContactHotel={handleContactHotel}
        visible={showBottomBar}
      /> */}
      <BottomBar
        minPrice={minPrice}
        onViewRooms={handleViewRooms}
        onContactHotel={handleContactHotel}
        visible={showBottomBar}
        hotelPhone={currentHotelDetail.contact?.phone || '010-23182712'}
      />
    </div>
  );
}

export default DetailPage;