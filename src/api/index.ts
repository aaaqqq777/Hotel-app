// src/api/index.ts
import { createApiService } from './service';

// 从环境变量获取API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 创建API服务实例
export const api = createApiService(API_BASE_URL);

// 导出API模块
export * from './modules';
