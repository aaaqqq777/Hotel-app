
// 广告数据接口
import type { BannerData } from '../../types/hotel';

// 模拟广告数据
export const MOCK_BANNERS: BannerData[] = [
  {
    id: '1',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20with%20modern%20architecture%20night%20view&image_size=landscape_16_9',
    title: '豪华酒店特惠',
    description: '限时享受8折优惠，预订即送早餐',
    hotelId: '1'
  },
  {
    id: '2',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beach%20resort%20with%20ocean%20view%20and%20swimming%20pool&image_size=landscape_16_9',
    title: '海滨度假酒店',
    description: '无敌海景，无边泳池，浪漫度假首选',
    hotelId: '2'
  },
  {
    id: '3',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20hotel%20lobby%20with%20modern%20design&image_size=landscape_16_9',
    title: '商务酒店精选',
    description: '免费会议室，高速WiFi，商务出行必备',
    hotelId: '3'
  }
]
