// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// import 'antd-mobile/es/global'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 1. 直接从我们的“地图”文件导入路由配置
import { routes } from './router';

// 引入全局样式
import 'antd-mobile/es/global';
import './index.css';

// 2. 使用地图配置来创建路由
const router = createBrowserRouter(routes);

// 3. 启动应用
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
