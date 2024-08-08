// useAnalysis.js
import { ref, computed } from 'vue'
import typography from '@/assets/typography.svg'
import color from '@/assets/color.svg'
import layout from '@/assets/layout.svg'
import ia from '@/assets/ia.svg'
import spacing from '@/assets/spacing.svg'
import navigation from '@/assets/navigation.svg'

export function useAnalysis() {
  const analysis = ref(null)
  const expandedCards = ref({})

  const analysisCards = computed(() => {
    if (!analysis.value || !analysis.value.categories) return []

    const iconMap = {
      Typography: typography,
      'Color Usage': color,
      'Layout & Composition': layout,
      'Information Architecture': ia,
      'Spacing & Padding': spacing,
      Navigation: navigation
    }

    return analysis.value.categories.map((category) => ({
      id: category.name.toLowerCase().replace(/ & /g, '').replace(/ /g, ''),
      title: category.name,
      icon: iconMap[category.name],
      score: category.score,
      expanded: !!expandedCards.value[category.name],
      issues: category.issues
    }))
  })

  const toggleCard = (index) => {
    const categoryName = analysis.value.categories[index].name
    expandedCards.value[categoryName] = !expandedCards.value[categoryName]
  }

  const setAnalysis = (newAnalysis) => {
    analysis.value = newAnalysis
    // Initialize all cards as collapsed
    analysis.value.categories.forEach((category) => {
      expandedCards.value[category.name] = false
    })
  }

  return {
    analysis,
    analysisCards,
    toggleCard,
    setAnalysis
  }
}
