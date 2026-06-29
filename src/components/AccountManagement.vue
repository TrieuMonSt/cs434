<script setup>
import { ref, computed } from 'vue';

// Filter inputs
const searchQuery = ref('');
const roleFilter = ref('all');
const statusFilter = ref('all');

// Activity History panel open
const showHistoryPanel = ref(true);

// Account List Data
const accounts = ref([
  {
    id: 1,
    name: 'Nguyễn Văn Hùng',
    email: 'hung.nv@mediflow.vn',
    initials: 'NH',
    role: 'Bác sĩ chuyên khoa',
    permissions: ['Khám bệnh', 'Kê đơn'],
    status: 'active', // 'active', 'locked'
    statusText: 'Đang hoạt động',
    avatarBg: '#cffafe', // cyan-100
    avatarColor: '#0891b2' // cyan-600
  },
  {
    id: 2,
    name: 'Trần Thị Lan',
    email: 'lan.tt@mediflow.vn',
    initials: 'TL',
    role: 'Điều dưỡng',
    permissions: ['Xem hồ sơ', 'Cập nhật chỉ số'],
    status: 'locked',
    statusText: 'Đã khóa',
    avatarBg: '#e5e7eb', // grey-200
    avatarColor: '#4b5563' // grey-600
  },
  {
    id: 3,
    name: 'Phạm Văn Vinh',
    email: 'vinh.pv@mediflow.vn',
    initials: 'PV',
    role: 'Quản trị viên',
    permissions: ['Toàn quyền', 'Cài đặt hệ thống'],
    status: 'active',
    statusText: 'Đang hoạt động',
    avatarBg: '#dcfce7', // green-100
    avatarColor: '#16a34a' // green-600
  }
]);

// Computed filtered accounts
const filteredAccounts = computed(() => {
  return accounts.value.filter(item => {
    // Search filter
    const query = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query);

    // Role filter
    const matchesRole = roleFilter.value === 'all' || 
      (roleFilter.value === 'doctor' && item.role.includes('Bác sĩ')) ||
      (roleFilter.value === 'nurse' && item.role.includes('Điều dưỡng')) ||
      (roleFilter.value === 'admin' && item.role.includes('Quản trị'));

    // Status filter
    const matchesStatus = statusFilter.value === 'all' || 
      item.status === statusFilter.value;

    return matchesSearch && matchesRole && matchesStatus;
  });
});

// Logs Data
const logs = ref([
  {
    id: 1,
    type: 'permission',
    title: 'Bạn đã thay đổi quyền hạn cho Nguyễn Văn Hùng',
    time: '10:45 AM',
    detail: 'Cấp quyền "Kê đơn"',
    date: 'Hôm nay - 24/05/2026',
    icon: 'fas fa-shield-alt',
    iconBg: '#e0f2fe',
    iconColor: '#0284c7'
  },
  {
    id: 2,
    type: 'lock',
    title: 'Bạn đã khóa tài khoản Trần Thị Lan',
    time: '09:12 AM',
    detail: 'Lý do: Vi phạm bảo mật',
    date: 'Hôm nay - 24/05/2026',
    icon: 'fas fa-user-lock',
    iconBg: '#fee2e2',
    iconColor: '#dc2626'
  },
  {
    id: 3,
    type: 'login',
    title: 'Đăng nhập từ IP: 113.190.231.xx',
    time: '08:05 AM',
    detail: 'Chrome trên Windows',
    date: 'Hôm nay - 24/05/2026',
    icon: 'fas fa-info-circle',
    iconBg: '#f3f4f6',
    iconColor: '#4b5563'
  },
  {
    id: 4,
    type: 'create',
    title: 'Tạo mới tài khoản Lê Minh Tuấn',
    time: '04:30 PM',
    detail: 'Vai trò: Kỹ thuật viên',
    date: 'Hôm qua - 23/05/2026',
    icon: 'fas fa-user-plus',
    iconBg: '#dcfce7',
    iconColor: '#16a34a'
  }
]);

// Group logs by date
const groupedLogs = computed(() => {
  const groups = {};
  logs.value.forEach(log => {
    if (!groups[log.date]) {
      groups[log.date] = [];
    }
    groups[log.date].push(log);
  });
  return groups;
});

// Create Account Modal state
const showModal = ref(false);
const newAccount = ref({
  name: '',
  email: '',
  role: 'Bác sĩ chuyên khoa',
  permissionsStr: '',
  status: 'active'
});

const handleCreate = () => {
  if (!newAccount.value.name.trim() || !newAccount.value.email.trim()) return;

  const permissions = newAccount.value.permissionsStr
    ? newAccount.value.permissionsStr.split(',').map(s => s.trim())
    : ['Xem hồ sơ'];

  accounts.value.push({
    id: Date.now(),
    name: newAccount.value.name,
    email: newAccount.value.email,
    initials: newAccount.value.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    role: newAccount.value.role,
    permissions: permissions,
    status: newAccount.value.status,
    statusText: newAccount.value.status === 'active' ? 'Đang hoạt động' : 'Đã khóa',
    avatarBg: '#dcfce7',
    avatarColor: '#16a34a'
  });

  // Log action
  logs.value.unshift({
    id: Date.now(),
    type: 'create',
    title: `Tạo mới tài khoản ${newAccount.value.name}`,
    time: 'Vừa xong',
    detail: `Vai trò: ${newAccount.value.role}`,
    date: 'Hôm nay - 24/05/2026',
    icon: 'fas fa-user-plus',
    iconBg: '#dcfce7',
    iconColor: '#16a34a'
  });

  showModal.value = false;
  // reset
  newAccount.value = {
    name: '',
    email: '',
    role: 'Bác sĩ chuyên khoa',
    permissionsStr: '',
    status: 'active'
  };
};

const toggleLock = (account) => {
  const originalStatus = account.status;
  account.status = account.status === 'active' ? 'locked' : 'active';
  account.statusText = account.status === 'active' ? 'Đang hoạt động' : 'Đã khóa';
  
  if (account.status === 'locked') {
    account.avatarBg = '#e5e7eb';
    account.avatarColor = '#4b5563';
  } else {
    account.avatarBg = '#cffafe';
    account.avatarColor = '#0891b2';
  }

  // Log action
  logs.value.unshift({
    id: Date.now(),
    type: account.status === 'locked' ? 'lock' : 'unlock',
    title: `Bạn đã ${account.status === 'locked' ? 'khóa' : 'mở khóa'} tài khoản ${account.name}`,
    time: 'Vừa xong',
    detail: account.status === 'locked' ? 'Lý do: Thay đổi cấu hình' : 'Mở khóa truy cập',
    date: 'Hôm nay - 24/05/2026',
    icon: account.status === 'locked' ? 'fas fa-user-lock' : 'fas fa-user-check',
    iconBg: account.status === 'locked' ? '#fee2e2' : '#dcfce7',
    iconColor: account.status === 'locked' ? '#dc2626' : '#16a34a'
  });
};
</script>

<template>
  <div class="container-fluid px-4 py-4">
    <!-- Row combining main table and log panel -->
    <div class="row">
      <!-- Main Columns containing Account list -->
      <div :class="showHistoryPanel ? 'col-xl-9 col-lg-8' : 'col-12'" class="transition-all">
        <!-- Title and action buttons row -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h3 class="font-weight-bold mb-1 text-dark" style="font-family: 'Outfit', sans-serif;">Quản lý Tài khoản & Phân quyền</h3>
            <p class="text-muted mb-0" style="font-size: 13.5px;">Quản lý người dùng, vai trò và quyền truy cập hệ thống MediFlow.</p>
          </div>
          
          <div class="d-flex align-items-center mt-3 mt-md-0">
            <button class="btn btn-light border mr-2 font-weight-bold text-dark px-3 py-2" style="font-size: 13.5px; background: white;">
              <i class="fas fa-users-cog mr-2"></i> Phân quyền Nhóm
            </button>
            <button class="btn btn-dark font-weight-bold px-3 py-2" style="font-size: 13.5px; background-color: #0d9488; border-color: #0d9488;" @click="showModal = true">
              <i class="fas fa-user-plus mr-2"></i> Thêm Tài khoản Mới
            </button>
          </div>
        </div>

        <!-- Filter bar Card -->
        <div class="card border-0 shadow-sm rounded-lg mb-4">
          <div class="card-body p-3">
            <div class="row align-items-center">
              <!-- Search name/email -->
              <div class="col-lg-5 col-md-12 mb-3 mb-lg-0">
                <div class="position-relative">
                  <i class="fas fa-search position-absolute text-muted" style="left: 12px; top: 12px;"></i>
                  <input 
                    type="text" 
                    class="form-control pl-4 border-0 bg-light rounded" 
                    placeholder="Tìm theo tên, email hoặc số điện thoại..." 
                    style="height: 38px; font-size: 13px;"
                    v-model="searchQuery"
                  >
                </div>
              </div>
              <!-- Role dropdown -->
              <div class="col-lg-3 col-md-6 mb-3 mb-lg-0">
                <select class="form-control border-0 bg-light font-weight-bold" style="height: 38px; font-size: 13px;" v-model="roleFilter">
                  <option value="all">Tất cả Vai trò</option>
                  <option value="doctor">Bác sĩ chuyên khoa</option>
                  <option value="nurse">Điều dưỡng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              <!-- Status dropdown -->
              <div class="col-lg-3 col-md-6 mb-3 mb-lg-0">
                <select class="form-control border-0 bg-light font-weight-bold" style="height: 38px; font-size: 13px;" v-model="statusFilter">
                  <option value="all">Tất cả Trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="locked">Đã khóa</option>
                </select>
              </div>
              <!-- Toggle Log side panel button -->
              <div class="col-lg-1 col-md-12 text-lg-right">
                <button 
                  class="btn btn-light border bg-white" 
                  :class="{ active: showHistoryPanel }"
                  @click="showHistoryPanel = !showHistoryPanel" 
                  style="height: 38px; width: 38px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px;"
                  title="Nhật ký hoạt động"
                >
                  <i class="fas fa-history text-secondary"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Table Card list -->
        <div class="card border-0 shadow-sm rounded-lg mb-4">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0 text-left" style="font-size: 13.5px; vertical-align: middle;">
                <thead class="thead-light">
                  <tr class="text-uppercase" style="font-family: 'Outfit', sans-serif; font-size: 12px; letter-spacing: 0.5px;">
                    <th class="py-3 px-4" style="width: 40px;">
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="checkAll">
                        <label class="custom-control-label" for="checkAll"></label>
                      </div>
                    </th>
                    <th class="py-3">Họ tên & Email</th>
                    <th class="py-3">Vai trò</th>
                    <th class="py-3">Quyền hạn</th>
                    <th class="py-3">Trạng thái</th>
                    <th class="py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in filteredAccounts" :key="item.id">
                    <td class="py-3 px-4 align-middle">
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" :id="'chk-' + item.id">
                        <label class="custom-control-label" :for="'chk-' + item.id"></label>
                      </div>
                    </td>
                    <!-- Name & email block -->
                    <td class="py-3 align-middle">
                      <div class="d-flex align-items-center">
                        <div 
                          class="rounded-circle d-flex align-items-center justify-content-center font-weight-bold mr-3"
                          :style="{
                            width: '40px',
                            height: '40px',
                            backgroundColor: item.avatarBg,
                            color: item.avatarColor,
                            fontSize: '13.5px'
                          }"
                        >
                          {{ item.initials }}
                        </div>
                        <div>
                          <h6 class="font-weight-bold mb-0 text-dark">{{ item.name }}</h6>
                          <small class="text-muted">{{ item.email }}</small>
                        </div>
                      </div>
                    </td>
                    <!-- Role -->
                    <td class="py-3 align-middle font-weight-bold text-dark">{{ item.role }}</td>
                    
                    <!-- Permissions list badges -->
                    <td class="py-3 align-middle">
                      <div class="d-flex flex-wrap">
                        <span 
                          v-for="(p, pIdx) in item.permissions" 
                          :key="pIdx" 
                          class="badge badge-light border mr-1 mb-1 px-2 py-1"
                          style="font-size: 11px; font-weight: 500; border-radius: 6px;"
                        >
                          {{ p }}
                        </span>
                      </div>
                    </td>
                    <!-- Active Status -->
                    <td class="py-3 align-middle">
                      <span 
                        class="badge badge-pill px-3 py-2 font-weight-bold"
                        :style="{
                          backgroundColor: item.status === 'active' ? '#f0fdf4' : '#fef2f2',
                          color: item.status === 'active' ? '#16a34a' : '#dc2626'
                        }"
                      >
                        <i class="fas fa-circle mr-1" style="font-size: 8px;"></i>
                        {{ item.statusText }}
                      </span>
                    </td>
                    <!-- Action buttons -->
                    <td class="py-3 align-middle text-center">
                      <button class="btn btn-sm btn-link text-secondary mr-2" title="Chỉnh sửa quyền hạn">
                        <i class="fas fa-sliders-h"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-link mr-2" 
                        :class="item.status === 'active' ? 'text-danger' : 'text-success'"
                        :title="item.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'"
                        @click="toggleLock(item)"
                      >
                        <i :class="item.status === 'active' ? 'fas fa-user-lock' : 'fas fa-user-check'"></i>
                      </button>
                      <button class="btn btn-sm btn-link text-secondary" title="Sửa thông tin">
                        <i class="fas fa-pencil-alt"></i>
                      </button>
                    </td>
                  </tr>

                  <!-- Empty result check -->
                  <tr v-if="filteredAccounts.length === 0">
                    <td colspan="6" class="text-center py-5 text-muted">
                      <i class="fas fa-user-slash fa-2x mb-3 text-secondary" style="opacity: 0.5;"></i>
                      <p class="mb-0">Không tìm thấy tài khoản nào khớp với dữ liệu lọc.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Table pagination block -->
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center p-4 border-top">
              <small class="text-muted mb-3 mb-sm-0">
                Hiển thị 1-{{ filteredAccounts.length }} trên tổng số 42 tài khoản
              </small>
              <nav aria-label="Table navigation">
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item disabled"><span class="page-link border-0 text-secondary">&laquo;</span></li>
                  <li class="page-item active"><a class="page-link border-0 text-white rounded" style="background-color: #0d9488;" href="#">1</a></li>
                  <li class="page-item"><a class="page-link border-0 text-secondary" href="#">2</a></li>
                  <li class="page-item"><a class="page-link border-0 text-secondary" href="#">3</a></li>
                  <li class="page-item disabled"><span class="page-link border-0 text-secondary">...</span></li>
                  <li class="page-item"><a class="page-link border-0 text-secondary" href="#" aria-label="Next">&raquo;</a></li>
                </ul>
              </nav>
            </div>

          </div>
        </div>

      </div>

      <!-- Right Column containing Activity History (Sidebar log panel) -->
      <div v-if="showHistoryPanel" class="col-xl-3 col-lg-4 pl-lg-0 border-left bg-white shadow-sm" style="min-height: calc(100vh - 100px);">
        <div class="d-flex justify-content-between align-items-center p-3 text-white" style="background-color: #0f766e; margin: -1.5rem -1rem 1.5rem -1rem;">
          <h6 class="font-weight-bold mb-0">
            <i class="fas fa-history mr-2"></i> Lịch sử Hoạt động
          </h6>
          <button type="button" class="close text-white" style="outline: none;" @click="showHistoryPanel = false">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <!-- History Timeline Container -->
        <div class="px-2" style="max-height: 600px; overflow-y: auto;">
          <div v-for="(logGroup, date) in groupedLogs" :key="date" class="mb-4">
            <h6 class="text-uppercase text-secondary font-weight-bold mb-3" style="font-size: 11px; letter-spacing: 0.5px;">
              {{ date }}
            </h6>

            <!-- Items -->
            <div class="d-flex flex-column">
              <div v-for="log in logGroup" :key="log.id" class="d-flex mb-3 border-bottom pb-2">
                <!-- Icon box -->
                <div 
                  class="rounded-circle d-flex align-items-center justify-content-center mr-3 flex-shrink-0"
                  :style="{
                    width: '32px',
                    height: '32px',
                    backgroundColor: log.iconBg,
                    color: log.iconColor
                  }"
                >
                  <i :class="log.icon" style="font-size: 13px;"></i>
                </div>
                <!-- Text box -->
                <div class="text-left">
                  <p class="mb-1 text-dark font-weight-bold" style="font-size: 12.5px; line-height: 16px;">
                    {{ log.title }}
                  </p>
                  <p class="mb-0 text-muted" style="font-size: 11px;">
                    {{ log.time }} &bull; {{ log.detail }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Link button inside sidebar log -->
        <div class="p-3 mt-4">
          <button class="btn btn-block btn-light border font-weight-bold text-secondary" style="font-size: 12px; height: 38px;">
            Xem tất cả nhật ký
          </button>
        </div>
      </div>
    </div>

    <!-- Create Account Modal Form -->
    <div v-if="showModal" class="modal d-block" style="background: rgba(0, 0, 0, 0.5); z-index: 1040;" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
          <div class="modal-header bg-light py-3 border-bottom">
            <h5 class="modal-title font-weight-bold text-dark" style="font-size: 16px;">Thêm Tài Khoản Nhân Viên Mới</h5>
            <button type="button" class="close" @click="showModal = false" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4 text-left">
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Họ tên nhân viên *</label>
              <input type="text" class="form-control" placeholder="Ví dụ: Trần Thị Lan..." v-model="newAccount.name">
            </div>
            
            <div class="form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Email tài khoản *</label>
              <input type="email" class="form-control" placeholder="lan.tt@mediflow.vn..." v-model="newAccount.email">
            </div>

            <div class="row">
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Vai trò</label>
                <select class="form-control" v-model="newAccount.role">
                  <option value="Bác sĩ chuyên khoa">Bác sĩ chuyên khoa</option>
                  <option value="Điều dưỡng">Điều dưỡng</option>
                  <option value="Quản trị viên">Quản trị viên</option>
                </select>
              </div>
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Trạng thái khởi tạo</label>
                <select class="form-control" v-model="newAccount.status">
                  <option value="active">Kích hoạt ngay</option>
                  <option value="locked">Khóa tạm thời</option>
                </select>
              </div>
            </div>

            <div class="form-group mb-0">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Quyền hạn (phân tách bằng dấu phẩy)</label>
              <input type="text" class="form-control" placeholder="Ví dụ: Xem hồ sơ, Cập nhật chỉ số..." v-model="newAccount.permissionsStr">
            </div>
          </div>
          <div class="modal-footer bg-light border-top py-3">
            <button type="button" class="btn btn-secondary py-2 px-4 font-weight-bold" style="font-size: 13px;" @click="showModal = false">Đóng</button>
            <button type="button" class="btn btn-dark py-2 px-4 font-weight-bold" style="font-size: 13px; background-color: #0d9488; border-color: #0d9488;" @click="handleCreate">Lưu thông tin</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>
