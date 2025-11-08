export const PITCH_TYPES = {
  '5v5': 'Sân 5 người',
  '7v7': 'Sân 7 người'
};

export const BOOKING_STATUS = {
  pending: { label: 'Chờ xác nhận', color: 'warning' },
  confirmed: { label: 'Đã xác nhận', color: 'info' },
  cancelled: { label: 'Đã hủy', color: 'danger' },
  completed: { label: 'Hoàn thành', color: 'success' }
};

export const PITCH_STATUS = {
  active: { label: 'Hoạt động', color: 'success' },
  inactive: { label: 'Ngưng hoạt động', color: 'danger' },
  maintenance: { label: 'Bảo trì', color: 'warning' }
};

export const USER_ROLES = {
  admin: 'Quản trị viên',
  customer: 'Khách hàng'
};

export const TIME_SLOTS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00'
];

export const DURATIONS = [
  { value: 0.5, label: '30 phút' },
  { value: 1, label: '1 giờ' },
  { value: 1.5, label: '1.5 giờ' },
  { value: 2, label: '2 giờ' },
  { value: 2.5, label: '2.5 giờ' },
  { value: 3, label: '3 giờ' }
];
