import { Tabs } from 'antd-mobile';
import styles from './SearchForm.module.css';

import { useSearchParams } from '../../hooks/useSearchParams';
import { useSearchLogic } from '../../hooks/useSearchLogic';
import type { SearchFormData } from '../../hooks/useSearchParams'
import OverseasSearch from '../Forms/OverseasSearch/OverseasSearch';
import DomesticSearchForm from '../Forms/DomesticSearch/DomesticSearch';

type SearchTabKey = 'domestic' | 'overseas' | 'hourly' | 'bnb';

export default function SearchForm() {
  // 搜索参数的唯一来源
  const { params, updateParams } = useSearchParams();

  // 搜索提交逻辑
  const { handleFinalSearch } = useSearchLogic();

  // 确保 activeTab 有默认值
  const activeTab = params.region || 'domestic';

  const onSearch = (latestData: SearchFormData) => {
    const merged = { ...params, ...latestData }
    handleFinalSearch(merged)
  }

  const renderSearchForm = () => {
    switch (activeTab) {
      case 'domestic':
        return (
          <DomesticSearchForm
            value={params}
            onChange={updateParams}
            onSearch={onSearch}
          />
        );
      case 'overseas':
        return (
          <OverseasSearch
            value={params}
            onChange={updateParams}
            onSearch={onSearch}
          />
        );
      case 'hourly':
        return (
          <DomesticSearchForm
            value={params}
            onChange={updateParams}
            onSearch={onSearch}
          />
        );
      case 'bnb':
        return (
          <DomesticSearchForm
            value={params}
            onChange={updateParams}
            onSearch={onSearch}
          />
        );
      default:
        // 默认返回国内搜索
        return (
          <DomesticSearchForm
            value={{ ...params, region: 'domestic' }}
            onChange={updateParams}
            onSearch={onSearch}
          />
        );
    }
  };

  const handleTabChange = (key: string) => {
    console.log('切换搜索类型:', key);
    // 切换tab时，只更新region，保留其他参数
    updateParams({ region: key as SearchTabKey });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
        >
          <Tabs.Tab title="国内" key="domestic" />
          <Tabs.Tab title="海外" key="overseas" />
          <Tabs.Tab title="钟点房" key="hourly" />
          <Tabs.Tab title="民宿" key="bnb" />
        </Tabs>

        <div className={styles.formContainer}>
          {renderSearchForm()}
        </div>
      </div>
    </div>
  );
}
