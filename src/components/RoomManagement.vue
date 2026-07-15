<script setup>
import { ref, computed } from 'vue';

// Mock Data
const rooms = ref([
  {
    tenPhong: 'Phòng HS2',
    ghiChu: 'Ghế ngồi thoải mái, chờ phục hồi',
    maPhong: 'P001',
    sucChua: 20,
    ngayTao: '27-06-2025'
  },
  {
    tenPhong: 'Phòng VIP1',
    ghiChu: 'Phòng VIP',
    maPhong: 'P005',
    sucChua: 30,
    ngayTao: '27-06-2025'
  }
]);

// Search and Form state
const searchInput = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);

const selectedRoom = ref(null);
const newRoom = ref({
  tenPhong: '',
  maPhong: '',
  sucChua: 1,
  ngayTao: '',
  ghiChu: ''
});

// Computed list
const filteredRooms = computed(() => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return rooms.value;
  return rooms.value.filter(room => 
    room.tenPhong.toLowerCase().includes(query) ||
    room.maPhong.toLowerCase().includes(query) ||
    room.ghiChu.toLowerCase().includes(query)
  );
});

// Open Add modal
const openAddRoom = () => {
  // Auto-generate code like P006
  const nextNum = rooms.value.length > 0
    ? Math.max(...rooms.value.map(x => parseInt(x.maPhong.replace('P', ''), 10) || 0)) + 1
    : 1;
  const formattedNum = String(nextNum).padStart(3, '0');
  
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  newRoom.value = {
    tenPhong: '',
    maPhong: `P${formattedNum}`,
    sucChua: 10,
    ngayTao: dateStr,
    ghiChu: ''
  };
  showAddModal.value = true;
};

const saveAddRoom = () => {
  if (rooms.value.some(x => x.maPhong === newRoom.value.maPhong)) {
    alert('Mã phòng này đã tồn tại!');
    return;
  }
  rooms.value.push({ ...newRoom.value });
  alert('Đã thêm phòng bệnh mới thành công!');
  showAddModal.value = false;
};

// Open Edit modal
const openEditRoom = (room) => {
  selectedRoom.value = JSON.parse(JSON.stringify(room));
  showEditModal.value = true;
};

const saveEditRoom = () => {
  const index = rooms.value.findIndex(x => x.maPhong === selectedRoom.value.maPhong);
  if (index !== -1) {
    rooms.value[index] = { ...selectedRoom.value };
    alert('Đã cập nhật thông tin phòng bệnh thành công!');
  }
  showEditModal.value = false;
};

// Delete Room
const deleteRoom = (maPhong) => {
  if (confirm(`Bạn có chắc chắn muốn xoá phòng bệnh ${maPhong} khỏi hệ thống?`)) {
    rooms.value = rooms.value.filter(x => x.maPhong !== maPhong);
    alert('Đã xoá thông tin phòng bệnh thành công!');
  }
};

// View Detail
const openDetailRoom = (room) => {
  selectedRoom.value = room;
  showDetailModal.value = true;
};
</script>

<template>
  <div class="p-4" style="background-color: #f8fafc; min-height: 85vh;">
    <!-- Upper Header -->
    <div class="row align-items-center mb-4">
      <div class="col-md-6 text-left">
        <h4 class="font-weight-bold text-dark mb-1" style="font-family: 'Outfit', sans-serif;">Quản Lý Phòng Bệnh Nội Trú</h4>
        <p class="text-secondary mb-0" style="font-size: 13.5px;">Xem danh sách phòng bệnh, sức chứa và ghi chú phân bổ bệnh nhân nội trú.</p>
      </div>
    </div>

    <!-- main card list container -->
    <div class="card border-0 shadow-sm rounded-lg overflow-hidden">
      <div class="card-header bg-white border-0 py-3.5 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <!-- Header title -->
        <h5 class="font-weight-bold text-dark mb-0 text-left" style="font-size: 16px;">Danh sách phòng bệnh nội trú</h5>
        
        <!-- Add Button -->
        <button 
          @click="openAddRoom"
          class="btn btn-primary rounded-pill px-3.5 py-2 font-weight-bold btn-sm shadow-sm" 
          style="background-color: #005f73; border: none;"
        >
          <i class="fas fa-plus mr-1"></i> Thêm phòng mới
        </button>
      </div>

      <div class="card-body p-4 text-left">
        <!-- Search bar -->
        <div class="position-relative mb-4">
          <input 
            type="text" 
            class="form-control pl-3 text-secondary" 
            placeholder="Tìm kiếm phòng theo tên phòng, mã phòng hoặc ghi chú..." 
            style="background-color: #f8fafc; border-color: #e2e8f0; font-size: 13.5px; height: 42px;"
            v-model="searchInput"
          />
        </div>

        <!-- Rooms Grid -->
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="room in filteredRooms" :key="room.maPhong" class="col mb-3">
            <div class="room-card border rounded-lg p-3.5 bg-white shadow-xs transition-all h-100 d-flex flex-column justify-content-between">
              <div>
                <h4 class="font-weight-bold text-dark mb-2" style="font-size: 17px; font-family: 'Outfit', sans-serif;">{{ room.tenPhong }}</h4>
                <span class="badge px-2.5 py-1 mb-3" style="background-color: #e0f2fe; color: #0369a1; border-radius: 6px; font-size: 11.5px; display: inline-block;">
                  {{ room.ghiChu }}
                </span>
                
                <div class="d-flex justify-content-between mb-2" style="font-size: 13px;">
                  <span class="text-secondary">Mã phòng:</span>
                  <strong class="text-dark">{{ room.maPhong }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-3" style="font-size: 13px;">
                  <span class="text-secondary">Sức chứa tối đa:</span>
                  <strong class="text-dark">{{ room.sucChua }} người</strong>
                </div>
              </div>
              
              <div class="border-top pt-3 d-flex justify-content-between align-items-center mt-3">
                <span class="text-secondary" style="font-size: 11.5px;">
                  <i class="far fa-calendar-alt mr-1"></i> Tạo lúc: {{ room.ngayTao }}
                </span>
                <div class="d-flex gap-1">
                  <button @click="openDetailRoom(room)" class="btn btn-light border btn-sm mr-1 font-weight-bold" style="font-size: 11.5px; border-radius: 6px;">
                    <i class="far fa-eye mr-1"></i> Xem
                  </button>
                  <button @click="openEditRoom(room)" class="btn btn-light border btn-sm mr-1 font-weight-bold" style="font-size: 11.5px; border-radius: 6px;">
                    <i class="far fa-edit mr-1"></i> Sửa
                  </button>
                  <button @click="deleteRoom(room.maPhong)" class="btn btn-outline-danger btn-sm font-weight-bold" style="font-size: 11.5px; border-radius: 6px;">
                    <i class="far fa-trash-alt"></i> Xoá
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty placeholder -->
          <div v-if="filteredRooms.length === 0" class="col-12 text-center py-5 text-secondary">
            <i class="fas fa-info-circle fa-2x d-block mb-2 text-muted"></i>
            Không tìm thấy phòng bệnh nào
          </div>
        </div>
      </div>
    </div>

    <!-- Room Detail Modal -->
    <div v-if="showDetailModal && selectedRoom" class="modal d-block text-left" tabindex="-1" style="background-color: rgba(0,0,0,0.4); z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
            <h5 class="modal-title fw-bold text-dark">Chi tiết Phòng Bệnh</h5>
            <button type="button" class="close border-0 bg-transparent" @click="showDetailModal = false">&times;</button>
          </div>
          <div class="modal-body pt-3">
            <div class="row g-3">
              <div class="col-12 text-left mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Tên Phòng</label>
                <div class="fw-bold fs-5 text-dark mt-1" style="font-size: 18px;">{{ selectedRoom.tenPhong }}</div>
              </div>
              <div class="col-6 text-left mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Mã Phòng</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedRoom.maPhong }}</div>
              </div>
              <div class="col-6 text-left mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Sức Chứa</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedRoom.sucChua }} người</div>
              </div>
              <div class="col-12 text-left mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Ngày Tạo</label>
                <div class="fw-bold fs-6 text-dark mt-1">{{ selectedRoom.ngayTao }}</div>
              </div>
              <div class="col-12 text-left mb-3">
                <label class="text-secondary small fw-bold text-uppercase">Ghi Chú</label>
                <div class="mt-1">
                  <span class="badge px-3 py-1.5" style="background-color: #f1f5f9; color: #475569; border-radius: 6px; font-size: 12px;">
                    {{ selectedRoom.ghiChu }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary rounded-3 px-4 font-weight-bold" @click="showDetailModal = false">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Room Edit Modal -->
    <div v-if="showEditModal && selectedRoom" class="modal d-block text-left" tabindex="-1" style="background-color: rgba(0,0,0,0.4); z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
            <h5 class="modal-title fw-bold text-dark">Chỉnh sửa Phòng Bệnh</h5>
            <button type="button" class="close border-0 bg-transparent" @click="showEditModal = false">&times;</button>
          </div>
          <form @submit.prevent="saveEditRoom">
            <div class="modal-body pt-3">
              <div class="row">
                <div class="col-12 form-group mb-3 text-left">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Tên Phòng</label>
                  <input type="text" class="form-control rounded-3" v-model="selectedRoom.tenPhong" required>
                </div>
                <div class="col-6 form-group mb-3 text-left">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Mã Phòng</label>
                  <input type="text" class="form-control rounded-3" v-model="selectedRoom.maPhong" readonly disabled>
                </div>
                <div class="col-6 form-group mb-3 text-left">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Sức Chứa</label>
                  <input type="number" class="form-control rounded-3" v-model="selectedRoom.sucChua" required>
                </div>
                <div class="col-12 form-group mb-3 text-left">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Ngày Tạo</label>
                  <input type="text" class="form-control rounded-3" v-model="selectedRoom.ngayTao" placeholder="DD-MM-YYYY" required>
                </div>
                <div class="col-12 form-group mb-3 text-left">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Ghi Chú</label>
                  <input type="text" class="form-control rounded-3" v-model="selectedRoom.ghiChu" required>
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

    <!-- Room Add Modal -->
    <div v-if="showAddModal" class="modal d-block text-left" tabindex="-1" style="background-color: rgba(0,0,0,0.4); z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
            <h5 class="modal-title fw-bold text-dark">Thêm Phòng Bệnh Mới</h5>
            <button type="button" class="close border-0 bg-transparent" @click="showAddModal = false">&times;</button>
          </div>
          <form @submit.prevent="saveAddRoom">
            <div class="modal-body pt-3">
              <div class="row">
                <div class="col-12 form-group mb-3 text-left">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Tên Phòng</label>
                  <input type="text" class="form-control rounded-3" v-model="newRoom.tenPhong" placeholder="Phòng HS3 / Phòng VIP2..." required>
                </div>
                <div class="col-6 form-group mb-3 text-left">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Mã Phòng</label>
                  <input type="text" class="form-control rounded-3" v-model="newRoom.maPhong" placeholder="PXXX" required>
                </div>
                <div class="col-6 form-group mb-3 text-left">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Sức Chứa</label>
                  <input type="number" class="form-control rounded-3" v-model="newRoom.sucChua" placeholder="Mức độ chứa" required>
                </div>
                <div class="col-12 form-group mb-3 text-left">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Ngày Tạo</label>
                  <input type="text" class="form-control rounded-3" v-model="newRoom.ngayTao" placeholder="DD-MM-YYYY" required>
                </div>
                <div class="col-12 form-group mb-3 text-left">
                  <label class="form-label small fw-bold text-uppercase text-secondary">Ghi Chú</label>
                  <input type="text" class="form-control rounded-3" v-model="newRoom.ghiChu" placeholder="Thông tin mô tả phòng..." required>
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

<style scoped>
.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
</style>
