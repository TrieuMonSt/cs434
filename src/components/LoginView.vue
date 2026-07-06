<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = () => {
  const mailVal = email.value.trim().toLowerCase();
  const passVal = password.value.trim();

  if (!mailVal || !passVal) {
    errorMessage.value = 'Vui lòng nhập đầy đủ Email và Mật khẩu.';
    return;
  }

  // Demo accounts check
  const validAccounts = [
    'admin@hospital.test',
    'doctor@hospital.test',
    'patient@hospital.test'
  ];

  if (validAccounts.includes(mailVal) && passVal === '123456') {
    errorMessage.value = '';
    // Determine user role and name
    let role = 'Quản trị';
    let name = 'Quản trị Bệnh viện';
    
    if (mailVal.startsWith('doctor')) {
      role = 'Bác sĩ';
      name = 'BS. Nguyễn Văn An';
    } else if (mailVal.startsWith('patient')) {
      role = 'Bệnh nhân';
      name = 'Trần Gia Hân';
    }

    emit('login-success', { email: mailVal, role, name });
  } else {
    errorMessage.value = 'Email hoặc Mật khẩu không chính xác (Mật khẩu demo: 123456).';
  }
};

const autofill = (demoEmail) => {
  email.value = demoEmail;
  password.value = '123456';
  errorMessage.value = '';
};
</script>

<template>
  <div class="container-fluid p-0 d-flex flex-column flex-md-row" style="min-height: 100vh; background-color: #ffffff;">
    <!-- Left Column: Login Form -->
    <div class="col-md-5 d-flex flex-column justify-content-between p-4 p-lg-5" style="background-color: #ffffff;">
      <!-- Logo CarePlus Header -->
      <div class="d-flex align-items-center mb-5">
        <div class="rounded-lg d-flex align-items-center justify-content-center mr-3" style="width: 44px; height: 44px; background-color: #0d9488; color: white;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 24px; height: 24px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>
        <div>
          <h5 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 18px; letter-spacing: -0.5px;">CarePlus Hospital</h5>
          <small class="text-secondary font-weight-bold" style="font-size: 11px; opacity: 0.8; letter-spacing: 0.5px;">Hệ thống quản lý bệnh viện</small>
        </div>
      </div>

      <!-- Main Login Container -->
      <div class="my-auto mx-auto w-100" style="max-width: 380px;">
        <small class="text-uppercase font-weight-bold text-secondary mb-1 d-block" style="font-size: 11px; letter-spacing: 1px;">CHÀO MỪNG TRỞ LẠI</small>
        <h2 class="font-weight-bold text-dark mb-4" style="font-family: 'Outfit', sans-serif; font-size: 32px; letter-spacing: -0.5px;">Đăng nhập hệ thống</h2>

        <!-- Error Notification -->
        <div v-if="errorMessage" class="alert alert-danger py-2.5 px-3 rounded mb-3" style="font-size: 13px; border-radius: 8px;">
          <i class="fas fa-exclamation-circle mr-2"></i> {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <!-- Email Input -->
          <div class="form-group mb-3">
            <label class="font-weight-bold text-secondary mb-1.5" style="font-size: 12.5px;">Email</label>
            <div class="position-relative">
              <i class="far fa-envelope position-absolute text-muted" style="left: 14px; top: 13px; font-size: 14px;"></i>
              <input 
                type="email" 
                class="form-control pl-5" 
                placeholder="admin@hospital.test" 
                style="height: 42px; font-size: 13.5px; border-radius: 8px;"
                v-model="email"
              >
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group mb-4">
            <label class="font-weight-bold text-secondary mb-1.5" style="font-size: 12.5px;">Mật khẩu</label>
            <div class="position-relative">
              <i class="fas fa-lock position-absolute text-muted" style="left: 14px; top: 13px; font-size: 14px;"></i>
              <input 
                type="password" 
                class="form-control pl-5" 
                placeholder="Tối thiểu 6 ký tự" 
                style="height: 42px; font-size: 13.5px; border-radius: 8px;"
                v-model="password"
              >
            </div>
          </div>

          <!-- Login Button -->
          <button 
            type="submit" 
            class="btn w-100 font-weight-bold text-white py-2.5 d-flex align-items-center justify-content-center mb-3 transition-all" 
            style="background-color: #0891b2; border: none; border-radius: 8px; font-size: 14.5px;"
          >
            <i class="fas fa-lock mr-2" style="font-size: 13px;"></i> Đăng nhập
          </button>
        </form>

        <div class="text-center mb-4">
          <small class="text-secondary" style="font-size: 12.5px;">
            Chưa có tài khoản? <a href="#" class="font-weight-bold text-info text-decoration-none" style="color: #0891b2 !important;" @click.prevent="alert('Chức năng đăng ký đang được bảo trì.')">Đăng ký</a>
          </small>
        </div>

        <!-- Demo Accounts Box -->
        <div class="p-3 border rounded-lg bg-light text-left" style="border: 1px solid #e2e8f0 !important; border-radius: 10px;">
          <h6 class="font-weight-bold text-dark mb-2 d-flex align-items-center" style="font-size: 13px;">
            <i class="fas fa-info-circle text-info mr-2"></i> Tài khoản demo
          </h6>
          <div class="d-flex flex-wrap mb-2" style="gap: 5px;">
            <span class="badge cursor-pointer p-2 border bg-white rounded text-secondary" style="font-size: 11.5px; font-weight: 500;" @click="autofill('admin@hospital.test')">admin@hospital.test</span>
            <span class="badge cursor-pointer p-2 border bg-white rounded text-secondary" style="font-size: 11.5px; font-weight: 500;" @click="autofill('doctor@hospital.test')">doctor@hospital.test</span>
            <span class="badge cursor-pointer p-2 border bg-white rounded text-secondary" style="font-size: 11.5px; font-weight: 500;" @click="autofill('patient@hospital.test')">patient@hospital.test</span>
          </div>
          <small class="text-secondary d-block" style="font-size: 11.5px;">Mật khẩu: <strong>123456</strong></small>
        </div>
      </div>

      <!-- Footer Branding -->
      <div class="text-center text-muted mt-5" style="font-size: 11.5px;">
        &copy; 2026 CarePlus Hospital OS. Bảo lưu mọi quyền.
      </div>
    </div>

    <!-- Right Column: Medical Building Visual Image -->
    <div class="col-md-7 p-0 position-relative d-none d-md-flex align-items-end" style="overflow: hidden; background-color: #0f172a;">
      <!-- Hospital Building image -->
      <img 
        src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200&auto=format&fit=crop" 
        alt="CarePlus Hospital Building" 
        class="w-100 h-100 position-absolute"
        style="object-fit: cover; opacity: 0.65; left: 0; top: 0;"
      >

      <!-- Gradient Overlay -->
      <div class="position-absolute w-100 h-100" style="background: linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.85) 100%); left: 0; top: 0;"></div>

      <!-- Bottom overlay text content -->
      <div class="p-5 position-relative text-left text-white w-100" style="max-width: 600px; z-index: 10;">
        <span class="badge badge-pill px-3 py-1.5 mb-3 font-weight-bold text-white" style="background-color: rgba(255,255,255,0.15); font-size: 11px;">Quản trị vận hành</span>
        <h1 class="font-weight-bold text-white mb-2" style="font-family: 'Outfit', sans-serif; font-size: 40px; line-height: 1.2; letter-spacing: -1px;">
          Lịch khám, bác sĩ, bệnh nhân và khoa/phòng trong một nơi.
        </h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.cursor-pointer:hover {
  background-color: #f1f5f9 !important;
  color: #0891b2 !important;
}
.transition-all {
  transition: all 0.2s ease;
}
</style>
