<script setup>
import { ref, computed } from 'vue';

// Mock Data from data.js
const doctors = ref([
  {
    code: '01',
    name: 'BS. Nguyễn Thị A',
    specialty: 'Ung thư học',
    email: 'nguyenthia@hospital.test',
    phone: '0912 345 678',
    experience: '10 năm',
    gender: 'Nữ',
    status: 'active',
    bio: 'Chuyên gia hàng đầu về ung thư học lâm sàng, nguyên trưởng khoa bệnh viện K.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Chiều', Wednesday: 'Sáng', Thursday: 'Chiều', Friday: 'Nghỉ', Saturday: 'Sáng', Sunday: 'Nghỉ'
    }
  },
  {
    code: '02',
    name: 'BS. Phạm Văn B',
    specialty: 'Tim mạch',
    email: 'phamvanb@hospital.test',
    phone: '0987 654 321',
    experience: '15 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Chuyên khoa Tim mạch can thiệp, tu nghiệp tại CH Pháp, có nhiều công trình nghiên cứu khoa học.',
    schedule: {
      Monday: 'Chiều', Tuesday: 'Sáng', Wednesday: 'Chiều', Thursday: 'Sáng', Friday: 'Sáng', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  },
  {
    code: '03',
    name: 'BS. Trần Thị C',
    specialty: 'Nhi khoa',
    email: 'tranthic@hospital.test',
    phone: '0909 123 456',
    experience: '8 năm',
    gender: 'Nữ',
    status: 'active',
    bio: 'Bác sĩ Nhi khoa tận tâm, yêu trẻ, chuyên sâu về dinh dưỡng trẻ em và hô hấp.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Sáng', Wednesday: 'Sáng', Thursday: 'Sáng', Friday: 'Sáng', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  },
  {
    code: '04',
    name: 'BS. Lê Hoàng D',
    specialty: 'Chấn thương chỉnh hình',
    email: 'lehoangd@hospital.test',
    phone: '0934 567 890',
    experience: '12 năm',
    gender: 'Nam',
    status: 'inactive',
    bio: 'Chuyên khoa xương khớp, phẫu thuật nội soi khớp và chấn thương thể thao.',
    schedule: {
      Monday: 'Chiều', Tuesday: 'Chiều', Wednesday: 'Nghỉ', Thursday: 'Chiều', Friday: 'Chiều', Saturday: 'Sáng', Sunday: 'Nghỉ'
    }
  },
  {
    code: '05',
    name: 'BS. Hoàng Mai E',
    specialty: 'Sản phụ khoa',
    email: 'hoangmaie@hospital.test',
    phone: '0945 678 901',
    experience: '14 năm',
    gender: 'Nữ',
    status: 'active',
    bio: 'Chuyên gia siêu âm sản khoa, quản lý thai kỳ nguy cơ cao và tư vấn kế hoạch hóa gia đình.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Nghỉ', Wednesday: 'Sáng', Thursday: 'Nghỉ', Friday: 'Sáng', Saturday: 'Sáng', Sunday: 'Nghỉ'
    }
  },
  {
    code: '06',
    name: 'BS. Đỗ Quốc F',
    specialty: 'Nội tiết',
    email: 'doquocf@hospital.test',
    phone: '0967 890 123',
    experience: '9 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Chuyên điều trị đái tháo đường, các bệnh lý tuyến giáp và rối loạn nội tiết tố.',
    schedule: {
      Monday: 'Chiều', Tuesday: 'Sáng', Wednesday: 'Nghỉ', Thursday: 'Sáng', Friday: 'Nghỉ', Saturday: 'Sáng', Sunday: 'Nghỉ'
    }
  },
  {
    code: '07',
    name: 'BS. Vũ Hoàng G',
    specialty: 'Thần kinh',
    email: 'vuhoangg@hospital.test',
    phone: '0978 901 234',
    experience: '11 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Chuyên sâu nội thần kinh, điều trị đau đầu, mất ngủ kéo dài và đau thần kinh tọa.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Chiều', Wednesday: 'Sáng', Thursday: 'Chiều', Friday: 'Sáng', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  },
  {
    code: '08',
    name: 'BS. Nguyễn Minh H',
    specialty: 'Da liễu',
    email: 'nguyenminhh@hospital.test',
    phone: '0989 012 345',
    experience: '7 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Chuyên điều trị mụn trứng cá, viêm da cơ địa và các phương pháp thẩm mỹ da công nghệ cao.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Sáng', Wednesday: 'Chiều', Thursday: 'Chiều', Friday: 'Sáng', Saturday: 'Chiều', Sunday: 'Nghỉ'
    }
  },
  {
    code: '09',
    name: 'BS. Phan Thanh I',
    specialty: 'Tai Mũi Họng',
    email: 'phanthanhi@hospital.test',
    phone: '0990 123 456',
    experience: '13 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Khám và điều trị viêm xoang, viêm amidan mạn tính và nội soi tai mũi họng trẻ em.',
    schedule: {
      Monday: 'Chiều', Tuesday: 'Sáng', Wednesday: 'Chiều', Thursday: 'Sáng', Friday: 'Chiều', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  },
  {
    code: '10',
    name: 'BS. Bùi Phương K',
    specialty: 'Mắt',
    email: 'buiphuongk@hospital.test',
    phone: '0901 234 567',
    experience: '6 năm',
    gender: 'Nữ',
    status: 'active',
    bio: 'Điều trị tật khúc xạ cận thị, viễn thị, loạn thị và các bệnh lý bề mặt nhãn cầu.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Chiều', Wednesday: 'Sáng', Thursday: 'Chiều', Friday: 'Sáng', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  },
  {
    code: '11',
    name: 'BS. Đặng Tiến L',
    specialty: 'Răng Hàm Mặt',
    email: 'dangtienl@hospital.test',
    phone: '0912 345 999',
    experience: '16 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Chuyên gia phục hình răng sứ thẩm mỹ, cấy ghép Implant nha khoa và niềng răng.',
    schedule: {
      Monday: 'Chiều', Tuesday: 'Chiều', Wednesday: 'Chiều', Thursday: 'Chiều', Friday: 'Chiều', Saturday: 'Sáng', Sunday: 'Nghỉ'
    }
  }
]);

// Search and Pagination states
const searchQuery = ref('');
const doctorSearchInput = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

// Modal visibility & content
const scheduleModalVisible = ref(false);
const selectedDoctorSchedule = ref(null);

const doctorModalVisible = ref(false);
const doctorModalMode = ref('add'); // 'add' or 'edit'
const editingDoctor = ref(null);

// Get SVG Avatar based on gender
const getAvatarSvg = (gender) => {
  if (gender === 'Nữ') {
    return `<svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#f0fdfa"/>
      <path d="M50 48c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13zm0 6c-10.67 0-32 5.33-32 16v8h64v-8c0-10.67-21.33-16-32-16z" fill="#0f766e"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#f0fdfa"/>
    <path d="M50 48c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13zm0 6c-10.67 0-32 5.33-32 16v6h64v-6c0-10.67-21.33-16-32-16z" fill="#0f766e"/>
  </svg>`;
};

// Filtered Doctors list
const filteredDoctors = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return doctors.value;
  return doctors.value.filter(doc => 
    doc.name.toLowerCase().includes(query) || 
    doc.code.toLowerCase().includes(query) ||
    doc.specialty.toLowerCase().includes(query)
  );
});

// Pagination computed
const totalPages = computed(() => Math.ceil(filteredDoctors.value.length / itemsPerPage));
const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredDoctors.value.slice(start, start + itemsPerPage);
});

const doctorStartIndex = computed(() => filteredDoctors.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1);
const doctorEndIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredDoctors.value.length));

// Search handler
const handleDoctorSearch = () => {
  searchQuery.value = doctorSearchInput.value;
  currentPage.value = 1;
};

const handleClearDoctorSearch = () => {
  doctorSearchInput.value = '';
  searchQuery.value = '';
  currentPage.value = 1;
};

// Navigation
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Schedule Modals
const openScheduleModal = (doc) => {
  selectedDoctorSchedule.value = JSON.parse(JSON.stringify(doc));
  scheduleModalVisible.value = true;
};

const saveDoctorSchedule = (updatedDoc) => {
  const index = doctors.value.findIndex(d => d.code === updatedDoc.code);
  if (index !== -1) {
    doctors.value[index].schedule = updatedDoc.schedule;
    alert(`Đã lưu lịch làm việc của bác sĩ ${updatedDoc.name}`);
  }
  scheduleModalVisible.value = false;
};

// Doctor form CRUD
const openAddDoctorModal = () => {
  editingDoctor.value = {
    code: String(doctors.value.length + 1).padStart(2, '0'),
    name: '',
    specialty: '',
    email: '',
    phone: '',
    experience: '',
    gender: 'Nam',
    status: 'active',
    bio: '',
    schedule: {
      Monday: 'Nghỉ', Tuesday: 'Nghỉ', Wednesday: 'Nghỉ', Thursday: 'Nghỉ', Friday: 'Nghỉ', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  };
  doctorModalMode.value = 'add';
  doctorModalVisible.value = true;
};

const openDoctorDetailModal = (doc) => {
  editingDoctor.value = JSON.parse(JSON.stringify(doc));
  doctorModalMode.value = 'edit';
  doctorModalVisible.value = true;
};

const saveDoctor = (doc) => {
  if (doctorModalMode.value === 'add') {
    // Check duplication
    if (doctors.value.some(d => d.code === doc.code)) {
      alert('Mã bác sĩ đã tồn tại!');
      return;
    }
    doctors.value.push(doc);
    alert(`Đã thêm bác sĩ mới: ${doc.name}`);
  } else {
    const index = doctors.value.findIndex(d => d.code === doc.code);
    if (index !== -1) {
      doctors.value[index] = doc;
      alert(`Đã cập nhật hồ sơ bác sĩ: ${doc.name}`);
    }
  }
  doctorModalVisible.value = false;
};

const deleteDoctor = (code) => {
  if (confirm(`Bạn có chắc muốn xóa bác sĩ có mã ${code}?`)) {
    doctors.value = doctors.value.filter(d => d.code !== code);
    alert('Đã xóa bác sĩ thành công!');
    doctorModalVisible.value = false;
  }
};
</script>

<template>
  <div class="p-4" style="background-color: #f8fafc; min-height: 85vh;">
    <!-- Upper Header -->
    <div class="row align-items-center mb-4">
      <div class="col-md-6 text-left">
        <h4 class="font-weight-bold text-dark mb-1" style="font-family: 'Outfit', sans-serif;">Hồ Sơ Đội Ngũ Bác Sĩ</h4>
        <p class="text-secondary mb-0" style="font-size: 13.5px;">Xem danh sách chi tiết, trạng thái công tác và lịch trực tuần của các bác sĩ.</p>
      </div>
    </div>

    <!-- main card list container -->
    <div class="card border-0 shadow-sm rounded-lg overflow-hidden">
      <div class="card-header bg-white border-0 py-3.5 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <!-- Badge count -->
        <div class="d-flex align-items-center">
          <h5 class="font-weight-bold text-dark mb-0 mr-2.5" style="font-size: 16px;">Đội ngũ bác sĩ</h5>
          <span class="badge px-2.5 py-1 font-weight-bold" style="background-color: #ccfbf1; color: #0f766e; border-radius: 6px; font-size: 12px;">
            {{ filteredDoctors.length }} Bác Sĩ
          </span>
        </div>

        <!-- Search Bar -->
        <div class="d-flex align-items-center">
          <div class="position-relative mr-2 flex-grow-1 flex-md-grow-0" style="width: 280px; max-width: 100%;">
            <input 
              type="text" 
              class="form-control pl-3 pr-4 border rounded text-secondary"
              placeholder="Tìm kiếm theo tên hoặc mã" 
              style="background-color: #f8fafc; border-color: #e2e8f0; font-size: 13px; height: 38px;"
              v-model="doctorSearchInput" 
              @keyup.enter="handleDoctorSearch"
            >
            <i 
              v-if="doctorSearchInput" 
              class="fas fa-times-circle position-absolute text-muted cursor-pointer"
              style="right: 12px; top: 12px; font-size: 14px;" 
              @click="handleClearDoctorSearch"
            ></i>
          </div>
          <button 
            @click="handleDoctorSearch"
            class="btn btn-light border font-weight-bold text-dark px-3 py-2 text-center transition-all shadow-sm"
            style="font-size: 13px; background-color: #ffffff; border-color: #e2e8f0; border-radius: 8px; height: 38px; min-width: 60px;"
          >
            Tìm
          </button>
        </div>
      </div>

      <!-- Card Body: Doctor Rows -->
      <div class="card-body p-0 text-left">
        <div class="doctors-list">
          <div 
            v-for="doc in paginatedDoctors" 
            :key="doc.code"
            class="d-flex flex-column flex-md-row align-items-md-center justify-content-between py-3.5 px-4 border-bottom doctor-row"
          >
            <div class="d-flex align-items-center mb-3 mb-md-0">
              <div
                class="rounded-circle mr-3 overflow-hidden d-flex align-items-center justify-content-center bg-light border shadow-sm flex-shrink-0"
                style="width: 60px; height: 60px;" 
                v-html="getAvatarSvg(doc.gender)"
              >
              </div>
              <div>
                <h6 class="font-weight-bold text-dark mb-1" style="font-size: 15px;">{{ doc.name }}</h6>
                <div class="d-flex align-items-center flex-wrap text-secondary" style="font-size: 13px;">
                  <span class="font-weight-bold mr-2 text-teal-custom" style="color: #0f766e;">{{ doc.specialty }}</span>
                  <span class="mr-2 opacity-50">|</span>
                  <span>Mã số: {{ doc.code }}</span>
                  <span 
                    v-if="doc.status === 'inactive'" 
                    class="badge badge-warning ml-2 font-weight-bold text-dark"
                    style="font-size: 10px; border-radius: 4px; padding: 3px 6px; background-color: #fef08a;"
                  >
                    Nghỉ công tác
                  </span>
                </div>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <button 
                @click="openScheduleModal(doc)"
                class="btn font-weight-bold px-3 py-2 mr-2 btn-schedule transition-all"
                style="border-radius: 8px; font-size: 12.5px; background-color: #f0fdfa; color: #0f766e; border: 1px solid #ccfbf1;"
              >
                Xem Lịch Làm Việc
              </button>
              <button 
                @click="openDoctorDetailModal(doc)"
                class="btn font-weight-bold px-3 py-2 btn-detail transition-all"
                style="border-radius: 8px; font-size: 12.5px; background-color: #ffffff; color: #475569; border: 1px solid #cbd5e1;"
              >
                Xem Chi Tiết Bác Sĩ
              </button>
            </div>
          </div>

          <div v-if="filteredDoctors.length === 0" class="py-5 text-center text-secondary">
            <i class="fas fa-user-md fa-3x mb-3 text-muted" style="opacity: 0.4;"></i>
            <h6 class="font-weight-bold text-dark mb-1">Không tìm thấy bác sĩ nào</h6>
            <p class="mb-0 text-muted" style="font-size: 12.5px;">Vui lòng thử tìm kiếm với tên hoặc mã số khác.</p>
          </div>
        </div>

        <!-- Card Footer: Pagination controls -->
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center py-3.5 px-4 bg-white border-top rounded-bottom">
          <small class="text-secondary font-weight-medium mb-3 mb-sm-0" style="font-size: 13px;">
            Hiển Thị {{ doctorStartIndex }} Đến {{ doctorEndIndex }} Trong Tổng Số {{ filteredDoctors.length }} Kết Quả
          </small>

          <nav v-if="totalPages > 1" aria-label="Table navigation">
            <ul class="pagination pagination-sm mb-0 align-items-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a 
                  class="page-link border d-flex align-items-center justify-content-center rounded-circle mr-2 transition-all cursor-pointer shadow-xs"
                  style="width: 32px; height: 32px; background: #fff; color: #64748b; border-color: #cbd5e1; cursor: pointer;"
                  @click.prevent="prevPage"
                >
                  <i class="fas fa-chevron-left" style="font-size: 10px;"></i>
                </a>
              </li>
              <li 
                v-for="p in totalPages" 
                :key="p" 
                class="page-item mx-1"
                :class="{ active: currentPage === p }"
              >
                <a 
                  class="page-link border-0 font-weight-bold d-flex align-items-center justify-content-center rounded transition-all cursor-pointer"
                  :style="{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: currentPage === p ? '#0f766e' : 'transparent',
                    color: currentPage === p ? '#fff' : '#64748b',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }" 
                  @click.prevent="currentPage = p"
                >
                  {{ p }}
                </a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a 
                  class="page-link border d-flex align-items-center justify-content-center rounded-circle ml-2 transition-all cursor-pointer shadow-xs"
                  style="width: 32px; height: 32px; background: #fff; color: #64748b; border-color: #cbd5e1; cursor: pointer;"
                  @click.prevent="nextPage"
                >
                  <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Floating Action Button (FAB) for adding new doctor -->
    <button 
      @click="openAddDoctorModal"
      class="btn rounded-circle d-flex align-items-center justify-content-center shadow-lg transition-all fab-btn"
      style="position: fixed; right: 30px; bottom: 30px; width: 56px; height: 56px; background-color: #0f766e; color: #ffffff; border: none; border-radius: 50%; z-index: 99; box-shadow: 0 4px 10px rgba(15, 118, 110, 0.35);"
      title="Thêm bác sĩ mới"
    >
      <i class="fas fa-plus" style="font-size: 20px;"></i>
    </button>

    <!-- Doctor Schedule Modal -->
    <div v-if="scheduleModalVisible && selectedDoctorSchedule" class="modal d-block text-left" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.4); z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-light py-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 class="modal-title font-weight-bold text-dark">
              Lịch trực tuần - {{ selectedDoctorSchedule.name }}
            </h5>
            <button type="button" class="close border-0 bg-transparent" @click="scheduleModalVisible = false" style="outline: none;">
              <span aria-hidden="true" style="font-size: 24px; color: #64748b;">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4 bg-white">
            <div class="table-responsive">
              <table class="table table-bordered table-striped text-center mb-0">
                <thead>
                  <tr class="bg-teal-light text-teal-custom" style="background-color: #f0fdfa; color: #0f766e;">
                    <th>Thứ 2</th>
                    <th>Thứ 3</th>
                    <th>Thứ 4</th>
                    <th>Thứ 5</th>
                    <th>Thứ 6</th>
                    <th>Thứ 7</th>
                    <th>Chủ Nhật</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td v-for="(day, key) in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']" :key="day" class="p-2">
                      <select v-model="selectedDoctorSchedule.schedule[day]" class="form-control form-control-sm text-center border-0 font-weight-bold" style="box-shadow: none;">
                        <option value="Sáng">Ca Sáng</option>
                        <option value="Chiều">Ca Chiều</option>
                        <option value="Cả ngày">Cả ngày</option>
                        <option value="Nghỉ">Nghỉ trực</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer bg-light border-top py-3">
            <button type="button" class="btn btn-secondary py-2 px-4 font-weight-bold" style="border-radius: 8px;" @click="scheduleModalVisible = false">Đóng</button>
            <button type="button" class="btn text-white py-2 px-4 font-weight-bold" style="background-color: #0f766e; border: none; border-radius: 8px;" @click="saveDoctorSchedule(selectedDoctorSchedule)">Lưu ca trực</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Doctor Edit/Add Form Modal -->
    <div v-if="doctorModalVisible && editingDoctor" class="modal d-block text-left" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.4); z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-light py-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 class="modal-title font-weight-bold text-dark">
              {{ doctorModalMode === 'add' ? 'Thêm Bác Sĩ Mới Vào Hệ Thống' : 'Chi Tiết Bác Sĩ - ' + editingDoctor.name }}
            </h5>
            <button type="button" class="close border-0 bg-transparent" @click="doctorModalVisible = false" style="outline: none;">
              <span aria-hidden="true" style="font-size: 24px; color: #64748b;">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4 bg-white" style="max-height: 70vh; overflow-y: auto;">
            <form @submit.prevent="saveDoctor(editingDoctor)">
              <div class="row">
                <!-- Avatar display only in edit mode -->
                <div v-if="doctorModalMode === 'edit'" class="col-md-3 mb-4 text-center">
                  <div 
                    class="rounded-circle mx-auto overflow-hidden bg-light border shadow-sm mb-3" 
                    style="width: 100px; height: 100px;"
                    v-html="getAvatarSvg(editingDoctor.gender)"
                  ></div>
                  <div class="badge badge-pill badge-light px-3 py-1.5 border font-weight-bold text-secondary" style="font-size: 11.5px; background-color: #f1f5f9;">
                    Mã bác sĩ: {{ editingDoctor.code }}
                  </div>
                </div>

                <!-- Form fields -->
                <div :class="doctorModalMode === 'edit' ? 'col-md-9' : 'col-12'">
                  <div class="row">
                    <!-- Mã số bác sĩ (editable in add, readonly in edit) -->
                    <div v-if="doctorModalMode === 'add'" class="col-md-4 form-group mb-3 text-left">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Mã số bác sĩ *</label>
                      <input type="text" class="form-control" v-model="editingDoctor.code" placeholder="Ví dụ: 12..." required>
                    </div>
                    
                    <!-- Họ tên -->
                    <div :class="doctorModalMode === 'add' ? 'col-md-8' : 'col-md-6'" class="form-group mb-3 text-left">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Họ tên bác sĩ *</label>
                      <input type="text" class="form-control" v-model="editingDoctor.name" placeholder="Ví dụ: BS. Nguyễn Văn A..." required>
                    </div>

                    <!-- Chuyên khoa -->
                    <div class="col-md-6 form-group mb-3 text-left">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Chuyên khoa *</label>
                      <input type="text" class="form-control" v-model="editingDoctor.specialty" placeholder="Ví dụ: Tim mạch, Nhi khoa..." required>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 form-group mb-3 text-left">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Điện thoại</label>
                      <input type="text" class="form-control" v-model="editingDoctor.phone" placeholder="Ví dụ: 0912...">
                    </div>
                    <div class="col-md-6 form-group mb-3 text-left">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Email</label>
                      <input type="email" class="form-control" v-model="editingDoctor.email" placeholder="Ví dụ: bacsi@hospital.test...">
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-4 form-group mb-3 text-left">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Giới tính</label>
                      <select class="form-control" v-model="editingDoctor.gender">
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                    <div class="col-md-4 form-group mb-3 text-left">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Kinh nghiệm</label>
                      <input type="text" class="form-control" v-model="editingDoctor.experience" placeholder="Ví dụ: 5 năm...">
                    </div>
                    <div class="col-md-4 form-group mb-3 text-left">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Trạng thái</label>
                      <select class="form-control" v-model="editingDoctor.status">
                        <option value="active">Đang công tác</option>
                        <option value="inactive">Tạm nghỉ / Nghỉ việc</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group mb-0 text-left">
                    <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Giới thiệu / Bio</label>
                    <textarea class="form-control" rows="3" v-model="editingDoctor.bio" placeholder="Giới thiệu chuyên môn của bác sĩ..." style="border-radius: 8px; font-size: 13px;"></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer bg-light border-top py-3 d-flex justify-content-between align-items-center">
            <!-- Left Delete button -->
            <div>
              <button v-if="doctorModalMode === 'edit'" type="button" class="btn btn-outline-danger py-2 px-3 font-weight-bold d-flex align-items-center" style="font-size: 13px; border-radius: 8px;" @click="deleteDoctor(editingDoctor.code)">
                <i class="far fa-trash-alt mr-2"></i> Xóa bác sĩ
              </button>
            </div>

            <!-- Right Cancel/Save buttons -->
            <div>
              <button type="button" class="btn btn-secondary py-2 px-4 font-weight-bold mr-2" style="font-size: 13px; border-radius: 8px;" @click="doctorModalVisible = false">Hủy bỏ</button>
              <button type="button" class="btn text-white py-2 px-4 font-weight-bold" style="font-size: 13px; background-color: #0f766e; border: none; border-radius: 8px;" @click="saveDoctor(editingDoctor)">
                {{ doctorModalMode === 'add' ? 'Lưu thông tin' : 'Cập nhật hồ sơ' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fab-btn:hover {
  transform: scale(1.1);
  background-color: #115e59 !important;
}
.btn-schedule:hover {
  background-color: #ccfbf1 !important;
}
.btn-detail:hover {
  background-color: #f1f5f9 !important;
}
</style>
