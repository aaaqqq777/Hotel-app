/**
 * 酒店类型定义
 */

export interface Hotel {
  id: string
  name: string
  location: string
  price: number
  starLevel: number
  image: string
  tags: string[]
  description: string
}

export interface QuickTag {
  label: string
  value: string
}

export type SortType = 'default' | 'price-asc' | 'price-desc' | 'rating'

export interface HotelFilterParams {
  keyword?: string
  starLevel?: string
  priceRange?: string
  tags?: string[]
}

export interface HotelQueryState {
  sortType: SortType
  selectedTags: string[]
}
