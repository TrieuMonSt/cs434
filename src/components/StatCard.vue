<script setup>
defineProps({
  icon: { type: String, required: true },       // vd: 'fas fa-pills'
  iconBg: { type: String, default: '#f0fdf4' },
  iconColor: { type: String, default: '#16a34a' },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  valueColor: { type: String, default: '#1f2937' },
  valueSize: { type: String, default: '' },       // vd: '20px' cho số tiền dài
});
</script>

<template>
  <div class="col-xl-3 col-md-6 mb-4">
    <div class="card border-0 shadow-sm rounded-lg" style="height: 100%;">
      <div class="card-body p-4 d-flex flex-column justify-content-between">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div
            class="rounded d-flex align-items-center justify-content-center"
            :style="{ width: '48px', height: '48px', backgroundColor: iconBg }"
          >
            <i :class="icon + ' fa-lg'" :style="{ color: iconColor }"></i>
          </div>
          <slot name="badge"></slot>
        </div>
        <div>
          <p class="text-muted mb-1" style="font-size: 13px; font-weight: 500;">{{ label }}</p>
          <h2
            class="font-weight-bold mb-0"
            :style="{ fontFamily: 'Outfit, sans-serif', color: valueColor, fontSize: valueSize || undefined }"
          >
            {{ value }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>
