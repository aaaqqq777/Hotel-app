
import { Button, Popup, Input } from 'antd-mobile';
import { EnvironmentOutline, LeftOutline, SearchOutline } from 'antd-mobile-icons';
import styles from './Header.module.css';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PeriodCalendar from '../../../components/PeriodCalendar/PeriodCalendar';
import RoomSelector from '../RoomSelector/RoomSelector';

interface HeaderProps {
  location?: string
  checkInDate?: string
  roomCount?: number
  guestCount?: number
  onDateChange?: (startDate: Date, endDate: Date) => void
  onCityChange?: (city: string) => void
  onRoomCountChange?: (count: number) => void
  onGuestCountChange?: (count: number) => void
  onOpenFilter?: () => void
}

export default function Header({ 
  location, 
  checkInDate, 
  roomCount , 
  guestCount, 
  onDateChange, 
  onCityChange,
  onRoomCountChange,
  onGuestCountChange
}: HeaderProps) {
  console.log('Header 组件接收 props:', { location, checkInDate, roomCount, guestCount });
  
  const navigate = useNavigate();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // 这里的函数只是为了示例，可以根据实际需要绑定不同的事件
  const handleMapClick = () => {
    console.log('用户点击了地图按钮');
    // 未来这里可能会打开一个地图模态框
    // onOpenMapModal(); 
  };
  
  const handleBackClick = () => {
    console.log('用户点击了返回按钮');
    // 执行路由返回
    navigate(-1); 
  };
  

  
  const handleDateClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止事件冒泡
    console.log('用户点击了日期');
    setCalendarVisible(true);
  };

  const handleCityClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止事件冒泡
    console.log('用户点击了城市');
    setCityVisible(true);
  };

  const handleCitySelect = (city: string) => {
    console.log('用户选择了城市:', city);
    setCityVisible(false);
    if (onCityChange) {
      onCityChange(city);
    }
  };
  
  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
    console.log('Selected dates:', { startDate, endDate });
    if (endDate) {
      setCalendarVisible(false);
    }
    if (onDateChange) {
      onDateChange(startDate || new Date(), endDate || new Date());
    }
  };
  
  // 解析日期字符串，提取入住和离店日期
  const parseDateRange = (dateStr: string) => {
    console.log('parseDateRange 开始解析日期:', dateStr);
    if (!dateStr) {
      console.log('日期字符串为空，返回空值');
      return { checkIn: '', checkOut: '' };
    }
    // 假设dateStr格式为"住MM/dd 离MM/dd"
    const match = dateStr.match(/住(\d+\/\d+) 离(\d+\/\d+)/);
    if (match) {
      const [, checkIn, checkOut] = match;
      // 将MM/dd格式转换为MM.dd格式
      const formattedCheckIn = checkIn.replace('/', '.');
      const formattedCheckOut = checkOut.replace('/', '.');
      console.log('格式化后的入住和离店日期:', formattedCheckIn, formattedCheckOut);
      return { checkIn: formattedCheckIn, checkOut: formattedCheckOut };
    }
    console.log('日期解析失败，返回空值');
    return { checkIn: '', checkOut: '' };
  };

  const { checkIn, checkOut } = parseDateRange(checkInDate || '');
  console.log('解析后的日期:', { checkIn, checkOut });

  return (
    <div className={styles.container}>
      {/* 返回按钮 */}
      <Button 
        fill="none" 
        onClick={handleBackClick}
        className={styles.backButton}
      >
        <LeftOutline />
      </Button>

      {/* 搜索摘要 - 新格式 */}
      <div className={styles.newSearchSummary}>
        {/* 地点部分 */}
        {location && (
          <div className={styles.locationSection} onClick={handleCityClick}>
            <span className={styles.locationText}>{location}</span>
          </div>
        )}

        {/* 分隔线 */}
        {(location && checkInDate) && <div className={styles.divider} />}

        {/* 日期部分 */}
        {(
          <div className={styles.dateSection} onClick={handleDateClick}>
            <div className={styles.dateItem}>住 {checkIn}</div>
            <div className={styles.dateItem}>离 {checkOut}</div>
          </div>
        )}

        {/* 分隔线 */}
        {(checkInDate || location) && <div className={styles.divider} />}

        {/* 房间选择部分 */}
        <RoomSelector 
          roomCount={roomCount ?? 1}
          guestCount={guestCount ?? 1}
          onRoomCountChange={onRoomCountChange || (() => {})} 
          onGuestCountChange={onGuestCountChange || (() => {})} 
        />

        {/* 分隔线 */}
        <div className={styles.divider} />

        {/* 搜索框部分 */}
        <div className={styles.searchSection}>
          <SearchOutline className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="位置/酒店/关键词"
          />
        </div>
      </div>

      {/* 地图按钮 */}
      <div className={styles.right}>
        <button className={styles.mapButton} onClick={handleMapClick}>
          <EnvironmentOutline />
        </button>
      </div>
      
      {/* 日历选择弹窗 */}
      <Popup
        visible={calendarVisible}
        onMaskClick={() => setCalendarVisible(false)}
        position="bottom"
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <div style={{ padding: '16px' }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 16px 0' }}>选择日期</h3>
          <PeriodCalendar 
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
        </div>
      </Popup>

      {/* 城市选择弹窗 */}
      <Popup
        visible={cityVisible}
        onMaskClick={() => setCityVisible(false)}
        position="bottom"
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '70%' }}
      >
        <div style={{ padding: '16px' }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 16px 0' }}>选择城市</h3>
          <Input placeholder="搜索城市" />
          <div style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>热门城市</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '重庆'].map((cityItem) => (
                <Button 
                  key={cityItem}
                  fill="outline"
                  onClick={() => handleCitySelect(cityItem)}
                  style={{ margin: '2px' }}
                >
                  {cityItem}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

