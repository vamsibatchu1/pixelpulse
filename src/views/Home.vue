<template>
  <div class="fixed inset-x-0 bottom-0">
    <div class="flex items-center gap-x-6 bg-gray-900 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <p class="text-sm leading-6 text-white">
        <a href="#">
          <strong class="font-semibold">Pixel Pulse</strong
          ><svg viewBox="0 0 2 2" class="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
            <circle cx="1" cy="1" r="1" /></svg
          >This is currently available in a BETA mode. Launch coming soon.<span aria-hidden="true"
          </span
          >
        </a>
      </p>
      <div class="flex flex-1 justify-end">
        <button type="button" class="-m-3 p-3 focus-visible:outline-offset-[-4px]">
          <span class="sr-only">Dismiss</span>
          <XMarkIcon class="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
  <div class="flex flex-1 overflow-hidden">
    <!-- Left Section (dynamically adjusted width) -->
    <div
      :class="['p-8 overflow-y-auto relative', showRightSection ? 'w-full lg:w-8/12' : 'w-full']"
    >
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">Pixel Pulse</h1>
        <label
          class="cursor-pointer bg-white text-black border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          + Upload your designs
          <input type="file" class="hidden" @change="onSelect" multiple accept="image/*" />
        </label>
      </div>

      <div
        class="bg-white border border-gray-300 rounded-lg h-96 flex justify-center items-center mb-8 relative"
      >
        <template v-if="selectedImage">
          <img
            :src="selectedImage"
            alt="Selected Design"
            class="max-w-full max-h-full object-contain"
          />
          <div v-if="highlightedIssue" class="absolute" :style="highlightStyle"></div>
        </template>
        <template v-else>
          <div class="text-center">
            <img
              :src="placeholderImage"
              alt="Upload placeholder"
              class="w-48 h-auto mb-4 mx-auto"
            />
            <p class="text-lg text-gray-700">Upload a PNG or JPG file</p>
            <p class="text-sm text-gray-500">Maximum File Size: 1 MB</p>
          </div>
        </template>
      </div>

      <div v-if="uploadedImages.length > 0">
        <h3 class="text-xl font-semibold mb-4">Uploaded Designs ({{ uploadedImages.length }})</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(image, index) in uploadedImages"
            :key="index"
            class="relative rounded-lg overflow-hidden cursor-pointer h-40"
            :class="{ 'ring-2 ring-blue-500': image === selectedImage }"
            @click="selectImage(image)"
          >
            <img
              :src="image"
              :alt="'Uploaded Design ' + (index + 1)"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded"
            >
              {{ getImageScore(image) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Section (30%) -->
    <div
      v-if="showRightSection"
      class="w-full lg:w-4/12 bg-neutral-100 p-6 overflow-y-auto shadow-lg"
      style="border-left: 1px solid; border-color: #dedede"
    >
      <h2 class="text-2xl font-bold mb-4">Design Diagnostics</h2>
      <div v-if="analysisLoading" class="text-center py-8">
        <img :src="loading" class="w-8 h-8 mx-auto mb-2" />
        <p class="text-gray-600">Analyzing image...</p>
      </div>
      <div v-else-if="analysis" class="space-y-4">
        <div class="bg-white p-4 rounded-lg flex justify-between items-center border">
          <span class="text-lg">Overall</span>
          <span :class="['text-2xl font-bold', getScoreClass(analysis.overallScore)]">
            {{ analysis.overallScore.toFixed(1) }}
          </span>
        </div>
        <div
          v-for="(category, index) in analysis.categories"
          :key="index"
          class="bg-white rounded-lg overflow-hidden border"
        >
          <div
            @click="toggleCard(index)"
            class="p-4 flex justify-between items-center cursor-pointer"
          >
            <div class="flex items-center space-x-4">
              <img :src="getCategoryIcon(category.name)" :alt="category.name" class="w-8 h-8" />
              <span>{{ category.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="['font-bold', getScoreClass(category.score)]">
                {{ category.score.toFixed(1) }}
              </span>
              <svg
                :class="[
                  'w-4 h-4 transform transition-transform',
                  category.expanded ? 'rotate-180' : ''
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
          <div v-if="category.expanded" class="p-4 border-t border-gray-200">
            <div
              v-for="(issue, issueIndex) in category.issues"
              :key="issueIndex"
              class="mb-4 last:mb-0 cursor-pointer"
              @click="highlightIssue(issue)"
              :class="{ 'bg-gray-100': highlightedIssue === issue }"
            >
              <div class="flex items-center mb-1">
                <div
                  :class="['w-2 h-2 rounded-full mr-2', getIssueSeverityClass(issue.severity)]"
                ></div>
                <h4 class="font-semibold text-sm">{{ issue.title }}</h4>
              </div>
              <p class="text-sm text-gray-600 ml-4">{{ issue.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- About Modal -->
  <div
    v-if="showAbout"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg max-w-md">
      <h2 class="text-2xl font-bold mb-4">About Pixel Pulse</h2>
      <p class="mb-4">
        Pixel Pulse is an AI-powered design analysis tool that helps designers and developers
        improve their UI/UX by providing detailed feedback on various aspects of their designs.
      </p>
      <button
        type="button"
        @click=""
        class="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Message Me
      </button>

      <br />
      <button
        @click="showAbout = false"
        class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const hasAnalyzedImage = ref(false)
const analysis = ref(null)
const analysisLoading = ref(false)
const uploadedImages = ref([])
const selectedImage = ref(null)
const showRightSection = ref(false)
const highlightedIssue = ref(null)
const showAbout = ref(false) // Add this line to define showAbout

const stats = [
  { name: 'Number of deploys', value: '405' },
  { name: 'Average deploy time', value: '3.65', unit: 'mins' },
  { name: 'Number of servers', value: '3' },
  { name: 'Success rate', value: '98.5%' }
]

const highlightStyle = computed(() => {
  if (!highlightedIssue.value) return {}
  const { x, y, width, height } = highlightedIssue.value.coordinates
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${width}%`,
    height: `${height}%`,
    backgroundColor: getIssueSeverityColor(highlightedIssue.value.severity),
    opacity: '0.3',
    border: `2px solid ${getIssueSeverityColor(highlightedIssue.value.severity)}`,
    pointerEvents: 'none'
  }
})

const getScoreClass = (score) => {
  if (score >= 8) return 'text-green-500'
  if (score >= 6) return 'text-yellow-500'
  return 'text-red-500'
}

const getIssueSeverityClass = (severity) => {
  switch (severity) {
    case 'high':
      return 'bg-red-500'
    case 'medium':
      return 'bg-yellow-500'
    case 'low':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

const getIssueSeverityColor = (severity) => {
  switch (severity) {
    case 'high':
      return 'rgba(239, 68, 68, 0.7)'
    case 'medium':
      return 'rgba(245, 158, 11, 0.7)'
    case 'low':
      return 'rgba(34, 197, 94, 0.7)'
    default:
      return 'rgba(107, 114, 128, 0.7)'
  }
}

const getCategoryIcon = (categoryName) => {
  switch (categoryName.toLowerCase()) {
    case 'typography':
      return typography
    case 'color usage':
      return color
    case 'layout & composition':
      return layout
    case 'information architecture':
      return ia
    case 'spacing & padding':
      return spacing
    case 'navigation':
      return navigation
    default:
      return pplogo
  }
}

const toggleCard = (index) => {
  if (analysis.value && analysis.value.categories) {
    analysis.value.categories[index].expanded = !analysis.value.categories[index].expanded
  }
}

const highlightIssue = (issue) => {
  highlightedIssue.value = issue
}

// Add this function to get the image score
const getImageScore = (image) => {
  // For now, we'll return a placeholder value
  // In a real implementation, you'd want to store and retrieve actual scores for each image
  return '3.6'
}

const analyzeImage = async (imageData) => {
  showRightSection.value = true
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
                text: `Analyze this image for its design quality from a UX and product design perspective.
                  Provide an overall score out of 10, and detailed sub-scores for the following categories: typography,
                  color usage, layout and composition, information architecture, spacing and padding, and navigation.
                  For each category, identify and describe multiple specific issues, referencing particular elements in the image
                  and offering clear and actionable insights for improvement. Be explicit about which parts of the image the feedback refers to.
                  For each issue, provide coordinates (x, y, width, height as percentages of the image dimensions) to highlight the relevant area.
                  Return the result as a JSON object with the following structure:
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
                            "severity": "low" | "medium" | "high",
                            "coordinates": {
                              "x": 10,
                              "y": 20,
                              "width": 30,
                              "height": 15
                            }
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
                  Ensure all scores are to one decimal place, and that the category names match exactly as shown.
                  IMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON object.`
              },
              { type: 'image_url', image_url: { url: imageData } }
            ]
          }
        ],
        max_tokens: 4000,
        temperature: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (
      response.data &&
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message
    ) {
      const content = response.data.choices[0].message.content

      // Log the raw content for debugging
      console.log('Raw API response:', content)

      // Clean up the content by removing any potential markdown formatting
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim()

      // Parse the cleaned content as JSON
      let parsedContent
      try {
        parsedContent = JSON.parse(cleanedContent)
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
        console.error('Cleaned content:', cleanedContent)
        throw new Error('Invalid JSON response from OpenAI')
      }

      if (parsedContent && parsedContent.overallScore && parsedContent.categories) {
        analysis.value = parsedContent
        analysis.value.categories.forEach((category) => (category.expanded = false))
      } else {
        throw new Error('Unexpected response structure from OpenAI')
      }
    } else {
      throw new Error('Unexpected response format from OpenAI')
    }
  } catch (error) {
    console.error('Error analyzing image:', error)
    if (error.response) {
      console.error('API responded with:', error.response.status, error.response.data)
    }
    analysis.value = null
    // You might want to set an error message to display to the user
    // errorMessage.value = 'An error occurred while analyzing the image. Please try again.'
  } finally {
    analysisLoading.value = false
  }
}

const onSelect = (event) => {
  const files = event.target.files
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
  analyzeImage(image)
}
</script>
