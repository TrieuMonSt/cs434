const { createApp, ref, computed, onMounted } = Vue;

const app = createApp({
  setup() {
    // Current active navigation tab (Default to Doctor Management)
    const activeTab = ref('bac-si');

    // Sidebar items configuration
    const menuItems = [
      { key: 'tong-quan', label: 'Tổng Quan' },
      { key: 'kham-benh', label: 'Khám Bệnh', hasDropdown: true },
      { key: 'benh-nhan', label: 'Bệnh Nhân' },
      { key: 'noi-tru', label: 'Nội Trú', hasDropdown: true },
      { key: 'bac-si', label: 'Bác Sĩ' },
      { key: 'kho-thuoc', label: 'Kho Thuốc' },
      { key: 'dich-vu', label: 'Dịch Vụ' },
      { key: 'phong-ban', label: 'Phòng Ban' },
      { key: 'phan-quyen', label: 'Phân Quyền' },
      { key: 'ho-so', label: 'Hồ Sơ' }
    ];

    // Global Toast Notification System
    const toastMessage = ref('');
    const triggerToast = (msg) => {
      toastMessage.value = msg;
      setTimeout(() => {
        toastMessage.value = '';
      }, 3000);
    };

    // ----------------------------------------------------
    // DOCTOR MANAGEMENT SECTION STATE & METHODS
    // ----------------------------------------------------
    const doctors = ref(initialDoctors);
    const doctorSearchInput = ref('');
    const activeDoctorSearchQuery = ref('');
    const doctorCurrentPage = ref(1);
    const doctorItemsPerPage = 10;

    // Doctor edit/add modal state
    const doctorModalVisible = ref(false);
    const doctorModalMode = ref('edit'); // 'add' or 'edit'
    const editingDoctor = ref(null);

    const selectedDoctorSchedule = ref(null);
    const doctorScheduleModalVisible = ref(false);

    // Search Computed
    const filteredDoctors = computed(() => {
      const query = activeDoctorSearchQuery.value.trim().toLowerCase();
      if (!query) return doctors.value;
      return doctors.value.filter(doc => 
        doc.name.toLowerCase().includes(query) || 
        doc.code.toLowerCase().includes(query) ||
        doc.specialty.toLowerCase().includes(query)
      );
    });

    // Pagination details
    const doctorTotalPages = computed(() => {
      return Math.max(1, Math.ceil(filteredDoctors.value.length / doctorItemsPerPage));
    });

    const paginatedDoctors = computed(() => {
      const start = (doctorCurrentPage.value - 1) * doctorItemsPerPage;
      const end = start + doctorItemsPerPage;
      return filteredDoctors.value.slice(start, end);
    });

    const doctorStartIndex = computed(() => {
      if (filteredDoctors.value.length === 0) return 0;
      return (doctorCurrentPage.value - 1) * doctorItemsPerPage + 1;
    });

    const doctorEndIndex = computed(() => {
      return Math.min(doctorCurrentPage.value * doctorItemsPerPage, filteredDoctors.value.length);
    });

    const handleDoctorSearch = () => {
      activeDoctorSearchQuery.value = doctorSearchInput.value;
      doctorCurrentPage.value = 1;
    };

    const handleClearDoctorSearch = () => {
      doctorSearchInput.value = '';
      activeDoctorSearchQuery.value = '';
      doctorCurrentPage.value = 1;
    };

    const prevDoctorPage = () => {
      if (doctorCurrentPage.value > 1) doctorCurrentPage.value--;
    };

    const nextDoctorPage = () => {
      if (doctorCurrentPage.value < doctorTotalPages.value) doctorCurrentPage.value++;
    };

    // Open Doctor Form modal in Edit mode
    const openDoctorDetailModal = (doctor) => {
      editingDoctor.value = JSON.parse(JSON.stringify(doctor));
      doctorModalMode.value = 'edit';
      doctorModalVisible.value = true;
    };

    // Open Doctor Form modal in Add mode
    const openAddDoctorModal = () => {
      const maxCode = doctors.value.reduce((max, doc) => {
        const codeNum = parseInt(doc.code);
        return isNaN(codeNum) ? max : Math.max(max, codeNum);
      }, 0);

      editingDoctor.value = {
        code: String(maxCode + 1).padStart(2, '0'),
        name: '',
        specialty: '',
        email: '',
        phone: '',
        experience: '5 năm',
        gender: 'Nữ',
        status: 'active',
        bio: '',
        schedule: {
          Monday: 'Sáng', Tuesday: 'Chiều', Wednesday: 'Sáng', Thursday: 'Chiều', Friday: 'Sáng', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
        }
      };
      doctorModalMode.value = 'add';
      doctorModalVisible.value = true;
    };

    // Form submit controller
    const saveDoctor = (updatedDoctor) => {
      if (doctorModalMode.value === 'add') {
        createDoctor(updatedDoctor);
      } else {
        saveDoctorDetail(updatedDoctor);
      }
    };

    // Edit Detail save method
    const saveDoctorDetail = (updatedDoc) => {
      if (!updatedDoc.name.trim()) {
        alert('Họ tên bác sĩ không được để trống.');
        return;
      }
      if (!updatedDoc.code.trim()) {
        alert('Mã số bác sĩ không được để trống.');
        return;
      }
      const idx = doctors.value.findIndex(d => d.code === updatedDoc.code);
      if (idx !== -1) {
        doctors.value[idx] = { ...updatedDoc };
        triggerToast(`Cập nhật hồ sơ bác sĩ thành công: ${updatedDoc.name}`);
      }
      doctorModalVisible.value = false;
    };

    // Add new doctor save method
    const createDoctor = (newDoc) => {
      if (!newDoc.name.trim()) {
        alert('Họ tên bác sĩ không được để trống.');
        return;
      }
      if (!newDoc.specialty.trim()) {
        alert('Chuyên khoa không được để trống.');
        return;
      }
      if (!newDoc.code.trim()) {
        alert('Mã số bác sĩ không được để trống.');
        return;
      }

      const exists = doctors.value.some(d => d.code === newDoc.code);
      if (exists) {
        alert(`Mã số bác sĩ "${newDoc.code}" đã được sử dụng. Vui lòng chọn mã khác.`);
        return;
      }

      doctors.value.push({ ...newDoc });
      triggerToast(`Thêm bác sĩ mới thành công: ${newDoc.name}`);
      doctorModalVisible.value = false;
    };

    // Delete Doctor
    const deleteDoctor = (code) => {
      const docToDelete = doctors.value.find(d => d.code === code);
      if (!docToDelete) return;
      if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ bác sĩ: ${docToDelete.name}?`)) {
        doctors.value = doctors.value.filter(d => d.code !== code);
        triggerToast(`Đã xóa hồ sơ bác sĩ: ${docToDelete.name}`);
        doctorModalVisible.value = false;
        if (doctorCurrentPage.value > doctorTotalPages.value) {
          doctorCurrentPage.value = doctorTotalPages.value;
        }
      }
    };

    const openScheduleModal = (doctor) => {
      selectedDoctorSchedule.value = JSON.parse(JSON.stringify(doctor));
      doctorScheduleModalVisible.value = true;
    };

    const saveDoctorSchedule = (updatedDoc) => {
      const idx = doctors.value.findIndex(d => d.code === updatedDoc.code);
      if (idx !== -1) {
        doctors.value[idx].schedule = { ...updatedDoc.schedule };
        triggerToast(`Đã cập nhật lịch làm việc của bác sĩ: ${updatedDoc.name}`);
      }
      doctorScheduleModalVisible.value = false;
    };

    // Avatar drawing helper
    const getAvatarSvg = (gender) => {
      if (gender === 'Nữ') {
        return `
          <svg viewBox="0 0 100 100" class="w-100 h-100">
            <circle cx="50" cy="50" r="48" fill="#ffe4e6" />
            <circle cx="50" cy="28" r="14" fill="#a1a1aa" />
            <circle cx="50" cy="18" r="8" fill="#71717a" />
            <rect x="44" y="45" width="12" height="15" fill="#fbcfe8" rx="2" />
            <circle cx="50" cy="38" r="16" fill="#fbcfe8" />
            <path d="M34 32 C38 22, 62 22, 66 32 C62 26, 38 26, 34 32 Z" fill="#71717a" />
            <circle cx="43" cy="36" r="5" fill="none" stroke="#27272a" stroke-width="1.8" />
            <circle cx="57" cy="36" r="5" fill="none" stroke="#27272a" stroke-width="1.8" />
            <line x1="48" y1="36" x2="52" y2="36" stroke="#27272a" stroke-width="1.8" />
            <path d="M36 38 C36 48, 64 48, 64 38 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
            <rect x="42" y="40" width="16" height="6" fill="#0d9488" rx="1" opacity="0.8" />
            <path d="M25 75 C25 60, 35 55, 50 55 C65 55, 75 60, 75 75 Z" fill="#0d9488" />
            <path d="M42 55 L50 63 L58 55" fill="none" stroke="#ffffff" stroke-width="2" />
            <path d="M36 58 C36 68, 64 68, 64 58" fill="none" stroke="#94a3b8" stroke-width="2.5" />
            <circle cx="50" cy="70" r="3" fill="#64748b" />
          </svg>
        `;
      } else {
        return `
          <svg viewBox="0 0 100 100" class="w-100 h-100">
            <circle cx="50" cy="50" r="48" fill="#e0f2fe" />
            <path d="M32 30 C32 16, 68 16, 68 30 Z" fill="#3f3f46" />
            <rect x="44" y="45" width="12" height="15" fill="#fbcfe8" rx="2" />
            <circle cx="50" cy="38" r="16" fill="#fbcfe8" />
            <path d="M34 30 L34 38 L37 38 L37 30 Z" fill="#3f3f46" />
            <path d="M66 30 L66 38 L63 38 L63 30 Z" fill="#3f3f46" />
            <rect x="38" y="33" width="9" height="6" rx="1.2" fill="none" stroke="#27272a" stroke-width="1.8" />
            <rect x="53" y="33" width="9" height="6" rx="1.2" fill="none" stroke="#27272a" stroke-width="1.8" />
            <line x1="47" y1="36" x2="53" y2="36" stroke="#27272a" stroke-width="1.8" />
            <path d="M36 38 C36 48, 64 48, 64 38 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
            <rect x="42" y="40" width="16" height="6" fill="#0f766e" rx="1" opacity="0.8" />
            <path d="M25 75 C25 60, 35 55, 50 55 C65 55, 75 60, 75 75 Z" fill="#0f766e" />
            <path d="M42 55 L50 63 L58 55" fill="none" stroke="#ffffff" stroke-width="2" />
            <path d="M36 58 C36 68, 64 68, 64 58" fill="none" stroke="#94a3b8" stroke-width="2.5" />
            <circle cx="50" cy="70" r="3" fill="#64748b" />
          </svg>
        `;
      }
    };

    return {
      activeTab, menuItems, toastMessage,
      // Doctors
      doctors, doctorSearchInput, activeDoctorSearchQuery, doctorCurrentPage, doctorItemsPerPage,
      doctorModalVisible, doctorModalMode, editingDoctor, saveDoctor,
      selectedDoctorSchedule, doctorScheduleModalVisible, doctorStartIndex, doctorEndIndex,
      filteredDoctors, doctorTotalPages, paginatedDoctors, handleDoctorSearch, handleClearDoctorSearch, prevDoctorPage, nextDoctorPage,
      openDoctorDetailModal, deleteDoctor, openScheduleModal, saveDoctorSchedule, openAddDoctorModal, getAvatarSvg
    };
  }
});

// Components definition to make index.html extremely lightweight
app.component('doctor-schedule-modal', {
  props: ['doctor'],
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const localDoctor = ref(JSON.parse(JSON.stringify(props.doctor)));
    const save = () => {
      emit('save', localDoctor.value);
    };
    return { localDoctor, save };
  },
  template: `
    <div class="modal d-block text-left overlay-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg modal-content-custom">
          <div class="modal-header bg-light py-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 class="modal-title font-weight-bold text-dark modal-title-font">
              Lịch Làm Việc Hàng Tuần - {{ localDoctor.name }}
            </h5>
            <button type="button" class="close" @click="$emit('close')" aria-label="Close" style="outline: none;">
              <span aria-hidden="true" style="font-size: 24px; color: #64748b;">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4 bg-white">
            <div class="alert alert-info border-0 rounded-lg py-2.5 px-3 mb-4" style="background-color: #e0f2fe; color: #0369a1; font-size: 13px;">
              <i class="fas fa-info-circle mr-2"></i> Thiết lập ca trực hàng tuần của bác sĩ. Ca Sáng (08:00 - 12:00) | Ca Chiều (13:30 - 17:30) | Nghỉ.
            </div>

            <div class="table-responsive">
              <table class="table table-bordered text-center mb-0" style="font-size: 13.5px; vertical-align: middle;">
                <thead class="bg-light text-secondary">
                  <tr>
                    <th>Ngày trong tuần</th>
                    <th style="width: 250px;">Ca làm việc</th>
                    <th>Ghi chú thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(day, dayKey) in { Monday: 'Thứ Hai', Tuesday: 'Thứ Ba', Wednesday: 'Thứ Tư', Thursday: 'Thứ Năm', Friday: 'Thứ Sáu', Saturday: 'Thứ Bảy', Sunday: 'Chủ Nhật' }" 
                    :key="dayKey"
                  >
                    <td class="font-weight-bold text-dark align-middle">{{ day }}</td>
                    <td class="align-middle">
                      <select 
                        class="form-control form-control-sm border" 
                        v-model="localDoctor.schedule[dayKey]"
                        style="height: 34px; border-radius: 6px; font-size: 13px;"
                      >
                        <option value="Sáng">Ca Sáng</option>
                        <option value="Chiều">Ca Chiều</option>
                        <option value="Cả Ngày">Cả Ngày</option>
                        <option value="Nghỉ">Nghỉ trực</option>
                      </select>
                    </td>
                    <td class="align-middle text-secondary" style="font-size: 12.5px;">
                      <span v-if="localDoctor.schedule[dayKey] === 'Sáng'" class="badge badge-success px-2.5 py-1">08:00 SA - 12:00 CH</span>
                      <span v-else-if="localDoctor.schedule[dayKey] === 'Chiều'" class="badge badge-primary px-2.5 py-1">01:30 CH - 05:30 CH</span>
                      <span v-else-if="localDoctor.schedule[dayKey] === 'Cả Ngày'" class="badge badge-info px-2.5 py-1">08:00 SA - 05:30 CH</span>
                      <span v-else class="badge badge-light text-muted px-2.5 py-1" style="background-color: #f1f5f9;">Không có ca trực</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer bg-light border-top py-3">
            <button type="button" class="btn btn-secondary py-2 px-4 font-weight-bold" style="font-size: 13px; border-radius: 8px;" @click="$emit('close')">Đóng</button>
            <button type="button" class="btn text-white py-2 px-4 font-weight-bold" style="font-size: 13px; background-color: #0f766e; border: none; border-radius: 8px;" @click="save">Lưu ca trực</button>
          </div>
        </div>
      </div>
    </div>
  `
});

app.component('doctor-form-modal', {
  props: ['mode', 'doctor', 'getAvatarSvg'],
  emits: ['close', 'save', 'delete'],
  setup(props, { emit }) {
    const localDoctor = ref(JSON.parse(JSON.stringify(props.doctor)));
    const save = () => {
      emit('save', localDoctor.value);
    };
    return { localDoctor, save };
  },
  template: `
    <div class="modal d-block text-left overlay-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg modal-content-custom">
          <div class="modal-header bg-light py-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 class="modal-title font-weight-bold text-dark modal-title-font">
              {{ mode === 'add' ? 'Thêm Bác Sĩ Mới Vào Hệ Thống' : 'Chi Tiết Bác Sĩ - ' + localDoctor.name }}
            </h5>
            <button type="button" class="close" @click="$emit('close')" aria-label="Close" style="outline: none;">
              <span aria-hidden="true" style="font-size: 24px; color: #64748b;">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4 bg-white" style="max-height: 70vh; overflow-y: auto;">
            
            <form @submit.prevent="save">
              <div class="row">
                <!-- Avatar display only in edit mode -->
                <div v-if="mode === 'edit'" class="col-md-3 mb-4 text-center">
                  <div 
                    class="rounded-circle mx-auto overflow-hidden bg-light border shadow-sm mb-3" 
                    style="width: 100px; height: 100px;"
                    v-html="getAvatarSvg(localDoctor.gender)"
                  ></div>
                  <div class="badge badge-pill badge-light px-3 py-1.5 border font-weight-bold text-secondary" style="font-size: 11.5px;">
                    Mã bác sĩ: {{ localDoctor.code }}
                  </div>
                </div>

                <!-- Form fields col-9 in edit mode, col-12 in add mode -->
                <div :class="mode === 'edit' ? 'col-md-9' : 'col-12'">
                  <div class="row">
                    <!-- Mã số bác sĩ (editable in add, hidden/readonly in edit) -->
                    <div v-if="mode === 'add'" class="col-md-4 form-group mb-3">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Mã số bác sĩ *</label>
                      <input type="text" class="form-control form-input" v-model="localDoctor.code" placeholder="Ví dụ: 12...">
                    </div>
                    
                    <!-- Họ tên -->
                    <div :class="mode === 'add' ? 'col-md-8' : 'col-md-6'" class="form-group mb-3">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Họ tên bác sĩ *</label>
                      <input type="text" class="form-control form-input" v-model="localDoctor.name" placeholder="Ví dụ: BS. Nguyễn Văn A...">
                    </div>

                    <!-- Chuyên khoa -->
                    <div class="col-md-6 form-group mb-3">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Chuyên khoa *</label>
                      <input type="text" class="form-control form-input" v-model="localDoctor.specialty" placeholder="Ví dụ: Tim mạch, Nhi khoa...">
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 form-group mb-3">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Điện thoại</label>
                      <input type="text" class="form-control form-input" v-model="localDoctor.phone" placeholder="Ví dụ: 0912...">
                    </div>
                    <div class="col-md-6 form-group mb-3">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Email</label>
                      <input type="email" class="form-control form-input" v-model="localDoctor.email" placeholder="Ví dụ: bacsi@hospital.test...">
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-4 form-group mb-3">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Giới tính</label>
                      <select class="form-control form-input" v-model="localDoctor.gender">
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                    <div class="col-md-4 form-group mb-3">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Kinh nghiệm</label>
                      <input type="text" class="form-control form-input" v-model="localDoctor.experience" placeholder="Ví dụ: 5 năm...">
                    </div>
                    <div class="col-md-4 form-group mb-3">
                      <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Trạng thái</label>
                      <select class="form-control form-input" v-model="localDoctor.status">
                        <option value="active">Đang công tác</option>
                        <option value="inactive">Tạm nghỉ / Nghỉ việc</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group mb-0">
                    <label class="font-weight-bold text-secondary mb-1" style="font-size: 12.5px;">Giới thiệu / Bio</label>
                    <textarea class="form-control" rows="3" v-model="localDoctor.bio" placeholder="Giới thiệu chuyên môn của bác sĩ..." style="border-radius: 8px; font-size: 13px;"></textarea>
                  </div>
                </div>
              </div>
            </form>

          </div>
          <div class="modal-footer bg-light border-top py-3 d-flex justify-content-between align-items-center">
            <!-- Left Delete button -->
            <div>
              <button v-if="mode === 'edit'" type="button" class="btn btn-outline-danger py-2 px-3 font-weight-bold d-flex align-items-center" style="font-size: 13px; border-radius: 8px;" @click="$emit('delete', localDoctor.code)">
                <i class="far fa-trash-alt mr-2"></i> Xóa bác sĩ
              </button>
            </div>

            <!-- Right Cancel/Save buttons -->
            <div>
              <button type="button" class="btn btn-secondary py-2 px-4 font-weight-bold mr-2" style="font-size: 13px; border-radius: 8px;" @click="$emit('close')">Hủy bỏ</button>
              <button type="button" class="btn text-white py-2 px-4 font-weight-bold" style="font-size: 13px; background-color: #0f766e; border: none; border-radius: 8px;" @click="save">
                {{ mode === 'add' ? 'Lưu thông tin' : 'Cập nhật hồ sơ' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});

app.mount('#app');
