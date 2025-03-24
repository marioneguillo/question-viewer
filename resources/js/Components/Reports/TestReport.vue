<script setup>
import { ref } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import TestAttempts from './TestAttempts.vue'
import TestObjectives from './TestObjectives.vue'
import TestCalendar from './TestCalendar.vue'
import TestQuestions from './TestQuestions.vue'
import TestLaunchOptions from './TestLaunchOptions.vue'
import { generateTestReport } from '@/services/reportGenerator'

const { t } = useTranslation()

const props = defineProps({
  test: {
    type: Object,
    required: true
  }
})

const activeTab = ref('attempts')
const tabs = [
  { id: 'attempts', label: t('reports.test.tabs.attempts') },
  { id: 'objectives', label: t('reports.test.tabs.objectives') },
  { id: 'calendar', label: t('reports.test.tabs.calendar') },
  { id: 'questions', label: t('reports.test.tabs.questions') }
]

const handleDownload = () => {
  generateTestReport(props.test)
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
    <!-- Encabezado del Reporte -->
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ test.name }}</h2>
          <p class="text-sm text-gray-500 mt-1">{{ test.description }}</p>
        </div>
        <button @click="handleDownload" 
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {{ t('reports.test.download') }}
        </button>
      </div>
    </div>

    <!-- Pestañas de Navegación -->
    <div class="border-b border-gray-100">
      <nav class="flex space-x-8 px-6" aria-label="Tabs">
        <button v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Contenido de las Pestañas -->
    <div class="p-6">
      <TestAttempts v-if="activeTab === 'attempts'" :test="test" />
      <TestObjectives v-if="activeTab === 'objectives'" :test="test" />
      <TestCalendar v-if="activeTab === 'calendar'" :test="test" />
      <TestQuestions v-if="activeTab === 'questions'" :test="test" />
    </div>

    <!-- Opciones de Lanzamiento de Test -->
    <div class="p-6 border-t border-gray-100">
      <TestLaunchOptions :test="test" />
    </div>
  </div>
</template> 