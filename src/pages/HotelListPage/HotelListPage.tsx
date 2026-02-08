import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, Tag, Button, List } from 'antd-mobile'
import { StarFill, EnvironmentOutline } from 'antd-mobile-icons'
import styles from './HotelListPage.module.css'

interface Hotel {
  id: string
  name: string
  location: string
  price: number
  starLevel: number
  image: string
  tags: string[]
  description: string
}

function HotelListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // 获取搜索参数
  const location = searchParams.get('location') || ''
  const keyword = searchParams.get('keyword') || ''
  const starLevel = searchParams.get('starLevel') || ''
  const priceRange = searchParams.get('priceRange') || ''
  const tagsStr = searchParams.get('tags') || ''

  // 模拟的酒店数据
  const mockHotels: Hotel[] = [
    {
      id: '1',
      name: '海景豪华大酒店',
      location: '海滨路1号',
      price: 1288,
      starLevel: 5,
      image: 'https://via.placeholder.com/300x200?text=Hotel+1',
      tags: ['luxury', 'parking', 'pool', 'breakfast'],
      description: '五星级豪华酒店，拥有800间客房，靠近海滨，提供一流的服务',
    },
    {
      id: '2',
      name: '城市商务酒店',
      location: '中心商务区',
      price: 450,
      starLevel: 4,
      image: 'https://via.placeholder.com/300x200?text=Hotel+2',
      tags: ['wifi', 'breakfast'],
      description: '四星级商务酒店，位于中心商务区，交通便利',
    },
    {
      id: '3',
      name: '家庭亲子酒店',
      location: '儿童乐园附近',
      price: 580,
      starLevel: 4,
      image: 'https://via.placeholder.com/300x200?text=Hotel+3',
      tags: ['family', 'pool', 'parking'],
      description: '专为家庭设计的亲子酒店，有儿童娱乐设施',
    },
    {
      id: '4',
      name: '经济快捷酒店',
      location: '地铁站附近',
      price: 180,
      starLevel: 3,
      image: 'https://via.placeholder.com/300x200?text=Hotel+4',
      tags: ['wifi'],
      description: '经济实惠的快捷酒店，距离地铁站步行5分钟',
    },
    {
      id: '5',
      name: '山景温泉酒店',
      location: '山区度假区',
      price: 920,
      starLevel: 4,
      image: 'https://via.placeholder.com/300x200?text=Hotel+5',
      tags: ['luxury', 'pool', 'breakfast'],
      description: '天然温泉酒店，享受山景和温泉体验',
    },
  ]

  // 根据搜索参数过滤酒店
  const filteredHotels = mockHotels.filter((hotel) => {
    // 关键字过滤
    if (
      keyword &&
      !hotel.name.toLowerCase().includes(keyword.toLowerCase()) &&
      !hotel.description.toLowerCase().includes(keyword.toLowerCase())
    ) {
      return false
    }

    // 星级过滤
    if (starLevel && hotel.starLevel !== parseInt(starLevel)) {
      return false
    }

    // 价格范围过滤
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map((p) => {
        if (p === '1000+') {
          return Infinity
        }
        return parseInt(p)
      })
      if (hotel.price < minPrice || hotel.price > maxPrice) {
        return false
      }
    }

    // 标签过滤
    if (tagsStr) {
      const selectedTags = tagsStr.split(',')
      const hasMatchingTag = selectedTags.some((tag) => hotel.tags.includes(tag))
      if (selectedTags.length > 0 && !hasMatchingTag) {
        return false
      }
    }

    return true
  })

  const handleHotelClick = (hotelId: string) => {
    navigate(`/detailpage?id=${hotelId}`)
  }

  const handleBackToSearch = () => {
    navigate('/')
  }

  return (
    <div className={styles.container}>
      {/* 搜索条件显示 */}
      <div className={styles.searchInfo}>
        <h2>搜索结果</h2>
        <div className={styles.conditions}>
          {location && (
            <Tag color="primary" className={styles.conditionTag}>
              📍 {location}
            </Tag>
          )}
          {keyword && (
            <Tag color="primary" className={styles.conditionTag}>
              🔍 {keyword}
            </Tag>
          )}
          {starLevel && (
            <Tag color="primary" className={styles.conditionTag}>
              ⭐ {starLevel}星
            </Tag>
          )}
          {priceRange && (
            <Tag color="primary" className={styles.conditionTag}>
              💰 {priceRange}
            </Tag>
          )}
          {tagsStr && (
            <Tag color="primary" className={styles.conditionTag}>
              🏷️ {tagsStr.split(',').length}个标签
            </Tag>
          )}
        </div>
        <Button size="small" onClick={handleBackToSearch} className={styles.backBtn}>
          返回修改搜索
        </Button>
      </div>

      {/* 酒店列表 */}
      <div className={styles.hotelList}>
        {filteredHotels.length > 0 ? (
          <List>
            {filteredHotels.map((hotel) => (
              <List.Item
                key={hotel.id}
                onClick={() => handleHotelClick(hotel.id)}
                className={styles.hotelCard}
              >
                <Card className={styles.card}>
                  <div className={styles.hotelContent}>
                    <div className={styles.imageSection}>
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className={styles.hotelImage}
                      />
                    </div>

                    <div className={styles.infoSection}>
                      <div className={styles.header}>
                        <h3 className={styles.hotelName}>{hotel.name}</h3>
                        <div className={styles.rating}>
                          {[...Array(hotel.starLevel)].map((_, i) => (
                            <StarFill key={i} className={styles.star} />
                          ))}
                        </div>
                      </div>

                      <div className={styles.location}>
                        <EnvironmentOutline className={styles.locationIcon} />
                        <span>{hotel.location}</span>
                      </div>

                      <p className={styles.description}>{hotel.description}</p>

                      {hotel.tags.length > 0 && (
                        <div className={styles.tags}>
                          {hotel.tags.map((tag) => (
                            <Tag key={tag} color="default">
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      )}

                      <div className={styles.footer}>
                        <div className={styles.price}>
                          <span className={styles.currency}>¥</span>
                          <span className={styles.amount}>{hotel.price}</span>
                          <span className={styles.unit}>/晚</span>
                        </div>
                        <Button size="small" color="primary">
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </List.Item>
            ))}
          </List>
        ) : (
          <div className={styles.emptyState}>
            <p>😔 没有找到匹配的酒店</p>
            <p>请修改搜索条件重试</p>
            <Button color="primary" onClick={handleBackToSearch}>
              返回修改搜索
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HotelListPage
