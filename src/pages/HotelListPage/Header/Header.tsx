import { Button, Popup, Input, Stepper, Space } from 'antd-mobile';
import { EnvironmentOutline, LeftOutline, SearchOutline } from 'antd-mobile-icons';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PeriodCalendar from '../../../components/PeriodCalendar/PeriodCalendar';
import LocationPicker from '../../../components/LocationPick/LocationPick';

interface HeaderProps {
  location?: string;
  checkInDate?: string;
  roomCount?: number;
  guestCount?: number;
  keyword?: string;
  lat?: number;
  lng?: number;
  onDateChange?: (startDate: Date, endDate: Date) => void;
  onCityChange?: (city: string) => void;
  onRoomCountChange?: (count: number) => void;
  onGuestCountChange?: (count: number) => void;
  onKeywordChange?: (keyword: string) => void;
  onLocationChange?: (location: { lat: number; lng: number; city: string; address: string }) => void;
}

export default function Header({
  location,
  checkInDate,
  roomCount = 1,
  guestCount = 1,
  onDateChange,
  onCityChange,
  onRoomCountChange,
  onGuestCountChange,
  onKeywordChange,
  onLocationChange,
}: HeaderProps) {
  const navigate = useNavigate();

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [cityVisible, setCityVisible] = useState(false);
  const [roomVisible, setRoomVisible] = useState(false);
  const [tempRoomCount, setTempRoomCount] = useState(roomCount);
  const [tempGuestCount, setTempGuestCount] = useState(guestCount);
  const [keyword, setKeyword] = useState('');

  // 新增：地图选点弹窗
  const [mapVisible, setMapVisible] = useState(false);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    if (end) setCalendarVisible(false);
    if (onDateChange) onDateChange(start || new Date(), end || new Date());
  };

  const handleCitySelect = (city: string) => {
    setCityVisible(false);
    onCityChange?.(city);
  };

  const handleRoomOpen = () => {
    setTempRoomCount(roomCount);
    setTempGuestCount(guestCount);
    setRoomVisible(true);
  };

  const handleRoomConfirm = () => {
    onRoomCountChange?.(tempRoomCount);
    onGuestCountChange?.(tempGuestCount);
    setRoomVisible(false);
  };

  const handleRoomCancel = () => {
    setTempRoomCount(roomCount);
    setTempGuestCount(guestCount);
    setRoomVisible(false);
  };

  const handleKeywordBlur = () => {
    if (keyword.trim()) {
      onKeywordChange?.(keyword);
    } else {
      onKeywordChange?.('');
    }
  };

  // 新增：地图选点确认
  const handleMapConfirm = (loc: { lat: number; lng: number; address?: string; city?: string }) => {
    setMapVisible(false);
    const city = loc.city || '';
    const address = loc.address || '';

    // 更新城市（用真实城市名，而不是"当前位置"）
    if (city) {
      onCityChange?.(city);
    }

    // 通知父组件坐标和地址信息
    onLocationChange?.({
      lat: loc.lat,
      lng: loc.lng,
      city,
      address,
    });
  };

  const parseDateRange = (dateStr: string) => {
    if (!dateStr) return { checkIn: '', checkOut: '' };
    const match = dateStr.match(/住(\d+\/\d+) 离(\d+\/\d+)/);
    if (match) {
      return {
        checkIn: match[1].replace('/', '.'),
        checkOut: match[2].replace('/', '.'),
      };
    }
    return { checkIn: '', checkOut: '' };
  };

  const { checkIn, checkOut } = parseDateRange(checkInDate || '');

  return (
    <div className={styles.container}>
      <Button fill="none" onClick={() => navigate(-1)} className={styles.backButton}>
        <LeftOutline />
      </Button>

      <div className={styles.newSearchSummary}>
        {location && (
          <div className={styles.locationSection} onClick={() => setCityVisible(true)}>
            <span className={styles.locationText}>{location}</span>
          </div>
        )}

        {location && checkInDate && <div className={styles.divider} />}

        <div className={styles.dateSection} onClick={() => setCalendarVisible(true)}>
          <div className={styles.dateItem}>住 {checkIn}</div>
          <div className={styles.dateItem}>离 {checkOut}</div>
        </div>

        <div className={styles.divider} />

        <div className={styles.roomSection} onClick={handleRoomOpen}>
          <div className={styles.textContainer}>
            <span className={styles.roomCount}>{roomCount}间</span>
            <span className={styles.guestCount}>{guestCount}人</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.searchSection}>
          <SearchOutline className={styles.searchIcon} />
          <Input
            type="text"
            className={styles.searchInput}
            placeholder="位置/酒店/关键词"
            value={keyword}
            onChange={setKeyword}
            onBlur={handleKeywordBlur}
            clearable
          />
        </div>
      </div>

      {/* 地图按钮 → 打开选点弹窗 */}
      <div className={styles.right}>
        <button className={styles.mapButton} onClick={() => setMapVisible(true)}>
          <EnvironmentOutline />
        </button>
      </div>

      {/* 日历弹窗 */}
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

      {/* 城市弹窗 */}
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
              {['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '重庆'].map(city => (
                <Button key={city} fill="outline" onClick={() => handleCitySelect(city)}>
                  {city}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Popup>

      {/* 房间/人数弹窗 */}
      <Popup
        visible={roomVisible}
        onMaskClick={handleRoomCancel}
        position="bottom"
        bodyStyle={{ minHeight: '200px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
      >
        <div className={styles.roomPopupContent}>
          <h3 className={styles.roomPopupTitle}>房间与入住人数</h3>
          <div className={styles.roomOptionRow}>
            <span className={styles.roomOptionLabel}>房间数</span>
            <Stepper value={tempRoomCount} min={1} max={10} onChange={setTempRoomCount} />
          </div>
          <div className={styles.roomOptionRow}>
            <span className={styles.roomOptionLabel}>入住人数</span>
            <Stepper value={tempGuestCount} min={1} max={20} onChange={setTempGuestCount} />
          </div>
          <div className={styles.roomButtonGroup}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button fill="outline" color="primary" onClick={handleRoomCancel}>取消</Button>
              <Button color="primary" onClick={handleRoomConfirm}>确认</Button>
            </Space>
          </div>
        </div>
      </Popup>

      {/* 地图选点弹窗 */}
      <Popup
        visible={mapVisible}
        onMaskClick={() => setMapVisible(false)}
        position="bottom"
        bodyStyle={{ height: '85vh', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
        destroyOnClose
      >
        {mapVisible && (
          <LocationPicker
            onConfirm={handleMapConfirm}
            onCancel={() => setMapVisible(false)}
          />
        )}
      </Popup>
    </div>
  );
}