import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from './test-utils';
import HotelListPage from '../../pages/HotelListPage/HotelListPage';
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
  useInfiniteHotelList: () => ({
    data: {
      pages: [
        {
          data: {
            total: 2,
            list: [
              {
                _id: '1',
                name_cn: '测试酒店1',
                cover_image: 'test1.jpg',
                min_price: 500,
                score: 4.5,
                location: { district: '浦东新区', address: '世纪大道1号' },
                star_rating: 4,
              },
              {
                _id: '2',
                name_cn: '测试酒店2',
                cover_image: 'test2.jpg',
                min_price: 800,
                score: 4.8,
                location: { district: '黄浦区', address: '南京东路100号' },
                star_rating: 5,
              },
            ],
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
  useHotelRoomTypes: () => ({
    data: [],
    isLoading: false,
  }),
}));

// Mock antd-mobile components that might not render properly in tests
vi.mock('antd-mobile', async () => {
  const actual = await import('antd-mobile');
  return {
    ...actual,
    InfiniteScroll: ({ children, hasMore, onLoadMore }: any) => (
      <div data-testid="infinite-scroll" onClick={onLoadMore}>
        {children}
        {hasMore && <div data-testid="load-more-trigger">加载更多</div>}
      </div>
    ),
  };
});

describe('列表页组件测试', () => {
  beforeEach(() => {
    (useSearchParams as vi.Mock).mockReturnValue([new URLSearchParams()]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('应正确渲染酒店列表页面', () => {
    render(<HotelListPage />);
    
    // 检查页面标题或主要元素
    expect(screen.getByText(/酒店列表/i)).toBeInTheDocument();
    
    // 检查是否存在酒店卡片
    expect(screen.getByText('测试酒店1')).toBeInTheDocument();
    expect(screen.getByText('测试酒店2')).toBeInTheDocument();
    
    // 检查是否存在筛选和排序组件
    expect(screen.getByText('智能排序')).toBeInTheDocument();
  });

  it('应正确显示酒店卡片信息', () => {
    render(<HotelListPage />);
    
    const hotelCard1 = screen.getByText('测试酒店1').closest('.hotel-card') || screen.getByText('测试酒店1');
    const hotelCard2 = screen.getByText('测试酒店2').closest('.hotel-card') || screen.getByText('测试酒店2');
    
    // 检查酒店名称
    expect(within(hotelCard1).getByText('测试酒店1')).toBeInTheDocument();
    expect(within(hotelCard2).getByText('测试酒店2')).toBeInTheDocument();
    
    // 检查价格信息
    expect(screen.getByText('¥500起')).toBeInTheDocument();
    expect(screen.getByText('¥800起')).toBeInTheDocument();
    
    // 检查评分信息
    expect(screen.getByText('4.5分')).toBeInTheDocument();
    expect(screen.getByText('4.8分')).toBeInTheDocument();
  });

  it('应正确处理筛选条件', async () => {
    render(<HotelListPage />);
    
    // 检查初始筛选状态
    expect(screen.getByText('价格')).toBeInTheDocument();
    expect(screen.getByText('星级')).toBeInTheDocument();
    
    // 模拟点击价格筛选
    const priceFilter = screen.getByText('价格');
    fireEvent.click(priceFilter);
    
    // 等待筛选选项出现
    await waitFor(() => {
      expect(screen.getByText('300以下')).toBeInTheDocument();
    });
    
    // 模拟选择价格范围
    const priceOption = screen.getByText('300-500');
    fireEvent.click(priceOption);
    
    // 检查状态是否更新
    expect(screen.getByText('300-500')).toBeInTheDocument();
  });

  it('应正确处理排序功能', async () => {
    render(<HotelListPage />);
    
    // 检查初始排序
    expect(screen.getByText('智能排序')).toBeInTheDocument();
    
    // 点击排序按钮
    const sortButton = screen.getByText('智能排序');
    fireEvent.click(sortButton);
    
    // 等待排序选项出现
    await waitFor(() => {
      expect(screen.getByText('价格从低到高')).toBeInTheDocument();
    });
    
    // 选择价格从低到高排序
    const priceAscOption = screen.getByText('价格从低到高');
    fireEvent.click(priceAscOption);
    
    // 检查排序状态是否更新
    expect(screen.queryByText('智能排序')).not.toBeInTheDocument();
    expect(screen.getByText('价格从低到高')).toBeInTheDocument();
  });

  it('应正确处理标签筛选', async () => {
    render(<HotelListPage />);
    
    // 检查是否存在标签筛选栏
    expect(screen.getByText('全部')).toBeInTheDocument();
    
    // 模拟点击标签
    const tag = screen.getByText('商务出行');
    fireEvent.click(tag);
    
    // 检查标签是否被选中
    expect(tag).toHaveClass('selected');
  });

  it('应正确处理无限滚动加载', async () => {
    const mockFetchNextPage = vi.fn();
    const mockHasNextPage = true;
    
    vi.mocked(useInfiniteHotelList).mockReturnValue({
      data: {
        pages: [
          {
            data: {
              total: 20,
              list: Array.from({ length: 10 }, (_, i) => ({
                _id: `${i + 1}`,
                name_cn: `测试酒店${i + 1}`,
                cover_image: `test${i + 1}.jpg`,
                min_price: 500 + i * 50,
                score: 4.0 + i * 0.1,
                location: { district: '区域', address: `地址${i + 1}` },
                star_rating: 4,
              })),
            },
          },
        ],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: mockHasNextPage,
      isLoading: false,
      isFetchingNextPage: false,
      refetch: vi.fn(),
    });
    
    render(<HotelListPage />);
    
    // 检查是否存在加载更多元素
    const loadMoreTrigger = screen.getByTestId('load-more-trigger');
    expect(loadMoreTrigger).toBeInTheDocument();
    
    // 模拟滚动到底部触发加载更多
    fireEvent.click(loadMoreTrigger);
    
    // 检查是否调用了加载更多函数
    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalled();
    });
  });

  it('应正确处理筛选状态保持', () => {
    // 模拟带有筛选参数的 URL
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set('price', '200-500');
    mockSearchParams.set('rating', '4星');
    mockSearchParams.set('sort', 'price-asc');
    
    (useSearchParams as vi.Mock).mockReturnValue([mockSearchParams]);
    
    render(<HotelListPage />);
    
    // 检查筛选状态是否从 URL 参数正确恢复
    expect(screen.getByText('200-500')).toBeInTheDocument();
    expect(screen.getByText('4星')).toBeInTheDocument();
  });
});