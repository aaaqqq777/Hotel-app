import { useState } from 'react';
import { Tabs } from 'antd-mobile';
import styles from './SearchForm.module.css';

// 1. 导入我们的核心逻辑 Hook
import { useSearchLogic } from '../../../../hooks/useSearchLogic';
import OverseasSearch from '../Forms/OverseasSearch/OverseasSearch';
import DomesticSearchForm from '../Forms/DomesticSearch/DomesticSearch';
// import HourlySearchForm from './components/forms/HourlySearchForm';

// 定义选项卡的类型
type SearchTabKey = 'domestic' | 'overseas' | 'hourly' | 'bnb';

export default function SearchForm() {
  // --- 容器组件的逻辑 ---

  // 1. 管理当前激活的 Tab
  const [activeTab, setActiveTab] = useState<SearchTabKey>('domestic');

  // 2. 从自定义 Hook 中获取统一的查询函数
  const { handleFinalSearch } = useSearchLogic();

  // 3. 定义一个函数，用于渲染不同类型的搜索表单
  const renderSearchForm = () => {
    switch (activeTab) {
      case 'domestic':
        // 将统一的查询函数，通过 onSearch prop 传递给子组件
        return <DomesticSearchForm onSearch={handleFinalSearch} />;
    case 'overseas':
        // 将统一的查询函数，通过 onSearch prop 传递给子组件
        return <OverseasSearch onSearch={handleFinalSearch} />;
    case 'bnb':
        return <div>民宿搜索卡片待实现</div>;
      case 'hourly':
        // return <HourlySearchForm onSearch={handleFinalSearch} />;
        return <div>钟点房搜索卡片待实现</div>;
      // ... 其他 case
      default:
        return null;
    }
  };

  // --- 容器组件的 UI ---
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* 选项卡 */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as SearchTabKey)}
        >
          <Tabs.Tab title='国内' key='domestic' />
          <Tabs.Tab title='海外' key='overseas' />
          <Tabs.Tab title='钟点房' key='hourly' />
          <Tabs.Tab title='民宿' key='bnb' />
        </Tabs>

        {/* 动态渲染的表单区域 */}
        <div className={styles.formContainer}>
          {renderSearchForm()}
        </div>
      </div>
    </div>
  );
}
