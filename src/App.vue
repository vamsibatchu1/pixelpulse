<template>
  <div class="flex flex-col h-screen bg-neutral-100 font-sans">
    <!-- Navbar -->
    <nav class="bg-black shadow">
      <div class="mx-auto max-w-9xl px-2 sm:px-4 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex px-2 lg:px-0">
            <div class="flex flex-shrink-0 items-center">
              <img :src="pplogo" alt="Logo" class="h-8" />
            </div>
            <div class="hidden lg:ml-6 lg:flex lg:space-x-8">
              <!-- Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" -->
              <router-link
                to="/"
                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-slate-50 hover:border-gray-300 hover:text-slate-400"
                >Home
              </router-link>
              <router-link
                to="/about"
                class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-slate-50 hover:border-gray-300 hover:text-slate-400"
                >About
              </router-link>
            </div>
            <div class="space-x-4">
              <router-link to="/" class="hover:text-gray-300 transition-colors duration-200"
                >Home</router-link
              >
              <router-link to="/about" class="hover:text-gray-300 transition-colors duration-200"
                >About</router-link
              >
            </div>
          </div>

          <div class="flex items-center lg:hidden">
            <!-- Mobile menu button -->
            <button
              type="button"
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Open main menu</span>
              <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          -->
              <svg
                class="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          -->
              <svg
                class="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="lg:hidden" id="mobile-menu">
        <div class="space-y-1 pb-3 pt-2">
          <!-- Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" -->
          <a
            href="#"
            class="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
            >Dashboard</a
          >
          <a
            href="#"
            class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
            >Team</a
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
