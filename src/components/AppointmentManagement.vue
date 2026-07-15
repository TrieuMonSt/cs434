<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../utils/api';

// Appointment Data
const appointments = ref([
  {
    stt: '01',
    id: 'APP-001',
    name: 'Nguyễn Văn A',
    date: '2025-06-17',
    gender: 'Nam',
    dob: '2004-06-06',
    symptom: 'Khó thở',
    status: 'confirmed', // confirmed, pending
  },
  {
    stt: '02',
    id: 'APP-002',
    name: 'Nguyễn Thị B',
    date: '2025-06-17',
    gender: 'Nữ',
    dob: '2004-08-14',
    symptom: 'Khó thở',
    status: 'pending',
  },
  {
    stt: '03',
    id: 'APP-003',
    name: 'Nguyễn Văn D',
    date: '2025-06-17',
    gender: 'Nam',
    dob: '2004-10-08',
    symptom: 'Đau đầu',
    status: 'pending',
  },
  {
    stt: '04',
    id: 'APP-004',
    name: 'Nguyễn Văn E',
    date: '2025-06-17',
    gender: 'Nam',
    dob: '2004-08-01',
    symptom: 'Nghẹt mũi',
    status: 'confirmed',
  }
]);

// Filters State
const searchQuery = ref('');
const statusFilter = ref('all');
const dateFilter = ref('');

// Modal State
const showAddModal = ref(false);
const newAppt = ref({
  name: '',
  date: '2025-06-17',
  gender: 'Nam',
  dob: '',
  symptom: '',
  status: 'pending'
});

// Toast notification
const toastMessage = ref('');
const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
};

// API calls
const fetchAppointments = async () => {
  try {
    const response = await api.get('/appointments');
    if (response.data.success && response.data.appointments) {
      appointments.value = response.data.appointments;
    }
  } catch (error) {
    console.error('Error fetching appointments from API, keeping mock data:', error.message);
  }
};

onMounted(() => {
  fetchAppointments();
});

// Filtered Appointments
const filteredAppointments = computed(() => {
  return appointments.value.filter((appt) => {
    // Search filter
    const matchesSearch = !searchQuery.value || 
      appt.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter.value === 'all' || appt.status === statusFilter.value;
    
    // Date filter
    const matchesDate = !dateFilter.value || appt.date === dateFilter.value;
    
    return matchesSearch && matchesStatus && matchesDate;
  });
});

// Format Date DD-MM-YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

// Reset Filters
const resetFilters = () => {
  searchQuery.value = '';
  statusFilter.value = 'all';
  dateFilter.value = '';
  triggerToast('Đã làm mới bộ lọc.');
};

// Export Report
const exportReport = () => {
  triggerToast('Xuất báo cáo lịch hẹn thành công (Excel/PDF)!');
};

// Toggle Status
const toggleStatus = async (appt) => {
  const prevStatus = appt.status;
  const newStatus = appt.status === 'confirmed' ? 'pending' : 'confirmed';
  appt.status = newStatus;

  try {
    const response = await api.put(`/appointments/${appt.id}/toggle`);
    if (response.data.success) {
      triggerToast(`Đã cập nhật trạng thái của ${appt.name} sang ${newStatus === 'confirmed' ? 'Đã xác nhận' : 'Chờ duyệt'}.`);
    }
  } catch (error) {
    console.error('Error toggling appointment status:', error);
    // Keep local change as fallback
    triggerToast(`(Mock) Đã cập nhật trạng thái của ${appt.name}.`);
  }
};

// Delete Appointment
const deleteAppointment = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
    const prevList = [...appointments.value];
    appointments.value = appointments.value.filter(a => a.id !== id);
    appointments.value.forEach((a, index) => {
      a.stt = String(index + 1).padStart(2, '0');
    });

    try {
      const response = await api.delete(`/appointments/${id}`);
      if (response.data.success) {
        triggerToast('Đã xóa lịch hẹn thành công.');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      // Keep local change as fallback
      triggerToast('(Mock) Đã xóa lịch hẹn.');
    }
  }
};

// Create Appointment
const createAppointment = async () => {
  if (!newAppt.value.name.trim() || !newAppt.value.dob) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
    return;
  }
  
  const payload = {
    name: newAppt.value.name,
    date: newAppt.value.date,
    gender: newAppt.value.gender,
    dob: newAppt.value.dob,
    symptom: newAppt.value.symptom || 'Khám sức khỏe',
    status: newAppt.value.status
  };

  try {
    const response = await api.post('/appointments', payload);
    if (response.data.success) {
      triggerToast('Đặt lịch hẹn mới thành công!');
      fetchAppointments();
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    // Mock local creation fallback
    const nextStt = String(appointments.value.length + 1).padStart(2, '0');
    appointments.value.push({
      stt: nextStt,
      id: `APP-MOCK-${Date.now().toString().slice(-3)}`,
      ...payload
    });
    triggerToast('(Mock) Đặt lịch hẹn mới thành công!');
  }

  showAddModal.value = false;

  // Reset fields
  newAppt.value = {
    name: '',
    date: '2025-06-17',
    gender: 'Nam',
    dob: '',
    symptom: '',
    status: 'pending'
  };
};
</script>

<template>
  <div class="container-fluid px-4 py-4 bg-light" style="min-height: calc(100vh - 120px);">
    <!-- Header Section -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
      <div>
        <h3 class="font-weight-bold mb-1 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 26px;">Lịch hẹn khám bệnh</h3>
        <p class="text-secondary mb-0" style="font-size: 14px;">Quản lý và theo dõi các cuộc hẹn với bệnh nhân trong ngày.</p>
      </div>
      
      <div class="d-flex align-items-center mt-3 mt-md-0">
        <button @click="exportReport" class="btn btn-light border mr-3 font-weight-bold text-dark px-3 py-2 d-flex align-items-center" style="font-size: 13.5px; background: white; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          <i class="fas fa-download mr-2 text-secondary"></i> Xuất báo cáo
        </button>
        <button @click="showAddModal = true" class="btn btn-dark font-weight-bold px-3 py-2 d-flex align-items-center" style="font-size: 13.5px; background-color: #0f766e; border-color: #0f766e; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          <i class="fas fa-plus mr-2"></i> Đặt lịch mới
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

    <!-- Filters Section -->
    <div class="card border-0 shadow-sm rounded-lg mb-4" style="border: 1px solid #e2e8f0 !important;">
      <div class="card-body p-3 bg-white rounded-lg">
        <div class="row align-items-end">
          <!-- Search input -->
          <div class="col-md-4 mb-2 mb-md-0">
            <label class="font-weight-bold text-uppercase text-secondary mb-1" style="font-size: 10px; letter-spacing: 0.5px;">Tìm kiếm</label>
            <div class="position-relative">
              <i class="fas fa-search position-absolute text-muted" style="left: 12px; top: 12px;"></i>
              <input 
                type="text" 
                class="form-control pl-5 border bg-light rounded" 
                placeholder="Họ tên bệnh nhân..." 
                style="height: 38px; font-size: 13px;"
                v-model="searchQuery"
              >
            </div>
          </div>

          <!-- Status Dropdown -->
          <div class="col-md-3 mb-2 mb-md-0">
            <label class="font-weight-bold text-uppercase text-secondary mb-1" style="font-size: 10px; letter-spacing: 0.5px;">Trạng thái</label>
            <select class="custom-select border bg-light" style="height: 38px; font-size: 13px;" v-model="statusFilter">
              <option value="all">Tất cả trạng thái</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="pending">Đang chờ</option>
            </select>
          </div>

          <!-- Date Input -->
          <div class="col-md-3 mb-2 mb-md-0">
            <label class="font-weight-bold text-uppercase text-secondary mb-1" style="font-size: 10px; letter-spacing: 0.5px;">Ngày hẹn</label>
            <div class="position-relative">
              <input 
                type="date" 
                class="form-control border bg-light rounded" 
                style="height: 38px; font-size: 13px;"
                v-model="dateFilter"
              >
            </div>
          </div>

          <!-- Reset Button -->
          <div class="col-md-2">
            <button @click="resetFilters" class="btn btn-light w-100 font-weight-bold d-flex align-items-center justify-content-center" style="height: 38px; font-size: 13px; color: #4f46e5; background-color: #e0e7ff; border: none; border-radius: 8px;">
              <i class="fas fa-sync-alt mr-2"></i> Làm mới
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="card border-0 shadow-sm rounded-lg" style="border: 1px solid #e2e8f0 !important;">
      <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
        <h6 class="font-weight-bold mb-0 text-dark" style="font-size: 14px; letter-spacing: 0.5px;">DANH SÁCH LỊCH HẸN</h6>
        <small class="text-secondary font-weight-medium">Hiển thị {{ filteredAppointments.length }} kết quả</small>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table mb-0 text-left" style="font-size: 13.5px; vertical-align: middle;">
            <thead class="bg-light">
              <tr class="text-uppercase text-secondary" style="font-family: 'Outfit', sans-serif; font-size: 11px; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">
                <th class="py-3 px-4 text-center" style="width: 80px;">STT</th>
                <th class="py-3 px-3">Bệnh nhân</th>
                <th class="py-3 px-3">Ngày hẹn</th>
                <th class="py-3 px-3">Giới tính</th>
                <th class="py-3 px-3">Ngày sinh</th>
                <th class="py-3 px-3">Triệu chứng</th>
                <th class="py-3 px-3 text-center" style="width: 160px;">Trạng thái</th>
                <th class="py-3 px-4 text-center" style="width: 200px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="appt in filteredAppointments" :key="appt.id" class="hover-row">
                <!-- STT -->
                <td class="py-3 text-center font-weight-bold text-dark align-middle">{{ appt.stt }}</td>
                
                <!-- Patient Name -->
                <td class="py-3 px-3 font-weight-bold text-dark align-middle">{{ appt.name }}</td>
                
                <!-- Appt Date -->
                <td class="py-3 px-3 text-secondary align-middle">{{ formatDate(appt.date) }}</td>
                
                <!-- Gender -->
                <td class="py-3 px-3 text-secondary align-middle">{{ appt.gender }}</td>
                
                <!-- Dob -->
                <td class="py-3 px-3 text-secondary align-middle">{{ formatDate(appt.dob) }}</td>
                
                <!-- Symptom -->
                <td class="py-3 px-3 align-middle">
                  <span class="px-2 py-1 rounded" style="background-color: #f1f5f9; color: #475569; font-size: 11.5px; font-weight: 500;">
                    {{ appt.symptom }}
                  </span>
                </td>
                
                <!-- Status Badge -->
                <td class="py-3 px-3 text-center align-middle">
                  <span 
                    class="badge text-white px-3 py-2 font-weight-bold w-100 text-center cursor-pointer transition-all"
                    :style="{
                      backgroundColor: appt.status === 'confirmed' ? '#15803d' : '#475569',
                      borderRadius: '6px',
                      fontSize: '11.5px'
                    }"
                    @click="toggleStatus(appt)"
                    title="Click để đổi trạng thái"
                  >
                    {{ appt.status === 'confirmed' ? 'Đã xác nhận' : 'Đang chờ' }}
                  </span>
                </td>
                
                <!-- Action Buttons -->
                <td class="py-3 px-4 text-center align-middle">
                  <div class="d-flex justify-content-center align-items-center">
                    <button 
                      @click="toggleStatus(appt)"
                      class="btn btn-sm text-white font-weight-bold px-3 py-1 mr-2 transition-all hover-shadow" 
                      style="background-color: #0284c7; border-radius: 6px; font-size: 12px; border: none;"
                    >
                      Cập nhật
                    </button>
                    <button 
                      @click="deleteAppointment(appt.id)"
                      class="btn btn-sm text-white font-weight-bold px-3 py-1 transition-all hover-shadow" 
                      style="background-color: #ef4444; border-radius: 6px; font-size: 12px; border: none;"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Empty state inside table -->
              <tr v-if="filteredAppointments.length === 0">
                <td colspan="8" class="text-center py-5 text-muted">
                  <i class="fas fa-calendar-times fa-2x mb-3 text-secondary" style="opacity: 0.5;"></i>
                  <p class="mb-0">Không có lịch hẹn nào khớp với bộ lọc tìm kiếm.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Table Pagination Footer row -->
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center py-3 px-4 border-top bg-white">
          <small class="text-secondary font-weight-medium mb-3 mb-sm-0">
            Trang 1/1
          </small>
          
          <nav aria-label="Table navigation">
            <ul class="pagination pagination-sm mb-0 align-items-center">
              <li class="page-item disabled mr-1">
                <a class="page-link border d-flex align-items-center justify-content-center rounded-circle" href="#" style="width: 28px; height: 28px; background: #fff; color: #cbd5e1;">
                  <i class="fas fa-chevron-left" style="font-size: 10px;"></i>
                </a>
              </li>
              <li class="page-item active mx-1">
                <a class="page-link border-0 text-white font-weight-bold d-flex align-items-center justify-content-center rounded" style="width: 28px; height: 28px; background-color: #0f766e;" href="#">1</a>
              </li>
              <li class="page-item disabled ml-1">
                <a class="page-link border d-flex align-items-center justify-content-center rounded-circle" href="#" style="width: 28px; height: 28px; background: #fff; color: #cbd5e1;">
                  <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>

      </div>
    </div>

    <!-- Add Appointment Dialog (Modal Backing) -->
    <div v-if="showAddModal" class="modal d-block" style="background: rgba(15, 23, 42, 0.6); z-index: 1040;" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
          <div class="modal-header bg-light py-3 border-bottom">
            <h5 class="modal-title font-weight-bold text-dark" style="font-size: 16px; font-family: 'Outfit', sans-serif;">Đặt Lịch Hẹn Khám Bệnh Mới</h5>
            <button type="button" class="close" @click="showAddModal = false" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4 text-left bg-white">
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Họ tên bệnh nhân *</label>
              <input type="text" class="form-control" placeholder="Ví dụ: Nguyễn Văn A..." v-model="newAppt.name">
            </div>
            
            <div class="row">
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Giới tính</label>
                <select class="form-control" v-model="newAppt.gender">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Ngày sinh *</label>
                <input type="date" class="form-control" v-model="newAppt.dob">
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Ngày hẹn *</label>
                <input type="date" class="form-control" v-model="newAppt.date">
              </div>
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Trạng thái đặt lịch</label>
                <select class="form-control" v-model="newAppt.status">
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="pending">Đang chờ</option>
                </select>
              </div>
            </div>

            <div class="form-group mb-0">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Triệu chứng lâm sàng</label>
              <input type="text" class="form-control" placeholder="Ví dụ: Khó thở, Đau đầu, Ho sốt..." v-model="newAppt.symptom">
            </div>
          </div>
          <div class="modal-footer bg-light border-top py-3">
            <button type="button" class="btn btn-secondary py-2 px-4 font-weight-bold" style="font-size: 13px; border-radius: 8px;" @click="showAddModal = false">Hủy bỏ</button>
            <button type="button" class="btn text-white py-2 px-4 font-weight-bold" style="font-size: 13px; background-color: #0f766e; border: none; border-radius: 8px;" @click="createAppointment">Lưu thông tin</button>
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
.cursor-pointer {
  cursor: pointer;
}
.transition-all {
  transition: all 0.2s ease;
}
.hover-shadow:hover {
  filter: brightness(0.9);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
