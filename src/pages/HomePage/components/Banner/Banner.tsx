
import { useState, useEffect } from 'react'
import { Card } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styles from './Banner.module.css'

// 广告数据接口
interface BannerData {
  id: string
  imageUrl: string
  title: string
  description: string
  hotelId: string
}

function Banner() {
  const navigate = useNavigate()
  const [bannerData, setBannerData] = useState<BannerData | null>(null)
  const [loading, setLoading] = useState(true)

  // 模拟从后台请求广告数据
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true)
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟后台返回的广告数据
        const mockData: BannerData = {
          id: '1',
          imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20with%20modern%20architecture&image_size=landscape_16_9',
          title: '豪华酒店特惠',
          description: '限时享受8折优惠，预订即送早餐',
          hotelId: '1'
        }
        
        setBannerData(mockData)
      } catch (error) {
        console.error('Failed to fetch banner data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBannerData()
  }, [])

  const handleBannerClick = () => {
    if (bannerData) {
      // 跳转到酒店详情页
      navigate(`/detailpage?id=${bannerData.hotelId}`)
    }
  }

  if (loading || !bannerData) {
    return (
      <Card className={styles.container}>
        <div className={styles.content}>
          <h3>加载中...</h3>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={styles.container}
      onClick={handleBannerClick}
    >
      <div 
        className={styles.content}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${bannerData.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h3>{bannerData.title}</h3>
        <p>{bannerData.description}</p>
      </div>
    </Card>
  )
}

export default Banner

