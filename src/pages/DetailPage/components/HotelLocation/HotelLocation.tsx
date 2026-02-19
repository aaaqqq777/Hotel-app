import { Button } from 'antd-mobile';
import { EnvironmentOutline } from 'antd-mobile-icons';
import styles from './HotelLocation.module.css';

interface HotelLocationProps {
  address: string;
  distance: string;
  mapUrl?: string;
}

export default function HotelLocation({ address, distance, mapUrl }: HotelLocationProps) {
  const handleViewMap = () => {
    console.log('Viewing map:', mapUrl);
  };

  const handleNavigate = () => {
    console.log('Navigating to:', address);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>酒店位置</h3>
      
      <div className={styles.addressInfo}>
        <EnvironmentOutline className={styles.addressIcon} />
        <div className={styles.addressDetails}>
          <span className={styles.addressText}>{address}</span>
          <span className={styles.distanceText}>{distance}</span>
        </div>
      </div>
      
      <div className={styles.mapContainer}>
        <img src={mapUrl || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hotel%20location%20map%20view&image_size=landscape_16_9"} alt="Hotel location" className={styles.mapImage} />
        <div className={styles.mapOverlay}>
          <Button className={styles.mapButton} onClick={handleViewMap}>
            
            <span>查看地图</span>
          </Button>
          <Button className={styles.navigateButton} onClick={handleNavigate}>
            
            <span>导航</span>
          </Button>
        </div>
      </div>
    </div>
  );
}