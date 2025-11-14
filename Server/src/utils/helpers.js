import { format, parseISO, addHours } from 'date-fns';

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  try {
    return format(parseISO(date), formatStr);
  } catch (error) {
    return date;
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = addHours(startDate, duration);
  return format(endDate, 'HH:mm');
};

export const isTimeSlotAvailable = (bookings, startTime, duration) => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = startMinutes + (duration * 60);

  for (const booking of bookings) {
    const [bookHour, bookMin] = booking.start_time.split(':').map(Number);
    const bookStartMinutes = bookHour * 60 + bookMin;
    const bookEndMinutes = bookStartMinutes + (booking.duration * 60);

    if (
      (startMinutes >= bookStartMinutes && startMinutes < bookEndMinutes) ||
      (endMinutes > bookStartMinutes && endMinutes <= bookEndMinutes) ||
      (startMinutes <= bookStartMinutes && endMinutes >= bookEndMinutes)
    ) {
      return false;
    }
  }

  return true;
};
