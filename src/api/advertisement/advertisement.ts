
import { MOCK_BANNERS } from '../../data/advertisement/advertisement'
import type { BannerData } from '../../types/hotel'

// 获取广告列表
export async function fetchBannerList(): Promise<BannerData[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    return MOCK_BANNERS
  } catch (error) {
    console.error('Failed to fetch banner list:', error)
    return MOCK_BANNERS
  }
}

export async function getAdvertisements(): Promise<BannerData[]> {
  return fetchBannerList()
}

export type { BannerData }
