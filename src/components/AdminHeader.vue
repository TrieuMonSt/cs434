<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'Quản trị Bệnh viện',
      role: 'Quản trị',
      email: 'admin@hospital.test'
    })
  }
});

const emit = defineEmits(['logout']);

const roleBadgeStyle = computed(() => {
  switch (props.user.role) {
    case 'Quản trị':
      return {
        backgroundColor: '#ffedd5',
        color: '#c2410c'
      };
    case 'Bác sĩ':
      return {
        backgroundColor: '#ccfbf1',
        color: '#0f766e'
      };
    default:
      return {
        backgroundColor: '#e0f2fe',
        color: '#0369a1'
      };
  }
});

const handleLogout = () => {
  emit('logout');
};
</script>

<template>
  <header class="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm px-4 py-2 d-flex justify-content-between align-items-center" style="height: 65px; position: sticky; top: 0; z-index: 99;">
    <!-- Welcome User Left Block -->
    <div class="text-left">
      <small class="text-secondary font-weight-bold d-block" style="font-size: 10px; opacity: 0.8; letter-spacing: 0.5px; line-height: 1;">Xin chào</small>
      <h5 class="font-weight-bold text-dark mb-0 mt-0.5" style="font-family: 'Outfit', sans-serif; font-size: 17px; letter-spacing: -0.3px;">{{ user.name }}</h5>
    </div>

    <!-- Right Controls Block -->
    <div class="d-flex align-items-center">
      <!-- Role Badge -->
      <span 
        class="badge px-3 py-1.5 font-weight-bold mr-3" 
        :style="{ 
          backgroundColor: roleBadgeStyle.backgroundColor, 
          color: roleBadgeStyle.color,
          fontSize: '11px',
          borderRadius: '20px'
        }"
      >
        {{ user.role }}
      </span>

      <!-- Logout Button -->
      <button 
        @click="handleLogout" 
        class="btn btn-outline-secondary d-flex align-items-center font-weight-bold px-3 py-1.5 text-dark hover-danger border" 
        style="font-size: 12.5px; border-radius: 8px; border-color: #cbd5e1 !important; background: #fff;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 14px; height: 14px;" class="mr-1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        <span>Đăng xuất</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.hover-danger:hover {
  background-color: #fef2f2 !important;
  color: #b91c1c !important;
  border-color: #fca5a5 !important;
}
</style>
