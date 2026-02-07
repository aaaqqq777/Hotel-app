// src/components/Header.tsx

// 引入一些样式
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="logo">
        🏨 旅途之家
      </div>
      <nav className="navigation">
        <a href="/">首页</a>
        <a href="/deals">优惠</a>
        <a href="/login">登录</a>
      </nav>
    </header>
  );
}

export default Header;
