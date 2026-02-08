// src/router/index.ts

import { AppOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import type { RouteObject } from 'react-router-dom';

// 导入所有页面组件
import App from '../App';
import HomePage from '../pages/HomePage/HomePage';
// import ListPage from '../pages/ListPage';
import SearchPage from '../pages/HomePage/SearchPage';
// import OrdersPage from '../pages/OrdersPage'; // 如果还没创建，可以先注释
// import ProfilePage from '../pages/ProfilePage'; // 如果还没创建，可以先注释

// 【核心】为我们的路由对象定义一个更丰富的 TypeScript 接口
// 我们在 react-router-dom 的 RouteObject 基础上，增加了 title 和 icon 属性
export type AppRouteObject = RouteObject & {
  title?: string;
  icon?: React.ReactNode;
  children?: AppRouteObject[];
};

// 【核心】这就是我们完整的“应用地图”数组
export const routes: AppRouteObject[] = [
  {
    path: '/',
    element: <App />, // App 组件作为所有带 TabBar 页面的“外壳”
    children: [
      // 在“外壳”内显示的子页面
      {
        path: '/',
        element: <HomePage />,
        title: '首页',
        icon: <AppOutline />,
      },
      // {
      //   path: '/orders',
      //   element: <OrdersPage />,
      //   title: '订单',
      //   icon: <UnorderedListOutline />,
      // },
      // {
      //   path: '/me',
      //   element: <ProfilePage />,
      //   title: '我的',
      //   icon: <UserOutline />,
      // },
    ],
  },
  {
    // 列表页没有 TabBar，所以我们把它作为一个独立的顶层路由
    path: '/list',
    element: <SearchPage />,
    title: '酒店列表',
  },
  // ...未来可以在这里轻松添加更多顶层路由，比如 /login 登录页
];
