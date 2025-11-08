export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatTime = (timeString) => {
  return timeString.substring(0, 5);
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + (duration * 60);
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

export const getStatusBadgeClass = (status, type = 'booking') => {
  const statusMap = {
    booking: {
      pending: 'badge-warning',
      confirmed: 'badge-info',
      cancelled: 'badge-danger',
      completed: 'badge-success'
    },
    pitch: {
      active: 'badge-success',
      inactive: 'badge-danger',
      maintenance: 'badge-warning'
    }
  };
  return statusMap[type]?.[status] || 'badge-info';
};
