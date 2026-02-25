import { useState, useMemo } from 'react';
import { Popup } from 'antd-mobile';
import PeriodCalendar from '../../../../components/PeriodCalendar/PeriodCalendar';
import styles from './DateSelection.module.css';

interface DateSelectionProps {
  checkInDate: string;
  checkOutDate: string;
}

export default function DateSelection({ checkInDate, checkOutDate }: DateSelectionProps) {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date(checkInDate));
  const [endDate, setEndDate] = useState<Date | null>(new Date(checkOutDate));

  // 获取星期几
  const getDayOfWeek = (date: Date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  };

  // 判断是否是今天
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 判断是否是明天
  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  // 获取日期标签（今天/明天/周几）
  const getDateLabel = (date: Date) => {
    if (isToday(date)) return '今天';
    if (isTomorrow(date)) return '明天';
    return getDayOfWeek(date);
  };

  // 计算住几晚
  const nights = useMemo(() => {
    if (startDate && endDate) {
      return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [startDate, endDate]);

  // 处理日期变化
  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    if (end) {
      setCalendarVisible(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 三列日期选择区 */}
      <div className={styles.dateSelector} onClick={() => setCalendarVisible(true)}>
        {/* 入住日期 */}
        <div className={styles.dateBlock}>
          {startDate && (
            <>
              <div className={styles.dateMain}>
                <span className={styles.dateDay}>
                  {startDate.getMonth() + 1}月{startDate.getDate()}日
                </span>
                <span className={styles.dateLabel}>{getDateLabel(startDate)}</span>
              </div>
            </>
          )}
        </div>

        {/* 住几晚 */}
        <div className={styles.nightsBlock}>
          <span className={styles.nightsText}>{nights}晚</span>
        </div>

        {/* 离店日期 */}
        <div className={styles.dateBlock}>
          {endDate && (
            <>
              <div className={styles.dateMain}>
                <span className={styles.dateDay}>
                  {endDate.getMonth() + 1}月{endDate.getDate()}日
                </span>
                <span className={styles.dateLabel}>{getDateLabel(endDate)}</span>
              </div>
            </>
          )}
        </div>
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
    </div>
  );
}