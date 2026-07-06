<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['select-tab']);

const selectTab = (tab) => {
  emit('select-tab', tab);
};
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100 bg-white border-right shadow-sm" style="width: 250px; min-height: 100vh; position: sticky; top: 0; z-index: 100;">
    <div>
      <!-- Brand Logo Header Section -->
      <div class="p-4 border-bottom-0">
        <div class="d-flex align-items-center">
          <div class="rounded-lg d-flex align-items-center justify-content-center mr-3 text-white font-weight-bold" style="width: 40px; height: 40px; background-color: #0d9488; font-size: 18px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 22px; height: 22px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <div>
            <h6 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif; font-size: 15.5px; letter-spacing: -0.3px;">CarePlus</h6>
            <small class="text-secondary font-weight-bold" style="font-size: 10px; opacity: 0.7; letter-spacing: 0.5px;">Hospital OS</small>
          </div>
        </div>
      </div>

      <!-- Menu Navigation Links -->
      <div class="px-2 py-2">
        <nav class="nav flex-column">
          <!-- Tổng quan -->
          <a 
            class="nav-link py-2.5 px-3 mb-1 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'tong-quan' ? '#e0f2fe' : 'transparent',
              color: activeTab === 'tong-quan' ? '#0d9488' : '#4b5563',
              fontWeight: activeTab === 'tong-quan' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '13.5px'
            }"
            @click.prevent="selectTab('tong-quan')"
            href="#"
          >
            <i class="fas fa-th-large mr-3 text-center" style="width: 18px; font-size: 14px;"></i>
            <span>Tổng quan</span>
          </a>

          <!-- Báo cáo -->
          <a 
            class="nav-link py-2.5 px-3 mb-1 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'bao-cao' ? '#e0f2fe' : 'transparent',
              color: activeTab === 'bao-cao' ? '#0d9488' : '#4b5563',
              fontWeight: activeTab === 'bao-cao' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '13.5px'
            }"
            @click.prevent="selectTab('bao-cao')"
            href="#"
          >
            <i class="fas fa-chart-line mr-3 text-center" style="width: 18px; font-size: 14px;"></i>
            <span>Báo cáo</span>
          </a>

          <!-- Bệnh nhân -->
          <a 
            class="nav-link py-2.5 px-3 mb-1 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'benh-nhan' ? '#e0f2fe' : 'transparent',
              color: activeTab === 'benh-nhan' ? '#0d9488' : '#4b5563',
              fontWeight: activeTab === 'benh-nhan' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '13.5px'
            }"
            @click.prevent="selectTab('benh-nhan')"
            href="#"
          >
            <i class="far fa-user mr-3 text-center" style="width: 18px; font-size: 14px;"></i>
            <span>Bệnh nhân</span>
          </a>

          <!-- Bác sĩ -->
          <a 
            class="nav-link py-2.5 px-3 mb-1 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'bac-si' ? '#e0f2fe' : 'transparent',
              color: activeTab === 'bac-si' ? '#0d9488' : '#4b5563',
              fontWeight: activeTab === 'bac-si' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '13.5px'
            }"
            @click.prevent="selectTab('bac-si')"
            href="#"
          >
            <i class="fas fa-user-md mr-3 text-center" style="width: 18px; font-size: 14px;"></i>
            <span>Bác sĩ</span>
          </a>

          <!-- Khoa/phòng -->
          <a 
            class="nav-link py-2.5 px-3 mb-1 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'khoa-phong' ? '#e0f2fe' : 'transparent',
              color: activeTab === 'khoa-phong' ? '#0d9488' : '#4b5563',
              fontWeight: activeTab === 'khoa-phong' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '13.5px'
            }"
            @click.prevent="selectTab('khoa-phong')"
            href="#"
          >
            <i class="fas fa-hospital mr-3 text-center" style="width: 18px; font-size: 14px;"></i>
            <span>Khoa/phòng</span>
          </a>

          <!-- Lịch khám -->
          <a 
            class="nav-link py-2.5 px-3 mb-1 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'lich-kham' ? '#e0f2fe' : 'transparent',
              color: activeTab === 'lich-kham' ? '#0d9488' : '#4b5563',
              fontWeight: activeTab === 'lich-kham' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '13.5px'
            }"
            @click.prevent="selectTab('lich-kham')"
            href="#"
          >
            <i class="far fa-calendar-alt mr-3 text-center" style="width: 18px; font-size: 14px;"></i>
            <span>Lịch khám</span>
          </a>

          <!-- Hồ sơ -->
          <a 
            class="nav-link py-2.5 px-3 mb-1 rounded d-flex align-items-center text-decoration-none transition-all"
            :style="{ 
              backgroundColor: activeTab === 'ho-so' ? '#e0f2fe' : 'transparent',
              color: activeTab === 'ho-so' ? '#0d9488' : '#4b5563',
              fontWeight: activeTab === 'ho-so' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '13.5px'
            }"
            @click.prevent="selectTab('ho-so')"
            href="#"
          >
            <i class="far fa-id-card mr-3 text-center" style="width: 18px; font-size: 14px;"></i>
            <span>Hồ sơ</span>
          </a>
        </nav>
      </div>
    </div>

    <!-- Security Badge Panel at the bottom -->
    <div class="p-3">
      <div class="p-2.5 rounded d-flex align-items-start bg-light border text-left" style="border-radius: 8px; border: 1px solid #f1f5f9 !important;">
        <span class="text-secondary mr-2.5 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 14px; height: 14px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </span>
        <div style="line-height: 1.2;">
          <p class="mb-0 text-dark font-weight-bold" style="font-size: 10px;">Bảo mật JWT</p>
          <small class="text-secondary font-weight-bold" style="font-size: 9px; opacity: 0.8;">Phân quyền theo vai trò</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-all {
  transition: all 0.2s ease;
}
.nav-link:hover {
  background-color: #f8fafc !important;
  color: #0d9488 !important;
}
</style>
