import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from './test-utils';
import DetailPage from '../../pages/DetailPage/DetailPage';
import { useSearchParams } from 'react-router-dom';

// Mock hooks and API
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

vi.mock('../../hooks/useHotelQueries', () => ({
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
        {
          id: 'room2',
          name: '双床房',
          price: 600,
          originalPrice: 800,
          stock: 3,
          facilities: ['空调', '电视'],
        },
      ],
    },
    isLoading: false,
    error: null,
  }),
  useHotelReviews: () => ({
    data: {
      reviews: [
        {
          id: 'review1',
          userName: '张三',
          rating: 5,
          content: '酒店环境很好，服务也很棒！',
          date: '2023-10-15',
        },
        {
          id: 'review2',
          userName: '李四',
          rating: 4,
          content: '房间干净整洁，位置便利。',
          date: '2023-10-10',
        },
      ],
      total: 2,
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
        images: ['room1-1.jpg', 'room1-2.jpg'],
      },
      {
        id: 'room2',
        name: '双床房',
        price: 600,
        originalPrice: 800,
        stock: 3,
        facilities: ['空调', '电视'],
        images: ['room2-1.jpg'],
      },
    ],
    isLoading: false,
  }),
  useHotelFacilities: () => ({
    data: ['免费WiFi', '停车场', '健身房', '餐厅', '游泳池'],
    isLoading: false,
  }),
}));

// Mock image component since it might not load in tests
vi.mock('antd-mobile', async () => {
  const actual = await import('antd-mobile');
  return {
    ...actual,
    Image: ({ src, alt, onClick, ...props }: any) => (
      <img 
        src={src} 
        alt={alt} 
        onClick={onClick}
        data-testid="hotel-image"
        {...props} 
      />
    ),
    Swiper: ({ children, ...props }: any) => (
      <div data-testid="swiper" {...props}>
        {children}
      </div>
    ),
    SwiperItem: ({ children, ...props }: any) => (
      <div data-testid="swiper-item" {...props}>
        {children}
      </div>
    ),
  };
});

describe('详情页组件测试', () => {
  beforeEach(() => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set('id', '1');
    (useSearchParams as vi.Mock).mockReturnValue([mockSearchParams]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('应正确渲染酒店详情页面', () => {
    render(<DetailPage />);
    
    // 检查酒店名称
    expect(screen.getByText('测试酒店')).toBeInTheDocument();
    
    // 检查酒店位置
    expect(screen.getByText('上海市浦东新区')).toBeInTheDocument();
    
    // 检查评分
    expect(screen.getByText('4.5分')).toBeInTheDocument();
    
    // 检查评论数
    expect(screen.getByText('1234条评价')).toBeInTheDocument();
  });

  it('应正确显示酒店图片轮播', () => {
    render(<DetailPage />);
    
    // 检查图片轮播组件
    const swiper = screen.getByTestId('swiper');
    expect(swiper).toBeInTheDocument();
    
    // 检查图片数量
    const images = screen.getAllByTestId('hotel-image');
    expect(images).toHaveLength(2); // 根据 mock 数据，有2张图片
  });

  it('应正确显示酒店设施', () => {
    render(<DetailPage />);
    
    // 检查设施列表
    expect(screen.getByText('免费WiFi')).toBeInTheDocument();
    expect(screen.getByText('停车场')).toBeInTheDocument();
    expect(screen.getByText('健身房')).toBeInTheDocument();
  });

  it('应正确显示房型列表', () => {
    render(<DetailPage />);
    
    // 检查房型名称
    expect(screen.getByText('豪华大床房')).toBeInTheDocument();
    expect(screen.getByText('双床房')).toBeInTheDocument();
    
    // 检查价格信息
    expect(screen.getByText('¥800')).toBeInTheDocument();
    expect(screen.getByText('¥600')).toBeInTheDocument();
    
    // 检查原价信息
    expect(screen.getByText('¥1000')).toBeInTheDocument();
    expect(screen.getByText('¥800')).toBeInTheDocument();
  });

  it('应正确处理房型预订', async () => {
    render(<DetailPage />);
    
    // 找到预订按钮
    const bookButtons = screen.getAllByRole('button', { name: /预订/ });
    expect(bookButtons).toHaveLength(2); // 两种房型
    
    // 点击第一个房型的预订按钮
    fireEvent.click(bookButtons[0]);
    
    // 检查是否显示了预订相关的信息
    await waitFor(() => {
      expect(screen.getByText('剩余5间')).toBeInTheDocument();
    });
  });

  it('应正确显示酒店描述', () => {
    render(<DetailPage />);
    
    // 检查酒店描述
    expect(screen.getByText('这是一个测试酒店，提供优质服务。')).toBeInTheDocument();
  });

  it('应正确处理日期选择', async () => {
    render(<DetailPage />);
    
    // 查找日期选择区域
    const dateSelection = screen.getByText(/选择入住日期/);
    expect(dateSelection).toBeInTheDocument();
    
    // 点击日期选择区域
    fireEvent.click(dateSelection);
    
    // 检查日历组件是否出现
    await waitFor(() => {
      expect(screen.getByText(/入住/)).toBeInTheDocument();
    });
  });

  it('应正确显示房型设施', () => {
    render(<DetailPage />);
    
    // 检查房型设施
    expect(screen.getByText('空调')).toBeInTheDocument();
    expect(screen.getByText('电视')).toBeInTheDocument();
    expect(screen.getByText('迷你吧')).toBeInTheDocument();
  });

  it('应正确处理房型库存显示', () => {
    render(<DetailPage />);
    
    // 检查房型库存信息
    expect(screen.getByText('剩余5间')).toBeInTheDocument(); // 豪华大床房
    expect(screen.getByText('剩余3间')).toBeInTheDocument(); // 双床房
  });

  it('应正确响应不同屏幕尺寸', () => {
    // 模拟移动设备尺寸
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });
    
    render(<DetailPage />);
    
    // 检查组件在移动设备上是否正常渲染
    expect(screen.getByText('测试酒店')).toBeInTheDocument();
    
    // 模拟桌面设备尺寸
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
    
    // 重新渲染以检查响应式行为
    render(<DetailPage />);
    expect(screen.getByText('测试酒店')).toBeInTheDocument();
  });
});