<script setup>
import { computed } from 'vue';
import StatCard from './StatCard.vue';

const props = defineProps({
  orders: { type: Array, required: true },
  today: { type: String, default: '2026-07-06' },
});

const unitPrice = (name, catalog) => {
  const found = (catalog || []).find(m => m.name === name);
  return found ? found.price : 0;
};

const orderTotal = (order, catalog) => {
  return order.items.reduce((sum, it) => sum + it.qty * unitPrice(it.name, catalog), 0);
};

defineExpose({ orderTotal });

const formatCurrency = (n) => Number(n || 0).toLocaleString('vi-VN') + ' đ';

const totalOrdersToday = computed(() => props.orders.filter(o => o.date === props.today).length);
const pendingCount = computed(() => props.orders.filter(o => o.status === 'pending').length);
const dispensingCount = computed(() => props.orders.filter(o => o.status === 'dispensing').length);
const revenueToday = computed(() =>
  props.orders
    .filter(o => o.date === props.today)
    .reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.qty * (it.price || 0), 0), 0)
);
</script>

<template>
  <div class="row mb-4">
    <StatCard
      icon="fas fa-file-prescription"
      icon-bg="#f0fdf4"
      icon-color="#16a34a"
      label="Đơn thuốc hôm nay"
      :value="totalOrdersToday"
    />
    <StatCard
      icon="fas fa-hourglass-half"
      icon-bg="#f3f4f6"
      icon-color="#4b5563"
      label="Chờ cấp phát"
      :value="pendingCount + ' Đơn'"
    />
    <StatCard
      icon="fas fa-pills"
      icon-bg="#eff6ff"
      icon-color="#2563eb"
      label="Đang cấp phát"
      :value="dispensingCount + ' Đơn'"
    />
    <StatCard
      icon="fas fa-sack-dollar"
      icon-bg="#fef2f2"
      icon-color="#dc2626"
      label="Doanh thu thuốc hôm nay"
      :value="formatCurrency(revenueToday)"
      value-size="20px"
    />
  </div>
</template>
