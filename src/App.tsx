
// import './App.css'
// import Header from './components/Hearder/Header'
// import {Button,Space,Toast} from 'antd-mobile'
// import { SearchOutline } from 'antd-mobile-icons'

// function App() {
//   return (
//     <>
//       <Space direction='vertical' style={{'--gap':'16px',padding:'16px'}}>
//       <Button color='primary' onClick={() => {
//         Toast.show('nice to meet you')}}>点击我试试
//       </Button>
//       <Header />
//       <div>
//         <p> Hello World! This is a hotel booking application built with React and Vite.</p>
//       </div>

//       <Button block>
//         <Space>
//           <SearchOutline />
//           <span>搜索酒店、目的地</span>
//         </Space>
//       </Button>

//       </Space>
//     </>
//   )
// }

// export default App
// src/App.tsx

import { TabBar } from 'antd-mobile';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './App.module.css';

// 1. 再次导入我们的“应用地图”
import { routes } from './router';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  // 2. 从“地图”中动态生成 TabBar 的标签项
  // 我们找到根路径'/'的配置，并遍历它的子路由
  const tabItems = routes.find(r => r.path === '/')?.children
    ?.filter((child: any) => child.path && child.title && child.icon)
    .map((child: any) => ({
      key: child.path as string,
      title: child.title,
      icon: child.icon,
    })) ?? []; // 如果找不到，则返回空数组

  const handleTabBarChange = (key: string) => {
    navigate(key);
  };

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Outlet />
      </div>
      <div className={styles.bottom}>
        <TabBar activeKey={pathname} onChange={handleTabBarChange}>
          {tabItems.map(item => (
            // 只有当 title 和 icon 都存在时，才渲染这个 Tab
            item.title && item.icon ? (
              <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ) : null
          ))}
        </TabBar>
      </div>
    </div>
  );
}
