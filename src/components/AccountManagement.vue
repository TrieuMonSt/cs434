<script setup>
import { ref } from 'vue';

// Profile info state
const profileName = ref('Quản trị Bệnh viện');
const profileEmail = ref('admin@hospital.test');
const creationTime = ref('09:16 2/7/26');
const profileId = ref('#1');

// Password fields state
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Toast notification
const toastMessage = ref('');
const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
};

const handleSaveProfile = () => {
  if (!profileName.value.trim()) {
    alert('Họ tên không được để trống.');
    return;
  }
  triggerToast('Đã lưu thông tin hồ sơ của bạn.');
};

const handleChangePassword = () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    alert('Vui lòng nhập đầy đủ mật khẩu.');
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    alert('Mật khẩu mới và Mật khẩu xác nhận không khớp.');
    return;
  }
  
  triggerToast('Đổi mật khẩu tài khoản thành công!');
  // reset
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
};
</script>

<template>
  <div class="container-fluid px-4 py-4">
    <!-- Toast Notice -->
    <div v-if="toastMessage" class="alert alert-success position-fixed shadow-lg" style="bottom: 20px; right: 20px; z-index: 1050; border-left: 5px solid #10b981; min-width: 300px; border-radius: 8px;">
      <div class="d-flex align-items-center text-left">
        <i class="fas fa-check-circle text-success mr-2.5 fa-lg"></i>
        <strong style="font-size: 13.5px; color: #1e293b;">{{ toastMessage }}</strong>
      </div>
    </div>

    <!-- Page Title Header -->
    <div class="text-left mb-4">
      <small class="text-uppercase font-weight-bold text-secondary mb-0.5 d-block" style="font-size: 10px; letter-spacing: 0.5px;">TÀI KHOẢN</small>
      <h3 class="font-weight-bold mb-1 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 26px; letter-spacing: -0.5px;">Hồ sơ cá nhân</h3>
      <p class="text-secondary mb-0" style="font-size: 13.5px;">Quản lý thông tin tài khoản và bảo mật.</p>
    </div>

    <!-- Form Cards Row -->
    <div class="row">
      <!-- Card 1: Profile Summary card -->
      <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-sm rounded-lg bg-white p-4 h-100 text-center" style="border: 1px solid #e2e8f0 !important; border-radius: 12px;">
          <!-- Avatar Icon initials -->
          <div class="position-relative d-inline-block mx-auto mb-4 mt-3">
            <div class="rounded-circle d-flex align-items-center justify-content-center text-white font-weight-bold shadow-sm" style="width: 110px; height: 110px; background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%); font-size: 32px; font-family: 'Outfit', sans-serif;">
              BV
            </div>
            <span class="position-absolute bg-success rounded-circle" style="width: 14px; height: 14px; right: 5px; bottom: 5px; border: 2.5px solid white;"></span>
          </div>

          <h5 class="font-weight-bold text-dark mb-1" style="font-family: 'Outfit', sans-serif; font-size: 19px;">{{ profileName }}</h5>
          
          <div class="d-flex justify-content-center mb-4">
            <span class="badge px-3 py-1 font-weight-bold" style="background-color: #ffedd5; color: #ea580c; border-radius: 20px; font-size: 11.5px;">Quản trị</span>
          </div>

          <!-- Profile info details list -->
          <div class="text-left border-top pt-3.5 mt-2" style="font-size: 13.5px;">
            <div class="d-flex align-items-center mb-3">
              <i class="far fa-envelope text-secondary mr-3" style="width: 16px; font-size: 14px;"></i>
              <span class="text-secondary">{{ profileEmail }}</span>
            </div>
            <div class="d-flex align-items-center mb-3">
              <i class="far fa-id-badge text-secondary mr-3" style="width: 16px; font-size: 14px;"></i>
              <span class="text-secondary">Mã tài khoản: <strong>{{ profileId }}</strong></span>
            </div>
            <div class="d-flex align-items-center">
              <i class="far fa-clock text-secondary mr-3" style="width: 16px; font-size: 14px;"></i>
              <span class="text-secondary">Tạo lúc: <strong>{{ creationTime }}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Update Profile information -->
      <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-sm rounded-lg bg-white p-4 h-100 text-left" style="border: 1px solid #e2e8f0 !important; border-radius: 12px;">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <small class="text-uppercase font-weight-bold text-secondary mb-0.5 d-block" style="font-size: 9.5px; letter-spacing: 0.5px;">THÔNG TIN</small>
              <h5 class="font-weight-bold text-dark mb-0" style="font-family: 'Outfit', sans-serif; font-size: 16.5px;">Cập nhật hồ sơ</h5>
            </div>
            <span class="text-muted"><i class="fas fa-pencil-alt" style="font-size: 13px;"></i></span>
          </div>

          <form @submit.prevent="handleSaveProfile">
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Họ tên</label>
              <input type="text" class="form-control form-input" v-model="profileName">
            </div>

            <div class="form-group mb-4">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Email (không thể đổi)</label>
              <input type="email" class="form-control form-input bg-light" v-model="profileEmail" disabled>
            </div>

            <button 
              type="submit" 
              class="btn w-100 font-weight-bold text-white py-2.5 d-flex align-items-center justify-content-center transition-all hover-shadow mt-4" 
              style="background-color: #0891b2; border: none; border-radius: 8px; font-size: 13.5px;"
            >
              <i class="far fa-save mr-2" style="font-size: 14px;"></i> Lưu hồ sơ
            </button>
          </form>
        </div>
      </div>

      <!-- Card 3: Change Password -->
      <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-sm rounded-lg bg-white p-4 h-100 text-left" style="border: 1px solid #e2e8f0 !important; border-radius: 12px;">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <small class="text-uppercase font-weight-bold text-secondary mb-0.5 d-block" style="font-size: 9.5px; letter-spacing: 0.5px;">BẢO MẬT</small>
              <h5 class="font-weight-bold text-dark mb-0" style="font-family: 'Outfit', sans-serif; font-size: 16.5px;">Đổi mật khẩu</h5>
            </div>
            <span class="text-muted"><i class="fas fa-key" style="font-size: 13px;"></i></span>
          </div>

          <form @submit.prevent="handleChangePassword">
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Mật khẩu hiện tại</label>
              <input type="password" class="form-control form-input" placeholder="Nhập mật khẩu hiện tại" v-model="currentPassword">
            </div>

            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Mật khẩu mới</label>
              <input type="password" class="form-control form-input" placeholder="Nhập mật khẩu mới" v-model="newPassword">
            </div>

            <div class="form-group mb-4">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Xác nhận mật khẩu mới</label>
              <input type="password" class="form-control form-input" placeholder="Nhập lại mật khẩu mới" v-model="confirmPassword">
            </div>

            <button 
              type="submit" 
              class="btn w-100 font-weight-bold text-white py-2.5 d-flex align-items-center justify-content-center transition-all hover-shadow" 
              style="background-color: #0891b2; border: none; border-radius: 8px; font-size: 13.5px;"
            >
              <i class="fas fa-key mr-2" style="font-size: 13px;"></i> Đổi mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-input {
  height: 40px;
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
