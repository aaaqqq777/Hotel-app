/**
 * 预存的酒店数据
 * 便于后期从后端 API 替换
 */

import type { Hotel } from './types'

export const MOCK_HOTELS: Hotel[] = [
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

export const QUICK_TAGS: Array<{ label: string; value: string }> = [
  { label: '亲子酒店', value: 'family' },
  { label: '豪华酒店', value: 'luxury' },
  { label: '免费停车', value: 'parking' },
  { label: 'WiFi免费', value: 'wifi' },
  { label: '有早餐', value: 'breakfast' },
  { label: '游泳池', value: 'pool' },
]
