// src/api/hotel.ts
import axios from 'axios';
import type { Hotel, SearchParams } from '../../types/hotel'; // 从 types 目录导入类型

// 假设这是你的后端 API 地址
const API_BASE_URL = 'https://api.your-app.com/v1';

// 定义一个函数，专门用于搜索酒店
export async function searchHotels(params: SearchParams): Promise<Hotel[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotels/search`, { params });
    // 直接返回后端给的原始数据中的 data 部分
    return response.data; 
  } catch (error) {
    console.error('Failed to search hotels:', error);
    // 向上抛出异常，让调用者处理
    throw error;
  }
}
