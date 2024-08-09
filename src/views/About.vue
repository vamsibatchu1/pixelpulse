<template>
  <div class="bg-white p-6 rounded-lg max-w-2xl mx-auto mt-8">
    <h1 class="text-3xl font-bold mb-4">About Pixel Pulse</h1>
    <p class="mb-4">
      Pixel Pulse is an AI-powered design analysis tool that helps designers and developers improve
      their UI/UX by providing detailed feedback on various aspects of their designs.
    </p>
    <button
      type="button"
      @click="messageMe"
      class="rounded-full bg-black px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      Message Me
    </button>
  </div>
</template>

<script setup>
const messageMe = () => {
  // Implement your messaging functionality here
  console.log('Message Me clicked')
}
</script>
