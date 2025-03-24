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

const selectedMode = ref('practice')
const selectedOptions = ref({
  objectives: [],
  failedQuestions: false,
  notAttempted: false
})

const launchTest = () => {
  // Implementar lógica de lanzamiento
  console.log('Lanzando test con opciones:', {
    mode: selectedMode.value,
    ...selectedOptions.value
  })
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium">{{ t('reports.test.launch.title') }}</h3>
    
    <!-- Modo de Test -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ t('reports.test.launch.mode') }}
      </label>
      <div class="flex gap-4">
        <button @click="selectedMode = 'practice'"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
                :class="selectedMode === 'practice' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
          {{ t('reports.test.launch.practiceMode') }}
        </button>
        <button @click="selectedMode = 'certification'"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
                :class="selectedMode === 'certification' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
          {{ t('reports.test.launch.certificationMode') }}
        </button>
      </div>
    </div>

    <!-- Opciones de Preguntas -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ t('reports.test.launch.questionOptions') }}
      </label>
      <div class="space-y-2">
        <label class="flex items-center">
          <input type="checkbox" 
                 v-model="selectedOptions.failedQuestions"
                 class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          <span class="ml-2 text-sm text-gray-700">
            {{ t('reports.test.launch.failedQuestions') }}
          </span>
        </label>
        <label class="flex items-center">
          <input type="checkbox" 
                 v-model="selectedOptions.notAttempted"
                 class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          <span class="ml-2 text-sm text-gray-700">
            {{ t('reports.test.launch.notAttempted') }}
          </span>
        </label>
      </div>
    </div>

    <!-- Objetivos -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ t('reports.test.launch.objectives') }}
      </label>
      <div class="space-y-2">
        <div v-for="objective in test.objectives.list" 
             :key="objective.id"
             class="flex items-center">
          <input type="checkbox" 
                 v-model="selectedOptions.objectives"
                 :value="objective.id"
                 class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          <span class="ml-2 text-sm text-gray-700">{{ objective.name }}</span>
        </div>
      </div>
    </div>

    <!-- Botón de Lanzamiento -->
    <button @click="launchTest"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      {{ t('reports.test.launch.start') }}
    </button>
  </div>
</template> 