import { useState, useMemo } from 'react';
import { Popup } from 'antd-mobile';
import PeriodCalendar from '../../../../components/PeriodCalendar/PeriodCalendar';
import styles from './DateSelection.module.css';

interface DateSelectionProps {
  checkInDate: string;
  checkOutDate: string;
  onDateChange?: (checkIn: string, checkOut: string) => void;
}

export default function DateSelection({ checkInDate, checkOutDate, onDateChange }: DateSelectionProps) {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date(checkInDate));
  const [endDate, setEndDate] = useState<Date | null>(new Date(checkOutDate));

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
    </div>
  );
}