
import { useState, useEffect, useRef } from 'react'
import { Card } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styles from './Banner.module.css'
import { useAdvertisements } from '../../../../hooks/useHotelQueries'
import type { BannerData } from '../../../../api/advertisement/advertisement'

function Banner() {
  const navigate = useNavigate()
  const { data: bannerList = [], isLoading: loading } = useAdvertisements()
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<number | null>(null);

  // 自动轮播
  useEffect(() => {
    if (bannerList.length <= 1) {
      return
    }

    // 启动自动轮播
    startAutoPlay()

    return () => {
      stopAutoPlay()
    }
  }, [bannerList])

  const startAutoPlay = () => {
    stopAutoPlay()
    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % bannerList.length)
    }, 3000)
  }

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const handleBannerClick = (banner: BannerData) => {
    navigate(`/detailpage?id=${banner.hotelId}`)
  }

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleMouseEnter = () => {
    if (bannerList.length > 1) {
      stopAutoPlay()
    }
  }

  const handleMouseLeave = () => {
    if (bannerList.length > 1) {
      startAutoPlay()
    }
  }

  if (loading) {
    return (
      <Card className={styles.container}>
        <div className={styles.content}>
          <h3>加载中...</h3>
        </div>
      </Card>
    )
  }

  if (!bannerList.length) {
    return null
  }

  // 如果只有一个广告，静止显示
  if (bannerList.length === 1) {
    const banner = bannerList[0] as BannerData
    return (
      <Card
        className={styles.container}
        onClick={() => handleBannerClick(banner)}
      >
        <div 
          className={styles.content}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${banner.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <h3>{banner.title}</h3>
          <p>{banner.description}</p>
        </div>
      </Card>
    )
  }

  // 多个广告，轮播显示
  return (
    <Card
      className={styles.container}
    >
      {/* 轮播内容 */}
      <div 
        className={styles.carouselWrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {bannerList.map((banner: BannerData, index: number) => (
          <div
            key={banner.id}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => handleBannerClick(banner)}
          >
            <div 
              className={styles.content}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${banner.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <h3>{banner.title}</h3>
              <p>{banner.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 指示器 */}
      <div className={styles.indicators}>
        {bannerList.map((_: any, index: number) => (
          <div
            key={index}
            className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => handleIndicatorClick(index)}
          />
        ))}
      </div>
    </Card>
  )
}

export default Banner
