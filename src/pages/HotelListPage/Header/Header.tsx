import { Button, Popup, Input, Stepper, Space } from 'antd-mobile';
import { EnvironmentOutline, LeftOutline, SearchOutline } from 'antd-mobile-icons';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PeriodCalendar from '../../../components/PeriodCalendar/PeriodCalendar';

interface HeaderProps {
  location?: string;
  checkInDate?: string;
  roomCount?: number;
  guestCount?: number;
  onDateChange?: (startDate: Date, endDate: Date) => void;
  onCityChange?: (city: string) => void;
  onRoomCountChange?: (count: number) => void;
  onGuestCountChange?: (count: number) => void;
  onOpenFilter?: () => void;
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
}: HeaderProps) {
  const navigate = useNavigate();

  // 日历弹窗
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 城市弹窗
  const [cityVisible, setCityVisible] = useState(false);

  // 房间/人数弹窗（原 RoomSelector 状态）
  const [roomVisible, setRoomVisible] = useState(false);
  const [tempRoomCount, setTempRoomCount] = useState(roomCount);
  const [tempGuestCount, setTempGuestCount] = useState(guestCount);

  // ── 日历 ────────────────────────────────────────────────
  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    if (end) setCalendarVisible(false);
    if (onDateChange) onDateChange(start || new Date(), end || new Date());
  };

  // ── 城市 ────────────────────────────────────────────────
  const handleCitySelect = (city: string) => {
    setCityVisible(false);
    onCityChange?.(city);
  };

  // ── 房间/人数 ────────────────────────────────────────────
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

  // ── 日期解析显示 ─────────────────────────────────────────
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
      {/* 返回按钮 */}
      <Button fill="none" onClick={() => navigate(-1)} className={styles.backButton}>
        <LeftOutline />
      </Button>

      {/* 搜索摘要栏 */}
      <div className={styles.newSearchSummary}>
        {/* 城市 */}
        {location && (
          <div className={styles.locationSection} onClick={() => setCityVisible(true)}>
            <span className={styles.locationText}>{location}</span>
          </div>
        )}

        {location && checkInDate && <div className={styles.divider} />}

        {/* 日期 */}
        <div className={styles.dateSection} onClick={() => setCalendarVisible(true)}>
          <div className={styles.dateItem}>住 {checkIn}</div>
          <div className={styles.dateItem}>离 {checkOut}</div>
        </div>

        <div className={styles.divider} />

        {/* 房间/人数（原 RoomSelector） */}
        <div className={styles.roomSection} onClick={handleRoomOpen}>
          <div className={styles.textContainer}>
            <span className={styles.roomCount}>{roomCount}间</span>
            <span className={styles.guestCount}>{guestCount}人</span>
          </div>
        </div>

        <div className={styles.divider} />

        {/* 关键词搜索 */}
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
        <button className={styles.mapButton}>
          <EnvironmentOutline />
        </button>
      </div>

      {/* ── 日历弹窗 ── */}
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

      {/* ── 城市弹窗 ── */}
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

      {/* ── 房间/人数弹窗（原 RoomSelector Popup） ── */}
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
    </div>
  );
}