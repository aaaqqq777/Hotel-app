import styles from './RoomSelection.module.css';

interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface RoomSelectionProps {
  roomTypes: RoomType[];
  selectedRoomId: string;
  onRoomSelect: (roomId: string) => void;
}

export default function RoomSelection({ roomTypes, selectedRoomId, onRoomSelect }: RoomSelectionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>选择房型</h3>
      </div>
      
      <div className={styles.roomList}>
        {roomTypes.map((room) => (
          <div 
            key={room.id} 
            className={`${styles.roomItem} ${selectedRoomId === room.id ? styles.selected : ''}`}
            onClick={() => onRoomSelect(room.id)}
          >
            <div className={styles.roomInfo}>
              <h4 className={styles.roomName}>{room.name}</h4>
              <p className={styles.roomDescription}>{room.description}</p>
            </div>
            <div className={styles.roomPrice}>
              <span className={styles.priceSymbol}>¥</span>
              <span className={styles.priceValue}>{room.price}</span>
              <span className={styles.priceUnit}>起/晚</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}