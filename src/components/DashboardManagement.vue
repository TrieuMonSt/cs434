<script setup>
import { ref } from 'vue';

// KPI Cards Data
const kpis = ref([
  {
    title: 'TỔNG BỆNH NHÂN',
    value: '2,252',
    change: '+36%',
    isPositive: true,
    bg: '#f0fdf4',
    icon: 'fas fa-users text-success'
  },
  {
    title: 'LỊCH HẸN',
    value: '836',
    change: '-14%',
    isPositive: false,
    bg: '#fef2f2',
    icon: 'fas fa-calendar-check text-danger'
  },
  {
    title: 'HÓA ĐƠN',
    value: '5,243',
    change: '+38%',
    isPositive: true,
    bg: '#f0fdf4',
    icon: 'fas fa-file-invoice-dollar text-success'
  },
  {
    title: 'DOANH THU ($K)',
    value: '245',
    change: '-14%',
    isPositive: false,
    bg: '#fef2f2',
    icon: 'fas fa-dollar-sign text-danger'
  }
]);

// Upcoming Patients
const upcomingPatients = ref([
  {
    name: 'Emma Thompson',
    time: '10:30 SA',
    dept: 'Khám tổng quát',
    avatar: 'ET',
    bg: '#e0f2fe',
    color: '#0284c7'
  },
  {
    name: 'James Wilson',
    time: '11:15 SA',
    dept: 'Khám chuyên khoa Tim',
    avatar: 'JW',
    bg: '#dcfce7',
    color: '#16a34a'
  },
  {
    name: 'Sarah Miller',
    time: '12:00 CH',
    dept: 'Tái khám',
    avatar: 'SM',
    bg: '#f3e8ff',
    color: '#7c3aed'
  },
  {
    name: 'Michael Chen',
    time: '01:30 CH',
    dept: 'Phân tích X-Quang',
    avatar: 'MC',
    bg: '#fee2e2',
    color: '#dc2626'
  }
]);

// Recent Transactions
const transactions = ref([
  {
    id: '#TRX-9821',
    patient: 'Emma Thompson',
    date: '24 Th10, 2023',
    amount: '$240.00',
    status: 'paid',
    statusText: 'Đã thanh toán'
  },
  {
    id: '#TRX-9815',
    patient: 'James Wilson',
    date: '24 Th10, 2023',
    amount: '$1,200.00',
    status: 'pending',
    statusText: 'Đang chờ'
  },
  {
    id: '#TRX-9802',
    patient: 'Robert Fox',
    date: '23 Th10, 2023',
    amount: '$350.00',
    status: 'paid',
    statusText: 'Đã thanh toán'
  }
]);

// Toast Notification
const toastMessage = ref('');
const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
};

const handleExport = () => {
  triggerToast('Xuất báo cáo tài chính Thống kê Bác sĩ thành công!');
};

const handleNewAppointment = () => {
  triggerToast('Đang chuyển hướng tạo lịch hẹn mới...');
};
</script>

<template>
  <div class="container-fluid px-4 py-4 bg-light" style="min-height: calc(100vh - 120px);">
    <!-- Header Section -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
      <div>
        <h3 class="font-weight-bold mb-1 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 26px;">Thống kê Bác sĩ</h3>
        <p class="text-secondary mb-0" style="font-size: 14px;">Tổng quan về hiệu quả hoạt động bệnh viện và các chỉ số bệnh nhân trong Tháng 10/2023.</p>
      </div>
      
      <div class="d-flex align-items-center mt-3 mt-md-0">
        <button @click="handleExport" class="btn btn-light border mr-3 font-weight-bold text-dark px-3 py-2 d-flex align-items-center" style="font-size: 13.5px; background: white; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          <i class="fas fa-download mr-2 text-secondary"></i> Xuất CSV
        </button>
        <button @click="handleNewAppointment" class="btn btn-dark font-weight-bold px-3 py-2 d-flex align-items-center" style="font-size: 13.5px; background-color: #0f766e; border-color: #0f766e; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          <i class="fas fa-plus mr-2"></i> Lịch hẹn mới
        </button>
      </div>
    </div>

    <!-- Toast Notice -->
    <div v-if="toastMessage" class="alert alert-success position-fixed shadow-lg" style="bottom: 20px; right: 20px; z-index: 1050; border-left: 5px solid #10b981; min-width: 300px; border-radius: 8px;">
      <div class="d-flex align-items-center">
        <i class="fas fa-check-circle text-success mr-2 fa-lg"></i>
        <strong style="font-size: 13.5px; color: #1e293b;">{{ toastMessage }}</strong>
      </div>
    </div>

    <!-- KPI Metric Cards Grid -->
    <div class="row mb-4">
      <div v-for="kpi in kpis" :key="kpi.title" class="col-xl-3 col-md-6 mb-4">
        <div class="card border-0 shadow-sm rounded-lg h-100" style="border: 1px solid #e2e8f0 !important;">
          <div class="card-body p-4 d-flex flex-column justify-content-between">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center" :style="{ width: '44px', height: '44px', backgroundColor: kpi.bg }">
                <i :class="kpi.icon + ' fa-lg'"></i>
              </div>
              <span class="badge badge-pill px-2.5 py-1 font-weight-bold" :class="kpi.isPositive ? 'badge-success' : 'badge-danger'" style="font-size: 11px;">
                {{ kpi.change }}
              </span>
            </div>
            <div>
              <p class="text-secondary font-weight-bold mb-1" style="font-size: 11px; letter-spacing: 0.5px;">{{ kpi.title }}</p>
              <h3 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 26px;">{{ kpi.value }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid Section -->
    <div class="row">
      <!-- Left Column (Income Report & Recent Transactions) -->
      <div class="col-xl-7">
        <!-- Income Report Card -->
        <div class="card border-0 shadow-sm rounded-lg mb-4" style="border: 1px solid #e2e8f0 !important;">
          <div class="card-body p-4">
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4">
              <div>
                <h5 class="font-weight-bold text-dark mb-1" style="font-family: 'Outfit', sans-serif; font-size: 17px;">Báo cáo Thu nhập</h5>
                <p class="text-secondary mb-0" style="font-size: 12px;">Phân tích doanh thu hàng tháng so với mục tiêu</p>
              </div>
              
              <!-- Legend indicators -->
              <div class="d-flex align-items-center mt-2 mt-sm-0" style="font-size: 12px;">
                <span class="mr-3 d-flex align-items-center">
                  <span class="d-inline-block rounded-circle mr-2" style="width: 10px; height: 10px; background-color: #0f766e;"></span>
                  Doanh thu
                </span>
                <span class="d-flex align-items-center">
                  <span class="d-inline-block rounded-circle mr-2" style="width: 10px; height: 10px; background-color: #e2e8f0;"></span>
                  Kỳ trước
                </span>
              </div>
            </div>

            <!-- Custom SVG / CSS Chart Area -->
            <div class="chart-container py-3">
              <div class="d-flex align-items-end justify-content-between px-2" style="height: 250px; border-bottom: 2px solid #f1f5f9;">
                <!-- January -->
                <div class="bar-group d-flex flex-column align-items-center" style="width: 8%;">
                  <div class="d-flex w-100 justify-content-center align-items-end" style="height: 200px;">
                    <div class="bg-light mr-0.5 rounded-top" style="height: 40%; width: 8px;"></div>
                    <div class="rounded-top" style="height: 55%; width: 10px; background-color: #0f766e;"></div>
                  </div>
                  <span class="text-muted mt-2 font-weight-bold" style="font-size: 10px;">Th1</span>
                </div>
                <!-- February -->
                <div class="bar-group d-flex flex-column align-items-center" style="width: 8%;">
                  <div class="d-flex w-100 justify-content-center align-items-end" style="height: 200px;">
                    <div class="bg-light mr-0.5 rounded-top" style="height: 35%; width: 8px;"></div>
                    <div class="rounded-top" style="height: 48%; width: 10px; background-color: #0f766e;"></div>
                  </div>
                  <span class="text-muted mt-2 font-weight-bold" style="font-size: 10px;">Th2</span>
                </div>
                <!-- March -->
                <div class="bar-group d-flex flex-column align-items-center" style="width: 8%;">
                  <div class="d-flex w-100 justify-content-center align-items-end" style="height: 200px;">
                    <div class="bg-light mr-0.5 rounded-top" style="height: 60%; width: 8px;"></div>
                    <div class="rounded-top" style="height: 70%; width: 10px; background-color: #0f766e;"></div>
                  </div>
                  <span class="text-muted mt-2 font-weight-bold" style="font-size: 10px;">Th3</span>
                </div>
                <!-- April -->
                <div class="bar-group d-flex flex-column align-items-center" style="width: 8%;">
                  <div class="d-flex w-100 justify-content-center align-items-end" style="height: 200px;">
                    <div class="bg-light mr-0.5 rounded-top" style="height: 50%; width: 8px;"></div>
                    <div class="rounded-top" style="height: 62%; width: 10px; background-color: #0f766e;"></div>
                  </div>
                  <span class="text-muted mt-2 font-weight-bold" style="font-size: 10px;">Th4</span>
                </div>
                <!-- May -->
                <div class="bar-group d-flex flex-column align-items-center" style="width: 8%;">
                  <div class="d-flex w-100 justify-content-center align-items-end" style="height: 200px;">
                    <div class="bg-light mr-0.5 rounded-top" style="height: 70%; width: 8px;"></div>
                    <div class="rounded-top" style="height: 85%; width: 10px; background-color: #0f766e;"></div>
                  </div>
                  <span class="text-muted mt-2 font-weight-bold" style="font-size: 10px;">Th5</span>
                </div>
                <!-- June -->
                <div class="bar-group d-flex flex-column align-items-center" style="width: 8%;">
                  <div class="d-flex w-100 justify-content-center align-items-end" style="height: 200px;">
                    <div class="bg-light mr-0.5 rounded-top" style="height: 80%; width: 8px;"></div>
                    <div class="rounded-top" style="height: 78%; width: 10px; background-color: #0f766e;"></div>
                  </div>
                  <span class="text-muted mt-2 font-weight-bold" style="font-size: 10px;">Th6</span>
                </div>
                <!-- July -->
                <div class="bar-group d-flex flex-column align-items-center" style="width: 8%;">
                  <div class="d-flex w-100 justify-content-center align-items-end" style="height: 200px;">
                    <div class="bg-light mr-0.5 rounded-top" style="height: 65%; width: 8px;"></div>
                    <div class="rounded-top" style="height: 80%; width: 10px; background-color: #0f766e;"></div>
                  </div>
                  <span class="text-muted mt-2 font-weight-bold" style="font-size: 10px;">Th7</span>
                </div>
                <!-- August -->
                <div class="bar-group d-flex flex-column align-items-center" style="width: 8%;">
                  <div class="d-flex w-100 justify-content-center align-items-end" style="height: 200px;">
                    <div class="bg-light mr-0.5 rounded-top" style="height: 50%; width: 8px;"></div>
                    <div class="rounded-top" style="height: 60%; width: 10px; background-color: #0f766e;"></div>
                  </div>
                  <span class="text-muted mt-2 font-weight-bold" style="font-size: 10px;">Th8</span>
                </div>
                <!-- September -->
                <div class="bar-group d-flex flex-column align-items-center" style="width: 8%;">
                  <div class="d-flex w-100 justify-content-center align-items-end" style="height: 200px;">
                    <div class="bg-light mr-0.5 rounded-top" style="height: 75%; width: 8px;"></div>
                    <div class="rounded-top" style="height: 90%; width: 10px; background-color: #0f766e;"></div>
                  </div>
                  <span class="text-muted mt-2 font-weight-bold" style="font-size: 10px;">Th9</span>
                </div>
                <!-- October -->
                <div class="bar-group d-flex flex-column align-items-center" style="width: 8%;">
                  <div class="d-flex w-100 justify-content-center align-items-end" style="height: 200px;">
                    <div class="bg-light mr-0.5 rounded-top" style="height: 82%; width: 8px;"></div>
                    <div class="rounded-top" style="height: 95%; width: 10px; background-color: #0f766e;"></div>
                  </div>
                  <span class="text-muted mt-2 font-weight-bold" style="font-size: 10px;">Th10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions Card -->
        <div class="card border-0 shadow-sm rounded-lg" style="border: 1px solid #e2e8f0 !important;">
          <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
            <h5 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 16px;">Giao dịch gần đây</h5>
            <button class="btn btn-sm btn-light border-0" style="background: transparent;">
              <i class="fas fa-ellipsis-h text-secondary"></i>
            </button>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table mb-0 text-left" style="font-size: 13.5px; vertical-align: middle;">
                <thead class="bg-light">
                  <tr class="text-uppercase text-secondary" style="font-size: 11px; letter-spacing: 0.5px;">
                    <th class="py-3 px-4">Mã giao dịch</th>
                    <th class="py-3">Bệnh nhân</th>
                    <th class="py-3">Ngày</th>
                    <th class="py-3">Số tiền</th>
                    <th class="py-3 px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="trx in transactions" :key="trx.id" class="hover-row">
                    <td class="py-3 px-4 font-weight-bold text-secondary">{{ trx.id }}</td>
                    <td class="py-3 font-weight-bold text-dark">{{ trx.patient }}</td>
                    <td class="py-3 text-secondary">{{ trx.date }}</td>
                    <td class="py-3 font-weight-bold text-dark">{{ trx.amount }}</td>
                    <td class="py-3 px-4">
                      <span 
                        class="badge px-2.5 py-1.5 font-weight-bold"
                        :style="{
                          backgroundColor: trx.status === 'paid' ? '#e0f2fe' : '#fef3c7',
                          color: trx.status === 'paid' ? '#0369a1' : '#d97706',
                          borderRadius: '6px'
                        }"
                      >
                        {{ trx.statusText }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (Next Patient, Today's Schedule, Mini mock) -->
      <div class="col-xl-5 mt-4 mt-xl-0">
        <!-- Next Patient Card -->
        <div class="card border-0 shadow-sm rounded-lg mb-4" style="border: 1px solid #e2e8f0 !important;">
          <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
            <h5 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 16px;">Bệnh nhân tiếp theo</h5>
            <a href="#" class="font-weight-bold text-decoration-none" style="color: #6b7280; font-size: 13px;">Xem tất cả</a>
          </div>
          <div class="card-body p-3">
            <div class="d-flex flex-column">
              <div v-for="p in upcomingPatients" :key="p.name" class="d-flex align-items-center mb-3 p-2.5 rounded hover-bg-light">
                <div 
                  class="rounded-circle d-flex align-items-center justify-content-center font-weight-bold mr-3"
                  :style="{ width: '42px', height: '42px', backgroundColor: p.bg, color: p.color, fontSize: '13.5px' }"
                >
                  {{ p.avatar }}
                </div>
                <div class="flex-grow-1">
                  <h6 class="font-weight-bold text-dark mb-0.5" style="font-size: 14px;">{{ p.name }}</h6>
                  <p class="text-secondary mb-0" style="font-size: 12px;">{{ p.dept }}</p>
                </div>
                <div class="text-right">
                  <span class="badge font-weight-bold px-2 py-1 bg-light border text-dark" style="font-size: 11.5px; border-radius: 6px;">{{ p.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Today's Schedule Card -->
        <div class="card border-0 shadow-lg mb-4 text-white" style="background-color: #0f766e; border-radius: 16px; overflow: hidden;">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="font-weight-bold mb-0" style="font-family: 'Outfit', sans-serif; font-size: 17px;">Lịch trình hôm nay</h5>
              <span class="rounded-circle d-flex align-items-center justify-content-center bg-white-10" style="width: 36px; height: 36px; background: rgba(255,255,255,0.15);">
                <i class="fas fa-sliders-h"></i>
              </span>
            </div>
            
            <p class="mb-4" style="font-size: 13px; opacity: 0.9;">Bạn có 12 lịch hẹn hôm nay. Còn lại 8 lịch.</p>
            
            <!-- Surgeon detail box -->
            <div class="p-3 mb-4 rounded-lg d-flex align-items-center justify-content-between" style="background-color: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);">
              <div>
                <small class="d-block text-uppercase font-weight-bold mb-1" style="font-size: 9px; opacity: 0.7; letter-spacing: 0.5px;">Ca phẫu thuật tiếp theo</small>
                <h6 class="font-weight-bold mb-1" style="font-size: 14.5px;">Phẫu thuật ruột thừa</h6>
                <small style="opacity: 0.8; font-size: 11px;">Bệnh nhân #204</small>
              </div>
              <div class="px-3 py-1.5 rounded-lg text-white font-weight-bold" style="background-color: rgba(255,255,255,0.2); font-size: 13px;">
                03:30 CH
              </div>
            </div>

            <!-- Button -->
            <button class="btn btn-white w-100 font-weight-bold py-2 bg-white" style="color: #0f766e; border-radius: 8px; font-size: 13.5px; border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              Xem toàn bộ lịch
            </button>
          </div>
        </div>

        <!-- Mini Visual Mockup (CSS mockup) -->
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white" style="border: 1px solid #e2e8f0 !important;">
          <div class="d-flex align-items-center mb-2">
            <span class="d-inline-block rounded-circle bg-success mr-2" style="width: 8px; height: 8px;"></span>
            <small class="text-secondary font-weight-bold" style="font-size: 11px;">Hệ thống giám sát vận hành</small>
          </div>
          <!-- Grid representation of active nodes -->
          <div class="row px-2">
            <div class="col-4 px-1"><div class="rounded py-2 text-center bg-light font-weight-bold text-success" style="font-size: 11px;">Phòng Mổ <br><span class="text-secondary" style="font-size: 9px;">Hoạt động</span></div></div>
            <div class="col-4 px-1"><div class="rounded py-2 text-center bg-light font-weight-bold text-success" style="font-size: 11px;">Cấp Cứu <br><span class="text-secondary" style="font-size: 9px;">Hoạt động</span></div></div>
            <div class="col-4 px-1"><div class="rounded py-2 text-center bg-light font-weight-bold text-warning" style="font-size: 11px;">Xét Nghiệm <br><span class="text-secondary" style="font-size: 9px;">Đầy tải</span></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-row:hover {
  background-color: #f8fafc;
}
.hover-bg-light:hover {
  background-color: #f1f5f9;
  cursor: pointer;
}
</style>
