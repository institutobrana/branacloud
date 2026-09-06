import { Calendar, Popover } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import dayjs from 'dayjs';
import { CalendarOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

function toDateValue(value) {
  return value ? dayjs(value) : dayjs();
}

export function AgendaDateNavigator() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => dayjs());

  useEffect(() => {
    const onCalendarState = (event) => {
      const date = event.detail?.focusDate || event.detail?.date;
      if (date) setSelectedDate(toDateValue(date));
    };
    window.addEventListener('brana-agenda-calendar-state', onCalendarState);
    return () => window.removeEventListener('brana-agenda-calendar-state', onCalendarState);
  }, []);

  const selectDate = (date) => {
    setSelectedDate(date);
    window.dispatchEvent(new CustomEvent('brana-agenda-calendar-date-select', {
      detail: { date: date.format('YYYY-MM-DD') },
    }));
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomLeft"
      content={<Calendar locale={ptBR.Calendar} fullscreen={false} style={{ width: 320 }} value={selectedDate} onSelect={selectDate} />}
    >
      <button type="button" className="auxiliary-shell-button agenda-functional-icon-button" aria-label="Calendário" title="Calendário">
        <CalendarOutlined aria-hidden="true" />
      </button>
    </Popover>
  );
}
