<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editingMedicine: { type: Object, default: null }, // null = thêm mới, có object = chỉnh sửa
});

const emit = defineEmits(['update:modelValue', 'submit']);

const emptyForm = () => ({
  name: '', category: '', unit: 'Viên', stock: 0, minStock: 10,
  price: 0, expiry: '', supplier: '',
});

const form = ref(emptyForm());
const isEditing = ref(false);

watch(() => props.modelValue, (val) => {
  if (val) {
    if (props.editingMedicine) {
      isEditing.value = true;
      form.value = { ...props.editingMedicine };
    } else {
      isEditing.value = false;
      form.value = emptyForm();
    }
  }
});

const close = () => emit('update:modelValue', false);

const submit = () => {
  if (!form.value.name.trim() || !form.value.category.trim()) {
    alert('Vui lòng điền đầy đủ tên thuốc và phân loại.');
    return;
  }
  emit('submit', { ...form.value, isEditing: isEditing.value, id: props.editingMedicine?.id });
  close();
};
</script>

<template>
  <div v-if="modelValue" class="modal d-block" style="background: rgba(0, 0, 0, 0.5); z-index: 1040;" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
        <div class="modal-header bg-light py-3 border-bottom">
          <h5 class="modal-title font-weight-bold text-dark" style="font-size: 16px;">
            {{ isEditing ? 'Chỉnh Sửa Thông Tin Thuốc' : 'Thêm Thuốc Mới Vào Kho' }}
          </h5>
          <button type="button" class="close" @click="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body p-4 text-left">
          <div class="form-group mb-3">
            <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Tên thuốc *</label>
            <input type="text" class="form-control" placeholder="Ví dụ: Paracetamol 500mg..." v-model="form.name">
          </div>

          <div class="row">
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Phân loại *</label>
              <input type="text" class="form-control" placeholder="Ví dụ: Kháng sinh..." v-model="form.category">
            </div>
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Đơn vị tính</label>
              <select class="form-control" v-model="form.unit">
                <option value="Viên">Viên</option>
                <option value="Gói">Gói</option>
                <option value="Chai">Chai</option>
                <option value="Hộp">Hộp</option>
                <option value="Tuýp">Tuýp</option>
                <option value="Ống">Ống</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Số lượng tồn kho</label>
              <input type="number" min="0" class="form-control" v-model.number="form.stock">
            </div>
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Tồn kho tối thiểu</label>
              <input type="number" min="0" class="form-control" v-model.number="form.minStock">
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Đơn giá (đ)</label>
              <input type="number" min="0" class="form-control" v-model.number="form.price">
            </div>
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Hạn sử dụng</label>
              <input type="date" class="form-control" v-model="form.expiry">
            </div>
          </div>

          <div class="form-group mb-0">
            <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Nhà cung cấp</label>
            <input type="text" class="form-control" placeholder="Ví dụ: Công ty Dược Hậu Giang..." v-model="form.supplier">
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
