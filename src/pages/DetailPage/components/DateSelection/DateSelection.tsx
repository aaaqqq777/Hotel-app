import { useState } from 'react';
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

  // 格式化日期为 MM.DD 格式
  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}月${day}日`;
  };

  // 获取星期几
  const getDayOfWeek = (date: Date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  };

  // 处理日期变化
  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
    console.log('Selected dates:', { startDate, endDate });
    if (endDate) {
      setCalendarVisible(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dateSelector} onClick={() => setCalendarVisible(true)}>
        <div className={styles.dateInfo}>
          <div className={styles.dateRow}>
            <div className={styles.dateRange}>
              {startDate && endDate ? (
                <>
                  <span className={styles.dateText}>
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </span>
                  <div className={styles.weekInfo}>
                    {getDayOfWeek(startDate)}入住 {getDayOfWeek(endDate)}离店
                  </div>
                </>
              ) : (
                <span className={styles.datePlaceholder}>选择入住和离店日期</span>
              )}
            </div>
            <div className={styles.roomTypeSelector}>
              {/* <Button 
                size="small" 
                fill="solid" 
                color="primary" 
                className={styles.roomTypeButton}
              >
                全日房
              </Button>
              <Button 
                size="small" 
                fill="outline" 
                color="primary" 
                className={styles.roomTypeButton}
              >
                钟点房
              </Button> */}
            </div>
          </div>
        </div>
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
    </div>
  );
}