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
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (bannerList.length <= 1) return
    startAutoPlay()
    return () => stopAutoPlay()
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

  // ── 加载态 ──────────────────────────────────────────────────
  if (loading) {
    return (
      <Card className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingDot} />
        </div>
      </Card>
    )
  }

  if (!bannerList.length) return null

  // ── 单图静止 ─────────────────────────────────────────────────
  if (bannerList.length === 1) {
    const banner = bannerList[0] as BannerData
    return (
      <Card className={styles.container} onClick={() => handleBannerClick(banner)}>
        <div
          className={styles.carouselWrapper}
          style={{
            backgroundImage: `url(${banner.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className={styles.content}>
            <div className={styles.textBlock}>
              <h3 className={styles.title}>{banner.title}</h3>
              <p className={styles.description}>{banner.description}</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // ── 多图轮播 ─────────────────────────────────────────────────
  return (
    <Card className={styles.container}>
      <div
        className={styles.carouselWrapper}
        onMouseEnter={() => stopAutoPlay()}
        onMouseLeave={() => startAutoPlay()}
      >
        {bannerList.map((banner: BannerData, index: number) => (
          <div
            key={banner.id}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => handleBannerClick(banner)}
            style={{
              backgroundImage: `url(${banner.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className={styles.content}>
              <div className={styles.textBlock}>
                <h3 className={styles.title}>{banner.title}</h3>
                <p className={styles.description}>{banner.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* 轮播指示器 */}
        <div className={styles.indicators}>
          {bannerList.map((_: BannerData, index: number) => (
            <div
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
              onClick={e => { e.stopPropagation(); setCurrentIndex(index) }}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}

export default Banner