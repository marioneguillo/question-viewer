<script setup>
import { ref } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const props = defineProps({
  test: {
    type: Object,
    required: true
  }
})

const selectedObjective = ref(null)

const getObjectiveStatus = (objective) => {
  if (objective.mastery >= 80) return 'mastered'
  if (objective.mastery >= 60) return 'improving'
  return 'needs-improvement'
}

const getStatusColor = (status) => {
  const colors = {
    mastered: 'text-green-600 bg-green-50',
    improving: 'text-yellow-600 bg-yellow-50',
    'needs-improvement': 'text-red-600 bg-red-50'
  }
  return colors[status]
}

const getStatusText = (status) => {
  const texts = {
    mastered: t('reports.test.objectives.mastered'),
    improving: t('reports.test.objectives.improving'),
    'needs-improvement': t('reports.test.objectives.needsImprovement')
  }
  return texts[status]
}
</script>

<template>
  <div class="space-y-6">
    <!-- Resumen de Objetivos -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-green-50 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-green-700">{{ t('reports.test.objectives.mastered') }}</span>
          <span class="text-2xl font-semibold text-green-600">{{ test.objectives.masteredCount }}</span>
        </div>
      </div>
      <div class="bg-yellow-50 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-yellow-700">{{ t('reports.test.objectives.improving') }}</span>
          <span class="text-2xl font-semibold text-yellow-600">{{ test.objectives.improvingCount }}</span>
        </div>
      </div>
      <div class="bg-red-50 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-red-700">{{ t('reports.test.objectives.needsImprovement') }}</span>
          <span class="text-2xl font-semibold text-red-600">{{ test.objectives.needsImprovementCount }}</span>
        </div>
      </div>
    </div>

    <!-- Lista de Objetivos -->
    <div class="space-y-4">
      <div v-for="objective in test.objectives.list" 
           :key="objective.id"
           class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
           @click="selectedObjective = objective">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h4 class="font-medium">{{ objective.name }}</h4>
              <span :class="getObjectiveStatus(objective)"
                    class="px-2 py-1 rounded-full text-xs font-medium">
                {{ getStatusText(getObjectiveStatus(objective)) }}
              </span>
            </div>
            <p class="text-sm text-gray-500">{{ objective.description }}</p>
          </div>
          <div class="ml-4">
            <div class="text-right">
              <span class="text-lg font-semibold">{{ objective.mastery }}%</span>
              <div class="w-24 h-2 bg-gray-200 rounded-full mt-1">
                <div class="h-full rounded-full"
                     :class="getObjectiveStatus(objective).includes('green') ? 'bg-green-500' : 
                            getObjectiveStatus(objective).includes('yellow') ? 'bg-yellow-500' : 
                            'bg-red-500'"
                     :style="{ width: `${objective.mastery}%` }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detalles del Objetivo -->
    <div v-if="selectedObjective" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-xl font-semibold">{{ selectedObjective.name }}</h3>
            <button @click="selectedObjective = null" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <div>
              <h4 class="font-medium mb-2">{{ t('reports.test.objectives.description') }}</h4>
              <p class="text-gray-600">{{ selectedObjective.description }}</p>
            </div>

            <div>
              <h4 class="font-medium mb-2">{{ t('reports.test.objectives.questions') }}</h4>
              <div class="space-y-4">
                <div v-for="question in selectedObjective.questions" 
                     :key="question.id"
                     class="border rounded-lg p-4">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="font-medium">{{ question.text }}</p>
                      <p class="text-sm text-gray-500 mt-1">{{ question.explanation }}</p>
                    </div>
                    <span :class="question.correct ? 'text-green-600' : 'text-red-600'"
                          class="ml-4">
                      {{ question.correct ? t('reports.test.objectives.correct') : t('reports.test.objectives.incorrect') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 