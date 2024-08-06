<template>
  <!-- The template remains unchanged -->
  <div class="layout-wrapper">
    <!-- Navbar -->
    <Menubar :model="items">
      <template #start>
        <img :src="pplogo" alt="Typography" class="category-icon" />
      </template>
      <template #end>
        <div class="user-avatar"></div>
      </template>
    </Menubar>

    <div class="content-wrapper">
      <!-- Left Section (70%) -->
      <div class="left-section">
        <div class="header">
          <h1>Pixel Pulse</h1>
          <FileUpload
            class="uploadbutton"
            mode="basic"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
            @select="onSelect"
            :auto="true"
            chooseLabel="Upload Your Design"
          />
        </div>

        <div class="selected-image-container">
          <img
            v-if="selectedImage"
            :src="selectedImage"
            alt="Selected Design"
            class="selected-image"
          />
          <div v-else class="placeholder">Selected Image</div>
        </div>

        <div v-if="uploadedImages.length > 0" class="uploaded-designs">
          <h3>Uploaded Designs ({{ uploadedImages.length }})</h3>
          <div class="image-grid">
            <div
              v-for="(image, index) in uploadedImages"
              :key="index"
              class="grid-item"
              :class="{ selected: image === selectedImage }"
              @click="selectImage(image)"
            >
              <img :src="image" :alt="'Uploaded Design ' + (index + 1)" />
              <div class="image-score">3.6</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section (30%) -->
      <div class="right-section">
        <h2>Design Diagnostics</h2>
        <div class="overall-score">
          <span>Overall</span>
          <span class="score">3.6</span>
        </div>
        <Card class="usage-card" id="typography">
          <template #content>
            <div class="usage-info">
              <div class="category">
                <img :src="typography" alt="Typography" class="category-icon" />
                Typography
              </div>
              <span class="score decrease">4.3</span>
            </div>
          </template>
        </Card>
        <Card class="usage-card" id="colorusage">
          <template #content>
            <div class="usage-info">
              <div class="category">
                <img :src="color" alt="Color Usage" class="category-icon" />
                Color Usage
              </div>
              <span class="score increase">8.0</span>
            </div>
          </template>
        </Card>
        <Card class="usage-card" id="layout">
          <template #content>
            <div class="usage-info">
              <div class="category">
                <img :src="layout" alt="Color Usage" class="category-icon" />
                Layout & Composition
              </div>
              <span class="score decrease">3.6</span>
            </div>
          </template>
        </Card>
        <Card class="usage-card" id="ia">
          <template #content>
            <div class="usage-info">
              <div class="category">
                <img :src="ia" alt="Color Usage" class="category-icon" />
                Information Architecture
              </div>
              <span class="score decrease">3.6</span>
            </div>
          </template>
        </Card>
        <Card class="usage-card" id="spacing">
          <template #content>
            <div class="usage-info">
              <div class="category">
                <img :src="spacing" alt="Color Usage" class="category-icon" />
                Spacing & Padding
              </div>
              <span class="score decrease">3.6</span>
            </div>
          </template>
        </Card>
        <Card class="usage-card" id="navigation">
          <template #content>
            <div class="usage-info">
              <div class="category">
                <img :src="navigation" alt="Color Usage" class="category-icon" />
                Navigation
              </div>
              <span class="score decrease">3.6</span>
            </div>
          </template>
        </Card>
        <!-- Additional cards can be added here -->
      </div>
    </div>
  </div>
</template>

<script setup>
// The script section remains unchanged
import { ref } from 'vue'
import Menubar from 'primevue/menubar'
//import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload'
import Card from 'primevue/card'
//import ProgressBar from 'primevue/progressbar'
import pplogo from '@/assets/pplogo.svg'
import typography from '@/assets/typography.svg'
import color from '@/assets/color.svg'
import layout from '@/assets/layout.svg'
import ia from '@/assets/ia.svg'
import navigation from '@/assets/navigation.svg'
import spacing from '@/assets/spacing.svg'

// Navbar items
const items = ref([
  {
    label: 'Evaluate Designs'
  },
  {
    label: 'History'
  },
  {
    label: 'Settings'
  }
])

// Image uploader and display logic
const uploadedImages = ref([])
const selectedImage = ref(null)

const onSelect = (event) => {
  const files = event.files
  for (let file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImages.value.push(e.target.result)
      if (!selectedImage.value) {
        selectedImage.value = e.target.result
      }
    }
    reader.readAsDataURL(file)
  }
}

const selectImage = (image) => {
  selectedImage.value = image
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}

.p-menubar {
  background-color: #000000;
  color: #ffffff;
  padding: 0.5rem 2rem;
}

.brand {
  font-size: 1.2rem;
  font-weight: bold;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #cccccc;
}

.content-wrapper {
  display: flex;
  flex: 1;
  padding: 0rem;
  gap: 2rem;
}

.left-section {
  flex: 7;
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  padding-left: 32px;
}

.right-section {
  flex: 3;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Recoleta', sans-serif;
}

body {
  margin: 0px !important;
}

.header {
  display: flex;
  justify-content: space-between;
  font-family: 'Recoleta', sans-serif;
  align-items: center;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem;
  margin: 0;
}

.p-fileupload-choose {
  background-color: #ffffff !important;
  color: #000000 !important;
  border: none !important;
  font-weight: bold !important;
}

.selected-image-container {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  height: 400px;
}

.selected-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-grid {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.grid-item {
  position: relative;
  flex: 0 0 150px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-score {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
}

h2 {
  font-size: 1.5rem;
  margin-top: 0;
}

.overall-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
  width: 100%;
  height: 80px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #eaecf0;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 12px;
}

.overall-score .score {
  font-size: 2rem;
  font-weight: bold;
  color: #ff4d4f;
}

.usage-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  margin-bottom: 16px;
  width: 100%;
  height: 105px;
  background: #ffffff;
  border: 1px solid #eaecf0;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 12px;
}

.usage-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.score {
  font-weight: bold;
}

.increase {
  color: #52c41a;
}

.decrease {
  color: #ff4d4f;
}

.custom-progress-bar {
  height: 0.5rem;
}

body {
  font-family: 'Recoleta', sans-serif !important;
}
</style>
