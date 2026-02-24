// src/api/modules/advertisement.ts
import { api } from '../index';
import type { BannerData } from '../../data/advertisement/advertisement';
import { MOCK_BANNERS } from '../../data/advertisement/advertisement';

// 广告API
export const advertisementApi = {
  // 获取广告列表
  getAdvertisements: async (): Promise<BannerData[]> => {
    try {
      return await api.get('/api/advertisements');
    } catch (error) {
      console.error('获取广告列表失败:', error);
      return MOCK_BANNERS;
    }
  }
};
