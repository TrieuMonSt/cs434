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
  <div class="d-flex flex-column justify-content-between h-100 bg-white border-right shadow-sm" style="width: 260px; min-height: 100vh;">
    <div>
      <!-- Logo Brand Box -->
      <div class="p-4 border-bottom">
        <div class="p-3 rounded d-flex align-items-center" style="background-color: #f0fdfa;">
          <div class="rounded-circle d-flex align-items-center justify-content-center mr-3" style="width: 42px; height: 42px; background-color: #0d9488; color: white;">
            <i class="fas fa-plus-square fa-lg"></i>
          </div>
          <div>
            <h6 class="font-weight-bold mb-0 text-dark" style="font-size: 15px;">MediFlow Admin</h6>
            <small class="text-uppercase font-weight-bold text-muted" style="font-size: 9px; letter-spacing: 0.5px;">Hospital Management</small>
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="px-2 py-4">
        <nav class="nav flex-column">
          <a 
            class="nav-link py-3 px-4 mb-2 rounded d-flex align-items-center text-decoration-none"
            :style="{ 
              backgroundColor: activeTab === 'dashboard' ? '#f0fdfa' : 'transparent',
              color: activeTab === 'dashboard' ? '#0d9488' : '#6b7280',
              fontWeight: activeTab === 'dashboard' ? '600' : '500',
              borderLeft: activeTab === 'dashboard' ? '4px solid #0d9488' : 'none',
              cursor: 'pointer'
            }"
            @click.prevent="selectTab('dashboard')"
            href="#"
          >
            <i class="fas fa-th-large mr-3" style="width: 20px;"></i>
            <span>Bảng điều khiển</span>
          </a>

          <a 
            class="nav-link py-3 px-4 mb-2 rounded d-flex align-items-center text-decoration-none"
            :style="{ 
              backgroundColor: activeTab === 'benh-nhan' ? '#f0fdfa' : 'transparent',
              color: activeTab === 'benh-nhan' ? '#0d9488' : '#6b7280',
              fontWeight: activeTab === 'benh-nhan' ? '600' : '500',
              borderLeft: activeTab === 'benh-nhan' ? '4px solid #0d9488' : 'none',
              cursor: 'pointer'
            }"
            @click.prevent="selectTab('benh-nhan')"
            href="#"
          >
            <i class="fas fa-user-injured mr-3" style="width: 20px;"></i>
            <span>Bệnh nhân</span>
          </a>

          <a 
            class="nav-link py-3 px-4 mb-2 rounded d-flex align-items-center text-decoration-none"
            :style="{ 
              backgroundColor: activeTab === 'lich-hen' ? '#f0fdfa' : 'transparent',
              color: activeTab === 'lich-hen' ? '#0d9488' : '#6b7280',
              fontWeight: activeTab === 'lich-hen' ? '600' : '500',
              borderLeft: activeTab === 'lich-hen' ? '4px solid #0d9488' : 'none',
              cursor: 'pointer'
            }"
            @click.prevent="selectTab('lich-hen')"
            href="#"
          >
            <i class="fas fa-calendar-alt mr-3" style="width: 20px;"></i>
            <span>Lịch hẹn</span>
          </a>

          <a 
            class="nav-link py-3 px-4 mb-2 rounded d-flex align-items-center text-decoration-none"
            :style="{ 
              backgroundColor: activeTab === 'nhan-vien' ? '#f0fdfa' : 'transparent',
              color: activeTab === 'nhan-vien' ? '#0d9488' : '#6b7280',
              fontWeight: activeTab === 'nhan-vien' ? '600' : '500',
              borderLeft: activeTab === 'nhan-vien' ? '4px solid #0d9488' : 'none',
              cursor: 'pointer'
            }"
            @click.prevent="selectTab('nhan-vien')"
            href="#"
          >
            <i class="fas fa-user-md mr-3" style="width: 20px;"></i>
            <span>Nhân viên</span>
          </a>

          <a 
            class="nav-link py-3 px-4 mb-2 rounded d-flex align-items-center text-decoration-none"
            :style="{ 
              backgroundColor: activeTab === 'cai-dat' ? '#f0fdfa' : 'transparent',
              color: activeTab === 'cai-dat' ? '#0d9488' : '#6b7280',
              fontWeight: activeTab === 'cai-dat' ? '600' : '500',
              borderLeft: activeTab === 'cai-dat' ? '4px solid #0d9488' : 'none',
              cursor: 'pointer'
            }"
            @click.prevent="selectTab('cai-dat')"
            href="#"
          >
            <i class="fas fa-cog mr-3" style="width: 20px;"></i>
            <span>Cài đặt</span>
          </a>
        </nav>
      </div>
    </div>

    <!-- Sidebar Footer section -->
    <div class="p-3 border-top bg-light">
      <nav class="nav flex-column">
        <a class="nav-link py-2 px-4 text-secondary d-flex align-items-center text-decoration-none" style="cursor: pointer;" href="#" @click.prevent="selectTab('support')">
          <i class="far fa-question-circle mr-3" style="width: 20px;"></i>
          <span style="font-size: 14px;">Hỗ trợ</span>
        </a>
        <a class="nav-link py-2 px-4 text-danger d-flex align-items-center font-weight-bold text-decoration-none" style="cursor: pointer;" href="#" @click.prevent="selectTab('logout')">
          <i class="fas fa-sign-out-alt mr-3" style="width: 20px;"></i>
          <span style="font-size: 14px;">Đăng xuất</span>
        </a>
      </nav>
    </div>
  </div>
</template>
