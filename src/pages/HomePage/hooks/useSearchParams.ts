// src/pages/HomePage/hooks/useSearchParams.ts
import { useState } from 'react';
import type { SearchData } from './useSearchLogic';

export function useSearchParams() {
  const [params, setParams] = useState<Partial<SearchData>>({
    searchType: 'domestic',
  });

  const updateParams = (partial: Partial<SearchData>) => {
    setParams(prev => ({ ...prev, ...partial }));
  };

  return {
    params,
    updateParams,
  };
}
