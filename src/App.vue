<script setup>
import { ref, computed } from 'vue';
import AdminSidebar from './components/AdminSidebar.vue';
import AdminHeader from './components/AdminHeader.vue';
import AdminFooter from './components/AdminFooter.vue';
import PatientManagement from './components/PatientManagement.vue';
import AccountManagement from './components/AccountManagement.vue';

const activeTab = ref('benh-nhan'); // Default tab in image 1 is 'benh-nhan'

const headerTitle = computed(() => {
  if (activeTab.value === 'benh-nhan') {
    return 'MediFlow Bệnh nhân';
  } else if (activeTab.value === 'cai-dat') {
    return 'MediFlow Cấu hình & Phân quyền';
  } else if (activeTab.value === 'dashboard') {
    return 'MediFlow Dashboard';
  } else if (activeTab.value === 'lich-hen') {
    return 'MediFlow Lịch hẹn';
  } else if (activeTab.value === 'nhan-vien') {
    return 'MediFlow Nhân viên';
  }
  return 'MediFlow Admin';
});

const handleSelectTab = (tab) => {
  if (tab === 'logout') {
    alert('Đăng xuất hệ thống thành công!');
    return;
  }
  if (tab === 'support') {
    alert('Đang kết nối tới bộ phận hỗ trợ kỹ thuật...');
    return;
  }
  activeTab.value = tab;
};
</script>

<template>
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar Left Layout -->
    <AdminSidebar :active-tab="activeTab" @select-tab="handleSelectTab" />

    <!-- Main Right Content Layout -->
    <div class="d-flex flex-column flex-grow-1" style="min-width: 0;">
      <!-- Header Top Layout -->
      <AdminHeader :title="headerTitle" />

      <!-- Inner content area dynamically loaded -->
      <div class="flex-grow-1 bg-light" style="overflow-y: auto;">
        
        <!-- Tab 1: Patient Management -->
        <PatientManagement v-if="activeTab === 'benh-nhan'" />

        <!-- Tab 2: Account Management -->
        <AccountManagement v-else-if="activeTab === 'cai-dat'" />

        <!-- Other Tabs Placeholder -->
        <div v-else class="container-fluid px-4 py-5 text-center">
          <div class="card border-0 shadow-sm rounded-lg p-5">
            <div class="py-5">
              <i class="fas fa-tools fa-3x mb-3 text-secondary" style="opacity: 0.5;"></i>
              <h4 class="font-weight-bold text-dark mb-2">Tính năng đang được phát triển</h4>
              <p class="text-secondary">Phân hệ này đang được hoàn thiện liên kết dữ liệu.</p>
              <p class="text-secondary">Vui lòng chuyển sang tab <a href="#" class="font-weight-bold text-decoration-none" style="color: #0d9488;" @click.prevent="activeTab = 'benh-nhan'">Bệnh nhân</a> hoặc <a href="#" class="font-weight-bold text-decoration-none" style="color: #0d9488;" @click.prevent="activeTab = 'cai-dat'">Cài đặt</a> để xem hai trang chức năng chính của Admin.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Bottom Layout -->
      <AdminFooter />
    </div>
  </div>
</template>

<style>
/* Global resets, styling with Bootstrap 4 classes */
body {
  margin: 0;
  padding: 0;
  background-color: #f6f8fb;
}
.cursor-pointer {
  cursor: pointer;
}
.transition-all {
  transition: all 0.2s ease;
}
</style>
