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

const selectedAttempt = ref(null)

const formatDate = (date) => {
  if (!date) return ''
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return ''
  return dateObj.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const formatDuration = (duration) => {
  if (!duration) return ''
  // Si la duración ya está en formato "45m", devolverla tal cual
  if (duration.endsWith('m')) return duration
  // Si está en formato "45 min", convertirla a "45m"
  if (duration.endsWith(' min')) return duration.replace(' min', 'm')
  // Si no tiene formato, asumir que son minutos y añadir 'm'
  return `${duration}m`
}
</script>

<template>
  <div class="space-y-6">
    <!-- Último Intento -->
    <div v-if="test.lastAttempt" class="bg-gray-50 rounded-xl p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('reports.test.attempts.lastAttempt') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p class="text-sm text-gray-500">{{ t('reports.test.attempts.date') }}</p>
          <p class="font-medium">{{ formatDate(test.lastAttempt.date) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ t('reports.test.attempts.mode') }}</p>
          <p class="font-medium">{{ test.lastAttempt.mode }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ t('reports.test.attempts.score') }}</p>
          <p class="font-medium" :class="test.lastAttempt.passed ? 'text-green-600' : 'text-red-600'">
            {{ test.lastAttempt.score }}%
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ t('reports.test.attempts.duration') }}</p>
          <p class="font-medium">{{ formatDuration(test.lastAttempt.duration) }}</p>
        </div>
      </div>
    </div>

    <!-- Historial de Intentos -->
    <div>
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('reports.test.attempts.history') }}</h3>
      <div class="space-y-4">
        <div v-for="attempt in test.attempts" 
             :key="attempt.id"
             class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
             @click="selectedAttempt = attempt">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ formatDate(attempt.date) }}</p>
              <p class="text-sm text-gray-500">{{ attempt.mode }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium" :class="attempt.passed ? 'text-green-600' : 'text-red-600'">
                {{ attempt.score }}%
              </p>
              <p class="text-sm text-gray-500">{{ formatDuration(attempt.duration) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detalles del Intento Seleccionado -->
    <div v-if="selectedAttempt" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-xl font-semibold">{{ t('reports.test.attempts.details') }}</h3>
            <button @click="selectedAttempt = null" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500">{{ t('reports.test.attempts.date') }}</p>
              <p class="font-medium">{{ formatDate(selectedAttempt.date) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ t('reports.test.attempts.mode') }}</p>
              <p class="font-medium">{{ selectedAttempt.mode }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ t('reports.test.attempts.score') }}</p>
              <p class="font-medium" :class="selectedAttempt.passed ? 'text-green-600' : 'text-red-600'">
                {{ selectedAttempt.score }}%
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ t('reports.test.attempts.duration') }}</p>
              <p class="font-medium">{{ formatDuration(selectedAttempt.duration) }}</p>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="font-medium mb-2">{{ t('reports.test.attempts.questions') }}</h4>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-green-600">{{ t('reports.test.attempts.correct') }}: {{ selectedAttempt.correctAnswers }}</span>
                <span class="text-red-600">{{ t('reports.test.attempts.incorrect') }}: {{ selectedAttempt.incorrectAnswers }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 