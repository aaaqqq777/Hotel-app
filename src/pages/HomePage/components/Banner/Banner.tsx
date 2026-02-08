
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
        <h3>酒店广告</h3>
        <p>点击查看详情</p>
        <p>需要换图片+跳转到酒店详情页面  </p>
        
      </div>
    </Card>
    )
  
}

export default Banner

