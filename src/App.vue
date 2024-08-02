<template>
  <div class="layout-wrapper">
    <!-- Navbar -->
    <Menubar :model="items">
      <template #start> </template>
      <template #end>
        <InputText placeholder="Search" type="text" />
      </template>
    </Menubar>

    <div class="content-wrapper">
      <!-- Left Section (70%) -->
      <div class="left-section">
        <div class="upload-section">
          <h2>Pixel Pulse</h2>
          <FileUpload
            mode="basic"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
            @select="onSelect"
            :auto="true"
            chooseLabel="Upload your Design"
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
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section (30%) -->
      <div class="right-section">
        <h3>Design Scores</h3>
        <Card class="usage-card" id="typography">
          <template #content>
            <div class="usage-info">
              <div class="warning-message">Typography</div>
              <span class="increase"> Excellent</span>
            </div>
            <div class="upgrade-message">
              The readability, font choice, and consistency of text elements to ensure effective
              communication.
            </div>
            <ProgressBar value="75" class="custom-progress-bar"></ProgressBar>
            <div class="vendor-count">75/100</div>
          </template>
        </Card>
        <Card class="usage-card" id="colorusage">
          <template #content>
            <div class="usage-info">
              <div class="warning-message">Color Usage</div>
              <span class="increase"> Excellent</span>
            </div>
            <div class="upgrade-message">
              Color schemes for aesthetic appeal, consistency, and alignment with branding
              guidelines
            </div>
            <ProgressBar value="45" class="custom-progress-bar"></ProgressBar>
            <div class="vendor-count">45/100</div>
          </template>
        </Card>
        <Card class="usage-card" id="spacing">
          <template #content>
            <div class="usage-info">
              <div class="warning-message">Spacing and Margins</div>
              <span class="increase"> Excellent</span>
            </div>
            <div class="upgrade-message">
              The use of white space and alignment to enhance visual clarity and user experience
            </div>
            <ProgressBar value="90" class="custom-progress-bar"></ProgressBar>
            <div class="vendor-count">240</div>
          </template>
        </Card>
        <!-- Additional cards -->
        <Card v-for="n in 9" :key="n" class="additional-card">
          <template #content>
            <h3>Card {{ n }}</h3>
            <p>Additional information for card {{ n }}</p>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload'
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'

// Navbar items
const items = ref([
  {
    label: 'Evaluate Designs',
    icon: 'pi pi-fw pi-image'
  },
  {
    label: 'History',
    icon: 'pi pi-fw pi-history'
  },
  {
    label: 'Settings',
    icon: 'pi pi-fw pi-cog'
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
}

.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left-section {
  width: 70%;
  padding: 2rem;
  font-family: 'Roboto', sans-serif;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.right-section {
  width: 30%;
  padding: 2rem;
  background-color: #f8f9fa;
  font-family: 'Roboto', sans-serif;
  overflow-y: auto;
}

.upload-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.selected-image-container {
  width: 100%;
  height: 400px;
  border: 2px solid #ced4da;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-bottom: 1rem;
}

.selected-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.placeholder {
  color: #6c757d;
  font-size: 1.2rem;
}

.uploaded-designs {
  margin-top: 1rem;
}

.image-grid {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 40px;
  padding: 20px 0;
}

.grid-item {
  flex: 0 0 auto;
  width: 100px;
  height: 100px;
  border: 1px solid #ced4da;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}

.grid-item.selected {
  border-color: #4caf50;
  border-width: 3px;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.usage-card {
  margin-bottom: 1rem;
  font-family: 'Roboto', sans-serif;
}

.usage-info {
  display: flex;
  justify-content: space-between;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 0.5rem;
}

.increase {
  color: #22c55e;
}

.custom-progress-bar {
  height: 0.8rem;
  font-size: 0rem;
}

.vendor-count {
  font-size: 2rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  margin: 1rem 0;
}

.warning-message {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.upgrade-message {
  margin-bottom: 1rem;
  font-family: 'Roboto', sans-serif;
}

.additional-card {
  margin-bottom: 1rem;
  font-family: 'Roboto', sans-serif;
}
</style>
