import styles from './HotelFacilities.module.css';

interface Facility {
  icon: string;
  name: string;
}

interface HotelFacilitiesProps {
  facilities: Facility[];
}

// 模拟设施图标，实际项目中可以使用 antd-mobile-icons 或其他图标库
export default function HotelFacilities({ facilities }: HotelFacilitiesProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>酒店设施</h3>
      <div className={styles.facilitiesGrid}>
        {facilities.map((facility, index) => (
          <div key={index} className={styles.facilityItem}>
            <div className={styles.facilityIcon}>
              {/* 这里使用文字代替图标，实际项目中可以使用真实的图标 */}
              {facility.icon}
            </div>
            <span className={styles.facilityName}>{facility.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}