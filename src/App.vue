<script setup>
import { ref, onMounted } from 'vue';
import AdminSidebar from './components/AdminSidebar.vue';
import AdminHeader from './components/AdminHeader.vue';
import AdminFooter from './components/AdminFooter.vue';
import DashboardManagement from './components/DashboardManagement.vue';
import AppointmentManagement from './components/AppointmentManagement.vue';
import PatientManagement from './components/PatientManagement.vue';
import AccountManagement from './components/AccountManagement.vue';
import MedicineOrderPage from './components/MedicineOrderPage.vue';
import MedicineInventoryPage from './components/MedicineInventoryPage.vue';
import ServicePage from './components/ServicePage.vue';

import DoctorManagement from './components/DoctorManagement.vue';
import RoomManagement from './components/RoomManagement.vue';
import InpatientManagement from './components/InpatientManagement.vue';
import PermissionManagement from './components/PermissionManagement.vue';
import LoginView from './components/LoginView.vue';
import ChatBot from './components/ChatBot.vue';

const isLoggedIn = ref(false);
const currentUser = ref(null);

// Default active tab to 'dashboard'
const activeTab = ref('dashboard');

const checkAuth = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (token && user) {
    isLoggedIn.value = true;
    currentUser.value = JSON.parse(user);
  } else {
    isLoggedIn.value = false;
    currentUser.value = null;
  }
};

const handleLoginSuccess = (user) => {
  isLoggedIn.value = true;
  currentUser.value = user;
  activeTab.value = 'dashboard';
};

const handleSelectTab = (tab) => {
  if (tab === 'logout') {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      isLoggedIn.value = false;
      currentUser.value = null;
      alert('Đăng xuất hệ thống thành công!');
    }
    return;
  }
  if (tab === 'support') {
    alert('Đang kết nối tới bộ phận hỗ trợ kỹ thuật MediCare / MediFlow (Hotline: 1900-6080)...');
    return;
  }
  activeTab.value = tab;
};

onMounted(() => {
  checkAuth();
});
</script>

<template>
  <!-- Login flow if not authenticated -->
  <LoginView v-if="!isLoggedIn" @login-success="handleLoginSuccess" />

  <!-- Main System Layout if authenticated -->
  <div v-else class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar Left Layout -->
    <AdminSidebar :active-tab="activeTab" @select-tab="handleSelectTab" />

    <!-- Main Right Content Layout -->
    <div class="d-flex flex-column flex-grow-1 bg-light" style="min-width: 0;">
      <!-- Header Top Layout -->
      <AdminHeader :active-tab="activeTab" />

      <!-- Inner content area dynamically loaded -->
      <div class="flex-grow-1" style="overflow-y: auto;">
        
        <!-- Tab 1: Dashboard / Doctor Stats (Màn hình 4) -->
        <DashboardManagement v-if="activeTab === 'dashboard'" />

        <!-- Tab 2: Appointment Management (Màn hình 1) -->
        <AppointmentManagement v-else-if="activeTab === 'lich-hen'" />

        <!-- Tab 3: Patient Management (Màn hình 2) -->
        <PatientManagement v-else-if="activeTab === 'benh-nhan'" />

        <!-- Tab 4: Account Management (Màn hình 3) -->
        <AccountManagement v-else-if="activeTab === 'cai-dat'" />

        <!-- Tab 5: Medicine Order Management (Đặt thuốc) -->
        <MedicineOrderPage v-else-if="activeTab === 'dat-thuoc'" />

        <!-- Tab 6: Medicine Inventory Management (Kho thuốc) -->
        <MedicineInventoryPage v-else-if="activeTab === 'kho-thuoc'" />

        <!-- Tab 7: Service Management (Dịch vụ) -->
        <ServicePage v-else-if="activeTab === 'dich-vu'" />

        <!-- Tab 8: Doctor Management (Bác sĩ) -->
        <DoctorManagement v-else-if="activeTab === 'bac-si'" />

        <!-- Tab 9: Room/Sickroom Management (Phòng bệnh) -->
        <RoomManagement v-else-if="activeTab === 'phong-benh'" />

        <!-- Tab 10: Inpatient Management (Nội trú) -->
        <InpatientManagement v-else-if="activeTab === 'noi-tru'" />

        <!-- Tab 11: Permission Management (Phân quyền) -->
        <PermissionManagement v-else-if="activeTab === 'phan-quyen'" />

      </div>

      <!-- Footer Bottom Layout -->
      <AdminFooter />
    </div>

    <!-- Floating Chatbot Assistant Widget -->
    <ChatBot />
  </div>
</template>

<style>
/* Global resets, styling with Bootstrap 4 classes */
body {
  margin: 0;
  padding: 0;
  background-color: #f6f8fb;
  font-family: 'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
.cursor-pointer {
  cursor: pointer;
}
.transition-all {
  transition: all 0.2s ease;
}
</style>
