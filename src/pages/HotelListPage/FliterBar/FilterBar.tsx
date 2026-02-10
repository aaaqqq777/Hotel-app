// src/pages/ListPage/components/FilterBar/index.tsx

import { EnvironmentOutline, CalendarOutline } from 'antd-mobile-icons';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  location?: string
  checkInDate?: string
  onOpenFilter?: () => void
}

export default function FilterBar({ location, checkInDate }: FilterBarProps) {
  
  // 这里的函数只是为了示例，可以根据实际需要绑定不同的事件
  const handleMapClick = () => {
    console.log('用户点击了地图按钮');
    // 未来这里可能会打开一个地图模态框
    // onOpenMapModal(); 
  };
  
  return (
    <div className={styles.container}>
      {/* 使用 Space 组件来自动处理间距 */}
      <div className={styles.left}>
        {/* 城市信息 */}
        {location && (
          <div className={styles.info}>
            <EnvironmentOutline className={styles.icon} />
            <span className={styles.text}>{location}</span>
          </div>
        )}

        {/* 入住日期 */}
        {checkInDate && (
          <div className={styles.info}>
            <CalendarOutline className={styles.icon} />
            <span className={styles.text}>{checkInDate}</span>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <button className={styles.mapButton} onClick={handleMapClick}>
          <EnvironmentOutline />
          地图
        </button>
      </div>
    </div>
  );
}

