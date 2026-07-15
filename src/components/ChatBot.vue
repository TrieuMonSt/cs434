<script setup>
import { ref, nextTick } from 'vue';

const isOpen = ref(false);
const inputMessage = ref('');
const messages = ref([
  { sender: 'bot', text: 'Xin chào! Tôi là Trợ lý ảo CarePlus. Tôi có thể giúp gì cho bạn hôm nay?', time: formatTime() }
]);

const chatBody = ref(null);

function formatTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    scrollToBottom();
  }
};

const sendMessage = () => {
  const text = inputMessage.value.trim();
  if (!text) return;

  // Push user message
  messages.value.push({
    sender: 'user',
    text,
    time: formatTime()
  });

  inputMessage.value = '';
  scrollToBottom();

  // Generate bot reply
  setTimeout(() => {
    const botReplyText = getBotResponse(text);
    messages.value.push({
      sender: 'bot',
      text: botReplyText,
      time: formatTime()
    });
    scrollToBottom();
  }, 700);
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
  });
};

const getBotResponse = (query) => {
  const q = query.toLowerCase().trim();
  
  if (q.includes('bác sĩ') || q.includes('bac si') || q.includes('doctor')) {
    return 'Hệ thống hiện tại có đội ngũ 11 bác sĩ chuyên khoa hoạt động. Bạn có thể xem hồ sơ và lịch trực tuần chi tiết tại menu "Bác sĩ" trên thanh điều hướng.';
  }
  if (q.includes('lịch hẹn') || q.includes('lich hen') || q.includes('đặt lịch') || q.includes('hủy lịch')) {
    return 'Lịch khám có thể được đăng ký mới, cập nhật trạng thái hoặc hủy bỏ trực tiếp tại mục "Lịch hẹn" của hệ thống.';
  }
  if (q.includes('phòng') || q.includes('phong') || q.includes('nội trú') || q.includes('noi tru')) {
    return 'Để theo dõi hoặc cấp phòng nội trú cho bệnh nhân, vui lòng truy cập menu "Bệnh nhân nội trú" hoặc "Phòng bệnh" để kiểm tra sức chứa và thông tin giường bệnh.';
  }
  if (q.includes('thuốc') || q.includes('thuoc') || q.includes('dược') || q.includes('kho')) {
    return 'Hệ thống cung cấp phân hệ "Kho thuốc" để kiểm tra thuốc tồn kho, hạn sử dụng và "Đặt thuốc" để lên đơn cấp phát thuốc cho bệnh nhân sau khám.';
  }
  if (q.includes('dịch vụ') || q.includes('dich vu')) {
    return 'Các dịch vụ khám chữa bệnh bao gồm: Khám tổng quát, Siêu âm ổ bụng, Chụp X-quang, Xét nghiệm máu,... Bạn có thể thiết lập đơn giá và thời gian khám tại tab "Dịch vụ".';
  }
  if (q.includes('xin chào') || q.includes('hello') || q.includes('chào') || q.includes('hi')) {
    return 'Chào bạn! Chúc bạn một ngày làm việc hiệu quả. Hãy hỏi tôi về các tính năng Quản lý Bác sĩ, Lịch hẹn, Bệnh nhân, Nội trú hoặc Dược phẩm của bệnh viện nhé!';
  }
  
  return 'Cảm ơn bạn đã nhắn tin. Tôi là trợ lý ảo hỗ trợ tìm kiếm nhanh thông tin hệ thống. Để quản trị chuyên môn, bạn có thể sử dụng các thanh chức năng tương ứng trên thanh Sidebar trái.';
};
</script>

<template>
  <div class="chatbot-wrapper text-left">
    <!-- Floating Chat Button -->
    <button 
      @click="toggleChat"
      class="chatbot-btn shadow-lg rounded-circle d-flex align-items-center justify-content-center border-0 text-white animate-pulse-btn"
      :style="{ backgroundColor: isOpen ? '#e11d48' : '#0f766e' }"
      title="Trợ lý ảo CarePlus"
    >
      <i v-if="!isOpen" class="far fa-comments" style="font-size: 22px;"></i>
      <i v-else class="fas fa-times" style="font-size: 20px;"></i>
    </button>

    <!-- Chat window panel -->
    <div v-if="isOpen" class="chat-panel card shadow-lg border rounded-lg d-flex flex-column">
      <!-- Chat header -->
      <div class="chat-header p-3 text-white d-flex align-items-center justify-content-between" style="background-color: #0f766e; border-top-left-radius: 12px; border-top-right-radius: 12px;">
        <div class="d-flex align-items-center">
          <div class="bot-avatar rounded-circle bg-white text-teal d-flex align-items-center justify-content-center mr-2.5" style="width: 32px; height: 32px; color: #0f766e;">
            <i class="fas fa-robot"></i>
          </div>
          <div>
            <h6 class="font-weight-bold mb-0" style="font-size: 14px;">Trợ lý CarePlus</h6>
            <small class="opacity-75" style="font-size: 10px;">Hoạt động trực tuyến</small>
          </div>
        </div>
        <button class="bg-transparent border-0 text-white" @click="isOpen = false" style="outline: none;">
          <i class="fas fa-chevron-down" style="font-size: 14px;"></i>
        </button>
      </div>

      <!-- Chat Body -->
      <div class="chat-body flex-grow-1 p-3" ref="chatBody" style="overflow-y: auto; background-color: #f8fafc; height: 280px;">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          class="d-flex mb-3.5"
          :class="msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'"
        >
          <!-- Bot avatar in row -->
          <div v-if="msg.sender === 'bot'" class="rounded-circle text-white bg-secondary-custom d-flex align-items-center justify-content-center mr-2 flex-shrink-0" style="width: 28px; height: 28px; background-color: #e2e8f0; color: #475569; font-size: 11px;">
            <i class="fas fa-robot"></i>
          </div>

          <!-- Message box -->
          <div 
            class="msg-bubble p-2.5 rounded-lg shadow-xs" 
            :style="{ 
              backgroundColor: msg.sender === 'user' ? '#0f766e' : '#ffffff',
              color: msg.sender === 'user' ? '#ffffff' : '#334155',
              maxWidth: '75%',
              fontSize: '13px',
              border: msg.sender === 'bot' ? '1px solid #e2e8f0' : 'none',
              borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0'
            }"
          >
            <div class="msg-text">{{ msg.text }}</div>
            <div 
              class="msg-time text-right opacity-50 mt-1" 
              :style="{ fontSize: '9px', color: msg.sender === 'user' ? '#e2e8f0' : '#64748b' }"
            >
              {{ msg.time }}
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Footer -->
      <form @submit.prevent="sendMessage" class="chat-footer p-2.5 bg-white border-top d-flex align-items-center">
        <input 
          type="text" 
          v-model="inputMessage"
          class="form-control border-0 bg-light rounded-pill px-3 mr-2" 
          placeholder="Nhập tin nhắn..." 
          style="font-size: 13px; height: 38px; box-shadow: none;"
        >
        <button 
          type="submit" 
          class="btn rounded-circle d-flex align-items-center justify-content-center text-white border-0 shadow-xs" 
          style="width: 38px; height: 38px; background-color: #0f766e;"
        >
          <i class="fas fa-paper-plane" style="font-size: 14px;"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  right: 30px;
  bottom: 100px;
  z-index: 1000;
}
.chatbot-btn {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(15, 118, 110, 0.3);
}
.chatbot-btn:hover {
  transform: scale(1.08);
}
.chat-panel {
  position: absolute;
  bottom: 64px;
  right: 0;
  width: 350px;
  max-width: 90vw;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  background: white;
  animation: slideUp 0.2s ease-out;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
