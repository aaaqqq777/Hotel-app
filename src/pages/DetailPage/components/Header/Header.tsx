import { useState } from 'react';
import { Button } from 'antd-mobile';
import { LeftOutline, HeartOutline, HeartFill } from 'antd-mobile-icons';  
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

interface HeaderProps {
  hotelName: string;
}

export default function Header({ hotelName }: HeaderProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={styles.container}>
      <Button 
        fill="none" 
        onClick={handleBackClick}
        className={styles.backButton}
      >
        <LeftOutline />
      </Button>
      <h1 className={styles.hotelName}>{hotelName}</h1>
      <Button 
        fill="none" 
        onClick={handleFavoriteClick}
        className={styles.favoriteButton}
      >
        {isFavorite ? <HeartFill style={{ color: '#ff4757' }} /> : <HeartOutline />}
      </Button>
    </div>
  );
}