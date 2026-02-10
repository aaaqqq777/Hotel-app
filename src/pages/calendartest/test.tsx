// 在 DomesticSearchForm.tsx 中
import { useState } from 'react';
import CustomCalendar from '../../components/Calendar/Calendar';
export default function Test() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelectedFromCalendar = (date: Date) => {
    console.log('日历组件通知我，用户选择了：', date);
    setSelectedDate(date);
    // 这里你可以进一步处理，比如关闭一个弹窗等
  };

  return (
    <div>
      {/* ... 其他表单项 ... */}
      <p>选中的日期是: {selectedDate?.toLocaleDateString() ?? '未选择'}</p>
      
      {/* 直接使用我们的日历组件 */}
      <CustomCalendar onDateSelect={handleDateSelectedFromCalendar} />
    </div>
  );
}
