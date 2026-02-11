import { useState } from "react";
// 确保你的 CSS 文件中定义了 .calendar, .header, .daysOfWeek, .datesGrid, .date 等类
import styles from "./PeriodCalendar.module.css";


interface PeriodCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (dates:{start: Date | null, end: Date | null}) => void;
}


// 1. 保留并使用这些辅助函数，避免重复代码
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export default function PeriodCalendar({startDate, endDate, onDateChange}: PeriodCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 2. 简化 handleDateClick 逻辑
  const handleDateClick = (day: number): void => {
    const newSelectedDate = new Date(year, month, day);

    if (!startDate || (startDate && endDate)) {
      // setStartDate(newSelectedDate);
      // setEndDate(null);
      onDateChange({ start: newSelectedDate, end: null})
    } else { // 此时必定是 startDate 存在且 endDate 不存在
      if (newSelectedDate < startDate) {
        onDateChange({ start: newSelectedDate, end: null})
      } else {
        onDateChange({ start: startDate, end: newSelectedDate})
      }
    }
  };

  const dayNames = ["日", "一", "二", "三", "四", "五", "六"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // --- 日期计算和渲染 ---
  const daysInMonth = getDaysInMonth(year, month);
  const startDayOfWeek = getFirstDayOfMonth(year, month);

  const dates = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    // 3. 正确使用 CSS Modules
    dates.push(<div className={`${styles.date} ${styles.empty}`} key={`empty-start-${i}`}></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    // 4. 正确拼接多个 CSS Modules 类名
    const classNames = [styles.date];

    if (startDate && endDate && date > startDate && date < endDate) {
      classNames.push(styles.inRange);
    }
    if (startDate && date.getTime() === startDate.getTime()) {
      classNames.push(styles.startDate);
    }
    if (endDate && date.getTime() === endDate.getTime()) {
      classNames.push(styles.endDate);
    }

    dates.push(
      <div className={classNames.join(' ')} key={`day-${i}`} onClick={() => handleDateClick(i)}>
        <div className={styles.day}>{i}</div>
      </div>
    );
  }

  return (
    // 5. 在所有地方都使用正确的 styles 对象
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={prevMonth}>&lt;</button>
        <span>{`${year}年 ${month + 1}月`}</span>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className={styles.weekdays}>
        {dayNames.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className={styles.days}>
        {dates}
      </div>
    </div>
  );
}
