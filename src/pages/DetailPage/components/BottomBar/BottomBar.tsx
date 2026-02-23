import { Button } from 'antd-mobile';
import { MessageOutline, PhonebookOutline } from 'antd-mobile-icons';
import styles from './BottomBar.module.css';

interface BottomBarProps {
  minPrice: number;
  onViewRooms: () => void;
  onContactHotel: () => void;
  visible?: boolean;
}

export default function BottomBar({ minPrice, onViewRooms, onContactHotel, visible = true }: BottomBarProps) {
  return (
    <div className={`${styles.container} ${visible ? styles.visible : styles.hidden}`}>
      <div className={styles.left}>
        <Button 
          className={styles.contactButton}
          onClick={onContactHotel}
        >
          <MessageOutline />
          <span>在线联系</span>
        </Button>
        <Button 
          className={styles.phoneButton}
          onClick={onContactHotel}
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
        <Button 
          className={styles.viewButton}
          onClick={onViewRooms}
        >
          查看房型
        </Button>
      </div>
    </div>
  );
}