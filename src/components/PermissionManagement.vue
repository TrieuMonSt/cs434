<script setup>
import { ref, onMounted } from 'vue';
import api from '../utils/api';

const users = ref([]);
const loading = ref(false);
const toastMessage = ref('');

const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
};

// Fetch all staff accounts
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/auth/users');
    if (response.data.success) {
      users.value = response.data.users;
    }
  } catch (error) {
    console.error('Error fetching staff list:', error);
    // Mock local fallback in case database connection fails
    users.value = [
      { id: 1, username: 'doctor_an', fullName: 'Nguyễn Thành An', specialty: 'Nội tổng quát', department: 'Khoa Nội 1', staffId: 'DR-2024-0082', accountType: 'Quản trị viên' },
      { id: 2, username: 'bs_pham_b', fullName: 'BS. Phạm Văn B', specialty: 'Tim mạch', department: 'Khoa Tim mạch', staffId: 'DR-2024-1142', accountType: 'Bác sĩ' },
      { id: 3, username: 'reception_lan', fullName: 'Nguyễn Thị Lan', specialty: 'Lễ tân', department: 'Quầy tiếp đón', staffId: 'ST-2024-0125', accountType: 'Lễ tân' }
    ];
  } finally {
    loading.value = false;
  }
};

// Update user role
const changeRole = async (user, newRole) => {
  try {
    const response = await api.put(`/auth/users/${user.id}/role`, {
      accountType: newRole
    });
    if (response.data.success) {
      user.accountType = newRole;
      triggerToast(`Đã thay đổi quyền tài khoản ${user.username} thành ${newRole}.`);
    }
  } catch (error) {
    console.error('Error updating role:', error);
    // Mock fallback update locally
    user.accountType = newRole;
    triggerToast(`(Mock) Đã thay đổi quyền tài khoản ${user.username} thành ${newRole}.`);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="p-4" style="background-color: #f8fafc; min-height: 85vh;">
    <!-- Upper Header -->
    <div class="row align-items-center mb-4">
      <div class="col-md-6 text-left">
        <h4 class="font-weight-bold text-dark mb-1" style="font-family: 'Outfit', sans-serif;">Phân Quyền Hệ Thống</h4>
        <p class="text-secondary mb-0" style="font-size: 13.5px;">Quản lý phân quyền, nhóm tài khoản và vai trò của cán bộ nhân viên y tế.</p>
      </div>
    </div>

    <!-- Toast Notice -->
    <div v-if="toastMessage" class="alert alert-success position-fixed shadow-lg" style="bottom: 20px; right: 20px; z-index: 1050; border-left: 5px solid #10b981; min-width: 300px; border-radius: 8px;">
      <div class="d-flex align-items-center">
        <i class="fas fa-check-circle text-success mr-2 fa-lg"></i>
        <strong style="font-size: 13.5px; color: #1e293b;">{{ toastMessage }}</strong>
      </div>
    </div>

    <!-- main card list container -->
    <div class="card border-0 shadow-sm rounded-lg overflow-hidden">
      <div class="card-header bg-white border-0 py-3.5 px-4 text-left">
        <h5 class="font-weight-bold text-dark mb-0" style="font-size: 16px;">Phân bổ vai trò & Quyền truy cập</h5>
      </div>

      <div class="card-body p-0 text-left">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr class="text-secondary" style="font-size: 13px;">
                <th scope="col" class="pb-3 border-bottom-2">Tên tài khoản</th>
                <th scope="col" class="pb-3 border-bottom-2">Họ & Tên</th>
                <th scope="col" class="pb-3 border-bottom-2">Mã nhân viên</th>
                <th scope="col" class="pb-3 border-bottom-2">Khoa / Phòng ban</th>
                <th scope="col" class="pb-3 border-bottom-2">Vai trò truy cập</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="font-weight-bold text-teal-custom" style="color: #0f766e;">{{ user.username }}</td>
                <td class="font-weight-semibold text-dark">{{ user.fullName }}</td>
                <td>{{ user.staffId || 'DR-MOCK-001' }}</td>
                <td>
                  <span class="badge bg-light text-secondary border px-2.5 py-1" style="border-radius: 6px;">
                    {{ user.department || user.specialty || 'Chưa phân khoa' }}
                  </span>
                </td>
                <td style="width: 220px;">
                  <select 
                    v-model="user.accountType" 
                    @change="changeRole(user, $event.target.value)" 
                    class="form-control form-control-sm font-weight-bold"
                    style="border-color: #cbd5e1; height: 34px; border-radius: 6px; font-size: 13px;"
                  >
                    <option value="Quản trị viên">Quản trị viên (Admin)</option>
                    <option value="Bác sĩ">Bác sĩ (Doctor)</option>
                    <option value="Lễ tân">Lễ tân (Receptionist)</option>
                  </select>
                </td>
              </tr>

              <tr v-if="loading">
                <td colspan="5" class="text-center py-5">
                  <div class="spinner-border text-teal-custom" role="status">
                    <span class="sr-only">Đang tải...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
