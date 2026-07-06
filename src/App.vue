<script setup>
import { ref } from 'vue';
import LoginView from './components/LoginView.vue';
import AdminSidebar from './components/AdminSidebar.vue';
import AdminHeader from './components/AdminHeader.vue';
import PatientManagement from './components/PatientManagement.vue';
import AccountManagement from './components/AccountManagement.vue';

// Auth State (Default false to show login screen first)
const isLoggedIn = ref(false);
const currentUser = ref({
  name: 'Quản trị Bệnh viện',
  role: 'Quản trị',
  email: 'admin@hospital.test'
});

// Navigation state
const activeTab = ref('benh-nhan');

// Login handler
const handleLoginSuccess = (userData) => {
  currentUser.value = userData;
  isLoggedIn.value = true;
  activeTab.value = 'benh-nhan'; // Default active tab after login
};

// Logout handler
const handleLogout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
    isLoggedIn.value = false;
    currentUser.value = { name: '', role: '', email: '' };
  }
};

// Select sidebar tab handler
const handleSelectTab = (tab) => {
  if (tab === 'logout') {
    handleLogout();
    return;
  }
  if (tab === 'support') {
    alert('Đang kết nối tới tổng đài hỗ trợ vận hành CarePlus (Hotline: 1800-8090)...');
    return;
  }
  activeTab.value = tab;
};
</script>

<template>
  <!-- Render Login View when not authenticated -->
  <LoginView v-if="!isLoggedIn" @login-success="handleLoginSuccess" />

  <!-- Render Main Dashboard when authenticated -->
  <div v-else class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar Left Layout -->
    <AdminSidebar :active-tab="activeTab" @select-tab="handleSelectTab" />

    <!-- Main Right Content Layout -->
    <div class="d-flex flex-column flex-grow-1 bg-light" style="min-width: 0;">
      <!-- Header Top Layout -->
      <AdminHeader :user="currentUser" @logout="handleLogout" />

      <!-- Inner content area dynamically loaded -->
      <div class="flex-grow-1" style="overflow-y: auto;">
        
        <!-- Tab 3: Patient List (Màn hình 1) -->
        <PatientManagement v-if="activeTab === 'benh-nhan'" />

        <!-- Tab 7: Profile / Account Settings (Màn hình 2) -->
        <AccountManagement v-else-if="activeTab === 'ho-so'" />

        <!-- Other placeholder tabs -->
        <div v-else class="container-fluid px-4 py-5 text-center my-auto">
          <div class="card border-0 shadow-sm rounded-lg p-5 bg-white" style="border: 1px solid #e2e8f0 !important; border-radius: 12px; max-width: 700px; margin: 40px auto;">
            <div class="py-5">
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-light mx-auto mb-4" style="width: 80px; height: 80px; color: #64748b;">
                <i class="fas fa-tools fa-2x"></i>
              </div>
              <h4 class="font-weight-bold text-dark mb-2">Phân hệ đang được hoàn thiện</h4>
              <p class="text-secondary">Chức năng liên kết dữ liệu của phần này đang được đồng bộ hóa.</p>
              <p class="text-secondary mb-0">Vui lòng chuyển sang tab <a href="#" class="font-weight-bold text-decoration-none" style="color: #0891b2;" @click.prevent="activeTab = 'benh-nhan'">Bệnh nhân</a> hoặc <a href="#" class="font-weight-bold text-decoration-none" style="color: #0891b2;" @click.prevent="activeTab = 'ho-so'">Hồ sơ</a> để kiểm tra giao diện chính.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
/* Global resets, styling with Bootstrap 4 classes */
body {
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  font-family: 'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.cursor-pointer {
  cursor: pointer;
}
.transition-all {
  transition: all 0.2s ease;
}
</style>
