// 在 DomesticSearchForm.tsx 中
import { useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
// import CustomCalendar from '../../components/Calendar/Calendar';
import PeriodCalendar from '../../components/PeriodCalendar/PeriodCalendar';
export default function Test() {
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [start, setStartDate] = useState<Date | null>(null);
  const [end, setEndDate] = useState<Date | null>(null);
  const handleDateSelectedFromCalendar = (dates:{start: Date | null, end: Date | null}) => {
    setStartDate(dates.start);
    setEndDate(dates.end);
    // 这里你可以进一步处理，比如关闭一个弹窗等
  };
  const nights = (start && end) 
    ? differenceInCalendarDays(end, start) 
    : 0;
  return (
    <div>
      
      <h1>酒店预订</h1>
      <p>请选择您的入住和离店日期</p>
      
      {/* <CustomCalendar onDateSelect={handleDateSelectedFromCalendar} /> */}
      <PeriodCalendar 
        startDate={start}
        endDate={end}
        onDateChange={handleDateSelectedFromCalendar}
        />
      <h3>您选择的日期：</h3>
        <p>
          <strong>入住:</strong> {start ? start.toLocaleDateString() : '---'}
        </p>
        <p>
          <strong>离店:</strong> {end ? end.toLocaleDateString() : '---'}
        </p>
        {nights > 0 && <p><strong>共计:</strong> {nights} 晚</p>}
    </div>
  );
}
