// /**
//  * 酒店业务逻辑服务
//  * 负责数据处理、过滤、排序等
//  */

// import type { HotelListItem as Hotel, HotelFilterParams, SortType } from '../types/hotel'
// import { MOCK_HOTELS } from '../data/hotels'

// /**
//  * 分页响应数据结构
//  */
// export interface PaginatedResponse<T> {
//   data: T[]
//   page: number
//   pageSize: number
//   total: number
//   hasMore: boolean
// }

// /**
//  * 获取所有酒店数据
//  * 便于后期替换为 API 调用
//  */
// export function getHotels(): Hotel[] {
//   return MOCK_HOTELS
// }

// /**
//  * 根据搜索参数过滤酒店
//  */
// function filterHotels(hotels: Hotel[], params: HotelFilterParams): Hotel[] {
//   return hotels.filter((hotel) => {
//     // 关键字过滤
//     if (params.keyword) {
//       const keyword = params.keyword.toLowerCase()
//       const nameMatch = hotel.name.toLowerCase().includes(keyword)
//       const descMatch = hotel.coverImage.toLowerCase().includes(keyword) // 使用coverImage代替description
//       if (!nameMatch && !descMatch) {
//         return false
//       }
//     }

//     // 星级过滤（处理文本格式如"5星"、"4星"等）
//     if (params.starLevel && params.starLevel !== '全部') {
//       const starLevelMap: { [key: string]: number } = {
//         '5星': 5,
//         '4星': 4,
//         '3星及以下': 3,
//       }
//       const targetLevel = starLevelMap[params.starLevel]
//       if (params.starLevel === '3星及以下') {
//         if (hotel.starLevel > 3) {
//           return false
//         }
//       } else if (targetLevel && hotel.starLevel !== targetLevel) {
//         return false
//       }
//     }

//     // 价格范围过滤（处理文本格式）
//     if (params.priceRange && params.priceRange !== '全部') {
//       const priceRangeMap: { [key: string]: [number, number] } = {
//         '100以下': [0, 100],
//         '100-300': [100, 300],
//         '300-600': [300, 600],
//         '600以上': [600, Infinity],
//       }
//       const [minPrice, maxPrice] = priceRangeMap[params.priceRange] || [0, Infinity]
//       if (hotel.price.lowest < minPrice || hotel.price.lowest > maxPrice) {
//         return false
//       }
//     }

//     // 标签过滤（支持多个标签，任意匹配即可）
//     if (params.tags && params.tags.length > 0) {
//       const hasMatchingTag = params.tags.some((tag: string) => hotel.tags?.includes(tag))
//       if (!hasMatchingTag) {
//         return false
//       }
//     }

//     return true
//   })
// }

// /**
//  * 对酒店进行排序
//  */
// function sortHotels(hotels: Hotel[], sortType: SortType): Hotel[] {
//   const sorted = [...hotels]

//   switch (sortType) {
//     case 'price-asc':
//       sorted.sort((a, b) => a.price.lowest - b.price.lowest)
//       break
//     case 'price-desc':
//       sorted.sort((a, b) => b.price.lowest - a.price.lowest)
//       break
//     case 'rating':
//       sorted.sort((a, b) => b.starLevel - a.starLevel)
//       break
//     case 'default':
//     default:
//       // 保持原序
//       break
//   }

//   return sorted
// }

// /**
//  * 获取处理后的酒店列表
//  * @param filterParams 过滤参数
//  * @param sortType 排序方式
//  * @returns 处理后的酒店列表
//  */
// export function getProcessedHotels(
//   filterParams: HotelFilterParams,
//   sortType: SortType = 'default'
// ): Hotel[] {
//   const hotels = getHotels()
//   const filtered = filterHotels(hotels, filterParams)
//   const sorted = sortHotels(filtered, sortType)
//   return sorted
// }

// /**
//  * 获取分页酒店数据 - 模拟后端API
//  * @param filterParams 过滤参数
//  * @param sortType 排序方式
//  * @param page 当前页码
//  * @param pageSize 每页数量
//  * @returns 分页响应数据
//  */
// export async function getPaginatedHotels(
//   filterParams: HotelFilterParams,
//   sortType: SortType = 'default',
//   page: number = 1,
//   pageSize: number = 5
// ): Promise<PaginatedResponse<Hotel>> {
//   // 模拟网络延迟
//   await new Promise(resolve => setTimeout(resolve, 800))

//   const allHotels = getProcessedHotels(filterParams, sortType)
//   const total = allHotels.length
//   const startIndex = (page - 1) * pageSize
//   const endIndex = startIndex + pageSize
//   const data = allHotels.slice(startIndex, endIndex)
//   const hasMore = endIndex < total

//   return {
//     data,
//     page,
//     pageSize,
//     total,
//     hasMore,
//   }
// }
