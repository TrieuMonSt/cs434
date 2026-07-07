<script setup>
import { ref, computed } from 'vue';
import MedicineOrderStats from './MedicineOrderStats.vue';
import MedicineOrderFormModal from './MedicineOrderFormModal.vue';

// Danh mục thuốc có sẵn trong kho (để chọn khi kê đơn)
const medicineCatalog = ref([
  { id: 'MED-001', name: 'Paracetamol 500mg', unit: 'Viên', price: 1000 },
  { id: 'MED-002', name: 'Amoxicillin 500mg', unit: 'Viên', price: 2500 },
  { id: 'MED-003', name: 'Vitamin C 500mg', unit: 'Viên', price: 800 },
  { id: 'MED-004', name: 'Oresol', unit: 'Gói', price: 3000 },
  { id: 'MED-005', name: 'Siro ho Prospan', unit: 'Chai', price: 45000 },
  { id: 'MED-006', name: 'Betadine sát khuẩn', unit: 'Chai', price: 32000 },
]);

const orders = ref([
  {
    id: 'DT-90231', patientName: 'Eleanor Shellstrop', patientId: 'PT-29402',
    doctor: 'BS. Trần Văn Khoa', date: '2026-07-06',
    items: [
      { name: 'Paracetamol 500mg', qty: 20, unit: 'Viên', dosage: 'Ngày 2 lần, sau ăn', price: 1000 },
      { name: 'Vitamin C 500mg', qty: 10, unit: 'Viên', dosage: 'Ngày 1 lần', price: 800 },
    ],
    status: 'pending', statusText: 'Chờ cấp phát',
  },
  {
    id: 'DT-90232', patientName: 'Arthur Morgan', patientId: 'PT-18394',
    doctor: 'BS. Lê Thị Hạnh', date: '2026-07-06',
    items: [
      { name: 'Amoxicillin 500mg', qty: 14, unit: 'Viên', dosage: 'Ngày 2 lần, cách 12h', price: 2500 },
      { name: 'Betadine sát khuẩn', qty: 1, unit: 'Chai', dosage: 'Sát khuẩn vết thương ngày 2 lần', price: 32000 },
    ],
    status: 'dispensing', statusText: 'Đang cấp phát',
  },
  {
    id: 'DT-90233', patientName: 'Jason Mendoza', patientId: 'PT-48201',
    doctor: 'BS. Trần Văn Khoa', date: '2026-07-05',
    items: [{ name: 'Siro ho Prospan', qty: 1, unit: 'Chai', dosage: 'Ngày 3 lần, mỗi lần 10ml', price: 45000 }],
    status: 'completed', statusText: 'Đã cấp phát',
  },
  {
    id: 'DT-90234', patientName: 'Tahani Al-Jamil', patientId: 'PT-55120',
    doctor: 'BS. Lê Thị Hạnh', date: '2026-07-04',
    items: [{ name: 'Oresol', qty: 5, unit: 'Gói', dosage: 'Pha 1 gói/1 lít nước, uống trong ngày', price: 3000 }],
    status: 'cancelled', statusText: 'Đã hủy',
  },
]);

const activeFilter = ref('all');
const searchQuery = ref('');
const showModal = ref(false);

const toastMessage = ref('');
const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => { toastMessage.value = ''; }, 3000);
};

const orderTotal = (order) => order.items.reduce((sum, it) => sum + it.qty * (it.price || 0), 0);
const formatCurrency = (n) => Number(n || 0).toLocaleString('vi-VN') + ' đ';
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
};

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      o.patientName.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.patientId.toLowerCase().includes(q);
    const matchesFilter = activeFilter.value === 'all' || o.status === activeFilter.value;
    return matchesSearch && matchesFilter;
  });
});

const statusStyle = (status) => {
  const map = {
    pending: { bg: '#f3f4f6', color: '#4b5563' },
    dispensing: { bg: '#eff6ff', color: '#2563eb' },
    completed: { bg: '#f0fdf4', color: '#16a34a' },
    cancelled: { bg: '#fef2f2', color: '#dc2626' },
  };
  return map[status] || map.pending;
};

const advanceStatus = (order) => {
  const flow = { pending: 'dispensing', dispensing: 'completed' };
  const textMap = { dispensing: 'Đang cấp phát', completed: 'Đã cấp phát' };
  if (flow[order.status]) {
    order.status = flow[order.status];
    order.statusText = textMap[order.status];
    triggerToast(`Cập nhật đơn ${order.id}: ${order.statusText}`);
  }
};

const cancelOrder = (order) => {
  if (order.status === 'completed') return;
  order.status = 'cancelled';
  order.statusText = 'Đã hủy';
  triggerToast(`Đã hủy đơn thuốc ${order.id}.`);
};

const deleteOrder = (id) => {
  if (confirm('Bạn có chắc muốn xóa đơn thuốc này?')) {
    orders.value = orders.value.filter(o => o.id !== id);
    triggerToast('Đã xóa đơn thuốc.');
  }
};

const handleSubmitOrder = (data) => {
  const newId = `DT-${Math.floor(90000 + Math.random() * 9000)}`;
  orders.value.unshift({
    id: newId,
    ...data,
    status: 'pending',
    statusText: 'Chờ cấp phát',
  });
  triggerToast('Tạo đơn thuốc mới thành công!');
};
</script>

<template>
  <div class="container-fluid px-4 py-4">
    <!-- Breadcrumb & Top Actions -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-transparent p-0 mb-1" style="font-size: 13px;">
            <li class="breadcrumb-item"><a href="#" class="text-secondary text-decoration-none">Tổng quan</a></li>
            <li class="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Đặt thuốc</li>
          </ol>
        </nav>
        <h3 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif;">Quản lý Đặt thuốc</h3>
      </div>

      <div class="d-flex align-items-center mt-3 mt-md-0">
        <button class="btn btn-light border mr-2 font-weight-bold text-dark px-3 py-2" style="font-size: 13.5px; background: white;">
          <i class="fas fa-download mr-2"></i> Xuất danh sách
        </button>
        <button class="btn btn-dark font-weight-bold px-3 py-2" style="font-size: 13.5px; background-color: #0d9488; border-color: #0d9488;" @click="showModal = true">
          <i class="fas fa-prescription-bottle-medical mr-2"></i> Kê đơn mới
        </button>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastMessage" class="alert alert-success position-fixed shadow" style="bottom: 20px; right: 20px; z-index: 1050; border-left: 5px solid #10b981; min-width: 280px;">
      <div class="d-flex align-items-center">
        <i class="fas fa-check-circle text-success mr-2 fa-lg"></i>
        <strong>{{ toastMessage }}</strong>
      </div>
    </div>

    <!-- Stats -->
    <MedicineOrderStats :orders="orders" />

    <!-- Main Table Section -->
    <div class="card border-0 shadow-sm rounded-lg mb-4">
      <div class="card-body p-4">
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4">
          <div class="btn-group mb-3 mb-lg-0" role="group">
            <button v-for="tab in [
                { key: 'all', label: 'Tất cả' },
                { key: 'pending', label: 'Chờ cấp phát' },
                { key: 'dispensing', label: 'Đang cấp phát' },
                { key: 'completed', label: 'Đã cấp phát' },
                { key: 'cancelled', label: 'Đã hủy' },
              ]"
              :key="tab.key"
              type="button"
              class="btn py-2 px-3 font-weight-bold"
              :style="{
                backgroundColor: activeFilter === tab.key ? '#0d9488' : '#f3f4f6',
                color: activeFilter === tab.key ? 'white' : '#4b5563',
                fontSize: '13.5px'
              }"
              @click="activeFilter = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="position-relative" style="width: 250px;">
            <i class="fas fa-search position-absolute text-muted" style="left: 12px; top: 12px;"></i>
            <input
              type="text"
              class="form-control pl-4 border-0 bg-light rounded"
              placeholder="Tìm bệnh nhân, mã đơn..."
              style="height: 38px; font-size: 13px;"
              v-model="searchQuery"
            >
          </div>
        </div>

        <div class="table-responsive rounded border">
          <table class="table table-hover mb-0 text-left" style="font-size: 13.5px; vertical-align: middle;">
            <thead class="thead-light">
              <tr class="text-uppercase" style="font-family: 'Outfit', sans-serif; font-size: 12px; letter-spacing: 0.5px;">
                <th class="py-3 px-4">Mã đơn / Bệnh nhân</th>
                <th class="py-3">Bác sĩ kê đơn</th>
                <th class="py-3">Ngày kê</th>
                <th class="py-3">Danh sách thuốc</th>
                <th class="py-3 text-right">Thành tiền</th>
                <th class="py-3">Trạng thái</th>
                <th class="py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id" class="align-middle">
                <td class="py-3 px-4">
                  <h6 class="font-weight-bold mb-0 text-dark">{{ order.patientName }}</h6>
                  <small class="text-muted">#{{ order.id }} &bull; {{ order.patientId }}</small>
                </td>
                <td class="py-3 align-middle text-secondary">{{ order.doctor }}</td>
                <td class="py-3 align-middle text-secondary">{{ formatDate(order.date) }}</td>
                <td class="py-3 align-middle">
                  <div class="d-flex flex-wrap" style="max-width: 260px;">
                    <span
                      v-for="(it, idx) in order.items"
                      :key="idx"
                      class="badge mr-1 mb-1 px-2 py-1"
                      style="background-color: #eff6ff; color: #1e40af; border-radius: 6px; font-weight: 500;"
                      :title="it.dosage"
                    >
                      {{ it.name }} x{{ it.qty }}
                    </span>
                  </div>
                </td>
                <td class="py-3 align-middle text-right font-weight-bold text-dark">{{ formatCurrency(orderTotal(order)) }}</td>
                <td class="py-3 align-middle">
                  <span
                    class="badge badge-pill px-3 py-2 font-weight-bold"
                    :style="{ backgroundColor: statusStyle(order.status).bg, color: statusStyle(order.status).color }"
                  >
                    <i class="fas fa-circle mr-1" style="font-size: 8px;"></i>
                    {{ order.statusText }}
                  </span>
                </td>
                <td class="py-3 align-middle text-center">
                  <button
                    v-if="order.status === 'pending' || order.status === 'dispensing'"
                    class="btn btn-sm btn-link text-secondary mr-1" title="Cập nhật trạng thái"
                    @click="advanceStatus(order)"
                  >
                    <i class="fas fa-arrow-circle-right" style="color: #0d9488;"></i>
                  </button>
                  <button
                    v-if="order.status !== 'completed' && order.status !== 'cancelled'"
                    class="btn btn-sm btn-link text-secondary mr-1" title="Hủy đơn"
                    @click="cancelOrder(order)"
                  >
                    <i class="fas fa-ban" style="color: #f59e0b;"></i>
                  </button>
                  <button class="btn btn-sm btn-link text-secondary" title="Xóa đơn" @click="deleteOrder(order.id)">
                    <i class="fas fa-trash-alt" style="color: #dc2626;"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="filteredOrders.length === 0">
                <td colspan="7" class="text-center py-5 text-muted">
                  <i class="fas fa-folder-open fa-2x mb-3 text-secondary" style="opacity: 0.5;"></i>
                  <p class="mb-0">Không tìm thấy đơn thuốc nào khớp với dữ liệu lọc.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4">
          <small class="text-muted mb-3 mb-sm-0">
            Hiển thị 1-{{ filteredOrders.length }} trong số {{ orders.length }} đơn thuốc
          </small>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <MedicineOrderFormModal
      v-model="showModal"
      :catalog="medicineCatalog"
      @submit="handleSubmitOrder"
    />
  </div>
</template>

<style scoped>
.text-teal {
  color: #0d9488;
}
.hover-bg-light:hover {
  background-color: #f8fafc;
}
</style>
