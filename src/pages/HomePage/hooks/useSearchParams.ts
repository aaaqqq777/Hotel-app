import { useState } from 'react'
import type { HotelSearchParams } from '../../../types/hotel'

// 扩展类型，补充 UI 专用字段
export type SearchFormData = Partial<HotelSearchParams> & {
  region?: 'domestic' | 'overseas' | 'hourly' | 'bnb'
  dates?: [Date, Date]
}

export function useSearchParams() {
  const [params, setParams] = useState<SearchFormData>({
    region: 'domestic',
    city: '上海',
  })

  const updateParams = (partial: Partial<SearchFormData>) => {
    setParams(prev => {
      const newParams = { ...prev, ...partial }
      if (newParams.region === 'domestic' && !newParams.city) {
        newParams.city = '上海'
      }
      return newParams
    })
  }

  return { params, updateParams }
}