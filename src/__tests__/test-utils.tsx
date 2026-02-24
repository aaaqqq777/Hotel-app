import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 创建一个测试用的 QueryClient
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 避免在测试中重试
      cacheTime: 0, // 立即清除缓存
    },
  },
});

// 创建测试渲染器
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const testQueryClient = createTestQueryClient();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// 用于模拟不同屏幕尺寸的工具函数
const resizeWindow = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  Object.defineProperty(document.documentElement, 'clientWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(document.documentElement, 'clientHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

// 模拟网络状态的工具函数
const mockNetworkConditions = (online: boolean) => {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    configurable: true,
    value: online,
  });
};

// 模拟地理位置的工具函数
const mockGeolocation = () => {
  const mockLocation = {
    coords: {
      latitude: 31.2304,
      longitude: 121.4737,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  };

  Object.defineProperty(navigator, 'geolocation', {
    value: {
      getCurrentPosition: jest.fn().mockImplementation((success) => success(mockLocation)),
      watchPosition: jest.fn().mockImplementation((success) => success(mockLocation)),
      clearWatch: jest.fn(),
    },
    writable: true,
  });
};

// 导出所有工具函数
export * from '@testing-library/react';
export { customRender as render, resizeWindow, mockNetworkConditions, mockGeolocation };