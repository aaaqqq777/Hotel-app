import { Button, Popup } from 'antd-mobile';
import { PhonebookOutline } from 'antd-mobile-icons';
import styles from './BottomBar.module.css';
import { useState } from 'react';

interface BottomBarProps {
  minPrice: number;
  onViewRooms: () => void;
  onContactHotel: () => void;
  visible?: boolean;
  hotelPhone?: string; // 新增
}

export default function BottomBar({
  minPrice,
  onViewRooms,
  onContactHotel,
  visible = true,
  hotelPhone = '',
}: BottomBarProps) {
  const [phoneVisible, setPhoneVisible] = useState(false);

  const handleCall = () => {
    if (hotelPhone) {
      window.location.href = `tel:${hotelPhone}`;
    }
    setPhoneVisible(false);
  };

  const handleCopy = () => {
    if (hotelPhone) {
      navigator.clipboard?.writeText(hotelPhone);
    }
    setPhoneVisible(false);
  };

  return (
    <div className={`${styles.container} ${visible ? styles.visible : styles.hidden}`}>
      <div className={styles.left}>
        <Button
          className={styles.phoneButton}
          onClick={() => {
            if (hotelPhone) {
              setPhoneVisible(true);
            }
          }}
        >
          <PhonebookOutline />
          <span>电话</span>
        </Button>
      </div>

      <div className={styles.right}>
        <div className={styles.priceInfo}>
          <div className={styles.price}>
            <span className={styles.priceSymbol}>¥</span>
            <span className={styles.priceValue}>{minPrice}</span>
            <span className={styles.priceUnit}>起</span>
          </div>
        </div>
        <Button className={styles.viewButton} onClick={onViewRooms}>
          查看房型
        </Button>
      </div>

      <Popup
        visible={phoneVisible}
        onMaskClick={() => setPhoneVisible(false)}
        position="bottom"
        bodyStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      >
        <div className={styles.phonePopup}>
          <div className={styles.phoneTitle}>联系酒店</div>
          <div className={styles.phoneNumber}>{hotelPhone}</div>
          <Button block color="primary" onClick={handleCall}>
            拨打电话
          </Button>
          <Button block onClick={handleCopy}>
            复制号码
          </Button>
          <Button block fill="none" onClick={() => setPhoneVisible(false)}>
            取消
          </Button>
        </div>
      </Popup>
    </div>
  );
}