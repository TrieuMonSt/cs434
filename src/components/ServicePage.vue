<script setup>
import { ref, computed } from 'vue';
import ServiceStats from './ServiceStats.vue';
import ServiceFormModal from './ServiceFormModal.vue';

const services = ref([
  { id: 'SV-001', name: 'Khám tổng quát', department: 'Nội tổng quát', price: 200000, duration: 30, status: 'active', description: 'Khám sức khỏe tổng quát định kỳ, đo huyết áp, nhịp tim.' },
  { id: 'SV-002', name: 'Siêu âm ổ bụng', department: 'Chẩn đoán hình ảnh', price: 350000, duration: 20, status: 'active', description: 'Siêu âm kiểm tra các cơ quan trong ổ bụng.' },
  { id: 'SV-003', name: 'Xét nghiệm máu tổng quát', department: 'Xét nghiệm', price: 250000, duration: 15, status: 'active', description: 'Phân tích công thức máu, đường huyết, mỡ máu.' },
  { id: 'SV-004', name: 'Chụp X-quang phổi', department: 'Chẩn đoán hình ảnh', price: 180000, duration: 15, status: 'active', description: 'Chụp X-quang kiểm tra phổi và lồng ngực.' },
  { id: 'SV-005', name: 'Khám nhi khoa', department: 'Nhi khoa', price: 220000, duration: 25, status: 'inactive', description: 'Khám và tư vấn sức khỏe cho trẻ em.' },
  { id: 'SV-006', name: 'Nội soi tai mũi họng', department: 'Tai Mũi Họng', price: 300000, duration: 20, status: 'active', description: 'Nội soi kiểm tra tai, mũi, họng bằng ống mềm.' },
]);

const activeFilter = ref('all'); // all, active, inactive
const searchQuery = ref('');
const showModal = ref(false);
const editingService = ref(null);

const toastMessage = ref('');
const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => { toastMessage.value = ''; }, 3000);
};

const formatCurrency = (n) => Number(n || 0).toLocaleString('vi-VN') + ' đ';

const filteredServices = computed(() => {
  return services.value.filter(s => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);
    const matchesFilter = activeFilter.value === 'all' || s.status === activeFilter.value;
    return matchesSearch && matchesFilter;
  });
});

const departments = computed(() => [...new Set(services.value.map(s => s.department))]);

const openAddModal = () => {
  editingService.value = null;
  showModal.value = true;
};
const openEditModal = (s) => {
  editingService.value = s;
  showModal.value = true;
};

const handleSubmitService = (data) => {
  if (data.isEditing) {
    const idx = services.value.findIndex(s => s.id === data.id);
    if (idx !== -1) services.value[idx] = { ...services.value[idx], ...data };
    triggerToast(`Đã cập nhật dịch vụ: ${data.name}`);
  } else {
    const newId = `SV-${String(services.value.length + 1).padStart(3, '0')}`;
    services.value.unshift({ id: newId, ...data });
    triggerToast(`Đã thêm dịch vụ mới: ${data.name}`);
  }
};

const toggleStatus = (s) => {
  s.status = s.status === 'active' ? 'inactive' : 'active';
  triggerToast(`Đã ${s.status === 'active' ? 'kích hoạt' : 'tạm ngừng'} dịch vụ: ${s.name}`);
};

const deleteService = (id) => {
  if (confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
    services.value = services.value.filter(s => s.id !== id);
    triggerToast('Đã xóa dịch vụ.');
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
            <li class="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Dịch vụ</li>
          </ol>
        </nav>
        <h3 class="font-weight-bold mb-0 text-dark" style="font-family: 'Outfit', sans-serif;">Quản lý Dịch vụ</h3>
      </div>

      <div class="d-flex align-items-center mt-3 mt-md-0">
        <button class="btn btn-light border mr-2 font-weight-bold text-dark px-3 py-2" style="font-size: 13.5px; background: white;">
          <i class="fas fa-download mr-2"></i> Xuất danh sách
        </button>
        <button class="btn btn-dark font-weight-bold px-3 py-2" style="font-size: 13.5px; background-color: #0d9488; border-color: #0d9488;" @click="openAddModal">
          <i class="fas fa-plus mr-2"></i> Thêm dịch vụ
        </button>
      </div>
    </div>

    <div v-if="toastMessage" class="alert alert-success position-fixed shadow" style="bottom: 20px; right: 20px; z-index: 1050; border-left: 5px solid #10b981; min-width: 280px;">
      <div class="d-flex align-items-center">
        <i class="fas fa-check-circle text-success mr-2 fa-lg"></i>
        <strong>{{ toastMessage }}</strong>
      </div>
    </div>

    <ServiceStats :services="services" />

    <div class="card border-0 shadow-sm rounded-lg mb-4">
      <div class="card-body p-4">
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4">
          <div class="btn-group mb-3 mb-lg-0" role="group">
            <button v-for="tab in [
                { key: 'all', label: 'Tất cả' },
                { key: 'active', label: 'Đang hoạt động' },
                { key: 'inactive', label: 'Tạm ngừng' },
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
              placeholder="Tìm tên dịch vụ, khoa..."
              style="height: 38px; font-size: 13px;"
              v-model="searchQuery"
            >
          </div>
        </div>

        <div class="table-responsive rounded border">
          <table class="table table-hover mb-0 text-left" style="font-size: 13.5px; vertical-align: middle;">
            <thead class="thead-light">
              <tr class="text-uppercase" style="font-family: 'Outfit', sans-serif; font-size: 12px; letter-spacing: 0.5px;">
                <th class="py-3 px-4">Tên dịch vụ</th>
                <th class="py-3">Khoa / Phòng</th>
                <th class="py-3">Thời lượng</th>
                <th class="py-3 text-right">Giá dịch vụ</th>
                <th class="py-3">Trạng thái</th>
                <th class="py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in filteredServices" :key="s.id" class="align-middle">
                <td class="py-3 px-4">
                  <h6 class="font-weight-bold mb-0 text-dark">{{ s.name }}</h6>
                  <small class="text-muted">#{{ s.id }} &bull; {{ s.description }}</small>
                </td>
                <td class="py-3 align-middle">
                  <span class="badge px-2 py-1" style="background-color: #eff6ff; color: #1e40af; border-radius: 6px; font-weight: 500;">
                    {{ s.department }}
                  </span>
                </td>
                <td class="py-3 align-middle text-secondary">{{ s.duration }} phút</td>
                <td class="py-3 align-middle text-right font-weight-bold text-dark">{{ formatCurrency(s.price) }}</td>
                <td class="py-3 align-middle">
                  <span
                    class="badge badge-pill px-3 py-2 font-weight-bold cursor-pointer"
                    :style="{
                      backgroundColor: s.status === 'active' ? '#f0fdf4' : '#f3f4f6',
                      color: s.status === 'active' ? '#16a34a' : '#4b5563'
                    }"
                    @click="toggleStatus(s)"
                    title="Click để đổi trạng thái"
                  >
                    <i class="fas fa-circle mr-1" style="font-size: 8px;"></i>
                    {{ s.status === 'active' ? 'Đang hoạt động' : 'Tạm ngừng' }}
                  </span>
                </td>
                <td class="py-3 align-middle text-center">
                  <button class="btn btn-sm btn-link text-secondary mr-1" title="Chỉnh sửa" @click="openEditModal(s)">
                    <i class="fas fa-pencil-alt" style="color: #6b7280;"></i>
                  </button>
                  <button class="btn btn-sm btn-link text-secondary" title="Xóa" @click="deleteService(s.id)">
                    <i class="fas fa-trash-alt" style="color: #dc2626;"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="filteredServices.length === 0">
                <td colspan="6" class="text-center py-5 text-muted">
                  <i class="fas fa-folder-open fa-2x mb-3 text-secondary" style="opacity: 0.5;"></i>
                  <p class="mb-0">Không tìm thấy dịch vụ nào khớp với dữ liệu lọc.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4">
          <small class="text-muted mb-3 mb-sm-0">
            Hiển thị 1-{{ filteredServices.length }} trong số {{ services.length }} dịch vụ
          </small>
        </div>
      </div>
    </div>

    <ServiceFormModal
      v-model="showModal"
      :editing-service="editingService"
      :departments="departments"
      @submit="handleSubmitService"
    />
  </div>
</template>

<style scoped>
.text-teal {
  color: #0d9488;
}
.cursor-pointer {
  cursor: pointer;
}
.hover-bg-light:hover {
  background-color: #f8fafc;
}
</style>
