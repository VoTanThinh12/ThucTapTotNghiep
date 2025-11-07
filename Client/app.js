// Mock Data
let pitches = [
  {
    id: 1,
    name: "Sân Bóng Center",
    type: "5v5",
    location: "123 Nguyễn Huệ, Q.1, TP.HCM",
    description: "Sân bóng chất lượng cao, cỏ nhân tạo cao cấp, chiếu sáng hiện đại",
    rules: ["Không được mang giày có đinh", "Phải mang giày bóng đá", "Cấm hút thuốc", "Cấm đồ uống"],
    openTime: "06:00",
    closeTime: "24:00",
    images: ["https://via.placeholder.com/400x300?text=San+Bong+1"],
    minPrice: 300000,
    maxPrice: 500000,
    status: "active",
    priceSlots: {
      "06-09": 300000,
      "09-12": 350000,
      "12-15": 300000,
      "15-18": 400000,
      "18-21": 500000,
      "21-24": 450000
    },
    rating: 4.5,
    reviews: 25
  },
  {
    id: 2,
    name: "Sân Bóng Thế Hệ Trẻ",
    type: "7v7",
    location: "456 Trần Hưng Đạo, Q.5, TP.HCM",
    description: "Sân bóng 7v7 rộng rãi, cỏ tự nhiên, tiện ích đầy đủ",
    rules: ["Phải có vé vào cửa", "Cấm mang vật cấm", "Tuân thủ giờ hoạt động"],
    openTime: "07:00",
    closeTime: "23:00",
    images: ["https://via.placeholder.com/400x300?text=San+Bong+2"],
    minPrice: 400000,
    maxPrice: 600000,
    status: "active",
    priceSlots: {
      "07-10": 400000,
      "10-13": 450000,
      "13-16": 400000,
      "16-19": 550000,
      "19-22": 600000,
      "22-23": 500000
    },
    rating: 4.2,
    reviews: 18
  },
  {
    id: 3,
    name: "Sân Bóng Phú Nhuận",
    type: "5v5",
    location: "789 Điện Biên Phủ, Q.3, TP.HCM",
    description: "Sân bóng mini hiện đại, phù hợp cho các đội bóng chuyên nghiệp",
    rules: ["Cấm trang phục lỏng lẻo", "Cấm vật cấm", "Phải xác nhận trước 2 giờ"],
    openTime: "06:00",
    closeTime: "24:00",
    images: ["https://via.placeholder.com/400x300?text=San+Bong+3"],
    minPrice: 350000,
    maxPrice: 550000,
    status: "active",
    priceSlots: {
      "06-09": 350000,
      "09-12": 400000,
      "12-15": 350000,
      "15-18": 450000,
      "18-21": 550000,
      "21-24": 500000
    },
    rating: 4.8,
    reviews: 35
  }
];

let customers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    totalSpent: 2500000,
    bookingCount: 8,
    createdAt: "2024-01-15",
    status: "active"
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0912345678",
    totalSpent: 1500000,
    bookingCount: 5,
    createdAt: "2024-02-20",
    status: "active"
  },
  {
    id: 3,
    name: "Lê Hoàng C",
    email: "lehoangc@example.com",
    phone: "0923456789",
    totalSpent: 3200000,
    bookingCount: 12,
    createdAt: "2023-12-10",
    status: "active"
  }
];

let bookings = [
  {
    id: 101,
    pitchId: 1,
    customerId: 1,
    date: "2025-11-10",
    startTime: "18:00",
    duration: 1.5,
    totalPrice: 750000,
    depositPaid: true,
    status: "confirmed",
    createdAt: "2025-11-04"
  },
  {
    id: 102,
    pitchId: 2,
    customerId: 2,
    date: "2025-11-12",
    startTime: "19:00",
    duration: 2,
    totalPrice: 1200000,
    depositPaid: true,
    status: "pending",
    createdAt: "2025-11-04"
  },
  {
    id: 103,
    pitchId: 3,
    customerId: 1,
    date: "2025-11-15",
    startTime: "20:00",
    duration: 1,
    totalPrice: 550000,
    depositPaid: false,
    status: "pending",
    createdAt: "2025-11-03"
  },
  {
    id: 104,
    pitchId: 1,
    customerId: 3,
    date: "2025-11-08",
    startTime: "15:00",
    duration: 1.5,
    totalPrice: 600000,
    depositPaid: true,
    status: "confirmed",
    createdAt: "2025-11-02"
  }
];

let users = [
  { id: 1, username: "admin", password: "123456", role: "admin" }
];

// State
let currentView = 'client';
let currentClientView = 'home';
let currentAdminView = 'dashboard';
let filteredPitches = [...pitches];
let currentBookingFilter = 'all';
let currentUser = null;
let charts = {};

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = isError ? 'toast error' : 'toast';
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Navigation Functions
function showClientView(view) {
  currentClientView = view;
  
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Hide all sections
  document.getElementById('hero-section').style.display = 'none';
  document.getElementById('pitches-section').style.display = 'none';
  document.getElementById('bookings-section').style.display = 'none';
  document.getElementById('contact-section').style.display = 'none';
  
  // Show selected section
  if (view === 'home') {
    document.getElementById('hero-section').style.display = 'block';
    document.querySelectorAll('.nav-link')[0].classList.add('active');
  } else if (view === 'pitches') {
    document.getElementById('pitches-section').style.display = 'block';
    document.querySelectorAll('.nav-link')[1].classList.add('active');
    renderPitches();
  } else if (view === 'bookings') {
    document.getElementById('bookings-section').style.display = 'block';
    document.querySelectorAll('.nav-link')[2].classList.add('active');
    renderClientBookings();
  } else if (view === 'contact') {
    document.getElementById('contact-section').style.display = 'block';
    document.querySelectorAll('.nav-link')[3].classList.add('active');
  }
}

function showAdminLogin() {
  document.getElementById('client-section').style.display = 'none';
  document.getElementById('admin-login').style.display = 'block';
}

function backToClient() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('client-section').style.display = 'block';
}

function adminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user && user.role === 'admin') {
    currentUser = user;
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    showAdminView('dashboard');
    showToast('Đăng nhập thành công!');
  } else {
    showToast('Sai tên đăng nhập hoặc mật khẩu!', true);
  }
}

function adminLogout() {
  currentUser = null;
  document.getElementById('admin-section').style.display = 'none';
  document.getElementById('client-section').style.display = 'block';
  showClientView('home');
  showToast('Đã đăng xuất!');
}

function showAdminView(view) {
  currentAdminView = view;
  
  // Update nav links
  document.querySelectorAll('.admin-nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Hide all views
  document.querySelectorAll('.admin-view').forEach(v => {
    v.style.display = 'none';
  });
  
  // Show selected view
  const viewElement = document.getElementById(`admin-${view}`);
  if (viewElement) {
    viewElement.style.display = 'block';
    
    // Find and activate corresponding nav link
    const navLinks = document.querySelectorAll('.admin-nav-link');
    if (view === 'dashboard') navLinks[0].classList.add('active');
    else if (view === 'pitches') navLinks[1].classList.add('active');
    else if (view === 'pricing') navLinks[2].classList.add('active');
    else if (view === 'bookings') navLinks[3].classList.add('active');
    else if (view === 'customers') navLinks[4].classList.add('active');
    else if (view === 'reports') navLinks[5].classList.add('active');
  }
  
  // Load data for each view
  if (view === 'dashboard') {
    loadDashboard();
  } else if (view === 'pitches') {
    renderAdminPitches();
  } else if (view === 'pricing') {
    loadPricingManagement();
  } else if (view === 'bookings') {
    renderAdminBookings();
  } else if (view === 'customers') {
    renderAdminCustomers();
  } else if (view === 'reports') {
    loadReports();
  }
}

// Client Functions
function applyFilters() {
  const type = document.getElementById('filter-type').value;
  const location = document.getElementById('filter-location').value;
  const maxPrice = parseInt(document.getElementById('filter-price').value);
  
  filteredPitches = pitches.filter(pitch => {
    if (type && pitch.type !== type) return false;
    if (location && !pitch.location.includes(location)) return false;
    if (pitch.minPrice > maxPrice) return false;
    return true;
  });
  
  renderPitches();
}

function updatePriceLabel() {
  const price = document.getElementById('filter-price').value;
  document.getElementById('price-label').textContent = `Dưới ${formatCurrency(price)}`;
}

function renderPitches() {
  const grid = document.getElementById('pitches-grid');
  
  if (filteredPitches.length === 0) {
    grid.innerHTML = '<p>Không tìm thấy sân bóng phù hợp.</p>';
    return;
  }
  
  grid.innerHTML = filteredPitches.map(pitch => `
    <div class="pitch-card" onclick="showPitchDetail(${pitch.id})">
      <img src="${pitch.images[0]}" alt="${pitch.name}" class="pitch-image">
      <div class="pitch-content">
        <h3 class="pitch-name">${pitch.name}</h3>
        <p class="pitch-location">📍 ${pitch.location}</p>
        <div class="pitch-meta">
          <span class="pitch-type">${pitch.type}</span>
          <span class="pitch-price">${formatCurrency(pitch.minPrice)} - ${formatCurrency(pitch.maxPrice)}</span>
        </div>
        <div class="pitch-rating">⭐ ${pitch.rating} (${pitch.reviews} đánh giá)</div>
        <div class="pitch-status active">Đang mở cửa</div>
        <button class="btn btn--primary btn--full-width" onclick="event.stopPropagation(); showBookingModal(${pitch.id})">Đặt sân ngay</button>
      </div>
    </div>
  `).join('');
}

function showPitchDetail(pitchId) {
  const pitch = pitches.find(p => p.id === pitchId);
  if (!pitch) return;
  
  const modal = document.getElementById('pitch-detail-modal');
  modal.innerHTML = `
    <div class="modal-header">
      <h2>${pitch.name}</h2>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="pitch-gallery">
        <img src="${pitch.images[0]}" alt="${pitch.name}">
      </div>
      <div style="margin-bottom: 16px;">
        <strong>Loại sân:</strong> ${pitch.type}<br>
        <strong>Địa điểm:</strong> ${pitch.location}<br>
        <strong>Giờ mở cửa:</strong> ${pitch.openTime} - ${pitch.closeTime}<br>
        <strong>Rating:</strong> ⭐ ${pitch.rating} (${pitch.reviews} đánh giá)
      </div>
      <h3>Mô tả</h3>
      <p>${pitch.description}</p>
      <h3 style="margin-top: 20px;">Quy tắc sân</h3>
      <ul class="pitch-rules">
        ${pitch.rules.map(rule => `<li>${rule}</li>`).join('')}
      </ul>
      <h3 style="margin-top: 20px;">Bảng giá theo khung giờ</h3>
      <div class="price-table">
        ${Object.entries(pitch.priceSlots).map(([slot, price]) => `
          <div class="price-row">
            <span>${slot.replace('-', ':00 - ')}:00</span>
            <strong>${formatCurrency(price)}</strong>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn--secondary" onclick="closeModal()">Đóng</button>
      <button class="btn btn--primary" onclick="closeModal(); showBookingModal(${pitch.id})">Đặt sân ngay</button>
    </div>
  `;
  
  openModal(modal);
}

function showBookingModal(pitchId) {
  const pitch = pitches.find(p => p.id === pitchId);
  if (!pitch) return;
  
  const modal = document.getElementById('booking-modal');
  const today = new Date().toISOString().split('T')[0];
  
  modal.innerHTML = `
    <div class="modal-header">
      <h2>Đặt sân: ${pitch.name}</h2>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="booking-step">
        <h3>1. Chọn ngày</h3>
        <input type="date" id="booking-date" class="form-control" min="${today}" onchange="updateBookingPrice()">
      </div>
      
      <div class="booking-step">
        <h3>2. Chọn giờ bắt đầu</h3>
        <select id="booking-time" class="form-control" onchange="updateBookingPrice()">
          <option value="">-- Chọn giờ --</option>
          ${Object.keys(pitch.priceSlots).map(slot => {
            const start = slot.split('-')[0];
            return `<option value="${start}:00">${start}:00</option>`;
          }).join('')}
        </select>
      </div>
      
      <div class="booking-step">
        <h3>3. Chọn thời lượng</h3>
        <select id="booking-duration" class="form-control" onchange="updateBookingPrice()">
          <option value="1">1 giờ</option>
          <option value="1.5">1.5 giờ</option>
          <option value="2">2 giờ</option>
          <option value="2.5">2.5 giờ</option>
          <option value="3">3 giờ</option>
        </select>
      </div>
      
      <div class="booking-step">
        <h3>4. Thông tin liên hệ</h3>
        <div class="form-group">
          <label>Họ tên</label>
          <input type="text" id="booking-name" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="booking-email" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Số điện thoại</label>
          <input type="tel" id="booking-phone" class="form-control" required>
        </div>
      </div>
      
      <div class="booking-step">
        <h3>5. Thanh toán tiền cọc</h3>
        <select id="booking-payment" class="form-control">
          <option value="card">Thẻ tín dụng</option>
          <option value="momo">MoMo</option>
          <option value="bank">Chuyển khoản ngân hàng</option>
        </select>
      </div>
      
      <div class="booking-summary">
        <h3>Tổng kết</h3>
        <div class="summary-row">
          <span>Sân:</span>
          <strong>${pitch.name}</strong>
        </div>
        <div class="summary-row">
          <span>Ngày:</span>
          <strong id="summary-date">--</strong>
        </div>
        <div class="summary-row">
          <span>Giờ:</span>
          <strong id="summary-time">--</strong>
        </div>
        <div class="summary-row">
          <span>Thời lượng:</span>
          <strong id="summary-duration">--</strong>
        </div>
        <div class="summary-row total">
          <span>Tổng tiền:</span>
          <strong id="summary-total">0 VND</strong>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn--secondary" onclick="closeModal()">Hủy</button>
      <button class="btn btn--primary" onclick="completeBooking(${pitchId})">Hoàn thành đặt sân</button>
    </div>
  `;
  
  openModal(modal);
}

function updateBookingPrice() {
  const pitchId = parseInt(document.querySelector('#booking-modal .modal-header h2').textContent.match(/\d+/)?.[0] || 0);
  const pitch = pitches.find(p => p.id === pitchId);
  if (!pitch) return;
  
  const date = document.getElementById('booking-date')?.value;
  const time = document.getElementById('booking-time')?.value;
  const duration = parseFloat(document.getElementById('booking-duration')?.value || 1);
  
  document.getElementById('summary-date').textContent = date || '--';
  document.getElementById('summary-time').textContent = time || '--';
  document.getElementById('summary-duration').textContent = duration ? `${duration} giờ` : '--';
  
  if (time) {
    const hour = parseInt(time.split(':')[0]);
    let totalPrice = 0;
    
    // Calculate price based on time slots
    for (const [slot, price] of Object.entries(pitch.priceSlots)) {
      const [start, end] = slot.split('-').map(Number);
      if (hour >= start && hour < end) {
        totalPrice = price * duration;
        break;
      }
    }
    
    document.getElementById('summary-total').textContent = formatCurrency(totalPrice);
  } else {
    document.getElementById('summary-total').textContent = '0 VND';
  }
}

function completeBooking(pitchId) {
  const date = document.getElementById('booking-date').value;
  const time = document.getElementById('booking-time').value;
  const duration = parseFloat(document.getElementById('booking-duration').value);
  const name = document.getElementById('booking-name').value;
  const email = document.getElementById('booking-email').value;
  const phone = document.getElementById('booking-phone').value;
  
  if (!date || !time || !name || !email || !phone) {
    showToast('Vui lòng điền đầy đủ thông tin!', true);
    return;
  }
  
  const pitch = pitches.find(p => p.id === pitchId);
  const hour = parseInt(time.split(':')[0]);
  let totalPrice = 0;
  
  for (const [slot, price] of Object.entries(pitch.priceSlots)) {
    const [start, end] = slot.split('-').map(Number);
    if (hour >= start && hour < end) {
      totalPrice = price * duration;
      break;
    }
  }
  
  // Create or find customer
  let customer = customers.find(c => c.email === email);
  if (!customer) {
    customer = {
      id: customers.length + 1,
      name,
      email,
      phone,
      totalSpent: 0,
      bookingCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    customers.push(customer);
  }
  
  // Create booking
  const booking = {
    id: bookings.length + 101,
    pitchId,
    customerId: customer.id,
    date,
    startTime: time,
    duration,
    totalPrice,
    depositPaid: true,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  bookings.push(booking);
  customer.bookingCount++;
  
  closeModal();
  showToast('Đặt sân thành công! Vui lòng chờ xác nhận.');
}

function renderClientBookings() {
  const container = document.getElementById('bookings-list');
  const userBookings = bookings.filter(b => {
    if (currentBookingFilter === 'all') return true;
    return b.status === currentBookingFilter;
  });
  
  if (userBookings.length === 0) {
    container.innerHTML = '<p>Chưa có đơn đặt sân nào.</p>';
    return;
  }
  
  container.innerHTML = userBookings.map(booking => {
    const pitch = pitches.find(p => p.id === booking.pitchId);
    const customer = customers.find(c => c.id === booking.customerId);
    
    return `
      <div class="booking-card">
        <div class="booking-header">
          <div class="booking-info">
            <h3>${pitch.name}</h3>
            <p class="pitch-location">📍 ${pitch.location}</p>
          </div>
          <span class="booking-status ${booking.status}">
            ${booking.status === 'pending' ? 'Chờ duyệt' : booking.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
          </span>
        </div>
        <div class="booking-details">
          <div class="booking-detail-item">
            <strong>Ngày đặt</strong>
            <span>${booking.date}</span>
          </div>
          <div class="booking-detail-item">
            <strong>Giờ</strong>
            <span>${booking.startTime}</span>
          </div>
          <div class="booking-detail-item">
            <strong>Thời lượng</strong>
            <span>${booking.duration} giờ</span>
          </div>
        </div>
        <div class="booking-details">
          <div class="booking-detail-item">
            <strong>Tổng tiền</strong>
            <span>${formatCurrency(booking.totalPrice)}</span>
          </div>
          <div class="booking-detail-item">
            <strong>Tiền cọc</strong>
            <span>${booking.depositPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
          </div>
          <div class="booking-detail-item">
            <strong>Khách hàng</strong>
            <span>${customer.name}</span>
          </div>
        </div>
        <div class="booking-actions">
          <button class="btn btn--outline" onclick="showBookingDetailModal(${booking.id})">Chi tiết</button>
          ${booking.status === 'pending' ? `<button class="btn btn--secondary" onclick="cancelBooking(${booking.id})">Hủy đơn</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function filterBookings(status) {
  currentBookingFilter = status;
  document.querySelectorAll('.booking-filters .filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  renderClientBookings();
}

function cancelBooking(bookingId) {
  if (!confirm('Bạn có chắc muốn hủy đơn đặt sân này?')) return;
  
  const booking = bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = 'cancelled';
    renderClientBookings();
    showToast('Đã hủy đơn đặt sân!');
  }
}

function showBookingDetailModal(bookingId) {
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;
  
  const pitch = pitches.find(p => p.id === booking.pitchId);
  const customer = customers.find(c => c.id === booking.customerId);
  
  const modal = document.getElementById('booking-detail-modal');
  modal.innerHTML = `
    <div class="modal-header">
      <h2>Chi tiết đơn đặt sân #${booking.id}</h2>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <h3>Thông tin sân</h3>
      <p><strong>Tên sân:</strong> ${pitch.name}</p>
      <p><strong>Loại:</strong> ${pitch.type}</p>
      <p><strong>Địa chỉ:</strong> ${pitch.location}</p>
      
      <h3 style="margin-top: 20px;">Thông tin đặt sân</h3>
      <p><strong>Ngày:</strong> ${booking.date}</p>
      <p><strong>Giờ bắt đầu:</strong> ${booking.startTime}</p>
      <p><strong>Thời lượng:</strong> ${booking.duration} giờ</p>
      <p><strong>Tổng tiền:</strong> ${formatCurrency(booking.totalPrice)}</p>
      <p><strong>Tiền cọc:</strong> ${booking.depositPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
      <p><strong>Trạng thái:</strong> ${booking.status === 'pending' ? 'Chờ duyệt' : booking.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}</p>
      
      <h3 style="margin-top: 20px;">Thông tin khách hàng</h3>
      <p><strong>Họ tên:</strong> ${customer.name}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Điện thoại:</strong> ${customer.phone}</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn--primary" onclick="closeModal()">Đóng</button>
    </div>
  `;
  
  openModal(modal);
}

function sendMessage(event) {
  event.preventDefault();
  showToast('Tin nhắn đã được gửi! Chúng tôi sẽ liên hệ bạn sớm.');
  event.target.reset();
}

// Admin Functions
function loadDashboard() {
  // Calculate stats
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  
  const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length;
  const newCustomers = customers.filter(c => c.createdAt === new Date().toISOString().split('T')[0]).length;
  const usageRate = Math.round((bookings.filter(b => b.status === 'confirmed').length / bookings.length) * 100);
  
  document.getElementById('stat-revenue').textContent = formatCurrency(totalRevenue);
  document.getElementById('stat-bookings').textContent = todayBookings;
  document.getElementById('stat-customers').textContent = newCustomers;
  document.getElementById('stat-usage').textContent = usageRate + '%';
  
  // Revenue by pitch chart
  const revenueByPitch = {};
  bookings.filter(b => b.status === 'confirmed').forEach(b => {
    const pitch = pitches.find(p => p.id === b.pitchId);
    if (pitch) {
      revenueByPitch[pitch.name] = (revenueByPitch[pitch.name] || 0) + b.totalPrice;
    }
  });
  
  const ctx1 = document.getElementById('revenueByPitchChart');
  if (charts.revenueByPitch) charts.revenueByPitch.destroy();
  charts.revenueByPitch = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: Object.keys(revenueByPitch),
      datasets: [{
        label: 'Doanh thu (VND)',
        data: Object.values(revenueByPitch),
        backgroundColor: '#1FB8CD'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
  
  // Revenue by day chart (last 7 days)
  const last7Days = [];
  const revenueByDay = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last7Days.push(dateStr);
    revenueByDay[dateStr] = 0;
  }
  
  bookings.filter(b => b.status === 'confirmed').forEach(b => {
    if (revenueByDay.hasOwnProperty(b.date)) {
      revenueByDay[b.date] += b.totalPrice;
    }
  });
  
  const ctx2 = document.getElementById('revenueByDayChart');
  if (charts.revenueByDay) charts.revenueByDay.destroy();
  charts.revenueByDay = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: last7Days.map(d => d.slice(5)),
      datasets: [{
        label: 'Doanh thu (VND)',
        data: Object.values(revenueByDay),
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
  
  // Recent bookings
  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  document.getElementById('recent-bookings-table').innerHTML = `
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sân</th>
            <th>Khách hàng</th>
            <th>Ngày</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${recentBookings.map(b => {
            const pitch = pitches.find(p => p.id === b.pitchId);
            const customer = customers.find(c => c.id === b.customerId);
            return `
              <tr>
                <td>#${b.id}</td>
                <td>${pitch.name}</td>
                <td>${customer.name}</td>
                <td>${b.date}</td>
                <td>${formatCurrency(b.totalPrice)}</td>
                <td><span class="booking-status ${b.status}">${b.status === 'pending' ? 'Chờ duyệt' : b.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}</span></td>
                <td>
                  <div class="table-actions">
                    ${b.status === 'pending' ? `<button class="action-btn confirm" onclick="confirmBooking(${b.id})">Xác nhận</button>` : ''}
                    <button class="action-btn edit" onclick="showBookingDetailModal(${b.id})">Chi tiết</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminPitches() {
  document.getElementById('pitches-table').innerHTML = `
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sân</th>
            <th>Loại</th>
            <th>Địa điểm</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${pitches.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.name}</td>
              <td>${p.type}</td>
              <td>${p.location}</td>
              <td>${formatCurrency(p.minPrice)} - ${formatCurrency(p.maxPrice)}</td>
              <td><span class="pitch-status active">Hoạt động</span></td>
              <td>
                <div class="table-actions">
                  <button class="action-btn edit" onclick="editPitch(${p.id})">Sửa</button>
                  <button class="action-btn delete" onclick="deletePitch(${p.id})">Xóa</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function showPitchForm(pitchId = null) {
  const pitch = pitchId ? pitches.find(p => p.id === pitchId) : null;
  const modal = document.getElementById('pitch-form-modal');
  
  modal.innerHTML = `
    <div class="modal-header">
      <h2>${pitch ? 'Sửa' : 'Thêm'} sân bóng</h2>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <form id="pitch-form">
        <div class="form-group">
          <label>Tên sân</label>
          <input type="text" id="pitch-name" class="form-control" value="${pitch?.name || ''}" required>
        </div>
        <div class="form-group">
          <label>Loại sân</label>
          <select id="pitch-type" class="form-control" required>
            <option value="5v5" ${pitch?.type === '5v5' ? 'selected' : ''}>5v5</option>
            <option value="7v7" ${pitch?.type === '7v7' ? 'selected' : ''}>7v7</option>
          </select>
        </div>
        <div class="form-group">
          <label>Địa điểm</label>
          <input type="text" id="pitch-location" class="form-control" value="${pitch?.location || ''}" required>
        </div>
        <div class="form-group">
          <label>Mô tả</label>
          <textarea id="pitch-description" class="form-control" required>${pitch?.description || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Quy tắc (mỗi quy tắc một dòng)</label>
          <textarea id="pitch-rules" class="form-control" required>${pitch?.rules?.join('\n') || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Giờ mở cửa</label>
          <input type="time" id="pitch-open" class="form-control" value="${pitch?.openTime || '06:00'}" required>
        </div>
        <div class="form-group">
          <label>Giờ đóng cửa</label>
          <input type="time" id="pitch-close" class="form-control" value="${pitch?.closeTime || '24:00'}" required>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button class="btn btn--secondary" onclick="closeModal()">Hủy</button>
      <button class="btn btn--primary" onclick="savePitch(${pitchId || 'null'})">Lưu</button>
    </div>
  `;
  
  openModal(modal);
}

function savePitch(pitchId) {
  const name = document.getElementById('pitch-name').value;
  const type = document.getElementById('pitch-type').value;
  const location = document.getElementById('pitch-location').value;
  const description = document.getElementById('pitch-description').value;
  const rules = document.getElementById('pitch-rules').value.split('\n').filter(r => r.trim());
  const openTime = document.getElementById('pitch-open').value;
  const closeTime = document.getElementById('pitch-close').value;
  
  if (!name || !type || !location || !description) {
    showToast('Vui lòng điền đầy đủ thông tin!', true);
    return;
  }
  
  if (pitchId) {
    // Edit existing pitch
    const pitch = pitches.find(p => p.id === pitchId);
    if (pitch) {
      pitch.name = name;
      pitch.type = type;
      pitch.location = location;
      pitch.description = description;
      pitch.rules = rules;
      pitch.openTime = openTime;
      pitch.closeTime = closeTime;
      showToast('Đã cập nhật sân bóng!');
    }
  } else {
    // Add new pitch
    const newPitch = {
      id: pitches.length + 1,
      name,
      type,
      location,
      description,
      rules,
      openTime,
      closeTime,
      images: ['https://via.placeholder.com/400x300?text=San+Bong'],
      minPrice: 300000,
      maxPrice: 500000,
      status: 'active',
      priceSlots: {
        "06-09": 300000,
        "09-12": 350000,
        "12-15": 300000,
        "15-18": 400000,
        "18-21": 500000,
        "21-24": 450000
      },
      rating: 5.0,
      reviews: 0
    };
    pitches.push(newPitch);
    showToast('Đã thêm sân bóng mới!');
  }
  
  closeModal();
  renderAdminPitches();
}

function editPitch(pitchId) {
  showPitchForm(pitchId);
}

function deletePitch(pitchId) {
  if (!confirm('Bạn có chắc muốn xóa sân bóng này?')) return;
  
  const index = pitches.findIndex(p => p.id === pitchId);
  if (index !== -1) {
    pitches.splice(index, 1);
    renderAdminPitches();
    showToast('Đã xóa sân bóng!');
  }
}

function loadPricingManagement() {
  const select = document.getElementById('pricing-pitch-select');
  select.innerHTML = '<option value="">-- Chọn sân --</option>' + 
    pitches.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

function loadPricingForm() {
  const pitchId = parseInt(document.getElementById('pricing-pitch-select').value);
  if (!pitchId) {
    document.getElementById('pricing-form').innerHTML = '';
    return;
  }
  
  const pitch = pitches.find(p => p.id === pitchId);
  if (!pitch) return;
  
  document.getElementById('pricing-form').innerHTML = `
    <h3 style="margin-top: 20px;">Bảng giá: ${pitch.name}</h3>
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>Khung giờ</th>
            <th>Giá (VND)</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(pitch.priceSlots).map(([slot, price]) => `
            <tr>
              <td>${slot.replace('-', ':00 - ')}:00</td>
              <td>
                <input type="number" id="price-${slot}" class="form-control" value="${price}" style="max-width: 200px;">
              </td>
              <td>
                <button class="action-btn confirm" onclick="updatePrice(${pitchId}, '${slot}')">Cập nhật</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function updatePrice(pitchId, slot) {
  const pitch = pitches.find(p => p.id === pitchId);
  if (!pitch) return;
  
  const newPrice = parseInt(document.getElementById(`price-${slot}`).value);
  if (newPrice && newPrice > 0) {
    pitch.priceSlots[slot] = newPrice;
    
    // Update min/max prices
    const prices = Object.values(pitch.priceSlots);
    pitch.minPrice = Math.min(...prices);
    pitch.maxPrice = Math.max(...prices);
    
    showToast('Đã cập nhật giá!');
  } else {
    showToast('Giá không hợp lệ!', true);
  }
}

function renderAdminBookings() {
  const filteredBookings = currentBookingFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === currentBookingFilter);
  
  document.getElementById('admin-bookings-table').innerHTML = `
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sân</th>
            <th>Khách hàng</th>
            <th>Ngày</th>
            <th>Giờ</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${filteredBookings.map(b => {
            const pitch = pitches.find(p => p.id === b.pitchId);
            const customer = customers.find(c => c.id === b.customerId);
            return `
              <tr>
                <td>#${b.id}</td>
                <td>${pitch?.name || 'N/A'}</td>
                <td>${customer?.name || 'N/A'}</td>
                <td>${b.date}</td>
                <td>${b.startTime}</td>
                <td>${formatCurrency(b.totalPrice)}</td>
                <td><span class="booking-status ${b.status}">${b.status === 'pending' ? 'Chờ duyệt' : b.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}</span></td>
                <td>
                  <div class="table-actions">
                    ${b.status === 'pending' ? `<button class="action-btn confirm" onclick="confirmBooking(${b.id})">Xác nhận</button>` : ''}
                    ${b.status === 'pending' ? `<button class="action-btn delete" onclick="rejectBooking(${b.id})">Hủy</button>` : ''}
                    <button class="action-btn edit" onclick="showBookingDetailModal(${b.id})">Chi tiết</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function filterAdminBookings(status) {
  currentBookingFilter = status;
  document.querySelectorAll('#admin-bookings .filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  renderAdminBookings();
}

function confirmBooking(bookingId) {
  const booking = bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = 'confirmed';
    renderAdminBookings();
    loadDashboard();
    showToast('Đã xác nhận đơn đặt sân!');
  }
}

function rejectBooking(bookingId) {
  if (!confirm('Bạn có chắc muốn hủy đơn đặt sân này?')) return;
  
  const booking = bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = 'cancelled';
    renderAdminBookings();
    showToast('Đã hủy đơn đặt sân!');
  }
}

function renderAdminCustomers() {
  document.getElementById('customers-table').innerHTML = `
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Số lần đặt</th>
            <th>Tổng chi tiêu</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${customers.map(c => `
            <tr>
              <td>${c.id}</td>
              <td>${c.name}</td>
              <td>${c.email}</td>
              <td>${c.phone}</td>
              <td>${c.bookingCount}</td>
              <td>${formatCurrency(c.totalSpent)}</td>
              <td><span class="pitch-status active">Hoạt động</span></td>
              <td>
                <div class="table-actions">
                  <button class="action-btn edit" onclick="viewCustomerDetail(${c.id})">Chi tiết</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function viewCustomerDetail(customerId) {
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return;
  
  const customerBookings = bookings.filter(b => b.customerId === customerId);
  
  const modal = document.getElementById('booking-detail-modal');
  modal.innerHTML = `
    <div class="modal-header">
      <h2>Chi tiết khách hàng: ${customer.name}</h2>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <h3>Thông tin cá nhân</h3>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Điện thoại:</strong> ${customer.phone}</p>
      <p><strong>Ngày tham gia:</strong> ${customer.createdAt}</p>
      <p><strong>Số lần đặt:</strong> ${customer.bookingCount}</p>
      <p><strong>Tổng chi tiêu:</strong> ${formatCurrency(customer.totalSpent)}</p>
      
      <h3 style="margin-top: 20px;">Lịch sử đặt sân</h3>
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>Sân</th>
              <th>Ngày</th>
              <th>Giá</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            ${customerBookings.map(b => {
              const pitch = pitches.find(p => p.id === b.pitchId);
              return `
                <tr>
                  <td>${pitch?.name}</td>
                  <td>${b.date}</td>
                  <td>${formatCurrency(b.totalPrice)}</td>
                  <td><span class="booking-status ${b.status}">${b.status === 'pending' ? 'Chờ duyệt' : b.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn--primary" onclick="closeModal()">Đóng</button>
    </div>
  `;
  
  openModal(modal);
}

function loadReports() {
  showReportTab('revenue');
}

function showReportTab(tab) {
  document.querySelectorAll('.report-tab').forEach(t => t.style.display = 'none');
  document.getElementById(`report-${tab}`).style.display = 'block';
  
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event?.target?.classList.add('active');
  
  if (tab === 'revenue') {
    generateRevenueReport();
  } else if (tab === 'usage') {
    generateUsageReport();
  } else if (tab === 'customers') {
    generateCustomersReport();
  }
}

function generateRevenueReport() {
  const revenueData = {};
  pitches.forEach(p => {
    revenueData[p.name] = 0;
  });
  
  bookings.filter(b => b.status === 'confirmed').forEach(b => {
    const pitch = pitches.find(p => p.id === b.pitchId);
    if (pitch) {
      revenueData[pitch.name] += b.totalPrice;
    }
  });
  
  const ctx = document.getElementById('revenueReportChart');
  if (charts.revenueReport) charts.revenueReport.destroy();
  charts.revenueReport = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(revenueData),
      datasets: [{
        label: 'Doanh thu (VND)',
        data: Object.values(revenueData),
        backgroundColor: '#1FB8CD'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
  
  document.getElementById('revenue-report-table').innerHTML = `
    <div class="data-table" style="margin-top: 20px;">
      <table>
        <thead>
          <tr>
            <th>Sân</th>
            <th>Số đơn</th>
            <th>Tổng doanh thu</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(revenueData).map(([name, revenue]) => {
            const count = bookings.filter(b => {
              const pitch = pitches.find(p => p.id === b.pitchId);
              return pitch?.name === name && b.status === 'confirmed';
            }).length;
            return `
              <tr>
                <td>${name}</td>
                <td>${count}</td>
                <td>${formatCurrency(revenue)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function generateUsageReport() {
  const usageData = {};
  pitches.forEach(p => {
    usageData[p.name] = 0;
  });
  
  bookings.filter(b => b.status === 'confirmed').forEach(b => {
    const pitch = pitches.find(p => p.id === b.pitchId);
    if (pitch) {
      usageData[pitch.name] += b.duration;
    }
  });
  
  const ctx = document.getElementById('usageReportChart');
  if (charts.usageReport) charts.usageReport.destroy();
  charts.usageReport = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(usageData),
      datasets: [{
        data: Object.values(usageData),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
  
  const totalHours = Object.values(usageData).reduce((sum, h) => sum + h, 0);
  
  document.getElementById('usage-report-table').innerHTML = `
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>Sân</th>
            <th>Tổng giờ</th>
            <th>Tỷ lệ</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(usageData).map(([name, hours]) => `
            <tr>
              <td>${name}</td>
              <td>${hours} giờ</td>
              <td>${Math.round((hours / totalHours) * 100)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function generateCustomersReport() {
  const sortedCustomers = [...customers].sort((a, b) => b.bookingCount - a.bookingCount);
  const newCustomers = [...customers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  
  document.getElementById('top-customers-table').innerHTML = `
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Số lần đặt</th>
            <th>Tổng chi tiêu</th>
          </tr>
        </thead>
        <tbody>
          ${sortedCustomers.map(c => `
            <tr>
              <td>${c.name}</td>
              <td>${c.bookingCount}</td>
              <td>${formatCurrency(c.totalSpent)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  document.getElementById('new-customers-table').innerHTML = `
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Ngày tham gia</th>
            <th>Số lần đặt</th>
          </tr>
        </thead>
        <tbody>
          ${newCustomers.map(c => `
            <tr>
              <td>${c.name}</td>
              <td>${c.createdAt}</td>
              <td>${c.bookingCount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function exportReport(type) {
  console.log(`Exporting ${type} report...`);
  showToast('Đã xuất báo cáo!');
}

// Modal Functions
function openModal(modal) {
  document.getElementById('modal-overlay').classList.add('active');
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  showClientView('home');
  applyFilters();
});