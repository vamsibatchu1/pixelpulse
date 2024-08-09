<template>
  <div class="flex flex-col h-screen bg-neutral-100 font-sans">
    <!-- Navbar -->
    <nav class="bg-black text-white px-8 py-4">
      <div class="flex justify-between items-center">
        <img :src="pplogo" alt="Logo" class="h-8" />
        <div class="space-x-4">
          <router-link to="/" class="hover:text-gray-300 transition-colors duration-200"
            >Home</router-link
          >
          <router-link to="/about" class="hover:text-gray-300 transition-colors duration-200"
            >About</router-link
          >
        </div>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import pplogo from '@/assets/pplogo.svg'

// Any global app logic can go here
</script>
