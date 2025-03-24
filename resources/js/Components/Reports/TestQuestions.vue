<script setup>
import { ref, computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const props = defineProps({
  test: {
    type: Object,
    required: true
  }
})

const selectedQuestion = ref(null)
const filter = ref('all') // all, correct, incorrect, notAttempted

const filteredQuestions = computed(() => {
  if (filter.value === 'all') return props.test.questions
  return props.test.questions.filter(q => {
    if (filter.value === 'correct') return q.correct
    if (filter.value === 'incorrect') return !q.correct
    return !q.attempted
  })
})

const getQuestionStatus = (question) => {
  if (!question.attempted) return 'not-attempted'
  return question.correct ? 'correct' : 'incorrect'
}

const getStatusColor = (status) => {
  const colors = {
    correct: 'text-green-600 bg-green-50',
    incorrect: 'text-red-600 bg-red-50',
    'not-attempted': 'text-gray-600 bg-gray-50'
  }
  return colors[status]
}

const getStatusText = (status) => {
  const texts = {
    correct: t('reports.test.questions.correct'),
    incorrect: t('reports.test.questions.incorrect'),
    'not-attempted': t('reports.test.questions.notAttempted')
  }
  return texts[status]
}

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
</script>

<template>
  <div class="space-y-6">
    <!-- Filtros -->
    <div class="flex gap-4">
      <button v-for="option in ['all', 'correct', 'incorrect', 'notAttempted']"
              :key="option"
              @click="filter = option"
              class="px-4 py-2 rounded-lg text-sm font-medium"
              :class="filter === option 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
        {{ t(`reports.test.questions.filters.${option}`) }}
      </button>
    </div>

    <!-- Lista de Preguntas -->
    <div class="space-y-4">
      <div v-for="question in filteredQuestions" 
           :key="question.id"
           class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
           @click="selectedQuestion = question">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-medium">{{ question.text }}</span>
              <span :class="getStatusColor(getQuestionStatus(question))"
                    class="px-2 py-1 rounded-full text-xs font-medium">
                {{ getStatusText(getQuestionStatus(question)) }}
              </span>
            </div>
            <p class="text-sm text-gray-500">{{ question.objective }}</p>
          </div>
          <div class="ml-4">
            <div class="text-right">
              <span class="text-sm text-gray-500">{{ t('reports.test.questions.attempts') }}</span>
              <p class="font-medium">{{ question.attempts }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detalles de la Pregunta -->
    <div v-if="selectedQuestion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-xl font-semibold">{{ t('reports.test.questions.details') }}</h3>
            <button @click="selectedQuestion = null" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <!-- Pregunta -->
            <div>
              <h4 class="font-medium mb-2">{{ t('reports.test.questions.question') }}</h4>
              <p class="text-gray-600">{{ selectedQuestion.text }}</p>
            </div>

            <!-- Objetivo -->
            <div>
              <h4 class="font-medium mb-2">{{ t('reports.test.questions.objective') }}</h4>
              <p class="text-gray-600">{{ selectedQuestion.objective }}</p>
            </div>

            <!-- Opciones -->
            <div>
              <h4 class="font-medium mb-2">{{ t('reports.test.questions.options') }}</h4>
              <div class="space-y-2">
                <div v-for="(option, index) in selectedQuestion.options" 
                     :key="index"
                     class="p-3 rounded-lg"
                     :class="{
                       'bg-green-50 border border-green-200': option === selectedQuestion.correctAnswer,
                       'bg-red-50 border border-red-200': option === selectedQuestion.userAnswer && option !== selectedQuestion.correctAnswer,
                       'bg-gray-50 border border-gray-200': option !== selectedQuestion.correctAnswer && option !== selectedQuestion.userAnswer
                     }">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ String.fromCharCode(65 + index) }}.</span>
                    <span>{{ option }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Explicación -->
            <div>
              <h4 class="font-medium mb-2">{{ t('reports.test.questions.explanation') }}</h4>
              <p class="text-gray-600">{{ selectedQuestion.explanation }}</p>
            </div>

            <!-- Historial de Intentos -->
            <div>
              <h4 class="font-medium mb-2">{{ t('reports.test.questions.attemptHistory') }}</h4>
              <div class="space-y-2">
                <div v-for="attempt in selectedQuestion.attemptHistory" 
                     :key="attempt.date"
                     class="flex items-center justify-between text-sm">
                  <span>{{ formatDate(attempt.date) }}</span>
                  <span :class="attempt.correct ? 'text-green-600' : 'text-red-600'">
                    {{ attempt.correct ? t('reports.test.questions.correct') : t('reports.test.questions.incorrect') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 