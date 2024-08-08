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
            class="custom-upload-button"
            mode="basic"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
            @select="onSelect"
            :auto="true"
          >
            <template #chooseButton="{ className, chooseButtonLabel }">
              <span
                :class="className"
                style="
                  background-color: #000000;
                  border: none;
                  color: white;
                  padding: 10px 20px;
                  font-size: 16px;
                  border-radius: 8px;
                  cursor: pointer;
                "
              >
                + Upload Your Design
              </span>
            </template>
          </FileUpload>
        </div>

        <div class="selected-image-container">
          <img
            v-if="selectedImage"
            :src="selectedImage"
            alt="Selected Design"
            class="selected-image"
          />
          <div v-else class="placeholder">Selected Image</div>
          <img :src="thumbnail" alt="Thumbnail" class="thumbnail" />
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
        <Card v-for="(card, index) in cards" :key="index" class="usage-card" :id="card.id">
          <template #content>
            <div class="usage-info" @click="toggleCard(index)">
              <div class="category">
                <img :src="card.icon" :alt="card.title" class="category-icon" />
                {{ card.title }}
              </div>
              <div class="score-and-toggle">
                <span :class="['score', card.score >= 5 ? 'increase' : 'decrease']">{{
                  card.score
                }}</span>
                <i :class="['pi', card.expanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
              </div>
            </div>
            <div v-if="card.expanded" class="card-details">
              <div v-for="(issue, issueIndex) in card.issues" :key="issueIndex" class="issue">
                <div class="issue-header">
                  <div class="issue-dot" :class="issue.severity"></div>
                  <h4>{{ issue.title }}</h4>
                </div>
                <p>{{ issue.description }}</p>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
// The script section remains unchanged
import { ref } from 'vue'
import Menubar from 'primevue/menubar'
import FileUpload from 'primevue/fileupload'
import Card from 'primevue/card'
import pplogo from '@/assets/pplogo.svg'
import typography from '@/assets/typography.svg'
import color from '@/assets/color.svg'
import layout from '@/assets/layout.svg'
import ia from '@/assets/ia.svg'
import navigation from '@/assets/navigation.svg'
import spacing from '@/assets/spacing.svg'
import thumbnail from '@/assets/thumbnail.svg'

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

// Cards data
const cards = ref([
  {
    id: 'typography',
    title: 'Typography',
    icon: typography,
    score: 4.3,
    expanded: false,
    issues: [
      {
        severity: 'high',
        title: 'Inconsistent button text styles',
        description:
          'The "Play" and "Replay" buttons use different text styles (weight and possibly size). Standardize button text for visual consistency.'
      },
      {
        severity: 'high',
        title: 'Column header legibility issues',
        description:
          'The light gray used for column headers (e.g., "Relevance", "Frustration") has low contrast. Increase contrast for better readability.'
      },
      {
        severity: 'medium',
        title: 'Overcrowded navigation sidebar',
        description:
          'The sidebar icons are densely packed with small text labels. Increase spacing and font size to improve navigation usability.'
      }
    ]
  },
  {
    id: 'colorusage',
    title: 'Color Usage',
    icon: color,
    score: 8.0,
    expanded: false,
    issues: []
  },
  {
    id: 'layout',
    title: 'Layout & Composition',
    icon: layout,
    score: 3.6,
    expanded: false,
    issues: []
  },
  {
    id: 'ia',
    title: 'Information Architecture',
    icon: ia,
    score: 3.6,
    expanded: false,
    issues: []
  },
  {
    id: 'spacing',
    title: 'Spacing & Padding',
    icon: spacing,
    score: 3.6,
    expanded: false,
    issues: []
  },
  {
    id: 'navigation',
    title: 'Navigation',
    icon: navigation,
    score: 3.6,
    expanded: false,
    issues: []
  }
])

const toggleCard = (index) => {
  cards.value[index].expanded = !cards.value[index].expanded
}
</script>

<style scoped>
/* All previous styles remain unchanged */
.layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
  margin: 0; /* Remove any default margin */
  padding: 0; /* Remove any default padding */
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
  padding: 0; /* Remove the padding */
  gap: 0; /* Remove the gap between left and right sections */
}

.left-section {
  flex: 7;
  display: flex;
  flex-direction: column;
  padding: 0; /* Remove the padding */
}

.right-section {
  flex: 3;
  background-color: #f6fafd;
  padding: 1.5rem;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1); /* Add left shadow for separation */
}

.header {
  padding: 1rem 2rem; /* Add some padding to the header */
}

body {
  margin: 0px !important;
}

.header {
  display: flex;
  justify-content: space-between;
  font-family: 'Recoleta', sans-serif;
  align-items: center;
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
  border-radius: 5px; /* Remove border radius */
  border: none; /* Remove border */
  margin: 32px;
  margin-top: 0px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  align-content: center;
  height: 400px;
  padding: 1rem 2rem; /* Add padding to match the header */
}

.uploaded-designs {
  padding: 0 2rem; /* Add horizontal padding */
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
  margin-bottom: 16px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #eaecf0;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden; /* Add this to ensure border-radius is applied to child elements */
}

.usage-info {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.category {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1; /* This will make the category take up all available space */
}

.category-icon {
  width: 44px;
  height: 44px;
}

.score-and-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap; /* Prevent wrapping of score and chevron */
}

.score {
  font-weight: bold;
  font-size: 1.2rem;
}

.increase {
  color: #52c41a;
}

.decrease {
  color: #ff4d4f;
}

.card-details {
  margin-top: 1rem;
  width: 100%;
  padding-left: 8px;
}

.issue {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.issue-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.issue-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.issue-dot.high {
  background-color: #ff4d4f;
}

.issue-dot.medium {
  background-color: #faad14;
}

.issue-dot.low {
  background-color: #52c41a;
}

.issue h4 {
  margin: 0;
  font-size: 14px;
}

.issue p {
  margin: 0;
  color: #666;
  font-size: 12px;
  padding-left: calc(12px + 0.5rem); /* Align with the header text */
}

body {
  font-family: 'Recoleta', sans-serif !important;
}

.custom-upload-button {
  display: inline-block;
}

.custom-upload-button :deep(.p-button-icon) {
  display: none !important;
}

.thumbnail {
  width: 450px;
  height: auto;
  object-fit: cover;
}

:deep(.p-card-content) {
  padding: 0rem !important;
}
</style>
