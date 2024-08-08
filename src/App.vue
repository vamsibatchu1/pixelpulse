<template>
  <div class="layout-wrapper">
    <!-- Navbar -->
    <Menubar :model="items">
      <template #start>
        <img :src="pplogo" alt="Typography" class="category-icon" />
      </template>
      <template #end> </template>
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
              <span :class="className"> + Upload Your Design </span>
            </template>
          </FileUpload>
        </div>

        <div class="selected-image-container">
          <template v-if="selectedImage">
            <img :src="selectedImage" alt="Selected Design" class="selected-image" />
          </template>
          <template v-else>
            <div class="placeholder">
              <img :src="placeholderImage" alt="Upload placeholder" class="placeholder-image" />
              <p class="upload-text">Upload SVG, PNG, JPG or GIF</p>
              <p class="upload-size">(max. 800x400px)</p>
            </div>
          </template>
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
        <div v-if="analysisLoading" class="analysis-loading">
          <img :src="loading" style="width: 30px" />
          Analyzing image...
        </div>
        <div v-if="analysis" class="overall-score">
          <span>Overall</span>
          <span class="score" :class="getScoreClass(analysis.overallScore)">{{
            analysis.overallScore.toFixed(1)
          }}</span>
        </div>
        <Card v-for="(card, index) in analysisCards" :key="index" class="usage-card" :id="card.id">
          <template #content>
            <div class="usage-info" @click="toggleCard(index)">
              <div class="category">
                <img :src="card.icon" :alt="card.title" class="category-icon" />
                {{ card.title }}
              </div>
              <div class="score-and-toggle">
                <span :class="['score', getScoreClass(card.score)]">
                  {{ card.score.toFixed(1) }}
                </span>
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
import { ref, computed } from 'vue'
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
import placeholderImage from '@/assets/thumbnail.svg'
import loading from '@/assets/loading.gif'
import axios from 'axios'
import { useAnalysis } from './composables/useAnalysis' // Assume we have this composable

const { analysis, analysisCards, toggleCard } = useAnalysis()

const getScoreClass = (score) => {
  if (score >= 8) return 'score-high'
  if (score >= 6) return 'score-medium'
  return 'score-low'
}

// Navbar items
const items = ref([
  {
    label: 'About Pixel Pulse'
  }
])

// Image uploader and display logic
const uploadedImages = ref([])
const selectedImage = ref(null)
const analysisLoading = ref(false)

//Parsing the Analysis
const parseAnalysisResult = (content) => {
  const lines = content.split('\n')
  const overallScore = parseFloat(lines[2].split(':')[1].trim())
  const categories = [
    'Typography',
    'Color Usage',
    'Layout and Composition',
    'Information Architecture',
    'Spacing and Padding',
    'Navigation'
  ]
  const parsedAnalysis = {
    overallScore,
    categories: {}
  }

  let currentCategory = ''
  for (const line of lines) {
    const categoryMatch = categories.find((cat) => line.includes(cat + ':'))
    if (categoryMatch) {
      currentCategory = categoryMatch.toLowerCase().replace(/ /g, '')
      const score = parseFloat(line.split(':')[1].trim())
      parsedAnalysis.categories[currentCategory] = { score, issues: [] }
    } else if (line.trim().startsWith('-') && currentCategory) {
      parsedAnalysis.categories[currentCategory].issues.push({
        title: line.trim().substring(2),
        description: '',
        severity: 'medium' // You might want to implement logic to determine severity
      })
    }
  }

  return parsedAnalysis
}

//Code for Analyzing Image
const analyzeImage = async (imageData) => {
  analysisLoading.value = true
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image for its design quality from a UX and product design perspective. Provide an overall score out of 10, and detailed sub-scores for the following categories: typography, color usage, layout and composition, information architecture, spacing and padding, and navigation. Every category such have issues generated for sure. For each category, identify and describe multiple specific issues, offering clear and actionable insights for improvement. Return the result as a JSON object with the following structure:
                {
                  "overallScore": 8.0,
                  "categories": [
                    {
                      "name": "Typography",
                      "score": 8.0,
                      "issues": [
                        {
                          "title": "Issue Title",
                          "description": "Issue Description",
                          "severity": "low" | "medium" | "high"
                        }
                      ]
                    },
                    {
                      "name": "Color Usage",
                      "score": 9.0,
                      "issues": []
                    },
                    {
                      "name": "Layout & Composition",
                      "score": 7.0,
                      "issues": []
                    },
                    {
                      "name": "Information Architecture",
                      "score": 8.0,
                      "issues": []
                    },
                    {
                      "name": "Spacing & Padding",
                      "score": 8.0,
                      "issues": []
                    },
                    {
                      "name": "Navigation",
                      "score": 8.0,
                      "issues": []
                    }
                  ]
                }
                Ensure all scores are to one decimal place, and that the category names match exactly as shown.`
              },
              { type: 'image_url', image_url: { url: imageData } }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.5,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Raw OpenAI response:', response.data)

    if (
      response.data &&
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message
    ) {
      const content = JSON.parse(response.data.choices[0].message.content)
      console.log('OpenAI content:', content)

      // Set the analysis directly from the JSON response
      analysis.value = content
    } else {
      throw new Error('Unexpected response format from OpenAI')
    }
  } catch (error) {
    console.error('Error analyzing image:', error.response ? error.response.data : error.message)
    analysisResult.value = 'Error occurred during analysis.'
    showAnalysisModal.value = true
  } finally {
    analysisLoading.value = false
  }
}

//Code for On Select
const onSelect = (event) => {
  const files = event.files
  for (let file of files) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const imageData = e.target.result
      uploadedImages.value.push(imageData)
      if (!selectedImage.value) {
        selectedImage.value = imageData
      }
      await analyzeImage(imageData)
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
  margin: 0;
  padding: 0;
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

.content-wrapper {
  display: flex;
  flex: 1;
  padding: 0;
  gap: 0;
}

.left-section {
  flex: 7;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.right-section {
  flex: 3;
  background-color: #f6fafd;
  padding: 1.5rem;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  font-family: 'Recoleta', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  font-family: 'Recoleta', sans-serif;
  align-items: center;
  padding: 1rem 2rem;
}

h1 {
  font-size: 2rem;
  margin: 0;
}

.selected-image-container {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin: 32px;
  margin-top: 24px;
  margin-left: 32px;
  margin-right: 32px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
}

.placeholder-image {
  width: 200px;
  height: auto;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #333;
  margin: 0;
  margin-bottom: 8px;
}

.upload-size {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.selected-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.analysis-loading {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
}

.uploaded-designs {
  padding: 0 2rem;
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
  overflow: hidden;
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
  flex: 1;
}

.category-icon {
  width: 44px;
  height: 44px;
}

.score-and-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
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
  padding: 0 1rem;
}

.issue {
  margin-bottom: 1rem;
}

.issue-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.issue-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
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
  font-weight: bold;
}

.issue p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.score-high {
  color: #52c41a;
}
.score-medium {
  color: #faad14;
}
.score-low {
  color: #ff4d4f;
}

body {
  font-family: 'Recoleta', sans-serif !important;
}

.custom-upload-button {
  display: inline-block;
}

.custom-upload-button :deep(.p-button) {
  background-color: #ffffff !important;
  color: #000000 !important;
  border: 1px solid #e0e0e0 !important;
  font-weight: normal !important;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
}

#app {
  margin: 0px !important;
}

.custom-upload-button :deep(.p-button:hover) {
  background-color: #f5f5f5 !important;
}

.custom-upload-button :deep(.p-button-icon) {
  display: none !important;
}

:deep(.p-card-content) {
  padding: 0rem !important;
}
</style>
