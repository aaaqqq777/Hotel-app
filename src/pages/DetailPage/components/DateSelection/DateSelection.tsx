import { RightOutline } from 'antd-mobile-icons';
import styles from './DateSelection.module.css';

interface DateSelectionProps {
  checkInDate: string;
  checkOutDate: string;
}

export default function DateSelection({ checkInDate, checkOutDate }: DateSelectionProps) {
  const handleDateClick = () => {
    // 这里可以实现打开日期选择器的逻辑
    console.log('Opening date picker');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>选择日期</h3>
      </div>
      
      <div className={styles.dateSelector} onClick={handleDateClick}>
        <div className={styles.dateInfo}>
          <div className={styles.dateRow}>
            <div className={styles.dateItem}>
              <div className={styles.dateLabel}>{checkInDate}</div>
              <div className={styles.dateDesc}>入住</div>
            </div>
            <RightOutline className={styles.arrow} />
            <div className={styles.dateItem}>
              <div className={styles.dateLabel}>{checkOutDate}</div>
              <div className={styles.dateDesc}>离店</div>
            </div>
          </div>
          <div className={styles.nightInfo}>1晚</div>
        </div>
        <div className={styles.warning}>
          当前已过0点，如需今天凌晨6点前入住，请选择"今天凌晨"
        </div>
      </div>
    </div>
  );
}