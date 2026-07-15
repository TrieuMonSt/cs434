<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // v-model:modelValue để đóng/mở
  catalog: { type: Array, required: true },       // danh mục thuốc trong kho để chọn
});

const emit = defineEmits(['update:modelValue', 'submit']);

const emptyOrder = () => ({
  patientName: '',
  patientId: '',
  doctor: '',
  date: new Date().toISOString().slice(0, 10),
  items: [{ name: props.catalog[0]?.name || '', qty: 1, unit: props.catalog[0]?.unit || 'Viên', dosage: '' }],
});

const form = ref(emptyOrder());

// reset form mỗi khi modal được mở lại
watch(() => props.modelValue, (val) => {
  if (val) form.value = emptyOrder();
});

const addLine = () => {
  form.value.items.push({ name: props.catalog[0]?.name || '', qty: 1, unit: props.catalog[0]?.unit || 'Viên', dosage: '' });
};
const removeLine = (idx) => {
  if (form.value.items.length > 1) form.value.items.splice(idx, 1);
};
const onSelectMedicine = (line) => {
  const found = props.catalog.find(m => m.name === line.name);
  if (found) line.unit = found.unit;
};

const close = () => emit('update:modelValue', false);

const submit = () => {
  if (!form.value.patientName.trim() || !form.value.doctor.trim()) {
    alert('Vui lòng điền đầy đủ thông tin bệnh nhân và bác sĩ kê đơn.');
    return;
  }
  // Gắn kèm đơn giá tại thời điểm kê đơn để các nơi khác tính tổng tiền không cần catalog
  const itemsWithPrice = form.value.items.map(it => {
    const found = props.catalog.find(m => m.name === it.name);
    return { ...it, price: found ? found.price : 0 };
  });

  emit('submit', { ...form.value, items: itemsWithPrice });
  close();
};
</script>

<template>
  <div v-if="modelValue" class="modal d-block" style="background: rgba(0, 0, 0, 0.5); z-index: 1040;" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
        <div class="modal-header bg-light py-3 border-bottom">
          <h5 class="modal-title font-weight-bold text-dark" style="font-size: 16px;">Kê Đơn Thuốc Mới</h5>
          <button type="button" class="close" @click="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body p-4 text-left" style="max-height: 70vh; overflow-y: auto;">
          <div class="row">
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Tên bệnh nhân *</label>
              <input type="text" class="form-control" placeholder="Ví dụ: Eleanor Shellstrop..." v-model="form.patientName">
            </div>
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Mã bệnh nhân</label>
              <input type="text" class="form-control" placeholder="PT-XXXXX (để trống tự tạo)" v-model="form.patientId">
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Bác sĩ kê đơn *</label>
              <input type="text" class="form-control" placeholder="Ví dụ: BS. Trần Văn Khoa..." v-model="form.doctor">
            </div>
            <div class="col-md-6 form-group mb-3">
              <label class="font-weight-bold text-secondary mb-1" style="font-size: 13px;">Ngày kê đơn</label>
              <input type="date" class="form-control" v-model="form.date">
            </div>
          </div>

          <hr>
          <label class="font-weight-bold text-secondary mb-2" style="font-size: 13px;">Danh sách thuốc kê đơn</label>

          <div v-for="(line, idx) in form.items" :key="idx" class="p-3 mb-2 rounded" style="background-color: #f8fafc; border: 1px solid #e2e8f0;">
            <div class="row align-items-end">
              <div class="col-md-4 form-group mb-2 mb-md-0">
                <label class="text-muted mb-1" style="font-size: 11.5px;">Tên thuốc</label>
                <select class="form-control form-control-sm" v-model="line.name" @change="onSelectMedicine(line)">
                  <option v-for="m in catalog" :key="m.id" :value="m.name">{{ m.name }}</option>
                </select>
              </div>
              <div class="col-md-2 form-group mb-2 mb-md-0">
                <label class="text-muted mb-1" style="font-size: 11.5px;">Số lượng</label>
                <input type="number" min="1" class="form-control form-control-sm" v-model.number="line.qty">
              </div>
              <div class="col-md-5 form-group mb-2 mb-md-0">
                <label class="text-muted mb-1" style="font-size: 11.5px;">Liều dùng / Ghi chú</label>
                <input type="text" class="form-control form-control-sm" placeholder="Ví dụ: Ngày 2 lần, sau ăn..." v-model="line.dosage">
              </div>
              <div class="col-md-1 text-right">
                <button type="button" class="btn btn-sm btn-link text-danger p-0" @click="removeLine(idx)" title="Xóa dòng thuốc">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn-light border font-weight-bold px-3 py-2 mt-1" style="font-size: 12.5px;" @click="addLine">
            <i class="fas fa-plus mr-1"></i> Thêm thuốc
          </button>
        </div>
        <div class="modal-footer bg-light border-top py-3">
          <button type="button" class="btn btn-secondary py-2 px-4 font-weight-bold" style="font-size: 13px;" @click="close">Đóng</button>
          <button type="button" class="btn btn-dark py-2 px-4 font-weight-bold" style="font-size: 13px; background-color: #0d9488; border-color: #0d9488;" @click="submit">Lưu đơn thuốc</button>
        </div>
      </div>
    </div>
  </div>
</template>
