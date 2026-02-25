// src/api/service.ts
import axios from 'axios';

/**
 * 创建API服务实例
 * @param baseURL API基础URL
 * @returns 配置好的axios实例
 */
export function createApiService(baseURL: string) {
  const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  apiClient.interceptors.request.use(
    (config) => {
      // 可以在这里添加认证token等
      // const token = localStorage.getItem('token');
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // 响应拦截器
  apiClient.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      // 统一错误处理
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

  return apiClient;
}
