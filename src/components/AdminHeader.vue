<script setup>
defineProps({
  title: {
    type: String,
    default: 'MediFlow Admin'
  }
});
</script>

<template>
  <header class="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm px-4 py-3 sticky-top">
    <!-- Header Brand Title -->
    <span class="navbar-brand font-weight-bold mb-0 text-dark" style="font-size: 20px; font-family: 'Outfit', sans-serif;">
      {{ title }}
    </span>

    <!-- Collapse / Right align -->
    <div class="collapse navbar-collapse justify-content-end">
      <!-- Search Input Box -->
      <form class="form-inline mr-4 d-none d-md-flex position-relative" style="max-width: 320px;">
        <i class="fas fa-search position-absolute text-muted" style="left: 15px;"></i>
        <input 
          class="form-control bg-light border-0 rounded-pill pl-5 pr-4" 
          type="search" 
          placeholder="Tìm kiếm hệ thống..." 
          aria-label="Search"
          style="font-size: 13.5px; height: 40px; width: 280px;"
        >
      </form>

      <!-- Utility Icons -->
      <ul class="navbar-nav align-items-center">
        <!-- Notification Bell -->
        <li class="nav-item mr-3">
          <a class="nav-link text-secondary p-2 rounded-circle hover-bg-light" href="#" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <i class="far fa-bell fa-lg"></i>
          </a>
        </li>
        <!-- History / Log -->
        <li class="nav-item mr-3">
          <a class="nav-link text-secondary p-2 rounded-circle hover-bg-light" href="#" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-history fa-lg"></i>
          </a>
        </li>
        
        <!-- User Profile Avatar -->
        <li class="nav-item border-left pl-3 d-flex align-items-center">
          <div class="position-relative">
            <img 
              src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100&h=100" 
              alt="Admin Avatar" 
              class="rounded-circle"
              style="width: 38px; height: 38px; object-fit: cover; border: 2px solid #e2e8f0;"
            >
            <span 
              class="position-absolute rounded-circle bg-success"
              style="width: 10px; height: 10px; right: 0; bottom: 0; border: 2px solid white;"
            ></span>
          </div>
        </li>
      </ul>
    </div>
  </header>
</template>
