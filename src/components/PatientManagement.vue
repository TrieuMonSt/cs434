<script setup>
import { ref, computed } from 'vue';

// Filter tabs
const activeFilter = ref('all'); // 'all', 'treating', 'recheck', 'discharged'

// Search query
const searchQuery = ref('');

// Sorting
const sortBy = ref('newest');

// Patient List Data
const patients = ref([
  {
    id: 'PT-29402',
    name: 'Eleanor Shellstrop',
    gender: 'Nữ',
    age: 34,
    avatar: 'ES',
    history: ['Cao huyết áp', 'Tiểu đường Type II'],
    status: 'treating', // 'treating', 'critical', 'recheck', 'discharged'
    statusText: 'Đang điều trị',
    avatarBg: '#e0f2fe',
    avatarColor: '#0369a1'
  },
  {
    id: 'PT-18394',
    name: 'Arthur Morgan',
    gender: 'Nam',
    age: 68,
    avatar: 'AM',
    history: ['Hậu phẫu'],
    status: 'critical',
    statusText: 'Nguy kịch',
    avatarBg: '#fee2e2',
    avatarColor: '#b91c1c'
  },
  {
    id: 'PT-48201',
    name: 'Jason Mendoza',
    gender: 'Nam',
    age: 29,
    avatar: 'JM',
    history: ['Khám định kỳ'],
    status: 'recheck',
    statusText: 'Tái khám',
    avatarBg: '#f3f4f6',
    avatarColor: '#374151'
  },
  {
    id: 'PT-55120',
    name: 'Tahani Al-Jamil',
    gender: 'Nữ',
    age: 31,
    avatar: 'TA',
    history: ['Hen suyễn', 'Dị ứng'],
    status: 'discharged',
    statusText: 'Đã xuất viện',
    avatarBg: '#f3e8ff',
    avatarColor: '#6b21a8'
  }
]);

// Computed filtered patients
const filteredPatients = computed(() => {
  return patients.value.filter(item => {
    // Search
    const query = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.history.some(h => h.toLowerCase().includes(query));
    
    // Filter status tab
    let matchesFilter = true;
    if (activeFilter.value === 'treating') {
      matchesFilter = item.status === 'treating' || item.status === 'critical';
    } else if (activeFilter.value === 'recheck') {
      matchesFilter = item.status === 'recheck';
    } else if (activeFilter.value === 'discharged') {
      matchesFilter = item.status === 'discharged';
    }
    
    return matchesSearch && matchesFilter;
  });
});

// Mock stats
const totalPatients = computed(() => 1284);
const activeBeds = ref(42);
const totalBeds = ref(50);
const pendingReports = ref(12);
const criticalCases = ref(3);

// Modal state
const showNewPatientModal = ref(false);
const newPatient = ref({
  name: '',
  gender: 'Nam',
  age: '',
  history: '',
  status: 'treating'
});

// Toast notification
const toastMessage = ref('');
const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
};

const handleCreatePatient = () => {
  if (!newPatient.value.name.trim()) return;
  
  const historyList = newPatient.value.history
    ? newPatient.value.history.split(',').map(s => s.trim())
    : ['Khám định kỳ'];

  const statusMap = {
    treating: 'Đang điều trị',
    critical: 'Nguy kịch',
    recheck: 'Tái khám',
    discharged: 'Đã xuất viện'
  };

  const newId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;

  patients.value.unshift({
    id: newId,
    name: newPatient.value.name,
    gender: newPatient.value.gender,
    age: parseInt(newPatient.value.age) || 30,
    avatar: newPatient.value.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    history: historyList,
    status: newPatient.value.status,
    statusText: statusMap[newPatient.value.status],
    avatarBg: '#e0f2fe',
    avatarColor: '#0369a1'
  });

  showNewPatientModal.value = false;
  triggerToast('Thêm bệnh nhân mới thành công!');
  
  // reset
  newPatient.value = {
    name: '',
    gender: 'Nam',
    age: '',
    history: '',
    status: 'treating'
  };
};

const handleDeletePatient = (id) => {
  patients.value = patients.value.filter(p => p.id !== id);
  triggerToast('Đã xóa hồ sơ bệnh nhân.');
};
</script>

<template>
  <div class="container-fluid px-4 py-4">
    <!-- Breadcrumb & Top Actions -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-transparent p-0 mb-1" style="font-size: 13px;">
            <li class="breadcrumb-item"><a href="#" class="text-secondary text-decoration-none">Tổng quan</a></li>
            <li class="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Bệnh nhân</li>
          </ol>
        </nav>
        <h3 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif;">Quản lý Bệnh nhân</h3>
      </div>
      
      <div class="d-flex align-items-center mt-3 mt-md-0">
        <button class="btn btn-light border mr-2 font-weight-bold text-dark px-3 py-2" style="font-size: 13.5px; background: white;">
          <i class="fas fa-download mr-2"></i> Xuất danh sách
        </button>
        <button class="btn btn-dark font-weight-bold px-3 py-2" style="font-size: 13.5px; background-color: #0d9488; border-color: #0d9488;" @click="showNewPatientModal = true">
          <i class="fas fa-user-plus mr-2"></i> Bệnh nhân mới
        </button>
      </div>
    </div>

    <!-- Toast Notification Banner -->
    <div v-if="toastMessage" class="alert alert-success position-fixed shadow" style="bottom: 20px; right: 20px; z-index: 1050; border-left: 5px solid #10b981; min-width: 280px;">
      <div class="d-flex align-items-center">
        <i class="fas fa-check-circle text-success mr-2 fa-lg"></i>
        <strong>{{ toastMessage }}</strong>
      </div>
    </div>

    <!-- Summary Statistics Grid -->
    <div class="row mb-4">
      <!-- Total Patients Card -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-0 shadow-sm rounded-lg" style="height: 100%;">
          <div class="card-body p-4 d-flex flex-column justify-content-between">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="rounded d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background-color: #f0fdf4;">
                <i class="fas fa-users fa-lg" style="color: #16a34a;"></i>
              </div>
              <span class="badge badge-pill badge-success px-2 py-1" style="font-size: 11px;">+4%</span>
            </div>
            <div>
              <p class="text-muted mb-1" style="font-size: 13px; font-weight: 500;">Tổng số bệnh nhân</p>
              <h2 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif;">{{ totalPatients }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Beds Occupancy Card -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-0 shadow-sm rounded-lg" style="height: 100%;">
          <div class="card-body p-4 d-flex flex-column justify-content-between">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="rounded d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background-color: #eff6ff;">
                <i class="fas fa-bed fa-lg" style="color: #2563eb;"></i>
              </div>
              <span class="badge badge-pill px-2 py-1" style="font-size: 11px; background-color: #fee2e2; color: #b91c1c;">85%</span>
            </div>
            <div>
              <p class="text-muted mb-1" style="font-size: 13px; font-weight: 500;">Công suất phòng khám</p>
              <h2 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif;">{{ activeBeds }}/{{ totalBeds }} Giường</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Card -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-0 shadow-sm rounded-lg" style="height: 100%;">
          <div class="card-body p-4 d-flex flex-column justify-content-between">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="rounded d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background-color: #f3f4f6;">
                <i class="far fa-clipboard fa-lg" style="color: #4b5563;"></i>
              </div>
            </div>
            <div>
              <p class="text-muted mb-1" style="font-size: 13px; font-weight: 500;">Báo cáo chờ duyệt</p>
              <h2 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif;">{{ pendingReports }} Báo cáo</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Critical Cases Card -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-0 shadow-sm rounded-lg" style="height: 100%;">
          <div class="card-body p-4 d-flex flex-column justify-content-between">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="rounded d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background-color: #fef2f2;">
                <i class="fas fa-exclamation-triangle fa-lg" style="color: #dc2626;"></i>
              </div>
            </div>
            <div>
              <p class="text-muted mb-1" style="font-size: 13px; font-weight: 500;">Trường hợp khẩn cấp</p>
              <h2 class="font-weight-bold mb-0 text-danger" style="font-family: 'Outfit', sans-serif;">0{{ criticalCases }} Ca</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Table Section Card -->
    <div class="card border-0 shadow-sm rounded-lg mb-4">
      <div class="card-body p-4">
        <!-- Table Toolbar Controls -->
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4">
          <!-- Filter tab buttons -->
          <div class="btn-group mb-3 mb-lg-0" role="group">
            <button 
              type="button" 
              class="btn py-2 px-3 font-weight-bold" 
              :style="{
                backgroundColor: activeFilter === 'all' ? '#0d9488' : '#f3f4f6',
                color: activeFilter === 'all' ? 'white' : '#4b5563',
                fontSize: '13.5px',
                borderRadius: '8px 0 0 8px'
              }"
              @click="activeFilter = 'all'"
            >
              Tất cả bệnh nhân
            </button>
            <button 
              type="button" 
              class="btn py-2 px-3 font-weight-bold" 
              :style="{
                backgroundColor: activeFilter === 'treating' ? '#0d9488' : '#f3f4f6',
                color: activeFilter === 'treating' ? 'white' : '#4b5563',
                fontSize: '13.5px'
              }"
              @click="activeFilter = 'treating'"
            >
              Đang điều trị
            </button>
            <button 
              type="button" 
              class="btn py-2 px-3 font-weight-bold" 
              :style="{
                backgroundColor: activeFilter === 'recheck' ? '#0d9488' : '#f3f4f6',
                color: activeFilter === 'recheck' ? 'white' : '#4b5563',
                fontSize: '13.5px'
              }"
              @click="activeFilter = 'recheck'"
            >
              Tái khám
            </button>
            <button 
              type="button" 
              class="btn py-2 px-3 font-weight-bold" 
              :style="{
                backgroundColor: activeFilter === 'discharged' ? '#0d9488' : '#f3f4f6',
                color: activeFilter === 'discharged' ? 'white' : '#4b5563',
                fontSize: '13.5px',
                borderRadius: '0 8px 8px 0'
              }"
              @click="activeFilter = 'discharged'"
            >
              Đã xuất viện
            </button>
          </div>

          <!-- Search & Sorting controls -->
          <div class="d-flex align-items-center">
            <!-- Search bar -->
            <div class="position-relative mr-3" style="width: 250px;">
              <i class="fas fa-search position-absolute text-muted" style="left: 12px; top: 12px;"></i>
              <input 
                type="text" 
                class="form-control pl-4 border-0 bg-light rounded" 
                placeholder="Tìm tên, ID..." 
                style="height: 38px; font-size: 13px;"
                v-model="searchQuery"
              >
            </div>
            
            <!-- Sort selector -->
            <span class="text-secondary mr-2 d-none d-sm-inline" style="font-size: 13px;">Sắp xếp:</span>
            <select class="custom-select mr-2 border-0 bg-light" style="width: 170px; height: 38px; font-size: 13px;" v-model="sortBy">
              <option value="newest">Cập nhật mới nhất</option>
              <option value="name">Tên A-Z</option>
              <option value="age">Tuổi tăng dần</option>
            </select>

            <!-- Settings filter square button -->
            <button class="btn btn-light border bg-white" style="height: 38px; width: 38px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
              <i class="fas fa-sliders-h text-secondary"></i>
            </button>
          </div>
        </div>

        <!-- Table Container -->
        <div class="table-responsive rounded border">
          <table class="table table-hover mb-0 text-left" style="font-size: 13.5px; vertical-align: middle;">
            <thead class="thead-light">
              <tr class="text-uppercase" style="font-family: 'Outfit', sans-serif; font-size: 12px; letter-spacing: 0.5px;">
                <th class="py-3 px-4">Thông tin bệnh nhân</th>
                <th class="py-3">Số ID</th>
                <th class="py-3">Tiền sử bệnh lý</th>
                <th class="py-3">Trạng thái hiện tại</th>
                <th class="py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredPatients" :key="item.id" class="align-middle">
                <!-- Name and demographics -->
                <td class="py-3 px-4">
                  <div class="d-flex align-items-center">
                    <div 
                      class="rounded-circle d-flex align-items-center justify-content-center font-weight-bold mr-3"
                      :style="{
                        width: '42px',
                        height: '42px',
                        backgroundColor: item.avatarBg,
                        color: item.avatarColor,
                        fontSize: '14px'
                      }"
                    >
                      {{ item.avatar }}
                    </div>
                    <div>
                      <h6 class="font-weight-bold mb-0 text-dark">{{ item.name }}</h6>
                      <small class="text-muted">{{ item.gender }}, {{ item.age }} tuổi</small>
                    </div>
                  </div>
                </td>
                
                <!-- ID -->
                <td class="py-3 align-middle text-secondary font-weight-bold">#{{ item.id }}</td>
                
                <!-- History tags -->
                <td class="py-3 align-middle">
                  <div class="d-flex flex-wrap">
                    <span 
                      v-for="(h, idx) in item.history" 
                      :key="idx" 
                      class="badge mr-1 mb-1 px-2 py-1"
                      style="background-color: #eff6ff; color: #1e40af; border-radius: 6px; font-weight: 500;"
                    >
                      {{ h }}
                    </span>
                  </div>
                </td>
                
                <!-- Current status badge -->
                <td class="py-3 align-middle">
                  <span 
                    class="badge badge-pill px-3 py-2 font-weight-bold"
                    :style="{
                      backgroundColor: item.status === 'treating' ? '#f0fdf4' : 
                                      item.status === 'critical' ? '#fef2f2' :
                                      item.status === 'recheck' ? '#f3f4f6' : '#eff6ff',
                      color: item.status === 'treating' ? '#16a34a' : 
                             item.status === 'critical' ? '#dc2626' :
                             item.status === 'recheck' ? '#4b5563' : '#2563eb'
                    }"
                  >
                    <i class="fas fa-circle mr-1" style="font-size: 8px;"></i>
                    {{ item.statusText }}
                  </span>
                </td>
                
                <!-- Actions -->
                <td class="py-3 align-middle text-center">
                  <button class="btn btn-sm btn-link text-secondary mr-2" title="Xem chi tiết" @click="triggerToast('Xem thông tin chi tiết bệnh nhân: ' + item.name)">
                    <i class="far fa-eye fa-lg" style="color: #6b7280;"></i>
                  </button>
                  <button class="btn btn-sm btn-link text-secondary" title="Chỉnh sửa" @click="triggerToast('Mở trình chỉnh sửa hồ sơ: ' + item.name)">
                    <i class="fas fa-pencil-alt" style="color: #6b7280;"></i>
                  </button>
                </td>
              </tr>
              
              <!-- Empty state inside table -->
              <tr v-if="filteredPatients.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">
                  <i class="fas fa-folder-open fa-2x mb-3 text-secondary" style="opacity: 0.5;"></i>
                  <p class="mb-0">Không tìm thấy bệnh nhân nào khớp với dữ liệu lọc.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Pagination Footer row -->
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4">
          <small class="text-muted mb-3 mb-sm-0">
            Hiển thị 1-{{ filteredPatients.length }} trong số {{ totalPatients }} bệnh nhân
          </small>
          
          <nav aria-label="Table navigation">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item disabled">
                <a class="page-link border-0 text-secondary" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item active"><a class="page-link border-0 text-white rounded" style="background-color: #0d9488;" href="#">1</a></li>
              <li class="page-item"><a class="page-link border-0 text-secondary" href="#">2</a></li>
              <li class="page-item"><a class="page-link border-0 text-secondary" href="#">3</a></li>
              <li class="page-item disabled"><span class="page-link border-0 text-secondary">...</span></li>
              <li class="page-item"><a class="page-link border-0 text-secondary" href="#">129</a></li>
              <li class="page-item">
                <a class="page-link border-0 text-secondary" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

      </div>
    </div>

    <!-- Bottom Secondary Section Grid (Chart + Recent consultations) -->
    <div class="row">
      <!-- Left Column: Department Distribution Chart -->
      <div class="col-xl-7 mb-4">
        <div class="card border-0 shadow-sm rounded-lg">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 16px;">
                Phân bổ bệnh nhân theo khoa
              </h5>
              <a href="#" class="text-teal font-weight-bold text-decoration-none" style="color: #0d9488; font-size: 13px;">
                Chi tiết <i class="fas fa-chevron-right ml-1"></i>
              </a>
            </div>

            <!-- Custom Horizontal Bar Chart using CSS heights / Bootstrap progress bars -->
            <div class="d-flex justify-content-around align-items-end pt-4 px-2" style="height: 240px; border-bottom: 2px solid #e2e8f0;">
              <!-- Hồi Sức -->
              <div class="d-flex flex-column align-items-center" style="width: 60px;">
                <div class="rounded-top w-100" style="height: 140px; background-color: #2dd4bf; transition: all 0.3s;"></div>
                <small class="text-uppercase text-muted font-weight-bold mt-2 text-center" style="font-size: 9px; min-height: 24px; line-height: 12px;">Hồi sức</small>
              </div>

              <!-- Tim Mạch -->
              <div class="d-flex flex-column align-items-center" style="width: 60px;">
                <div class="rounded-top w-100" style="height: 210px; background-color: #0f766e; transition: all 0.3s;"></div>
                <small class="text-uppercase text-muted font-weight-bold mt-2 text-center" style="font-size: 9px; min-height: 24px; line-height: 12px;">Tim mạch</small>
              </div>

              <!-- Thần Kinh -->
              <div class="d-flex flex-column align-items-center" style="width: 60px;">
                <div class="rounded-top w-100" style="height: 105px; background-color: #2dd4bf; transition: all 0.3s;"></div>
                <small class="text-uppercase text-muted font-weight-bold mt-2 text-center" style="font-size: 9px; min-height: 24px; line-height: 12px;">Thần kinh</small>
              </div>

              <!-- Nội Tổng Quát -->
              <div class="d-flex flex-column align-items-center" style="width: 60px;">
                <div class="rounded-top w-100" style="height: 180px; background-color: #0f766e; transition: all 0.3s;"></div>
                <small class="text-uppercase text-muted font-weight-bold mt-2 text-center" style="font-size: 9px; min-height: 24px; line-height: 12px;">Nội tổng quát</small>
              </div>

              <!-- Nhi Khoa -->
              <div class="d-flex flex-column align-items-center" style="width: 60px;">
                <div class="rounded-top w-100" style="height: 130px; background-color: #2dd4bf; transition: all 0.3s;"></div>
                <small class="text-uppercase text-muted font-weight-bold mt-2 text-center" style="font-size: 9px; min-height: 24px; line-height: 12px;">Nhi khoa</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Recent Consultations -->
      <div class="col-xl-5 mb-4">
        <div class="card border-0 shadow-sm rounded-lg">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 16px;">
                Tư vấn gần đây
              </h5>
              <a href="#" class="text-secondary font-weight-bold text-decoration-none" style="font-size: 13px;">
                Xem tất cả
              </a>
            </div>

            <!-- Consultations List -->
            <div class="d-flex flex-column">
              <!-- Item 1 -->
              <div class="d-flex align-items-center mb-3 p-3 rounded" style="background-color: #f8fafc; border-left: 4px solid #3b82f6;">
                <div class="rounded-circle d-flex align-items-center justify-content-center mr-3 bg-white border" style="width: 44px; height: 44px;">
                  <i class="fas fa-file-medical text-primary fa-lg"></i>
                </div>
                <div>
                  <h6 class="font-weight-bold text-dark mb-1" style="font-size: 14px;">Khám lại hậu phẫu</h6>
                  <p class="text-muted mb-0" style="font-size: 11.5px;">
                    Hôm nay, 09:30 sáng &bull; <strong>Arthur Morgan</strong>
                  </p>
                </div>
              </div>

              <!-- Item 2 -->
              <div class="d-flex align-items-center mb-3 p-3 rounded" style="background-color: #f8fafc; border-left: 4px solid #10b981;">
                <div class="rounded-circle d-flex align-items-center justify-content-center mr-3 bg-white border" style="width: 44px; height: 44px;">
                  <i class="fas fa-pills text-success fa-lg"></i>
                </div>
                <div>
                  <h6 class="font-weight-bold text-dark mb-1" style="font-size: 14px;">Cập nhật đơn thuốc</h6>
                  <p class="text-muted mb-0" style="font-size: 11.5px;">
                    Hôm nay, 11:45 sáng &bull; <strong>Eleanor Shellstrop</strong>
                  </p>
                </div>
              </div>

              <!-- Item 3 -->
              <div class="d-flex align-items-center p-3 rounded" style="background-color: #f8fafc; border-left: 4px solid #6b7280;">
                <div class="rounded-circle d-flex align-items-center justify-content-center mr-3 bg-white border" style="width: 44px; height: 44px;">
                  <i class="fas fa-vials text-secondary fa-lg"></i>
                </div>
                <div>
                  <h6 class="font-weight-bold text-dark mb-1" style="font-size: 14px;">Đánh giá kết quả xét nghiệm</h6>
                  <p class="text-muted mb-0" style="font-size: 11.5px;">
                    Hôm qua, 04:15 chiều &bull; <strong>Jason Mendoza</strong>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Create Patient Dialog (Modal Backing) -->
    <div v-if="showNewPatientModal" class="modal d-block" style="background: rgba(0, 0, 0, 0.5); z-index: 1040;" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
          <div class="modal-header bg-light py-3 border-bottom">
            <h5 class="modal-title font-weight-bold text-dark" style="font-size: 16px;">Tạo Hồ Sơ Bệnh Nhân Mới</h5>
            <button type="button" class="close" @click="showNewPatientModal = false" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4 text-left">
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Họ tên bệnh nhân *</label>
              <input type="text" class="form-control" placeholder="Ví dụ: Arthur Morgan..." v-model="newPatient.name">
            </div>
            
            <div class="row">
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Giới tính</label>
                <select class="form-control" v-model="newPatient.gender">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Tuổi *</label>
                <input type="number" class="form-control" placeholder="Tuổi..." v-model="newPatient.age">
              </div>
            </div>

            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Tiền sử bệnh lý (Cắt nhau bằng dấu phẩy)</label>
              <input type="text" class="form-control" placeholder="Ví dụ: Huyết áp cao, Dị ứng thuốc..." v-model="newPatient.history">
            </div>

            <div class="form-group mb-0">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Trạng thái điều trị</label>
              <select class="form-control" v-model="newPatient.status">
                <option value="treating">Đang điều trị</option>
                <option value="critical">Nguy kịch</option>
                <option value="recheck">Tái khám</option>
                <option value="discharged">Đã xuất viện</option>
              </select>
            </div>
          </div>
          <div class="modal-footer bg-light border-top py-3">
            <button type="button" class="btn btn-secondary py-2 px-4 font-weight-bold" style="font-size: 13px;" @click="showNewPatientModal = false">Đóng</button>
            <button type="button" class="btn btn-dark py-2 px-4 font-weight-bold" style="font-size: 13px; background-color: #0d9488; border-color: #0d9488;" @click="handleCreatePatient">Lưu thông tin</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.text-teal {
  color: #0d9488;
}
.hover-bg-light:hover {
  background-color: #f8fafc;
}
</style>
