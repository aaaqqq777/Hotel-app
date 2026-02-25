// src/hooks/useSearchLogic.ts
import { useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import type { HotelSearchParams } from '../../../types/hotel'
/**
 * UI 层传入的原始搜索数据（宽松）
 */
export interface RawSearchData {
  city?: string
  keyword?: string
  region?: string
  dates?: [Date, Date]
  priceRange?: [number, number]
  starLevels?: number[]
  brands?: string[]
  lat?: number
  lng?: number
  roomCount?: number
  guestCount?: number
}

/**
 * 模拟城市坐标数据（实际项目中应该从API获取）
 */
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '上海': { lat: 31.2304, lng: 121.4737 },
  '北京': { lat: 39.9042, lng: 116.4074 },
  '广州': { lat: 23.1291, lng: 113.2644 },
  '深圳': { lat: 22.3193, lng: 114.1694 },
  '杭州': { lat: 30.2741, lng: 120.1551 },
  '成都': { lat: 30.5728, lng: 104.0668 },
  '南京': { lat: 32.0603, lng: 118.7969 },
  '重庆': { lat: 29.5630, lng: 106.5516 },
  '当前位置': { lat: 31.2304, lng: 121.4737 }, // 默认使用上海坐标
}

/**
 * 工具函数：Date → yyyy-mm-dd
 */
function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function useSearchLogic() {
  const navigate = useNavigate()

  /**
   * 最终唯一对外暴露的搜索入口
   */
  const handleFinalSearch = (raw: RawSearchData) => {
    // ===== 1. 必填校验 & 默认值 =====
    const city = raw.city || '上海'
    console.log('处理搜索，城市:', city);

    let checkInDate: string
    let checkOutDate: string

    if (raw.dates && raw.dates.length === 2) {
      checkInDate = formatDate(raw.dates[0])
      checkOutDate = formatDate(raw.dates[1])
    } else {
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)
      checkInDate = formatDate(today)
      checkOutDate = formatDate(tomorrow)
    }

    // 根据城市名称获取经纬度，如果传入的经纬度为空
    const lat = raw.lat ?? CITY_COORDINATES[city]?.lat;
    const lng = raw.lng ?? CITY_COORDINATES[city]?.lng;

    const params: HotelSearchParams = {
      city,
      keyword: raw.keyword?.trim() || undefined,

      checkInDate,
      checkOutDate,

      minPrice: raw.priceRange?.[0],
      maxPrice: raw.priceRange?.[1],

      starLevels: raw.starLevels?.length ? raw.starLevels[0] : undefined,
      brands: raw.brands?.length ? raw.brands : undefined,
     
      roomCount: raw.roomCount,
      guestCount: raw.guestCount,
      
      sortBy: 'price',
      sortOrder: 'asc',

      page: 1,
      pageSize: 10,

      lat,
      lng,
    }

    console.log('构建的搜索参数:', params);

    // ===== 2. 转为 URLSearchParams =====
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        console.log(`跳过参数 ${key}，值为:`, value);
        return
      }

      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)))
      } else {
        searchParams.set(key, String(value))
      }
      
      console.log(`添加参数 ${key}=${value}`);
    })

    console.log('最终URL参数:', searchParams.toString());

    // ===== 3. 跳转 =====
    Toast.show({ content: '正在查询...', icon: 'loading' })
    navigate(`/hotellist?${searchParams.toString()}`)
  }

  return { handleFinalSearch }
}