<script setup>
import { computed } from 'vue';
import StatCard from './StatCard.vue';

const props = defineProps({
  medicines: { type: Array, required: true },
  today: { type: String, default: '2026-07-07' },
});

const daysToExpiry = (dateStr) => {
  const today = new Date(props.today);
  const exp = new Date(dateStr);
  return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
};

const stockState = (m) => {
  if (m.stock <= 0) return 'out';
  if (m.stock < m.minStock) return 'low';
  if (daysToExpiry(m.expiry) <= 60) return 'expiring';
  return 'ok';
};

defineExpose({ daysToExpiry, stockState });

const formatCurrency = (n) => Number(n || 0).toLocaleString('vi-VN') + ' đ';

const totalItems = computed(() => props.medicines.length);
const lowStockCount = computed(() => props.medicines.filter(m => stockState(m) === 'low').length);
const outOfStockCount = computed(() => props.medicines.filter(m => stockState(m) === 'out').length);
const totalInventoryValue = computed(() =>
  props.medicines.reduce((sum, m) => sum + m.stock * m.price, 0)
);
</script>

<template>
  <div class="row mb-4">
    <StatCard
      icon="fas fa-capsules"
      icon-bg="#f0fdf4"
      icon-color="#16a34a"
      label="Tổng số mặt hàng"
      :value="totalItems"
    />
    <StatCard
      icon="fas fa-exclamation-triangle"
      icon-bg="#fffbeb"
      icon-color="#d97706"
      label="Sắp hết hàng"
      :value="lowStockCount + ' Mặt hàng'"
    />
    <StatCard
      icon="fas fa-times-circle"
      icon-bg="#fef2f2"
      icon-color="#dc2626"
      label="Hết hàng"
      :value="outOfStockCount + ' Mặt hàng'"
      value-color="#dc2626"
    />
    <StatCard
      icon="fas fa-warehouse"
      icon-bg="#eff6ff"
      icon-color="#2563eb"
      label="Giá trị tồn kho"
      :value="formatCurrency(totalInventoryValue)"
      value-size="20px"
    />
  </div>
</template>
