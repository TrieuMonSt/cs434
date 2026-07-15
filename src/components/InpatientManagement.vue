<script setup>
import { ref, computed } from 'vue';

// Mock Data
const inpatients = ref([
  {
    maNoiTru: 'MT007',
    maPhong: 'P004',
    maBenhNhan: 'BN001',
    ngayTao: '10-09-2025',
    tenBenhNhan: 'Nguyễn Văn Anh',
    chanDoan: 'Viêm ruột thừa cấp',
    bacSi: 'BS. Nguyễn Văn A',
    tuoi: 28,
    gioiTinh: 'Nam'
  },
  {
    maNoiTru: 'MT009',
    maPhong: 'P005',
    maBenhNhan: 'BN003',
    ngayTao: '10-20-2025',
    tenBenhNhan: 'Trần Thị Bình',
    chanDoan: 'Viêm phổi thùy',
    bacSi: 'BS. Trần Thị B',
    tuoi: 35,
    gioiTinh: 'Nữ'
  }
]);

// Search and Modal states
const searchInput = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);

const selectedInpatient = ref(null);
const newInpatient = ref({
  maNoiTru: '',
  maPhong: '',
  maBenhNhan: '',
  ngayTao: '',
  tenBenhNhan: '',
  tuoi: 1,
  gioiTinh: 'Nam',
  bacSi: '',
  chanDoan: ''
});

// Computed list
const filteredInpatients = computed(() => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return inpatients.value;
  return inpatients.value.filter(item => 
    item.maNoiTru.toLowerCase().includes(query) ||
    item.maPhong.toLowerCase().includes(query) ||
    item.maBenhNhan.toLowerCase().includes(query) ||
    item.tenBenhNhan.toLowerCase().includes(query) ||
    item.bacSi.toLowerCase().includes(query) ||
    item.chanDoan.toLowerCase().includes(query)
  );
});

// Open Add Inpatient modal
const openAddInpatient = () => {
  const nextNum = inpatients.value.length > 0 
    ? Math.max(...inpatients.value.map(x => parseInt(x.maNoiTru.replace('MT', ''), 10) || 0)) + 1
    : 1;
  const formattedNum = String(nextNum).padStart(3, '0');
  
  const today = new Date();
  const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;

  newInpatient.value = {
    maNoiTru: `MT${formattedNum}`,
    maPhong: '',
    maBenhNhan: '',
    ngayTao: dateStr,
    tenBenhNhan: '',
    tuoi: 30,
    gioiTinh: 'Nam',
    bacSi: '',
    chanDoan: ''
  };
  showAddModal.value = true;
};

const saveAddInpatient = () => {
  if (inpatients.value.some(x => x.maNoiTru === newInpatient.value.maNoiTru)) {
    alert('Mã nội trú này đã tồn tại!');
    return;
  }
  inpatients.value.push({ ...newInpatient.value });
  alert('Đã thêm bệnh nhân nội trú mới thành công!');
  showAddModal.value = false;
};

// Open Edit Inpatient modal
const openEditInpatient = (item) => {
  selectedInpatient.value = JSON.parse(JSON.stringify(item));
  showEditModal.value = true;
};

const saveEditInpatient = () => {
  const index = inpatients.value.findIndex(x => x.maNoiTru === selectedInpatient.value.maNoiTru);
  if (index !== -1) {
    inpatients.value[index] = { ...selectedInpatient.value };
    alert('Đã cập nhật thông tin bệnh nhân nội trú thành công!');
  }
  showEditModal.value = false;
};

// Delete Inpatient
const deleteInpatient = (maNoiTru) => {
  if (confirm(`Bạn có chắc chắn muốn xoá bệnh nhân nội trú ${maNoiTru} khỏi danh sách?`)) {
    inpatients.value = inpatients.value.filter(x => x.maNoiTru !== maNoiTru);
    alert('Đã xoá bệnh nhân nội trú thành công!');
  }
};

// Open Detail View
const openDetailInpatient = (item) => {
  selectedInpatient.value = item;
  showDetailModal.value = true;
};
</script>

<template>
  <div class="p-4" style="background-color: #f8fafc; min-height: 85vh;">
    <!-- Upper Header -->
    <div class="row align-items-center mb-4">
      <div class="col-md-6 text-left">
        <h4 class="font-weight-bold text-dark mb-1" style="font-family: 'Outfit', sans-serif;">Bệnh Nhân Nội Trú</h4>
        <p class="text-secondary mb-0" style="font-size: 13.5px;">Quản lý thông tin hồ sơ điều trị nội trú, phòng bệnh và bác sĩ phụ trách.</p>
      </div>
    </div>

    <!-- main card list container -->
    <div class="card border-0 shadow-sm rounded-lg overflow-hidden">
      <div class="card-header bg-white border-0 py-3.5 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <!-- Header title & count -->
        <div class="d-flex align-items-center">
          <h5 class="font-weight-bold text-dark mb-0 mr-2.5" style="font-size: 16px;">Danh sách nội trú</h5>
          <span class="badge px-2.5 py-1 font-weight-bold" style="background-color: #e0f2fe; color: #0369a1; border-radius: 6px; font-size: 12px;">
            {{ filteredInpatients.length }} Bệnh nhân
          </span>
        </div>
        
        <!-- Add Button -->
        <button 
          @click="openAddInpatient"
          class="btn btn-primary rounded-pill px-3.5 py-2 font-weight-bold btn-sm shadow-sm" 
          style="background-color: #005f73; border: none;"
        >
          <i class="fas fa-plus mr-1"></i> Thêm mới
        </button>
      </div>

      <div class="card-body p-4 text-left">
        <!-- Search bar -->
        <div class="position-relative mb-4">
          <input 
            type="text" 
            class="form-control pl-3 text-secondary" 
            placeholder="Tìm kiếm nội trú theo mã nội trú, mã phòng, mã bệnh nhân, tên, bác sĩ, chẩn đoán..." 
            style="background-color: #f8fafc; border-color: #e2e8f0; font-size: 13.5px; height: 42px;"
            v-model="searchInput"
          />
        </div>

        <!-- Table responsive list -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr class="text-secondary" style="font-size: 13px;">
                <th scope="col" class="pb-3 border-bottom-2">Mã nội trú</th>
                <th scope="col" class="pb-3 border-bottom-2">Mã phòng</th>
                <th scope="col" class="pb-3 border-bottom-2">Mã bệnh nhân</th>
                <th scope="col" class="pb-3 border-bottom-2">Họ & Tên</th>
                <th scope="col" class="pb-3 border-bottom-2">Ngày nhập viện</th>
                <th scope="col" class="pb-3 border-bottom-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredInpatients" :key="item.maNoiTru">
                <td class="font-weight-bold text-dark">{{ item.maNoiTru }}</td>
                <td>
                  <span class="badge border px-2.5 py-1 text-secondary" style="background-color: #f8fafc; border-radius: 6px;">
                    {{ item.maPhong }}
                  </span>
                </td>
                <td class="font-weight-medium text-dark">{{ item.maBenhNhan }}</td>
                <td>{{ item.tenBenhNhan }}</td>
                <td class="text-secondary">{{ item.ngayTao }}</td>
                <td class="text-right">
                  <button @click="openDetailInpatient(item)" class="btn btn-light border btn-sm mr-1 font-weight-bold" style="font-size: 11.5px; border-radius: 6px;">
                    <i class="far fa-eye mr-1"></i> Xem
                  </button>
                  <button @click="openEditInpatient(item)" class="btn btn-light border btn-sm mr-1 font-weight-bold" style="font-size: 11.5px; border-radius: 6px;">
                    <i class="far fa-edit mr-1"></i> Sửa
                  </button>
                  <button @click="deleteInpatient(item.maNoiTru)" class="btn btn-outline-danger btn-sm font-weight-bold" style="font-size: 11.5px; border-radius: 6px;">
                    <i class="far fa-trash-alt"></i> Xoá
                  </button>
                </td>
              </tr>

              <!-- Empty placeholder -->
              <tr v-if="filteredInpatients.length === 0">
                <td colspan="6" class="text-center py-5 text-secondary">
                  <i class="fas fa-user-slash fa-2x d-block mb-2 text-muted"></i>
                  Không tìm thấy bệnh nhân nội trú nào
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal && selectedInpatient" class="modal d-block text-left" tabindex="-1" style="background-color: rgba(0,0,0,0.4); z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
            <h5 class="modal-title fw-bold text-dark">Chi tiết Bệnh nhân Nội trú</h5>
            <button type="button" class="close border-0 bg-transparent" @click="showDetailModal = false">&times;</button>
          </div>
          <div class="modal-body pt-3">
            <div class="row">
              <div class="col-6 mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Mã Nội Trú</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedInpatient.maNoiTru }}</div>
              </div>
              <div class="col-6 mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Mã Phòng</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedInpatient.maPhong }}</div>
              </div>
              <div class="col-6 mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Mã Bệnh Nhân</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedInpatient.maBenhNhan }}</div>
              </div>
              <div class="col-6 mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Ngày Tạo</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedInpatient.ngayTao }}</div>
              </div>
              <div class="col-12 mb-3">
                <hr class="my-1 text-muted">
              </div>
              <div class="col-12 mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Họ và Tên</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedInpatient.tenBenhNhan }}</div>
              </div>
              <div class="col-6 mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Tuổi</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedInpatient.tuoi }}</div>
              </div>
              <div class="col-6 mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Giới Tính</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedInpatient.gioiTinh }}</div>
              </div>
              <div class="col-12 mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Bác Sĩ Phụ Trách</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedInpatient.bacSi }}</div>
              </div>
              <div class="col-12 mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Chẩn Đoán</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedInpatient.chanDoan }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary rounded-3 px-4 font-weight-bold" @click="showDetailModal = false">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal && selectedInpatient" class="modal d-block text-left" tabindex="-1" style="background-color: rgba(0,0,0,0.4); z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
            <h5 class="modal-title fw-bold text-dark">Chỉnh sửa Thông tin</h5>
            <button type="button" class="close border-0 bg-transparent" @click="showEditModal = false">&times;</button>
          </div>
          <form @submit.prevent="saveEditInpatient">
            <div class="modal-body pt-3">
              <div class="row">
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Mã Nội Trú</label>
                  <input type="text" class="form-control rounded-3" v-model="selectedInpatient.maNoiTru" readonly disabled>
                </div>
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Mã Phòng</label>
                  <input type="text" class="form-control rounded-3" v-model="selectedInpatient.maPhong" required>
                </div>
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Mã Bệnh Nhân</label>
                  <input type="text" class="form-control rounded-3" v-model="selectedInpatient.maBenhNhan" required>
                </div>
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Ngày Tạo</label>
                  <input type="text" class="form-control rounded-3" v-model="selectedInpatient.ngayTao" placeholder="DD-MM-YYYY" required>
                </div>
                <div class="col-12 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Họ và Tên</label>
                  <input type="text" class="form-control rounded-3" v-model="selectedInpatient.tenBenhNhan" required>
                </div>
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Tuổi</label>
                  <input type="number" class="form-control rounded-3" v-model="selectedInpatient.tuoi" required>
                </div>
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Giới Tính</label>
                  <select class="form-control rounded-3" v-model="selectedInpatient.gioiTinh" required>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div class="col-12 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Bác Sĩ Phụ Trách</label>
                  <input type="text" class="form-control rounded-3" v-model="selectedInpatient.bacSi" required>
                </div>
                <div class="col-12 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Chẩn Đoán</label>
                  <textarea class="form-control rounded-3" rows="2" v-model="selectedInpatient.chanDoan" required></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-secondary rounded-3 px-4 font-weight-bold" @click="showEditModal = false">Hủy</button>
              <button type="submit" class="btn btn-primary rounded-3 px-4 font-weight-bold" style="background-color: #005f73; border: none;">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="modal d-block text-left" tabindex="-1" style="background-color: rgba(0,0,0,0.4); z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
            <h5 class="modal-title fw-bold text-dark">Thêm Bệnh nhân Nội trú Mới</h5>
            <button type="button" class="close border-0 bg-transparent" @click="showAddModal = false">&times;</button>
          </div>
          <form @submit.prevent="saveAddInpatient">
            <div class="modal-body pt-3">
              <div class="row">
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Mã Nội Trú</label>
                  <input type="text" class="form-control rounded-3" v-model="newInpatient.maNoiTru" placeholder="MT0XX" required>
                </div>
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Mã Phòng</label>
                  <input type="text" class="form-control rounded-3" v-model="newInpatient.maPhong" placeholder="PXXX" required>
                </div>
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Mã Bệnh Nhân</label>
                  <input type="text" class="form-control rounded-3" v-model="newInpatient.maBenhNhan" placeholder="BNXXX" required>
                </div>
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Ngày Tạo</label>
                  <input type="text" class="form-control rounded-3" v-model="newInpatient.ngayTao" placeholder="MM-DD-YYYY" required>
                </div>
                <div class="col-12 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Họ và Tên</label>
                  <input type="text" class="form-control rounded-3" v-model="newInpatient.tenBenhNhan" placeholder="Nguyễn Văn A" required>
                </div>
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Tuổi</label>
                  <input type="number" class="form-control rounded-3" v-model="newInpatient.tuoi" required>
                </div>
                <div class="col-6 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Giới Tính</label>
                  <select class="form-control rounded-3" v-model="newInpatient.gioiTinh" required>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div class="col-12 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Bác Sĩ Phụ Trách</label>
                  <input type="text" class="form-control rounded-3" v-model="newInpatient.bacSi" placeholder="BS. Nguyễn Văn A" required>
                </div>
                <div class="col-12 form-group mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Chẩn Đoán</label>
                  <textarea class="form-control rounded-3" rows="2" v-model="newInpatient.chanDoan" placeholder="Chẩn đoán bệnh..." required></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-secondary rounded-3 px-4 font-weight-bold" @click="showAddModal = false">Hủy</button>
              <button type="submit" class="btn btn-primary rounded-3 px-4 font-weight-bold" style="background-color: #005f73; border: none;">Thêm mới</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
