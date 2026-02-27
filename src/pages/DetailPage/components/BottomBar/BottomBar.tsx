import { useState } from 'react';
import { Button, Popup, Toast } from 'antd-mobile';
import { PhonebookOutline } from 'antd-mobile-icons';
import styles from './BottomBar.module.css';

interface BottomBarProps {
  minPrice: number;
  hotelPhone: string;          // 新增：酒店电话
  onViewRooms: () => void;
  onContactHotel?: () => void;  // 新增：联系酒店回调
  visible?: boolean;
}

export default function BottomBar({
  minPrice,
  hotelPhone,
  onViewRooms,
  onContactHotel,
  visible = true,
}: BottomBarProps) {
  const [phoneVisible, setPhoneVisible] = useState(false);

  /** 一键复制 */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hotelPhone);
      Toast.show({ content: '已复制电话' });
    } catch {
      Toast.show({ content: '复制失败' });
    }
  };

  /** 一键拨号 */
  const handleCall = () => {
    window.location.href = `tel:${hotelPhone}`;
  };

  return (
    <>
      <div className={`${styles.container} ${visible ? styles.visible : styles.hidden}`}>
        <div className={styles.left}>
          <Button
            className={styles.phoneButton}
            onClick={() => setPhoneVisible(true)}
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
      </div>

      {/* 电话弹层 */}
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
    </>
  );
}