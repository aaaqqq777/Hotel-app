// src/hooks/useSearchLogic.ts
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';

// 定义所有可能的搜索数据类型
export interface SearchData {
  searchType: 'domestic' | 'overseas' | 'hourly' | 'bnb';
  city?: string;
  keyword?: string;
  dates?: [Date, Date];
  brand?: string;
  priceRange?: [number, number];
  tags?: string[];
}

export function useSearchLogic() {
  const navigate = useNavigate();

  // 这是我们暴露给所有表单的【统一查询函数】
  const handleFinalSearch = (data: Partial<SearchData>) => {
    console.log('采集到的最终搜索信息:', data);

    // 1. 数据校验
    if (data.searchType === 'domestic' && !data.city) {
      Toast.show('请选择城市');
      return;
    }
    if (data.searchType !== 'hourly' && !data.dates) {
      Toast.show('请选择入住日期');
      return;
    }

    // 2. 将数据对象转换为 URL 查询字符串
    const params = new URLSearchParams();
    for (const key in data) {
      const value = data[key as keyof SearchData];
      if (value) {
        // 对数组等复杂类型进行处理
        if (Array.isArray(value)) {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, value.toString());
        }
      }
    }

    // 3. 执行跳转
    Toast.show({ content: '正在查询...', icon: 'loading' });
    navigate(`/list?${params.toString()}`);
  };

  // 返回这个核心函数
  return { handleFinalSearch };
}
