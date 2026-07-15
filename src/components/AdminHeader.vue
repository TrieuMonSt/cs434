<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

// Dynamic doctor profile for header based on active tab matching screenshots
const doctorProfile = computed(() => {
  switch (props.activeTab) {
    case 'lich-hen':
      return {
        name: 'BS. Chu Văn Minh',
        role: 'Bác sĩ chuyên khoa',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100'
      };
    case 'benh-nhan':
      return {
        name: 'BS. Sarah Mitchell',
        role: 'Trưởng khoa Tim mạch',
        avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=100&h=100'
      };
    case 'cai-dat':
      return {
        name: 'BS. Nguyễn Thành An',
        role: 'Quản trị viên',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100&h=100'
      };
    case 'dat-thuoc':
      return {
        name: 'DS. Phạm Thị Lan',
        role: 'Dược sĩ phụ trách',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=100&h=100'
      };
    case 'kho-thuoc':
      return {
        name: 'DS. Hoàng Văn Đức',
        role: 'Quản lý kho dược',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100&h=100'
      };
    case 'dich-vu':
      return {
        name: 'BS. Ngô Thị Hương',
        role: 'Quản lý dịch vụ y tế',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100'
      };
    case 'dashboard':
    default:
      return {
        name: 'BS. Sarah Jenkins',
        role: 'Trưởng khoa Ngoại',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100'
      };
  }
});

// Dynamic search placeholder depending on active view
const searchPlaceholder = computed(() => {
  switch (props.activeTab) {
    case 'lich-hen':
      return 'Tìm kiếm bệnh nhân, mã hồ sơ...';
    case 'benh-nhan':
      return 'Tìm kiếm bệnh nhân, tiểu sử hoặc ID...';
    case 'cai-dat':
      return 'Tìm kiếm hồ sơ...';
    case 'dat-thuoc':
      return 'Tìm kiếm đơn thuốc, bệnh nhân...';
    case 'kho-thuoc':
      return 'Tìm kiếm tên thuốc, mã, phân loại...';
    case 'dich-vu':
      return 'Tìm kiếm tên dịch vụ, khoa/phòng...';
    case 'dashboard':
    default:
      return 'Tìm kiếm bệnh nhân, hồ sơ hoặc nhân viên...';
  }
});
</script>

<template>
  <header class="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm px-4 py-2 sticky-top" style="height: 70px;">
    <!-- Left side: Adaptive Search Input Box -->
    <div class="d-flex align-items-center flex-grow-1">
      <form class="form-inline mr-auto d-none d-md-flex position-relative" style="width: 360px;" @submit.prevent>
        <i class="fas fa-search position-absolute text-muted" style="left: 15px; top: 12px;"></i>
        <input 
          class="form-control bg-light border-0 pl-5 pr-4" 
          type="search" 
          :placeholder="searchPlaceholder" 
          style="font-size: 13px; height: 38px; width: 100%; border-radius: 20px;"
        >
      </form>
    </div>

    <!-- Right side: Utility Icons & Dynamic User Doctor Profile -->
    <div class="d-flex align-items-center">
      <!-- Notification Icon -->
      <a class="text-secondary p-2 rounded-circle hover-bg-light mr-3 position-relative" href="#" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
        <i class="far fa-bell fa-lg"></i>
        <span class="position-absolute bg-danger rounded-circle" style="width: 6px; height: 6px; right: 10px; top: 10px;"></span>
      </a>

      <!-- Gear / Message Icon -->
      <a class="text-secondary p-2 rounded-circle hover-bg-light mr-4" href="#" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
        <i class="fas fa-cog fa-lg"></i>
      </a>

      <!-- User Doctor Profile info block -->
      <div class="d-flex align-items-center border-left pl-4" style="height: 40px;">
        <div class="text-right mr-3 d-none d-sm-block">
          <h6 class="font-weight-bold mb-0 text-dark" style="font-size: 13.5px; font-family: 'Outfit', sans-serif;">{{ doctorProfile.name }}</h6>
          <small class="text-secondary font-weight-bold" style="font-size: 10px;">{{ doctorProfile.role }}</small>
        </div>
        
        <div class="position-relative">
          <img 
            :src="doctorProfile.avatar" 
            alt="Doctor profile avatar" 
            class="rounded-circle border"
            style="width: 38px; height: 38px; object-fit: cover;"
          >
          <span 
            class="position-absolute rounded-circle bg-success"
            style="width: 9px; height: 9px; right: 0; bottom: 0; border: 2px solid white;"
          ></span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hover-bg-light:hover {
  background-color: #f1f5f9;
  text-decoration: none;
}
</style>
