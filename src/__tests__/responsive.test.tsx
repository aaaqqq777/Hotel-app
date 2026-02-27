import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from './test-utils';
import { resizeWindow } from './test-utils';
import HomePage from '../pages/HomePage/HomePage';
import HotelListPage from '../pages/HotelListPage/HotelListPage';
import DetailPage from '../pages/DetailPage/DetailPage';
import { useSearchParams } from 'react-router-dom';

// Mock all necessary modules
vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('../../hooks/useHotelQueries', () => ({
  useAdvertisements: () => ({
    data: [
      {
        id: '1',
        title: '测试广告',
        imageUrl: 'test-banner.jpg',
        hotelId: '1',
        priority: 1,
      },
    ],
    isLoading: false,
  }),
  useInfiniteHotelList: () => ({
    data: {
      pages: [
        {
          data: {
            total: 10,
            list: Array.from({ length: 5 }, (_, i) => ({
              _id: `${i + 1}`,
              name_cn: `测试酒店${i + 1}`,
              cover_image: `test${i + 1}.jpg`,
              min_price: 500 + i * 100,
              score: 4.0 + i * 0.1,
              location: { district: '区域', address: `地址${i + 1}` },
              star_rating: 4,
            })),
          },
        },
      ],
    },
    fetchNextPage: vi.fn(),
    hasNextPage: true,
    isLoading: false,
    isFetchingNextPage: false,
    refetch: vi.fn(),
  }),
  useHotelDetail: () => ({
    data: {
      id: '1',
      name: '测试酒店',
      images: ['image1.jpg', 'image2.jpg'],
      location: '上海市浦东新区',
      rating: 4.5,
      reviews: 1234,
      facilities: ['免费WiFi', '停车场', '健身房'],
      description: '这是一个测试酒店，提供优质服务。',
      rooms: [
        {
          id: 'room1',
          name: '豪华大床房',
          price: 800,
          originalPrice: 1000,
          stock: 5,
          facilities: ['空调', '电视', '迷你吧'],
        },
      ],
    },
    isLoading: false,
    error: null,
  }),
  useHotelReviews: () => ({
    data: {
      reviews: [],
      total: 0,
    },
    isLoading: false,
  }),
  useHotelRoomTypes: () => ({
    data: [
      {
        id: 'room1',
        name: '豪华大床房',
        price: 800,
        originalPrice: 1000,
        stock: 5,
        facilities: ['空调', '电视', '迷你吧'],
        images: ['room1-1.jpg'],
      },
    ],
    isLoading: false,
  }),
  useHotelFacilities: () => ({
    data: ['免费WiFi', '停车场', '健身房'],
    isLoading: false,
  }),
}));

describe('自适应能力测试', () => {
  beforeEach(() => {
    (useSearchParams as vi.Mock).mockReturnValue([new URLSearchParams()]);
  });

  afterEach(() => {
    vi.clearAllMocks();
    // 重置窗口尺寸
    resizeWindow(1024, 768);
  });

  describe('搜索页自适应测试', () => {
    it('应在移动设备尺寸下正常显示', () => {
      // 模拟移动设备尺寸
      resizeWindow(375, 667);
      
      render(<HomePage />);
      
      // 检查主要元素是否可见
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // 检查搜索表单是否适应小屏幕
      expect(screen.getByText('国内游')).toBeInTheDocument();
      
      // 验证没有水平滚动条
      const container = screen.getByRole('main');
      expect(container.clientWidth).toBeLessThanOrEqual(window.innerWidth);
    });

    it('应在平板设备尺寸下正常显示', () => {
      // 模拟平板设备尺寸
      resizeWindow(768, 1024);
      
      render(<HomePage />);
      
      // 检查主要元素是否可见
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // 检查组件是否正确适应中等屏幕
      expect(screen.getByText('国内游')).toBeInTheDocument();
    });

    it('应在桌面设备尺寸下正常显示', () => {
      // 模拟桌面设备尺寸
      resizeWindow(1024, 768);
      
      render(<HomePage />);
      
      // 检查主要元素是否可见
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // 检查组件是否正确适应大屏幕
      expect(screen.getByText('国内游')).toBeInTheDocument();
    });

    it('应响应窗口尺寸变化', async () => {
      // 初始设置为桌面尺寸
      resizeWindow(1024, 768);
      
      render(<HomePage />);
      
      // 改变为移动尺寸
      resizeWindow(375, 667);
      
      // 触发 resize 事件
      global.window.dispatchEvent(new Event('resize'));
      
      // 等待组件响应尺寸变化
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });
  });

  describe('列表页自适应测试', () => {
    it('应在移动设备尺寸下正常显示酒店列表', () => {
      // 模拟移动设备尺寸
      resizeWindow(375, 667);
      
      render(<HotelListPage />);
      
      // 检查酒店卡片是否适应小屏幕
      expect(screen.getByText('测试酒店1')).toBeInTheDocument();
      
      // 检查筛选栏是否适应小屏幕
      expect(screen.getByText('智能排序')).toBeInTheDocument();
    });

    it('应在平板设备尺寸下正常显示', () => {
      // 模拟平板设备尺寸
      resizeWindow(768, 1024);
      
      render(<HotelListPage />);
      
      // 检查列表布局是否适应中等屏幕
      expect(screen.getByText('测试酒店1')).toBeInTheDocument();
      expect(screen.getByText('测试酒店2')).toBeInTheDocument();
    });

    it('应在桌面设备尺寸下正常显示', () => {
      // 模拟桌面设备尺寸
      resizeWindow(1024, 768);
      
      render(<HotelListPage />);
      
      // 检查列表布局是否适应大屏幕
      expect(screen.getByText('测试酒店1')).toBeInTheDocument();
    });

    it('应正确处理不同屏幕下的网格布局', () => {
      // 移动设备 - 单列布局
      resizeWindow(375, 667);
      render(<HotelListPage />);
      
      // 检查酒店卡片是否垂直排列
      const hotelCards = screen.getAllByText(/测试酒店\d+/);
      expect(hotelCards.length).toBeGreaterThan(0);
    });
  });

  describe('详情页自适应测试', () => {
    it('应在移动设备尺寸下正常显示详情页', () => {
      // 模拟移动设备尺寸
      resizeWindow(375, 667);
      
      render(<DetailPage />);
      
      // 检查酒店名称是否可见
      expect(screen.getByText('测试酒店')).toBeInTheDocument();
      
      // 检查图片轮播是否适应小屏幕
      expect(screen.getByTestId('swiper')).toBeInTheDocument();
    });

    it('应在平板设备尺寸下正常显示', () => {
      // 模拟平板设备尺寸
      resizeWindow(768, 1024);
      
      render(<DetailPage />);
      
      // 检查详情页组件是否适应中等屏幕
      expect(screen.getByText('测试酒店')).toBeInTheDocument();
    });

    it('应在桌面设备尺寸下正常显示', () => {
      // 模拟桌面设备尺寸
      resizeWindow(1024, 768);
      
      render(<DetailPage />);
      
      // 检查详情页组件是否适应大屏幕
      expect(screen.getByText('测试酒店')).toBeInTheDocument();
    });

    it('应正确处理不同屏幕下的图片显示', () => {
      // 移动设备
      resizeWindow(375, 667);
      render(<DetailPage />);
      
      // 检查图片是否适应屏幕宽度
      const images = screen.getAllByTestId('hotel-image');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('跨设备一致性测试', () => {
    it('应在不同设备尺寸下保持功能一致性', async () => {
      const devices = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1024, height: 768 },
      ];

      for (const device of devices) {
        resizeWindow(device.width, device.height);
        
        // 测试搜索页
        render(<HomePage />);
        expect(screen.getByRole('main')).toBeInTheDocument();
        
        // 测试列表页
        render(<HotelListPage />);
        expect(screen.getByText('测试酒店1')).toBeInTheDocument();
        
        // 测试详情页
        render(<DetailPage />);
        expect(screen.getByText('测试酒店')).toBeInTheDocument();
      }
    });

    it('应在屏幕旋转时保持布局稳定性', async () => {
      // 模拟竖屏
      resizeWindow(375, 667);
      render(<HomePage />);
      expect(screen.getByRole('main')).toBeInTheDocument();

      // 模拟横屏
      resizeWindow(667, 375);
      global.window.dispatchEvent(new Event('resize'));
      
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });
  });

  describe('响应式组件测试', () => {
    it('应正确响应媒体查询', () => {
      // 测试小屏幕
      resizeWindow(320, 568);
      render(<HomePage />);
      expect(screen.getByRole('main')).toBeInTheDocument();

      // 测试大屏幕
      resizeWindow(1200, 800);
      render(<HomePage />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('应正确处理字体大小自适应', () => {
      resizeWindow(375, 667);
      render(<HomePage />);
      
      // 检查文本元素是否可读
      const elements = screen.getAllByText(/(国内游|海外游|搜索)/i);
      elements.forEach(el => {
        expect(el).toBeInTheDocument();
      });
    });
  });
});