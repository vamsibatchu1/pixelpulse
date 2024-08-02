<template>
  <div id="app" class="p-4">
    <Button label="Click Me" class="p-button-rounded p-button-primary" @click="handleClick" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';

export default defineComponent({
  name: 'App',
  components: {
    Button
  },
  methods: {
    handleClick() {
      alert('Button clicked!');
    }
  }
});
</script>

<style>
/* Add any custom styles here */
</style>