
import { Card, Toast } from 'antd-mobile'
import styles from './Banner.module.css'

function Banner() {

    const handleBannerClick = () => {
    // 在真实项目中，这里会用 navigate 跳转到详情页
    // navigate(`/hotel/123`);
    Toast.show({
      content: '即将跳转到酒店详情页...',
      icon: 'loading',
    })
    }
    return (
    <Card
      className={styles.container}
      onClick={handleBannerClick}
    >
      <div className={styles.content}>
        <h3>限时特惠</h3>
        <p>海景豪华大酒店，仅需 ¥1288 起</p>
      </div>
    </Card>
    )
  
}

export default Banner

