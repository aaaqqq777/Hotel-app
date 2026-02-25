// src/pages/HomePage/hooks/useSearchParams.ts
import { useState } from 'react';
import type { RawSearchData } from './useSearchLogic';

export function useSearchParams() {
  const [params, setParams] = useState<Partial<RawSearchData>>({
    region: 'domestic',
    city: '上海', // 为domestic类型设置默认城市
  });

  const updateParams = (partial: Partial<RawSearchData>) => {
    // 使用函数式更新，确保获取最新状态
    setParams(prev => {
      const newParams = { ...prev, ...partial };
      // 确保domestic类型始终有城市值
      if (newParams.region === 'domestic' && !newParams.city) {
        newParams.city = '上海';
      }
      console.log("searchparam:", newParams);
      return newParams;
    });
  };

  return {
    params,
    updateParams,
  };
}
