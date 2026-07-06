<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['select-tab']);

const selectTab = (tab) => {
  emit('select-tab', tab);
};

// Dynamic Brand Info to match the screenshot logos exactly
const brandInfo = computed(() => {
  if (props.activeTab === 'dashboard' || props.activeTab === 'cai-dat') {
    return {
      title: 'MediFlow Admin',
      subtitle: 'Bệnh viện Đa khoa v2.1',
      logoBg: '#115e59', // dark teal
      logoColor: '#ffffff'
    };
  } else {
    return {
      title: 'MediCare Admin',
      subtitle: 'CỔNG QUẢN TRỊ',
      logoBg: '#0f766e', // teal
      logoColor: '#ffffff'
    };
  }
});

// Trigger Emergency alarm
const triggerEmergency = () => {
  alert('🚨 [CẢNH BÁO BÁO ĐỘNG ĐỎ] Kích hoạt thông báo khẩn cấp toàn hệ thống! Đội ngũ cấp cứu đang được điều động.');
};
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100 bg-white border-right shadow-sm" style="width: 260px; min-height: 100vh; position: sticky; top: 0; z-index: 100;">
    <div>
      <!-- Dynamic Logo Brand Box -->
      <div class="p-3 border-bottom">
        <div class="p-2.5 rounded d-flex align-items-center" style="background-color: #f0fdfa;">
          <div 
            class="rounded d-flex align-items-center justify-content-center mr-3 text-white font-weight-bold" 
            :style="{ 
              width: '42px', 
              height: '42px', 
              backgroundColor: brandInfo.logoBg,
              fontSize: '20px'
            }"
          >
            <i class="fas fa-hand-holding-medical"></i>
          </div>
          <div>
            <h6 class="font-weight-bold mb-0 text-dark" style="font-size: 15px; font-family: 'Outfit', sans-serif;">
              {{ brandInfo.title }}
            </h6>
            <small class="text-uppercase font-weight-bold text-muted" style="font-size: 9px; letter-spacing: 0.5px;">
              {{ brandInfo.subtitle }}
            </small>
          </div>
        </div>
      </div>

      <!-- Menu Navigation Items -->
      <div class="px-2 py-3">
        <nav class="nav flex-column">
          <!-- Dashboard (Màn hình 4) -->
          <a 
            class="nav-link py-2.5 px-3 mb-1.5 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'dashboard' ? '#22d3ee20' : 'transparent',
              color: activeTab === 'dashboard' ? '#0f766e' : '#6b7280',
              fontWeight: activeTab === 'dashboard' ? '700' : '500',
              borderLeft: activeTab === 'dashboard' ? '4px solid #0f766e' : 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }"
            @click.prevent="selectTab('dashboard')"
            href="#"
          >
            <i class="fas fa-th-large mr-3 text-center" style="width: 20px; font-size: 16px;"></i>
            <span>Bảng điều khiển</span>
          </a>

          <!-- Lịch hẹn (Màn hình 1) -->
          <a 
            class="nav-link py-2.5 px-3 mb-1.5 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'lich-hen' ? '#22d3ee20' : 'transparent',
              color: activeTab === 'lich-hen' ? '#0f766e' : '#6b7280',
              fontWeight: activeTab === 'lich-hen' ? '700' : '500',
              borderLeft: activeTab === 'lich-hen' ? '4px solid #0f766e' : 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }"
            @click.prevent="selectTab('lich-hen')"
            href="#"
          >
            <i class="far fa-calendar-alt mr-3 text-center" style="width: 20px; font-size: 16px;"></i>
            <span>Lịch hẹn</span>
          </a>

          <!-- Bệnh nhân (Màn hình 2) -->
          <a 
            class="nav-link py-2.5 px-3 mb-1.5 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'benh-nhan' ? '#22d3ee20' : 'transparent',
              color: activeTab === 'benh-nhan' ? '#0f766e' : '#6b7280',
              fontWeight: activeTab === 'benh-nhan' ? '700' : '500',
              borderLeft: activeTab === 'benh-nhan' ? '4px solid #0f766e' : 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }"
            @click.prevent="selectTab('benh-nhan')"
            href="#"
          >
            <i class="fas fa-user-injured mr-3 text-center" style="width: 20px; font-size: 16px;"></i>
            <span>Bệnh nhân</span>
          </a>

          <!-- Cài đặt tài khoản (Màn hình 3) -->
          <a 
            class="nav-link py-2.5 px-3 mb-1.5 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'cai-dat' ? '#22d3ee20' : 'transparent',
              color: activeTab === 'cai-dat' ? '#0f766e' : '#6b7280',
              fontWeight: activeTab === 'cai-dat' ? '700' : '500',
              borderLeft: activeTab === 'cai-dat' ? '4px solid #0f766e' : 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }"
            @click.prevent="selectTab('cai-dat')"
            href="#"
          >
            <i class="fas fa-user-circle mr-3 text-center" style="width: 20px; font-size: 16px;"></i>
            <span>Tài khoản</span>
          </a>
        </nav>
      </div>
    </div>

    <!-- Bottom emergency red panel & utility links -->
    <div class="p-3 border-top bg-light">
      <!-- Alarm button -->
      <button 
        @click="triggerEmergency"
        class="btn btn-danger w-100 font-weight-bold py-2 mb-3 d-flex align-items-center justify-content-center transition-all"
        style="background-color: #b91c1c; border: none; border-radius: 8px; font-size: 12.5px; box-shadow: 0 2px 4px rgba(185, 28, 28, 0.2);"
      >
        <i class="fas fa-broadcast-tower mr-2 animate-pulse"></i>
        <span>Báo động khẩn cấp</span>
      </button>

      <nav class="nav flex-column" style="font-size: 13.5px;">
        <a class="nav-link py-2 px-2 text-secondary d-flex align-items-center text-decoration-none transition-all hover-bg-light" style="cursor: pointer; border-radius: 6px;" href="#" @click.prevent="selectTab('support')">
          <i class="far fa-question-circle mr-2.5 text-center" style="width: 18px;"></i>
          <span>Hỗ trợ</span>
        </a>
        <a class="nav-link py-2 px-2 text-danger d-flex align-items-center font-weight-bold text-decoration-none transition-all hover-bg-light" style="cursor: pointer; border-radius: 6px;" href="#" @click.prevent="selectTab('logout')">
          <i class="fas fa-sign-out-alt mr-2.5 text-center" style="width: 18px;"></i>
          <span>Đăng xuất</span>
        </a>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
.hover-bg-light:hover {
  background-color: #e2e8f0;
}
</style>
