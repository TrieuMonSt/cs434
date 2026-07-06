<script setup>
import { ref, onMounted } from 'vue';

// Patient Data (exactly matches Image 1)
const patients = ref([
  {
    name: 'Hoàng Anh Tuấn',
    email: 'tuan.hoang@example.com',
    phone: '0912 707 808',
    insurance: 'BHYT-2026-0008',
    status: 'active', // active, monitor
    dob: '1982-09-24',
    gender: 'Nam',
    address: 'Tam Kỳ, Quảng Nam'
  },
  {
    name: 'Bùi Khánh Linh',
    email: 'linh.bui@example.com',
    phone: '0912 505 606',
    insurance: 'BHYT-2026-0007',
    status: 'active',
    dob: '1995-11-12',
    gender: 'Nữ',
    address: 'Hải Châu, Đà Nẵng'
  },
  {
    name: 'Võ Quốc Hưng',
    email: 'hung.vo@example.com',
    phone: '0912 303 404',
    insurance: 'BHYT-2026-0006',
    status: 'active',
    dob: '1988-03-15',
    gender: 'Nam',
    address: 'Ninh Kiều, Cần Thơ'
  },
  {
    name: 'Đặng Ngọc Mai',
    email: 'mai.dang@example.com',
    phone: '0912 101 202',
    insurance: 'BHYT-2026-0005',
    status: 'monitor',
    dob: '1990-07-22',
    gender: 'Nữ',
    address: 'Quận 1, TP. Hồ Chí Minh'
  },
  {
    name: 'Phạm Minh Khang',
    email: 'khang.pham@example.com',
    phone: '0912 888 999',
    insurance: 'BHYT-2026-0004',
    status: 'active',
    dob: '1993-01-05',
    gender: 'Nam',
    address: 'Hoàn Kiếm, Hà Nội'
  },
  {
    name: 'Lê Thu Hà',
    email: 'ha.le@example.com',
    phone: '0912 666 777',
    insurance: 'BHYT-2026-0003',
    status: 'monitor',
    dob: '1985-05-18',
    gender: 'Nữ',
    address: 'Lê Chân, Hải Phòng'
  },
  {
    name: 'Nguyễn Hoàng Nam',
    email: 'nam.nguyen@example.com',
    phone: '0912 444 555',
    insurance: 'BHYT-2026-0002',
    status: 'active',
    dob: '1992-10-30',
    gender: 'Nam',
    address: 'Thanh Xuân, Hà Nội'
  },
  {
    name: 'Trần Gia Hân',
    email: 'patient@hospital.test',
    phone: '0912 222 333',
    insurance: 'BHYT-2026-0001',
    status: 'active',
    dob: '1998-12-25',
    gender: 'Nữ',
    address: 'Quận 3, TP. Hồ Chí Minh'
  }
]);

// Currently selected patient for editing
const selectedPatient = ref(null);
const selectedIndex = ref(-1);

// Toast notice
const toastMessage = ref('');
const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
};

// Select patient for form
const selectPatient = (patient, index) => {
  selectedIndex.value = index;
  selectedPatient.value = { ...patient };
};

// Auto-select first patient on mount (matches Image 1)
onMounted(() => {
  if (patients.value.length > 0) {
    selectPatient(patients.value[0], 0);
  }
});

// Update selected patient's information in the main list
const updatePatient = () => {
  if (selectedIndex.value === -1 || !selectedPatient.value) return;
  
  if (!selectedPatient.value.name.trim()) {
    alert('Họ tên không được trống.');
    return;
  }

  // Update in array
  patients.value[selectedIndex.value] = { ...selectedPatient.value };
  triggerToast(`Đã cập nhật hồ sơ bệnh nhân: ${selectedPatient.value.name}`);
};

// Delete patient from list
const deletePatient = (index, name) => {
  if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ bệnh nhân ${name}?`)) {
    patients.value.splice(index, 1);
    triggerToast(`Đã xóa hồ sơ bệnh nhân: ${name}`);
    
    // Select another patient or clear
    if (patients.value.length > 0) {
      selectPatient(patients.value[0], 0);
    } else {
      selectedPatient.value = null;
      selectedIndex.value = -1;
    }
  }
};

// Close right side panel (just clears selection)
const closePanel = () => {
  selectedPatient.value = null;
  selectedIndex.value = -1;
};
</script>

<template>
  <div class="container-fluid px-4 py-4">
    <!-- Toast Message Banner -->
    <div v-if="toastMessage" class="alert alert-success position-fixed shadow-lg" style="bottom: 20px; right: 20px; z-index: 1050; border-left: 5px solid #10b981; min-width: 300px; border-radius: 8px;">
      <div class="d-flex align-items-center text-left">
        <i class="fas fa-check-circle text-success mr-2.5 fa-lg"></i>
        <strong style="font-size: 13.5px; color: #1e293b;">{{ toastMessage }}</strong>
      </div>
    </div>

    <!-- Main Flex Row -->
    <div class="row">
      <!-- Left side: Patient Table Card (occupies ~68% width on desktop) -->
      <div class="col-lg-8 mb-4">
        <div class="card border-0 shadow-sm rounded-lg bg-white" style="border: 1px solid #e2e8f0 !important; border-radius: 12px; overflow: hidden;">
          <!-- Card Header -->
          <div class="card-header bg-white border-bottom-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <h6 class="font-weight-bold mb-0 text-dark" style="font-size: 14.5px; opacity: 0.8;">
              {{ patients.length }} bản ghi
            </h6>
          </div>

          <!-- Table Container -->
          <div class="table-responsive">
            <table class="table mb-0 text-left" style="font-size: 13.5px; vertical-align: middle;">
              <thead>
                <tr class="text-uppercase text-secondary" style="font-size: 10.5px; font-weight: 700; border-bottom: 2px solid #f1f5f9; background-color: #fafafa;">
                  <th class="py-3 px-4">Họ tên</th>
                  <th class="py-3">Email</th>
                  <th class="py-3">Điện thoại</th>
                  <th class="py-3">BHYT</th>
                  <th class="py-3 text-center" style="width: 140px;">Trạng thái</th>
                  <th class="py-3 text-center" style="width: 110px;">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(p, index) in patients" 
                  :key="p.insurance" 
                  class="align-middle hover-row cursor-pointer"
                  :class="{ 'selected-row': selectedIndex === index }"
                  @click="selectPatient(p, index)"
                >
                  <!-- Name -->
                  <td class="py-3.5 px-4 font-weight-bold text-dark">{{ p.name }}</td>
                  
                  <!-- Email -->
                  <td class="py-3.5 text-secondary" style="font-size: 13px;">{{ p.email }}</td>
                  
                  <!-- Phone -->
                  <td class="py-3.5 text-secondary" style="font-size: 13px;">{{ p.phone }}</td>
                  
                  <!-- Insurance Code -->
                  <td class="py-3.5 text-secondary" style="font-size: 12.5px; font-weight: 500;">{{ p.insurance }}</td>
                  
                  <!-- Status Badge -->
                  <td class="py-3.5 text-center">
                    <span 
                      class="badge font-weight-bold px-2.5 py-1.5"
                      :style="{
                        backgroundColor: p.status === 'active' ? '#e0fdf4' : '#ffedd5',
                        color: p.status === 'active' ? '#0f766e' : '#ea580c',
                        borderRadius: '6px',
                        fontSize: '11px'
                      }"
                    >
                      {{ p.status === 'active' ? 'Đang hoạt động' : 'Theo dõi' }}
                    </span>
                  </td>
                  
                  <!-- Action Buttons -->
                  <td class="py-3.5 text-center" @click.stop>
                    <div class="d-flex justify-content-center align-items-center">
                      <!-- Edit Circle icon -->
                      <button 
                        @click="selectPatient(p, index)"
                        class="btn-action border mr-2 transition-all" 
                        style="width: 28px; height: 28px; border-radius: 6px; background-color: #f0fdfa; color: #0d9488; border-color: #ccfbf1 !important;"
                        title="Xem & Cập nhật"
                      >
                        <i class="fas fa-pencil-alt" style="font-size: 11px;"></i>
                      </button>
                      <!-- Delete Circle icon -->
                      <button 
                        @click="deletePatient(index, p.name)"
                        class="btn-action border transition-all" 
                        style="width: 28px; height: 28px; border-radius: 6px; background-color: #fef2f2; color: #dc2626; border-color: #fee2e2 !important;"
                        title="Xóa"
                      >
                        <i class="far fa-trash-alt" style="font-size: 11px;"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right side: Edit Panel (occupies ~32% width on desktop) -->
      <div class="col-lg-4">
        <!-- If patient is selected -->
        <div v-if="selectedPatient" class="card border-0 shadow-sm rounded-lg bg-white p-4" style="border: 1px solid #e2e8f0 !important; border-radius: 12px;">
          <!-- Panel Header -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <small class="text-uppercase font-weight-bold text-secondary mb-0.5 d-block" style="font-size: 9.5px; letter-spacing: 0.5px;">CẬP NHẬT</small>
              <h5 class="font-weight-bold text-dark mb-0" style="font-family: 'Outfit', sans-serif; font-size: 18px;">Bệnh nhân</h5>
            </div>
            <!-- Close icon button -->
            <button 
              @click="closePanel" 
              class="btn btn-light d-flex align-items-center justify-content-center" 
              style="width: 28px; height: 28px; border-radius: 6px; background-color: #f1f5f9; border: none; color: #64748b;"
            >
              <i class="fas fa-times" style="font-size: 11px;"></i>
            </button>
          </div>

          <!-- Edit Form -->
          <form @submit.prevent="updatePatient" class="text-left">
            <!-- Full Name -->
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12px;">Họ tên</label>
              <input type="text" class="form-control form-input" v-model="selectedPatient.name">
            </div>

            <!-- Email -->
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12px;">Email</label>
              <input type="email" class="form-control form-input" v-model="selectedPatient.email">
            </div>

            <!-- Phone -->
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12px;">Số điện thoại</label>
              <input type="text" class="form-control form-input" v-model="selectedPatient.phone">
            </div>

            <!-- Birth Date -->
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12px;">Ngày sinh</label>
              <input type="date" class="form-control form-input" v-model="selectedPatient.dob">
            </div>

            <!-- Gender -->
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12px;">Giới tính</label>
              <select class="form-control form-input" v-model="selectedPatient.gender">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <!-- Address -->
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12px;">Địa chỉ</label>
              <input type="text" class="form-control form-input" v-model="selectedPatient.address">
            </div>

            <!-- Insurance Card (BHYT) -->
            <div class="form-group mb-4">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12px;">Mã BHYT</label>
              <input type="text" class="form-control form-input" v-model="selectedPatient.insurance">
            </div>

            <!-- Status selector -->
            <div class="form-group mb-4">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12px;">Trạng thái hoạt động</label>
              <select class="form-control form-input" v-model="selectedPatient.status">
                <option value="active">Đang hoạt động</option>
                <option value="monitor">Theo dõi</option>
              </select>
            </div>

            <!-- Save Action Button -->
            <button 
              type="submit" 
              class="btn w-100 font-weight-bold text-white py-2.5 d-flex align-items-center justify-content-center transition-all hover-shadow" 
              style="background-color: #0891b2; border: none; border-radius: 8px; font-size: 13.5px;"
            >
              <i class="far fa-save mr-2" style="font-size: 14px;"></i> Cập nhật thông tin
            </button>
          </form>
        </div>

        <!-- Placeholder when no patient is selected -->
        <div v-else class="card border-0 shadow-sm rounded-lg bg-white p-5 text-center text-secondary" style="border: 1px solid #e2e8f0 !important; border-radius: 12px; height: 100%; min-height: 300px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
          <i class="fas fa-user-circle fa-3x mb-3 text-muted" style="opacity: 0.4;"></i>
          <h6 class="font-weight-bold text-dark mb-1">Chưa chọn bệnh nhân</h6>
          <p class="mb-0 text-muted" style="font-size: 12.5px;">Vui lòng chọn một bệnh nhân từ bảng để xem thông tin chi tiết hoặc cập nhật hồ sơ.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-row:hover {
  background-color: #f8fafc;
}
.selected-row {
  background-color: #e0f2fe40 !important;
}
.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  outline: none;
}
.btn-action:hover {
  filter: brightness(0.95);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.form-input {
  height: 38px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}
.form-input:focus {
  border-color: #0891b2;
  box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.1);
}
.hover-shadow:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  filter: brightness(0.95);
}
</style>
