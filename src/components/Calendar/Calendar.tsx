import { useState } from 'react';
import styles from './Calendar.module.css';

// 【第 2 步的 JS 逻辑】我们把它们作为组件内部的帮助函数
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

// 定义组件接收的 Props
interface CustomCalendarProps {
  onDateSelect: (date: Date) => void; // 用于向父组件“喊话”
}

export default function CustomCalendar({ onDateSelect }: CustomCalendarProps) {
  // --- 状态管理 ---
  // 1. 使用 state 来管理当前显示的年月
  const [currentDate, setCurrentDate] = useState(new Date());
  // 2. 使用 state 来管理用户选中的日期
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // --- 动态生成日历数据 ---
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDaysArray = Array.from({ length: firstDayOfMonth });

  // --- 事件处理 ---
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const handleDateClick = (day: number) => {
    const newSelectedDate = new Date(year, month, day);
    setSelectedDate(newSelectedDate);
    // 【核心】当用户点击日期时，调用从 props 传来的 onDateSelect 函数
    // 把选中的日期“通知”给父组件
    onDateSelect(newSelectedDate);
  };
  
  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>{`${year}年 ${month + 1}月`}</span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>

      <div className={styles.weekdays}>
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className={styles.days}>
        {/* 渲染上个月的空白格子 */}
        {emptyDaysArray.map((_, index) => (
          <div key={`empty-${index}`} className={`${styles.day} ${styles.empty}`}></div>
        ))}

        {/* 渲染本月的日期 */}
        {daysArray.map(day => {
          // 动态计算每个日期的 class
          const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
          
          const dayClasses = [
            styles.day,
            isSelected ? styles.selected : '',
            isToday ? styles.today : '',
          ].join(' '); // 组合多个 class

          return (
            <div
              key={day}
              className={dayClasses}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
