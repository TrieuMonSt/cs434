<script setup>
import { ref } from 'vue';
import api from '../utils/api';

const emit = defineEmits(['login-success']);

const isLoginMode = ref(true);
const username = ref('');
const password = ref('');
const fullName = ref('');
const specialty = ref('');
const department = ref('');

const errorMessage = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    if (isLoginMode.value) {
      // Login API call
      const response = await api.post('/auth/login', {
        username: username.value,
        password: password.value
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        emit('login-success', response.data.user);
      } else {
        errorMessage.value = response.data.message || 'Đăng nhập thất bại.';
      }
    } else {
      // Register API call
      const response = await api.post('/auth/register', {
        username: username.value,
        password: password.value,
        fullName: fullName.value,
        specialty: specialty.value || null,
        department: department.value || null
      });

      if (response.data.success) {
        alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
        isLoginMode.value = true;
        password.value = '';
      } else {
        errorMessage.value = response.data.message || 'Đăng ký thất bại.';
      }
    }
  } catch (error) {
    console.error('Auth error:', error);
    errorMessage.value = error.response?.data?.message || 'Có lỗi kết nối xảy ra. Vui lòng kiểm tra lại.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container d-flex align-items-center justify-content-center">
    <div class="login-card p-4 rounded-lg shadow-lg bg-white border text-left">
      <div class="text-center mb-4">
        <div class="logo-box mx-auto mb-3 text-white d-flex align-items-center justify-content-center">
          <i class="fas fa-hand-holding-medical"></i>
        </div>
        <h3 class="font-weight-bold text-dark mb-1" style="font-family: 'Outfit', sans-serif;">
          {{ isLoginMode ? 'Đăng Nhập Cổng Hospital' : 'Đăng Ký Tài Khoản' }}
        </h3>
        <p class="text-secondary mb-0" style="font-size: 13.5px;">
          {{ isLoginMode ? 'Hệ thống Quản lý và Điều hành Bệnh viện CarePlus' : 'Tạo tài khoản bác sĩ / nhân viên y tế' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group mb-3">
          <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Tài khoản đăng nhập *</label>
          <div class="position-relative">
            <i class="fas fa-user position-absolute text-muted" style="left: 12px; top: 12px;"></i>
            <input 
              type="text" 
              class="form-control pl-45 border rounded form-input" 
              placeholder="Nhập tên đăng nhập..." 
              v-model="username" 
              required
            >
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Mật khẩu *</label>
          <div class="position-relative">
            <i class="fas fa-lock position-absolute text-muted" style="left: 12px; top: 12px;"></i>
            <input 
              type="password" 
              class="form-control pl-45 border rounded form-input" 
              placeholder="Nhập mật khẩu..." 
              v-model="password" 
              required
            >
          </div>
        </div>

        <!-- Register extra fields -->
        <div v-if="!isLoginMode">
          <div class="form-group mb-3">
            <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Họ và Tên *</label>
            <div class="position-relative">
              <i class="fas fa-signature position-absolute text-muted" style="left: 12px; top: 12px;"></i>
              <input 
                type="text" 
                class="form-control pl-45 border rounded form-input" 
                placeholder="Ví dụ: BS. Nguyễn Văn A..." 
                v-model="fullName" 
                required
              >
            </div>
          </div>

          <div class="row">
            <div class="col-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Chuyên khoa</label>
              <input 
                type="text" 
                class="form-control border rounded form-input" 
                placeholder="Ví dụ: Tim mạch..." 
                v-model="specialty"
              >
            </div>
            <div class="col-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Khoa phụ trách</label>
              <input 
                type="text" 
                class="form-control border rounded form-input" 
                placeholder="Ví dụ: Khoa Nội 1..." 
                v-model="department"
              >
            </div>
          </div>
        </div>

        <!-- Error box -->
        <div v-if="errorMessage" class="alert alert-danger py-2 px-3 mb-3 text-center" style="font-size: 13px; border-radius: 6px;">
          <i class="fas fa-exclamation-circle mr-1"></i> {{ errorMessage }}
        </div>

        <button 
          type="submit" 
          class="btn btn-dark w-100 font-weight-bold py-2.5 transition-all text-white border-0 shadow-sm"
          style="background-color: #0f766e; border-radius: 8px; font-size: 14px;"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
          <span>{{ isLoginMode ? 'Đăng nhập hệ thống' : 'Hoàn tất đăng ký' }}</span>
        </button>
      </form>

      <div class="text-center mt-4">
        <a 
          href="#" 
          class="text-teal-custom font-weight-bold text-decoration-none" 
          style="font-size: 13px; color: #0f766e;"
          @click.prevent="isLoginMode = !isLoginMode; errorMessage = '';"
        >
          {{ isLoginMode ? 'Bạn chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập' }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  width: 100%;
}
.login-card {
  width: 420px;
  max-width: 90%;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(15, 118, 110, 0.1);
  padding: 30px;
}
.logo-box {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background-color: #0f766e;
  font-size: 24px;
}
.pl-45 {
  padding-left: 38px;
}
.form-input {
  height: 42px;
  font-size: 13.5px;
  border-color: #e2e8f0;
}
.form-input:focus {
  border-color: #0f766e;
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.1);
}
</style>
