<script setup>
import { computed } from 'vue';
import StatCard from './StatCard.vue';

const props = defineProps({
  services: { type: Array, required: true },
});

const formatCurrency = (n) => Number(n || 0).toLocaleString('vi-VN') + ' đ';

const totalServices = computed(() => props.services.length);
const activeCount = computed(() => props.services.filter(s => s.status === 'active').length);
const inactiveCount = computed(() => props.services.filter(s => s.status === 'inactive').length);
const avgPrice = computed(() => {
  if (props.services.length === 0) return 0;
  return Math.round(props.services.reduce((sum, s) => sum + s.price, 0) / props.services.length);
});
</script>

<template>
  <div class="row mb-4">
    <StatCard
      icon="fas fa-briefcase-medical"
      icon-bg="#f0fdf4"
      icon-color="#16a34a"
      label="Tổng số dịch vụ"
      :value="totalServices"
    />
    <StatCard
      icon="fas fa-toggle-on"
      icon-bg="#eff6ff"
      icon-color="#2563eb"
      label="Đang hoạt động"
      :value="activeCount + ' Dịch vụ'"
    />
    <StatCard
      icon="fas fa-toggle-off"
      icon-bg="#f3f4f6"
      icon-color="#4b5563"
      label="Tạm ngừng"
      :value="inactiveCount + ' Dịch vụ'"
    />
    <StatCard
      icon="fas fa-tag"
      icon-bg="#fef2f2"
      icon-color="#dc2626"
      label="Giá trung bình"
      :value="formatCurrency(avgPrice)"
      value-size="20px"
    />
  </div>
</template>
