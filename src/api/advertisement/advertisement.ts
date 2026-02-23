
import { apiClient } from '../config'
import type { BannerData } from '../../data/advertisement/advertisement'
import { MOCK_BANNERS } from '../../data/advertisement/advertisement'

// 获取广告列表
export async function fetchBannerList(): Promise<BannerData[]> {
  try {
    // TODO: 这里替换为真实的后端接口
    // const response = await apiClient.get('/banners')
    // return response.data.data.list

    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 返回模拟数据
    return MOCK_BANNERS
  } catch (error) {
    console.error('Failed to fetch banner list:', error)
    // 请求失败时返回模拟数据作为降级方案
    return MOCK_BANNERS
  }
}

// 导出类型
export type { BannerData }
