<script setup>
import { ref } from 'vue';

// Active Sub-Tab: 'ho-so', 'doi-mat-khau', 'bao-mat'
const activeSubTab = ref('ho-so');

// Edit Mode
const isEditing = ref(false);

// Profile Data
const doctorProfile = ref({
  fullName: 'Nguyễn Thành An',
  nationalId: '079185002931',
  gender: 'Nam',
  dob: '1985-10-15',
  doctorId: 'DOC-AN-001',
  address: '128/4 Nguyễn Trãi, Phường 3, Quận 5, TP. Hồ Chí Minh',
  specialty: 'Nội tổng quát',
  department: 'Khoa Nội 1 - Tòa nhà A',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200',
  staffId: 'DR-2024-0082',
  accountType: 'Quản trị viên',
  certifications: [
    { title: 'BSCK II - Nội khoa', detail: 'Xác thực bởi Bộ Y tế', icon: 'fas fa-user-shield', bg: '#ecfdf5', color: '#059669' },
    { title: '12 năm kinh nghiệm', detail: 'Bệnh viện Chợ Rẫy', icon: 'fas fa-history', bg: '#f0fdfa', color: '#0d9488' }
  ]
});

// Cache for rollback on cancel
const profileBackup = ref({});

// Change Password fields
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Toast state
const toastMessage = ref('');
const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
};

// Start Editing
const startEdit = () => {
  profileBackup.value = { ...doctorProfile.value };
  isEditing.value = true;
};

// Cancel Editing
const cancelEdit = () => {
  doctorProfile.value = { ...profileBackup.value };
  isEditing.value = false;
  triggerToast('Đã hủy bỏ các thay đổi.');
};

// Save Profile changes
const saveChanges = () => {
  if (!doctorProfile.value.fullName.trim()) {
    alert('Họ tên không được để trống.');
    return;
  }
  isEditing.value = false;
  triggerToast('Đã lưu thông tin tài khoản thành công!');
};

// Save Password changes
const updatePassword = () => {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    alert('Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.');
    return;
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp.');
    return;
  }
  triggerToast('Cập nhật mật khẩu mới thành công!');
  passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
};
</script>

<template>
  <div class="container-fluid px-4 py-4 bg-light" style="min-height: calc(100vh - 120px);">
    <!-- Title Area -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
      <div>
        <h3 class="font-weight-bold mb-1 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 26px;">Quản lý tài khoản</h3>
        
        <!-- Navigation Sub-Tabs -->
        <ul class="nav nav-tabs border-bottom-0 mt-3" style="font-size: 14.5px;">
          <li class="nav-item mr-3">
            <a 
              class="nav-link px-0 py-2 border-0 font-weight-bold cursor-pointer" 
              :style="{ 
                color: activeSubTab === 'ho-so' ? '#0f766e' : '#6b7280', 
                borderBottom: activeSubTab === 'ho-so' ? '3px solid #0f766e' : 'none' 
              }"
              @click="activeSubTab = 'ho-so'"
            >
              Hồ sơ
            </a>
          </li>
          <li class="nav-item mr-3">
            <a 
              class="nav-link px-0 py-2 border-0 font-weight-bold cursor-pointer" 
              :style="{ 
                color: activeSubTab === 'doi-mat-khau' ? '#0f766e' : '#6b7280', 
                borderBottom: activeSubTab === 'doi-mat-khau' ? '3px solid #0f766e' : 'none' 
              }"
              @click="activeSubTab = 'doi-mat-khau'"
            >
              Đổi mật khẩu
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link px-0 py-2 border-0 font-weight-bold cursor-pointer" 
              :style="{ 
                color: activeSubTab === 'bao-mat' ? '#0f766e' : '#6b7280', 
                borderBottom: activeSubTab === 'bao-mat' ? '3px solid #0f766e' : 'none' 
              }"
              @click="activeSubTab = 'bao-mat'"
            >
              Thông báo & Bảo mật
            </a>
          </li>
        </ul>
      </div>

      <!-- Action Button Top Right -->
      <div v-if="activeSubTab === 'ho-so' && !isEditing" class="mt-3 mt-md-0">
        <button @click="startEdit" class="btn btn-dark font-weight-bold px-4 py-2 d-flex align-items-center" style="font-size: 13.5px; background-color: #0f766e; border-color: #0f766e; border-radius: 8px;">
          <i class="fas fa-pencil-alt mr-2" style="font-size: 12px;"></i> Chỉnh sửa
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toastMessage" class="alert alert-success position-fixed shadow-lg" style="bottom: 20px; right: 20px; z-index: 1050; border-left: 5px solid #10b981; min-width: 300px; border-radius: 8px;">
      <div class="d-flex align-items-center">
        <i class="fas fa-check-circle text-success mr-2 fa-lg"></i>
        <strong style="font-size: 13.5px; color: #1e293b;">{{ toastMessage }}</strong>
      </div>
    </div>

    <!-- Tab 1: Profile View -->
    <div v-if="activeSubTab === 'ho-so'" class="row">
      <!-- Left Column: Avatar & Certifications -->
      <div class="col-xl-4 mb-4">
        <!-- Profile summary card -->
        <div class="card border-0 shadow-sm rounded-lg mb-4 text-center p-4 bg-white" style="border: 1px solid #e2e8f0 !important;">
          <div class="position-relative d-inline-block mx-auto mb-3">
            <img 
              :src="doctorProfile.avatar" 
              alt="Doctor Avatar" 
              class="rounded-circle border"
              style="width: 140px; height: 140px; object-fit: cover; border: 4px solid #f1f5f9 !important;"
            >
            <span class="position-absolute bg-success rounded-circle" style="width: 16px; height: 16px; right: 8px; bottom: 8px; border: 3px solid white;"></span>
          </div>

          <h5 class="font-weight-bold text-dark mb-1" style="font-family: 'Outfit', sans-serif;">BS. {{ doctorProfile.fullName }}</h5>
          <p class="text-secondary mb-4" style="font-size: 13px;">Chuyên khoa {{ doctorProfile.specialty }}</p>

          <!-- Status badge groups -->
          <div class="row px-2">
            <div class="col-6 px-1">
              <div class="p-2 rounded bg-light border text-center">
                <small class="d-block text-secondary font-weight-bold" style="font-size: 8.5px; letter-spacing: 0.5px;">ID NHÂN VIÊN</small>
                <span class="font-weight-bold text-dark" style="font-size: 12.5px;">{{ doctorProfile.staffId }}</span>
              </div>
            </div>
            <div class="col-6 px-1">
              <div class="p-2 rounded bg-light border text-center">
                <small class="d-block text-secondary font-weight-bold" style="font-size: 8.5px; letter-spacing: 0.5px;">LOẠI TÀI KHOẢN</small>
                <span class="font-weight-bold text-dark" style="font-size: 12.5px;">{{ doctorProfile.accountType }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications card -->
        <div class="card border-0 shadow-sm rounded-lg p-4 bg-white" style="border: 1px solid #e2e8f0 !important;">
          <h6 class="font-weight-bold text-secondary text-uppercase mb-3" style="font-size: 11px; letter-spacing: 0.5px;">Chứng chỉ & Hoạt động</h6>
          <div class="d-flex flex-column">
            <div v-for="cert in doctorProfile.certifications" :key="cert.title" class="d-flex align-items-center mb-3 p-2.5 rounded" :style="{ backgroundColor: cert.bg }">
              <div class="rounded-circle d-flex align-items-center justify-content-center mr-3" :style="{ width: '38px', height: '38px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)', color: cert.color }">
                <i :class="cert.icon"></i>
              </div>
              <div>
                <h6 class="font-weight-bold mb-0.5 text-dark" style="font-size: 13.5px;">{{ cert.title }}</h6>
                <small class="text-secondary" style="font-size: 11.5px;">{{ cert.detail }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Personal Information Form -->
      <div class="col-xl-8 mb-4">
        <div class="card border-0 shadow-sm rounded-lg p-4 bg-white h-100" style="border: 1px solid #e2e8f0 !important;">
          <h5 class="font-weight-bold text-dark mb-4" style="font-family: 'Outfit', sans-serif; font-size: 17px; border-left: 4px solid #0f766e; padding-left: 10px;">
            Thông tin cá nhân
          </h5>

          <form @submit.prevent="saveChanges">
            <div class="row">
              <!-- Full name -->
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Họ và tên</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="doctorProfile.fullName" 
                  :disabled="!isEditing"
                  :class="{ 'bg-light': !isEditing }"
                >
              </div>
              
              <!-- National ID -->
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Số CCCD / Hộ chiếu</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="doctorProfile.nationalId" 
                  :disabled="!isEditing"
                  :class="{ 'bg-light': !isEditing }"
                >
              </div>
            </div>

            <div class="row">
              <!-- Gender -->
              <div class="col-md-4 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Giới tính</label>
                <select 
                  class="form-control" 
                  v-model="doctorProfile.gender" 
                  :disabled="!isEditing"
                  :class="{ 'bg-light': !isEditing }"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <!-- Date of Birth -->
              <div class="col-md-4 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Ngày sinh</label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="doctorProfile.dob" 
                  :disabled="!isEditing"
                  :class="{ 'bg-light': !isEditing }"
                >
              </div>

              <!-- Doctor ID (DOC Code) -->
              <div class="col-md-4 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Mã Bác sĩ</label>
                <input 
                  type="text" 
                  class="form-control bg-light" 
                  v-model="doctorProfile.doctorId" 
                  disabled
                >
              </div>
            </div>

            <!-- Address -->
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Địa chỉ thường trú</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="doctorProfile.address" 
                :disabled="!isEditing"
                :class="{ 'bg-light': !isEditing }"
              >
            </div>

            <div class="row mb-4">
              <!-- Specialty -->
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Chuyên khoa</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="doctorProfile.specialty" 
                  :disabled="!isEditing"
                  :class="{ 'bg-light': !isEditing }"
                >
              </div>

              <!-- Department -->
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Khoa / Phòng ban</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="doctorProfile.department" 
                  :disabled="!isEditing"
                  :class="{ 'bg-light': !isEditing }"
                >
              </div>
            </div>

            <!-- Workplace & System visual blocks (Image placeholders) -->
            <div class="row mb-4">
              <div class="col-sm-6 mb-3 mb-sm-0">
                <div class="rounded border p-3 bg-light d-flex align-items-center justify-content-center text-center cursor-pointer hover-shadow" style="height: 120px; flex-direction: column;">
                  <i class="fas fa-hospital-user fa-2x mb-2 text-secondary" style="opacity: 0.6;"></i>
                  <span class="font-weight-bold text-dark" style="font-size: 12.5px;">Khu vực làm việc</span>
                  <small class="text-secondary" style="font-size: 11px;">Xem ảnh chi tiết</small>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="rounded border p-3 bg-light d-flex align-items-center justify-content-center text-center cursor-pointer hover-shadow" style="height: 120px; flex-direction: column;">
                  <i class="fas fa-history fa-2x mb-2 text-secondary" style="opacity: 0.6;"></i>
                  <span class="font-weight-bold text-dark" style="font-size: 12.5px;">Lịch sử hệ thống</span>
                  <small class="text-secondary" style="font-size: 11px;">Hoạt động gần nhất</small>
                </div>
              </div>
            </div>

            <!-- Form Edit Buttons -->
            <div v-if="isEditing" class="d-flex justify-content-end border-top pt-3">
              <button 
                type="button" 
                @click="cancelEdit" 
                class="btn btn-light border mr-2 font-weight-bold px-4 py-2" 
                style="border-radius: 8px; font-size: 13.5px; background: white;"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                class="btn text-white font-weight-bold px-4 py-2" 
                style="background-color: #0f766e; border-radius: 8px; font-size: 13.5px; border: none;"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Tab 2: Change Password View -->
    <div v-else-if="activeSubTab === 'doi-mat-khau'" class="card border-0 shadow-sm rounded-lg p-4 bg-white" style="border: 1px solid #e2e8f0 !important; max-width: 600px; margin: 0 auto;">
      <h5 class="font-weight-bold text-dark mb-4" style="font-family: 'Outfit', sans-serif; font-size: 17px;">Đổi mật khẩu tài khoản</h5>
      
      <form @submit.prevent="updatePassword">
        <div class="form-group mb-3">
          <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Mật khẩu hiện tại</label>
          <input type="password" class="form-control" placeholder="Nhập mật khẩu hiện tại..." v-model="passwordForm.currentPassword">
        </div>
        <div class="form-group mb-3">
          <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Mật khẩu mới</label>
          <input type="password" class="form-control" placeholder="Nhập mật khẩu mới..." v-model="passwordForm.newPassword">
        </div>
        <div class="form-group mb-4">
          <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Xác nhận mật khẩu mới</label>
          <input type="password" class="form-control" placeholder="Xác nhận lại mật khẩu mới..." v-model="passwordForm.confirmPassword">
        </div>

        <button type="submit" class="btn text-white font-weight-bold py-2 w-100" style="background-color: #0f766e; border-radius: 8px; font-size: 14px; border: none;">
          Cập nhật mật khẩu
        </button>
      </form>
    </div>

    <!-- Tab 3: Notifications & Security View -->
    <div v-else-if="activeSubTab === 'bao-mat'" class="card border-0 shadow-sm rounded-lg p-4 bg-white" style="border: 1px solid #e2e8f0 !important; max-width: 800px; margin: 0 auto;">
      <h5 class="font-weight-bold text-dark mb-3" style="font-family: 'Outfit', sans-serif; font-size: 17px;">Thông báo & Cài đặt bảo mật</h5>
      <p class="text-secondary mb-4" style="font-size: 13.5px;">Cấu hình cách nhận cảnh báo hệ thống và bảo vệ thông tin cá nhân của bạn.</p>

      <div class="list-group list-group-flush">
        <div class="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
          <div>
            <h6 class="font-weight-bold text-dark mb-1" style="font-size: 14px;">Xác thực 2 lớp (2FA)</h6>
            <small class="text-secondary">Yêu cầu mã xác thực OTP gửi qua điện thoại khi đăng nhập từ thiết bị lạ.</small>
          </div>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="switch2fa" checked>
            <label class="custom-control-label cursor-pointer" for="switch2fa"></label>
          </div>
        </div>

        <div class="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
          <div>
            <h6 class="font-weight-bold text-dark mb-1" style="font-size: 14px;">Nhận cảnh báo cấp cứu bằng SMS</h6>
            <small class="text-secondary">Gửi tin nhắn trực tiếp đến số điện thoại đăng ký khi có trường hợp khẩn cấp.</small>
          </div>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="switchEmergency" checked>
            <label class="custom-control-label cursor-pointer" for="switchEmergency"></label>
          </div>
        </div>

        <div class="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
          <div>
            <h6 class="font-weight-bold text-dark mb-1" style="font-size: 14px;">Báo cáo lịch hẹn hàng tuần</h6>
            <small class="text-secondary">Gửi bản tóm tắt Excel số lượng khám và doanh thu qua email vào mỗi sáng Thứ Hai.</small>
          </div>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="switchReport">
            <label class="custom-control-label cursor-pointer" for="switchReport"></label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.hover-shadow:hover {
  filter: brightness(0.95);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
</style>
