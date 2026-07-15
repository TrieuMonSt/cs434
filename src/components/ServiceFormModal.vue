<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editingService: { type: Object, default: null }, // null = thêm mới
  departments: { type: Array, default: () => [] },  // gợi ý khoa/phòng đã có
});

const emit = defineEmits(['update:modelValue', 'submit']);

const emptyForm = () => ({
  name: '', department: '', price: 0, duration: 15, status: 'active', description: '',
});

const form = ref(emptyForm());
const isEditing = ref(false);

watch(() => props.modelValue, (val) => {
  if (val) {
    if (props.editingService) {
      isEditing.value = true;
      form.value = { ...props.editingService };
    } else {
      isEditing.value = false;
      form.value = emptyForm();
    }
  }
});

const close = () => emit('update:modelValue', false);

const submit = () => {
  if (!form.value.name.trim() || !form.value.department.trim()) {
    alert('Vui lòng điền đầy đủ tên dịch vụ và khoa/phòng phụ trách.');
    return;
  }
  emit('submit', { ...form.value, isEditing: isEditing.value, id: props.editingService?.id });
  close();
};
</script>

<template>
  <div v-if="modelValue" class="modal d-block" style="background: rgba(0, 0, 0, 0.5); z-index: 1040;" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
        <div class="modal-header bg-light py-3 border-bottom">
          <h5 class="modal-title font-weight-bold text-dark" style="font-size: 16px;">
            {{ isEditing ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới' }}
          </h5>
          <button type="button" class="close" @click="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body p-4 text-left">
          <div class="form-group mb-3">
            <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Tên dịch vụ *</label>
            <input type="text" class="form-control" placeholder="Ví dụ: Khám tổng quát..." v-model="form.name">
          </div>

          <div class="row">
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Khoa / Phòng *</label>
              <input type="text" class="form-control" list="departmentList" placeholder="Ví dụ: Nội tổng quát..." v-model="form.department">
              <datalist id="departmentList">
                <option v-for="d in departments" :key="d" :value="d"></option>
              </datalist>
            </div>
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Thời lượng (phút)</label>
              <input type="number" min="1" class="form-control" v-model.number="form.duration">
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Giá dịch vụ (đ)</label>
              <input type="number" min="0" class="form-control" v-model.number="form.price">
            </div>
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Trạng thái</label>
              <select class="form-control" v-model="form.status">
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm ngừng</option>
              </select>
            </div>
          </div>

          <div class="form-group mb-0">
            <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Mô tả dịch vụ</label>
            <textarea class="form-control" rows="3" placeholder="Mô tả ngắn về dịch vụ..." v-model="form.description"></textarea>
          </div>
        </div>
        <div class="modal-footer bg-light border-top py-3">
          <button type="button" class="btn btn-secondary py-2 px-4 font-weight-bold" style="font-size: 13px;" @click="close">Đóng</button>
          <button type="button" class="btn btn-dark py-2 px-4 font-weight-bold" style="font-size: 13px; background-color: #0d9488; border-color: #0d9488;" @click="submit">Lưu thông tin</button>
        </div>
      </div>
    </div>
  </div>
</template>
