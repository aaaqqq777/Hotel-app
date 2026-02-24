// src/pages/HotelListPage/RoomSelector/RoomSelector.tsx
import React, { useState } from 'react';
import { Popup, Stepper, Space, Button } from 'antd-mobile';
import styles from './RoomSelector.module.css';

interface RoomSelectorProps {
  roomCount: number;
  guestCount: number;
  onRoomCountChange: (count: number) => void;
  onGuestCountChange: (count: number) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({
  roomCount,
  guestCount,
  onRoomCountChange,
  onGuestCountChange
}) => {
  const [visible, setVisible] = useState(false);
  const [tempRoomCount, setTempRoomCount] = useState(roomCount);
  const [tempGuestCount, setTempGuestCount] = useState(guestCount);

  const handleConfirm = () => {
    onRoomCountChange(tempRoomCount);
    onGuestCountChange(tempGuestCount);
    setVisible(false);
  };

  const handleCancel = () => {
    setTempRoomCount(roomCount);
    setTempGuestCount(guestCount);
    setVisible(false);
  };

  return (
    <div className={styles.container}>
      <div 
        className={styles.selectorButton}
        onClick={() => {
          setTempRoomCount(roomCount);
          setTempGuestCount(guestCount);
          setVisible(true);
        }}
      >
        <div className={styles.textContainer}>
          <span className={styles.roomCount}>{tempRoomCount}间</span>
          <span className={styles.guestCount}>{tempGuestCount}人</span>
        </div>
      </div>

      <Popup
        visible={visible}
        onMaskClick={() => handleCancel()}
        position="bottom"
        bodyStyle={{ minHeight: '200px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
      >
        <div className={styles.popupContent}>
          <div className={styles.popupHeader}>
            <h3>房间与入住人数</h3>
          </div>
          
          <div className={styles.optionContainer}>
            <div className={styles.optionRow}>
              <span className={styles.optionLabel}>房间数</span>
              <Stepper
                value={tempRoomCount}
                min={1}
                max={10}
                onChange={setTempRoomCount}
                className={styles.stepper}
              />
            </div>
            
            <div className={styles.optionRow}>
              <span className={styles.optionLabel}>入住人数</span>
              <Stepper
                value={tempGuestCount}
                min={1}
                max={20}
                onChange={setTempGuestCount}
                className={styles.stepper}
              />
            </div>
          </div>
          
          <div className={styles.buttonGroup}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button 
                fill="outline" 
                color="primary" 
                onClick={handleCancel}
              >
                取消
              </Button>
              <Button 
                color="primary" 
                onClick={handleConfirm}
              >
                确认
              </Button>
            </Space>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default RoomSelector;