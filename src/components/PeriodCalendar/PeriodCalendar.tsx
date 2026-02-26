import { useState } from "react";
import styles from "./PeriodCalendar.module.css";
import type { JSX } from "react";
interface PeriodCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

/** 统一的“今天”基准（去掉时分秒） */
const today = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

/** 工具函数 */
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export default function PeriodCalendar({
  startDate,
  endDate,
  onDateChange,
}: PeriodCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  /** 日期点击（带防御校验） */
  const handleDateClick = (day: number): void => {
    const newSelectedDate = new Date(year, month, day);
    newSelectedDate.setHours(0, 0, 0, 0);

    // 兜底：禁止选择今天之前
    if (newSelectedDate < today) return;

    if (!startDate || endDate) {
      onDateChange(newSelectedDate, null);
    } else {
      if (newSelectedDate < startDate) {
        onDateChange(newSelectedDate, null);
      } else {
        onDateChange(startDate, newSelectedDate);
      }
    }
  };

  const dayNames = ["日", "一", "二", "三", "四", "五", "六"];

  /** 上一月（防止翻到全是过去日期的月份） */
  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    const endOfPrevMonth = new Date(
      prev.getFullYear(),
      prev.getMonth() + 1,
      0
    );
    endOfPrevMonth.setHours(0, 0, 0, 0);

    if (endOfPrevMonth < today) return;

    setCurrentDate(prev);
  };

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  /** 日期计算 */
  const daysInMonth = getDaysInMonth(year, month);
  const startDayOfWeek = getFirstDayOfMonth(year, month);

  const dates: JSX.Element[] = [];

  // 月初空白
  for (let i = 0; i < startDayOfWeek; i++) {
    dates.push(
      <div
        className={`${styles.date} ${styles.empty}`}
        key={`empty-start-${i}`}
      />
    );
  }

  // 本月日期
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    date.setHours(0, 0, 0, 0);

    const isPast = date < today;

    const classNames = [styles.date];

    if (isPast) {
      classNames.push(styles.disabled);
    }

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
      <div
        key={`day-${i}`}
        className={classNames.join(" ")}
        onClick={isPast ? undefined : () => handleDateClick(i)}
      >
        <div className={styles.day}>{i}</div>
      </div>
    );
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={prevMonth}>&lt;</button>
        <span>{`${year}年 ${month + 1}月`}</span>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div className={styles.weekdays}>
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className={styles.days}>{dates}</div>
    </div>
  );
}