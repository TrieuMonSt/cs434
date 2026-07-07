<script setup>
import { ref, computed } from 'vue';
import MedicineInventoryStats from './MedicineInventoryStats.vue';
import MedicineInventoryFormModal from './MedicineInventoryFormModal.vue';

const medicines = ref([
  { id: 'MED-001', name: 'Paracetamol 500mg', category: 'Giảm đau, hạ sốt', unit: 'Viên', stock: 1200, minStock: 300, price: 1000, expiry: '2027-05-10', supplier: 'Công ty Dược Hậu Giang' },
  { id: 'MED-002', name: 'Amoxicillin 500mg', category: 'Kháng sinh', unit: 'Viên', stock: 80, minStock: 200, price: 2500, expiry: '2026-09-15', supplier: 'Công ty Dược Traphaco' },
  { id: 'MED-003', name: 'Vitamin C 500mg', category: 'Vitamin & Khoáng chất', unit: 'Viên', stock: 600, minStock: 150, price: 800, expiry: '2027-01-20', supplier: 'Công ty Dược Hậu Giang' },
  { id: 'MED-004', name: 'Oresol', category: 'Bù nước điện giải', unit: 'Gói', stock: 25, minStock: 100, price: 3000, expiry: '2026-08-01', supplier: 'Công ty Dược Imexpharm' },
  { id: 'MED-005', name: 'Siro ho Prospan', category: 'Hô hấp', unit: 'Chai', stock: 45, minStock: 30, price: 45000, expiry: '2026-07-25', supplier: 'Engelhard Arzneimittel' },
  { id: 'MED-006', name: 'Betadine sát khuẩn', category: 'Sát khuẩn ngoài da', unit: 'Chai', stock: 0, minStock: 20, price: 32000, expiry: '2027-03-12', supplier: 'Mundipharma' },
]);

const activeFilter = ref('all'); // all, low, out, expiring
const searchQuery = ref('');
const showModal = ref(false);
const editingMedicine = ref(null);

const toastMessage = ref('');
const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => { toastMessage.value = ''; }, 3000);
};

const daysToExpiry = (dateStr) => {
  const today = new Date('2026-07-07');
  const exp = new Date(dateStr);
  return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
};

const stockState = (m) => {
  if (m.stock <= 0) return 'out';
  if (m.stock < m.minStock) return 'low';
  if (daysToExpiry(m.expiry) <= 60) return 'expiring';
  return 'ok';
};

const formatCurrency = (n) => Number(n || 0).toLocaleString('vi-VN') + ' đ';
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
};

const filteredMedicines = computed(() => {
  return medicines.value.filter(m => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q);

    let matchesFilter = true;
    if (activeFilter.value === 'low') matchesFilter = stockState(m) === 'low';
    else if (activeFilter.value === 'out') matchesFilter = stockState(m) === 'out';
    else if (activeFilter.value === 'expiring') matchesFilter = daysToExpiry(m.expiry) <= 60;

    return matchesSearch && matchesFilter;
  });
});

const stockPercent = (m) => {
  const target = Math.max(m.minStock * 3, 1);
  return Math.min(100, Math.round((m.stock / target) * 100));
};
const stockBarColor = (m) => {
  const state = stockState(m);
  if (state === 'out') return '#dc2626';
  if (state === 'low') return '#f59e0b';
  return '#16a34a';
};

const openAddModal = () => {
  editingMedicine.value = null;
  showModal.value = true;
};
const openEditModal = (m) => {
  editingMedicine.value = m;
  showModal.value = true;
};

const handleSubmitMedicine = (data) => {
  if (data.isEditing) {
    const idx = medicines.value.findIndex(m => m.id === data.id);
    if (idx !== -1) medicines.value[idx] = { ...medicines.value[idx], ...data };
    triggerToast(`Đã cập nhật thông tin thuốc: ${data.name}`);
  } else {
    const newId = `MED-${String(medicines.value.length + 1).padStart(3, '0')}`;
    medicines.value.unshift({ id: newId, ...data });
    triggerToast(`Đã thêm thuốc mới vào kho: ${data.name}`);
  }
};

const adjustStock = (m, delta) => {
  m.stock = Math.max(0, m.stock + delta);
  triggerToast(`Đã ${delta > 0 ? 'nhập' : 'xuất'} kho ${Math.abs(delta)} ${m.unit} ${m.name}.`);
};

const deleteMedicine = (id) => {
  if (confirm('Bạn có chắc muốn xóa thuốc này khỏi kho?')) {
    medicines.value = medicines.value.filter(m => m.id !== id);
    triggerToast('Đã xóa thuốc khỏi kho.');
  }
};
</script>

<template>
  <div class="container-fluid px-4 py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-transparent p-0 mb-1" style="font-size: 13px;">
            <li class="breadcrumb-item"><a href="#" class="text-secondary text-decoration-none">Tổng quan</a></li>
            <li class="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Kho thuốc</li>
          </ol>
        </nav>
        <h3 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif;">Quản lý Kho thuốc</h3>
      </div>

      <div class="d-flex align-items-center mt-3 mt-md-0">
        <button class="btn btn-light border mr-2 font-weight-bold text-dark px-3 py-2" style="font-size: 13.5px; background: white;">
          <i class="fas fa-download mr-2"></i> Xuất báo cáo kho
        </button>
        <button class="btn btn-dark font-weight-bold px-3 py-2" style="font-size: 13.5px; background-color: #0d9488; border-color: #0d9488;" @click="openAddModal">
          <i class="fas fa-plus mr-2"></i> Thêm thuốc mới
        </button>
      </div>
    </div>

    <div v-if="toastMessage" class="alert alert-success position-fixed shadow" style="bottom: 20px; right: 20px; z-index: 1050; border-left: 5px solid #10b981; min-width: 280px;">
      <div class="d-flex align-items-center">
        <i class="fas fa-check-circle text-success mr-2 fa-lg"></i>
        <strong>{{ toastMessage }}</strong>
      </div>
    </div>

    <MedicineInventoryStats :medicines="medicines" />

    <div class="card border-0 shadow-sm rounded-lg mb-4">
      <div class="card-body p-4">
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4">
          <div class="btn-group mb-3 mb-lg-0" role="group">
            <button v-for="tab in [
                { key: 'all', label: 'Tất cả' },
                { key: 'low', label: 'Sắp hết' },
                { key: 'out', label: 'Hết hàng' },
                { key: 'expiring', label: 'Sắp hết hạn' },
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
              placeholder="Tìm tên thuốc, mã, phân loại..."
              style="height: 38px; font-size: 13px;"
              v-model="searchQuery"
            >
          </div>
        </div>

        <div class="table-responsive rounded border">
          <table class="table table-hover mb-0 text-left" style="font-size: 13.5px; vertical-align: middle;">
            <thead class="thead-light">
              <tr class="text-uppercase" style="font-family: 'Outfit', sans-serif; font-size: 12px; letter-spacing: 0.5px;">
                <th class="py-3 px-4">Tên thuốc</th>
                <th class="py-3">Phân loại</th>
                <th class="py-3">Tồn kho</th>
                <th class="py-3 text-right">Đơn giá</th>
                <th class="py-3">Hạn sử dụng</th>
                <th class="py-3">Nhà cung cấp</th>
                <th class="py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in filteredMedicines" :key="m.id" class="align-middle">
                <td class="py-3 px-4">
                  <h6 class="font-weight-bold mb-0 text-dark">{{ m.name }}</h6>
                  <small class="text-muted">#{{ m.id }}</small>
                </td>
                <td class="py-3 align-middle">
                  <span class="badge px-2 py-1" style="background-color: #f3f4f6; color: #374151; border-radius: 6px; font-weight: 500;">
                    {{ m.category }}
                  </span>
                </td>
                <td class="py-3 align-middle" style="min-width: 140px;">
                  <div class="d-flex justify-content-between mb-1">
                    <small class="font-weight-bold text-dark">{{ m.stock }} {{ m.unit }}</small>
                    <small class="text-muted">Min: {{ m.minStock }}</small>
                  </div>
                  <div class="progress" style="height: 6px; border-radius: 4px;">
                    <div class="progress-bar" :style="{ width: stockPercent(m) + '%', backgroundColor: stockBarColor(m) }"></div>
                  </div>
                </td>
                <td class="py-3 align-middle text-right font-weight-bold text-dark">{{ formatCurrency(m.price) }}</td>
                <td class="py-3 align-middle">
                  <span
                    class="badge badge-pill px-3 py-2 font-weight-bold"
                    :style="{
                      backgroundColor: daysToExpiry(m.expiry) <= 60 ? '#fffbeb' : '#f0fdf4',
                      color: daysToExpiry(m.expiry) <= 60 ? '#d97706' : '#16a34a'
                    }"
                  >
                    {{ formatDate(m.expiry) }}
                  </span>
                </td>
                <td class="py-3 align-middle text-secondary">{{ m.supplier }}</td>
                <td class="py-3 align-middle text-center">
                  <button class="btn btn-sm btn-link text-secondary mr-1" title="Nhập kho +10" @click="adjustStock(m, 10)">
                    <i class="fas fa-plus-circle" style="color: #16a34a;"></i>
                  </button>
                  <button class="btn btn-sm btn-link text-secondary mr-1" title="Xuất kho -10" @click="adjustStock(m, -10)">
                    <i class="fas fa-minus-circle" style="color: #d97706;"></i>
                  </button>
                  <button class="btn btn-sm btn-link text-secondary mr-1" title="Chỉnh sửa" @click="openEditModal(m)">
                    <i class="fas fa-pencil-alt" style="color: #6b7280;"></i>
                  </button>
                  <button class="btn btn-sm btn-link text-secondary" title="Xóa" @click="deleteMedicine(m.id)">
                    <i class="fas fa-trash-alt" style="color: #dc2626;"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="filteredMedicines.length === 0">
                <td colspan="7" class="text-center py-5 text-muted">
                  <i class="fas fa-folder-open fa-2x mb-3 text-secondary" style="opacity: 0.5;"></i>
                  <p class="mb-0">Không tìm thấy thuốc nào khớp với dữ liệu lọc.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4">
          <small class="text-muted mb-3 mb-sm-0">
            Hiển thị 1-{{ filteredMedicines.length }} trong số {{ medicines.length }} mặt hàng
          </small>
        </div>
      </div>
    </div>

    <MedicineInventoryFormModal
      v-model="showModal"
      :editing-medicine="editingMedicine"
      @submit="handleSubmitMedicine"
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
