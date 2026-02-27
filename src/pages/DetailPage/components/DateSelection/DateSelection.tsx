import { useState, useMemo } from 'react';
import { Popup ,Button} from 'antd-mobile';
import PeriodCalendar from '../../../../components/PeriodCalendar/PeriodCalendar';
import styles from './DateSelection.module.css';

interface DateSelectionProps {
  checkInDate: string;
  checkOutDate: string;
  onDateChange?: (checkIn: string, checkOut: string) => void;
  roomCount?: number;
  guestCount?: number;
  onRoomGuestChange?: (roomCount: number, guestCount: number) => void;
}

export default function DateSelection({ checkInDate, checkOutDate, onDateChange, roomCount, guestCount, onRoomGuestChange }: DateSelectionProps) {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date(checkInDate));
  const [endDate, setEndDate] = useState<Date | null>(new Date(checkOutDate));
  const [roomGuestVisible, setRoomGuestVisible] = useState(false);
  const [roomnum, setRoomCount] = useState(roomCount || 1);
  const [guestnum, setGuestCount] = useState(guestCount || 1);
  const getDayOfWeek = (date: Date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return '今天';
    if (isTomorrow(date)) return '明天';
    return getDayOfWeek(date);
  };

  const nights = useMemo(() => {
    if (startDate && endDate) {
      return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [startDate, endDate]);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setCalendarVisible(false);
      onDateChange?.(
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      );
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.dateSelector} onClick={() => setCalendarVisible(true)}>
        <div className={styles.dateBlock}>
          {startDate && (
            <div className={styles.dateMain}>
              <span className={styles.dateDay}>
                {startDate.getMonth() + 1}月{startDate.getDate()}日
              </span>
              <span className={styles.dateLabel}>{getDateLabel(startDate)}</span>
            </div>
          )}
        </div>

        <div className={styles.nightsBlock}>
          <span className={styles.nightsText}>{nights}晚</span>
        </div>

        <div className={styles.dateBlock}>
          {endDate && (
            <div className={styles.dateMain}>
              <span className={styles.dateDay}>
                {endDate.getMonth() + 1}月{endDate.getDate()}日
              </span>
              <span className={styles.dateLabel}>{getDateLabel(endDate)}</span>
            </div>
          )}
        </div>
        </div>
        <div className={styles.roomGuestRow}>
            <div className={styles.roomGuestButton} onClick={() => setRoomGuestVisible(true)}>
              {/* <span className={styles.roomGuestLabel}>房间</span> */}
              <span className={styles.roomGuestValue}>{roomnum}</span>
              <span className={styles.roomGuestLabel}>间</span>
              <span className={styles.roomGuestDivider}>/</span>
              {/* <span className={styles.roomGuestLabel}>人数</span> */}
              <span className={styles.roomGuestValue}>{guestnum}</span>
              <span className={styles.roomGuestLabel}>人</span>
            </div>
          </div>
        

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
      <Popup
          visible={roomGuestVisible}
          onMaskClick={() => setRoomGuestVisible(false)}
          position="bottom"
          className={styles.roomGuestPopup}
        >
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>房间与人数</h3>
            <div className={styles.roomGuestSection}>
              <div className={styles.roomGuestTitle}>房间数</div>
              <div className={styles.numberStepper}>
                <Button
                  fill="none"
                  size="small"
                  onClick={() => setRoomCount(prev => Math.max(1, prev - 1))}
                  disabled={roomnum <= 1}
                >
                  -
                </Button>
                <span className={styles.numberValue}>{roomnum}</span>
                <Button
                  fill="none"
                  size="small"
                  onClick={() => setRoomCount(prev => Math.min(10, prev + 1))}
                  disabled={roomnum >= 10}
                >
                  +
                </Button>
              </div>
            </div>
            <div className={styles.roomGuestSection}>
              <div className={styles.roomGuestTitle}>出行人数</div>
              <div className={styles.numberStepper}>
                <Button
                  fill="none"
                  size="small"
                  onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                  disabled={guestnum <= 1}
                >
                  -
                </Button>
                <span className={styles.numberValue}>{guestnum}</span>
                <Button
                  fill="none"
                  size="small"
                  onClick={() => setGuestCount(prev => Math.min(20, prev + 1))}
                  disabled={guestnum >= 20}
                >
                  +
                </Button>
              </div>
            </div>
            <Button
              color="primary"
              block
              size="large"
              onClick={() => {
                setRoomGuestVisible(false);
                onRoomGuestChange?.(roomnum, guestnum);
              }}
              style={{ marginTop: 24 }}
            >
              确定
            </Button>
          </div>
        </Popup>
    </div>
  );
}