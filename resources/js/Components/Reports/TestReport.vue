<script setup>
import { ref, computed, watch } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import TestAttempts from './TestAttempts.vue'
import TestObjectives from './TestObjectives.vue'
import TestCalendar from './TestCalendar.vue'
import TestQuestions from './TestQuestions.vue'
import { generateTestReport } from '@/services/reportGenerator'

const { t } = useTranslation()

const props = defineProps({
  test: {
    type: Object,
    required: true
  }
})

const activeTab = ref('attempts')
const showAttemptsModal = ref(false)
const showCalendarModal = ref(false)
const selectedAttempt = ref(null)
const questionFilter = ref('all') // all, correct, incorrect, unanswered
const searchQuery = ref('')
const selectedQuestion = ref(null)
const showQuestionModal = ref(false)
const showActionsMenu = ref(false)

const tabs = [
  { id: 'attempts', label: t('reports.test.tabs.attempts') },
  { id: 'objectives', label: t('reports.test.tabs.objectives') },
  { id: 'calendar', label: t('reports.test.tabs.calendar') },
  { id: 'questions', label: t('reports.test.tabs.questions') }
]

// Datos de ejemplo para las preguntas
const sampleQuestions = [
  {
    id: 1,
    text: "¿Cuál es el servicio de Azure que permite crear y gestionar contenedores Docker?",
    options: [
      { id: 'A', text: "Azure Container Instances", correct: true },
      { id: 'B', text: "Azure Kubernetes Service", correct: false },
      { id: 'C', text: "Azure App Service", correct: false },
      { id: 'D', text: "Azure Functions", correct: false }
    ],
    explanation: "Azure Container Instances es el servicio más simple para ejecutar contenedores Docker en Azure sin necesidad de gestionar servidores.",
    correct: true,
    answered: true,
    userAnswer: 'A'
  },
  {
    id: 2,
    text: "¿Qué es Azure Key Vault?",
    options: [
      { id: 'A', text: "Un servicio de almacenamiento de archivos", correct: false },
      { id: 'B', text: "Un servicio de gestión de secretos y claves", correct: true },
      { id: 'C', text: "Un servicio de bases de datos", correct: false },
      { id: 'D', text: "Un servicio de red", correct: false }
    ],
    explanation: "Azure Key Vault es un servicio de gestión de secretos que permite almacenar y gestionar claves, contraseñas y certificados de forma segura.",
    correct: false,
    answered: true,
    userAnswer: 'C'
  },
  {
    id: 3,
    text: "¿Cuál es el servicio de Azure para análisis de datos en tiempo real?",
    options: [
      { id: 'A', text: "Azure Stream Analytics", correct: true },
      { id: 'B', text: "Azure Data Lake", correct: false },
      { id: 'C', text: "Azure SQL Database", correct: false },
      { id: 'D', text: "Azure Cosmos DB", correct: false }
    ],
    explanation: "Azure Stream Analytics es un servicio de análisis en tiempo real que permite procesar y analizar datos de streaming.",
    correct: true,
    answered: true,
    userAnswer: 'A'
  },
  {
    id: 4,
    text: "¿Qué es Azure Active Directory?",
    options: [
      { id: 'A', text: "Un servicio de almacenamiento", correct: false },
      { id: 'B', text: "Un servicio de red", correct: false },
      { id: 'C', text: "Un servicio de identidad y acceso", correct: true },
      { id: 'D', text: "Un servicio de bases de datos", correct: false }
    ],
    explanation: "Azure AD es un servicio de identidad y acceso que permite gestionar usuarios, grupos y permisos en la nube.",
    correct: false,
    answered: true,
    userAnswer: 'B'
  },
  {
    id: 5,
    text: "¿Qué es Azure Functions?",
    options: [
      { id: 'A', text: "Un servicio de bases de datos", correct: false },
      { id: 'B', text: "Un servicio de almacenamiento", correct: false },
      { id: 'C', text: "Un servicio serverless para ejecutar código", correct: true },
      { id: 'D', text: "Un servicio de red", correct: false }
    ],
    explanation: "Azure Functions es un servicio serverless que permite ejecutar código sin preocuparse por la infraestructura.",
    correct: true,
    answered: true,
    userAnswer: 'C'
  },
  {
    id: 6,
    text: "¿Cuál es el servicio de Azure para bases de datos SQL?",
    options: [
      { id: 'A', text: "Azure Cosmos DB", correct: false },
      { id: 'B', text: "Azure SQL Database", correct: true },
      { id: 'C', text: "Azure Table Storage", correct: false },
      { id: 'D', text: "Azure Data Lake", correct: false }
    ],
    explanation: "Azure SQL Database es el servicio de base de datos SQL completamente administrado en Azure.",
    correct: false,
    answered: true,
    userAnswer: 'A'
  }
]

// Asignar preguntas a objetivos
const assignQuestionsToObjectives = () => {
  if (selectedAttempt.value) {
    selectedAttempt.value.questions = sampleQuestions
    // Asignar preguntas a objetivos
    props.test.objectives.list.forEach(objective => {
      objective.questions = sampleQuestions.filter(q => {
        // Asignar preguntas basadas en el tema del objetivo
        switch (objective.name) {
          case 'Fundamentos de Azure':
            return [1, 2].includes(q.id)
          case 'Servicios de Computación':
            return [3, 5].includes(q.id)
          case 'Servicios de Almacenamiento':
            return [4, 6].includes(q.id)
          default:
            return true
        }
      })
    })
  }
}

// Computed properties para estadísticas
const statistics = computed(() => {
  if (!selectedAttempt.value?.questions) return {
    total: 0,
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    correctPercentage: 0,
    incorrectPercentage: 0,
    unansweredPercentage: 0
  }
  
  const totalQuestions = selectedAttempt.value.questions.length
  const correctAnswers = selectedAttempt.value.questions.filter(q => q.correct).length
  const incorrectAnswers = selectedAttempt.value.questions.filter(q => !q.correct).length
  const unansweredQuestions = totalQuestions - (correctAnswers + incorrectAnswers)
  
  return {
    total: totalQuestions,
    correct: correctAnswers,
    incorrect: incorrectAnswers,
    unanswered: unansweredQuestions,
    correctPercentage: (correctAnswers / totalQuestions) * 100,
    incorrectPercentage: (incorrectAnswers / totalQuestions) * 100,
    unansweredPercentage: (unansweredQuestions / totalQuestions) * 100
  }
})

// Filtrar preguntas según el filtro seleccionado
const filteredQuestions = computed(() => {
  if (!selectedAttempt.value?.questions) return []
  
  let questions = selectedAttempt.value.questions
  
  // Aplicar filtro de estado
  if (questionFilter.value !== 'all') {
    questions = questions.filter(q => {
      switch (questionFilter.value) {
        case 'correct':
          return q.correct
        case 'incorrect':
          return !q.correct
        case 'unanswered':
          return !q.correct && !q.answered
        default:
          return true
      }
    })
  }
  
  // Aplicar búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    questions = questions.filter(q => 
      q.text.toLowerCase().includes(query) ||
      q.explanation.toLowerCase().includes(query)
    )
  }
  
  return questions
})

const handleDownload = () => {
  generateTestReport(props.test, t)
}

const handleEmail = () => {
  console.log('Enviar por email')
}

const selectAttempt = (attempt) => {
  selectedAttempt.value = attempt
  // Asignar preguntas al intento seleccionado
  selectedAttempt.value.questions = sampleQuestions
  // Asignar preguntas a objetivos
  props.test.objectives.list.forEach(objective => {
    objective.questions = sampleQuestions.filter(q => {
      // Asignar preguntas basadas en el tema del objetivo
      switch (objective.name) {
        case 'Fundamentos de Azure':
          return [1, 2].includes(q.id)
        case 'Servicios de Computación':
          return [3, 5].includes(q.id)
        case 'Servicios de Almacenamiento':
          return [4, 6].includes(q.id)
        default:
          return true
      }
    })
  })
}

// Añadir función para ordenar intentos
const sortedAttempts = computed(() => {
  return [...props.test.attempts].sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  if (!dateString) return '00:00'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '00:00'
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '00:00'
  }
}

const formatDuration = (duration) => {
  if (!duration) return '00:00'
  try {
    const [hours, minutes] = duration.split(':').map(Number)
    if (isNaN(hours) || isNaN(minutes)) return '00:00'
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  } catch (error) {
    return '00:00'
  }
}

const openQuestionModal = (question) => {
  selectedQuestion.value = question
  showQuestionModal.value = true
}

const closeQuestionModal = () => {
  selectedQuestion.value = null
  showQuestionModal.value = false
}

// Computed properties para estadísticas generales
const generalStatistics = computed(() => {
  if (!props.test.attempts?.length) return {
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    worstScore: 0,
    totalTime: '00:00',
    averageTime: '00:00',
    passRate: 0,
    improvement: 0
  }

  const scores = props.test.attempts.map(a => a.score)
  const times = props.test.attempts.map(a => {
    if (!a.duration) return 0
    try {
      const [hours, minutes] = a.duration.split(':').map(Number)
      if (isNaN(hours) || isNaN(minutes)) return 0
      return hours * 60 + minutes
    } catch (error) {
      return 0
    }
  })

  const totalMinutes = times.reduce((a, b) => a + b, 0)
  const averageMinutes = Math.round(totalMinutes / times.length)

  return {
    totalAttempts: props.test.attempts.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.max(...scores),
    worstScore: Math.min(...scores),
    totalTime: `${Math.floor(totalMinutes / 60).toString().padStart(2, '0')}:${(totalMinutes % 60).toString().padStart(2, '0')}`,
    averageTime: `${Math.floor(averageMinutes / 60).toString().padStart(2, '0')}:${(averageMinutes % 60).toString().padStart(2, '0')}`,
    passRate: Math.round((props.test.attempts.filter(a => a.passed).length / props.test.attempts.length) * 100),
    improvement: scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0
  }
})

// Añadir función para obtener el último intento
const getLastAttempt = computed(() => {
  return sortedAttempts.value[0] || null
})

// Modificar el watch para inicializar selectedAttempt
watch(() => props.test, (newTest) => {
  if (newTest && newTest.attempts?.length) {
    selectedAttempt.value = getLastAttempt.value
    if (selectedAttempt.value) {
      selectAttempt(selectedAttempt.value)
    }
  }
}, { immediate: true })

// Añadir ref para el buscador de intentos
const attemptSearchQuery = ref('')

// Añadir computed para filtrar intentos
const filteredAttempts = computed(() => {
  if (!attemptSearchQuery.value) return sortedAttempts.value
  
  const query = attemptSearchQuery.value.toLowerCase()
  return sortedAttempts.value.filter(attempt => {
    const date = formatDate(attempt.date).toLowerCase()
    const time = formatTime(attempt.date).toLowerCase()
    const score = attempt.score.toString()
    const duration = attempt.duration.toLowerCase()
    const mode = attempt.mode?.toLowerCase() || ''
    
    return date.includes(query) || 
           time.includes(query) || 
           score.includes(query) || 
           duration.includes(query) || 
           mode.includes(query)
  })
})

// Reemplazar el array de actions por funciones individuales
const handlePrint = () => {
  window.print()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Resumen General -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900">Resumen General</h3>
          <p class="text-sm text-gray-500">Estadísticas de todos los intentos</p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="showCalendarModal = true"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-sm hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            <svg class="w-5 h-5 mr-2 text-purple-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendario
          </button>
          <button
            @click="showAttemptsModal = true"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-sm hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg class="w-5 h-5 mr-2 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Revisar Intentos
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Total Intentos</p>
          <p class="mt-1 text-2xl font-semibold text-gray-900">{{ generalStatistics.totalAttempts }}</p>
          <p class="text-xs text-gray-500">Tasa de aprobación: {{ generalStatistics.passRate }}%</p>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Puntuación Media</p>
          <p class="mt-1 text-2xl font-semibold text-gray-900">{{ generalStatistics.averageScore }}%</p>
          <p class="text-xs text-gray-500">
            Mejor: {{ generalStatistics.bestScore }}% | Peor: {{ generalStatistics.worstScore }}%
          </p>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Tiempo Total</p>
          <p class="mt-1 text-2xl font-semibold text-gray-900">{{ generalStatistics.totalTime }}</p>
          <p class="text-xs text-gray-500">Promedio: {{ generalStatistics.averageTime }}</p>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Progreso</p>
          <p class="mt-1 text-2xl font-semibold" :class="{
            'text-green-600': generalStatistics.improvement > 0,
            'text-red-600': generalStatistics.improvement < 0,
            'text-gray-900': generalStatistics.improvement === 0
          }">
            {{ generalStatistics.improvement > 0 ? '+' : '' }}{{ generalStatistics.improvement }}%
          </p>
          <p class="text-xs text-gray-500">Desde el primer intento</p>
        </div>
      </div>
    </div>

    <!-- Modal de Calendario -->
    <div v-if="showCalendarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Calendario de Intentos</h3>
            <button @click="showCalendarModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <TestCalendar 
            :attempts="props.test.attempts"
            @select-date="(date) => {
              const attempts = props.test.attempts.filter(attempt => {
                const attemptDate = new Date(attempt.date)
                return attemptDate.toDateString() === date.toDateString()
              })
              if (attempts.length > 0) {
                selectedAttempt = attempts[0]
                showCalendarModal = false
                showAttemptsModal = false
              }
            }"
          />
        </div>
      </div>
    </div>

    <!-- Modal de Selección de Intentos -->
    <div v-if="showAttemptsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">Historial de Intentos</h3>
            <button @click="showAttemptsModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Buscador de Intentos -->
          <div class="mb-6">
            <div class="relative">
              <input
                v-model="attemptSearchQuery"
                type="text"
                placeholder="Buscar por fecha, hora, puntuación..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Listado de Intentos -->
          <div class="space-y-3">
            <div
              v-for="attempt in filteredAttempts"
              :key="attempt.id"
              class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              :class="{
                'ring-2 ring-blue-500': selectedAttempt?.id === attempt.id
              }"
              @click="selectAttempt(attempt); showAttemptsModal = false"
            >
              <div class="p-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-4">
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ formatDate(attempt.date) }}</p>
                        <p class="text-xs text-gray-500">{{ formatTime(attempt.date) }}</p>
                      </div>
                      <div class="text-sm">
                        <span class="font-medium" :class="{
                          'text-purple-600': attempt.mode === 'certification',
                          'text-blue-600': attempt.mode === 'practice'
                        }">
                          {{ attempt.mode === 'certification' ? 'Certificación' : 'Práctica' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-6">
                    <div class="text-right">
                      <p class="text-sm font-medium text-gray-500">Duración</p>
                      <p class="text-sm text-gray-900">{{ formatDuration(attempt.duration) }}</p>
                    </div>
                    
                    <div class="text-right">
                      <p class="text-sm font-medium text-gray-500">Puntuación</p>
                      <p class="text-sm font-semibold" :class="{
                        'text-green-600': attempt.passed,
                        'text-red-600': !attempt.passed
                      }">
                        {{ attempt.score }}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje cuando no hay resultados -->
            <div v-if="filteredAttempts.length === 0" class="text-center py-8 text-gray-500">
              No se encontraron intentos que coincidan con la búsqueda
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detalles del Intento Seleccionado -->
    <div v-if="selectedAttempt" class="space-y-6">
      <!-- Contenedor Unificado -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <!-- Encabezado del Intento -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8">
            <div>
              <h3 class="text-lg sm:text-xl font-medium text-gray-900">Resumen del Intento</h3>
              <p class="text-sm text-gray-500">{{ formatDate(selectedAttempt.date) }} - {{ formatTime(selectedAttempt.date) }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-4 sm:gap-6">
              <div class="flex items-center space-x-3">
                <div class="w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center" :class="{
                  'bg-green-100': selectedAttempt.passed,
                  'bg-red-100': !selectedAttempt.passed
                }">
                  <span class="text-xl sm:text-2xl font-bold" :class="{
                    'text-green-600': selectedAttempt.passed,
                    'text-red-600': !selectedAttempt.passed
                  }">
                    {{ selectedAttempt.score }}%
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Puntuación</p>
                  <p class="text-sm font-semibold" :class="{
                    'text-green-600': selectedAttempt.passed,
                    'text-red-600': !selectedAttempt.passed
                  }">
                    {{ selectedAttempt.passed ? 'Aprobado' : 'No Aprobado' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg class="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Duración</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formatDuration(selectedAttempt.duration) }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="handleDownload"
                  class="inline-flex items-center p-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  title="Descargar PDF"
                >
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button
                  @click="handleEmail"
                  class="inline-flex items-center p-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  title="Enviar por Email"
                >
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de Preguntas -->
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h4 class="text-lg font-medium text-gray-900">Resumen de Preguntas</h4>
            <div class="text-sm text-gray-500">
              Total: <span class="font-semibold text-gray-900">{{ statistics.total }}</span> preguntas
            </div>
          </div>

          <div class="grid grid-cols-3 gap-6">
            <button
              @click="questionFilter = questionFilter === 'correct' ? 'all' : 'correct'"
              class="bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors duration-200"
              :class="{
                'ring-2 ring-green-500': questionFilter === 'correct'
              }"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Correctas</p>
                  <p class="text-2xl font-bold text-green-600">{{ statistics.correct }}</p>
                  <p class="text-xs text-gray-500">{{ statistics.correctPercentage.toFixed(1) }}%</p>
                </div>
              </div>
            </button>

            <button
              @click="questionFilter = questionFilter === 'incorrect' ? 'all' : 'incorrect'"
              class="bg-red-50 rounded-lg p-4 hover:bg-red-100 transition-colors duration-200"
              :class="{
                'ring-2 ring-red-500': questionFilter === 'incorrect'
              }"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-red-100 rounded-lg">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Incorrectas</p>
                  <p class="text-2xl font-bold text-red-600">{{ statistics.incorrect }}</p>
                  <p class="text-xs text-gray-500">{{ statistics.incorrectPercentage.toFixed(1) }}%</p>
                </div>
              </div>
            </button>

            <button
              @click="questionFilter = questionFilter === 'unanswered' ? 'all' : 'unanswered'"
              class="bg-yellow-50 rounded-lg p-4 hover:bg-yellow-100 transition-colors duration-200"
              :class="{
                'ring-2 ring-yellow-500': questionFilter === 'unanswered'
              }"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-yellow-100 rounded-lg">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Sin Responder</p>
                  <p class="text-2xl font-bold text-yellow-600">{{ statistics.unanswered }}</p>
                  <p class="text-xs text-gray-500">{{ statistics.unansweredPercentage.toFixed(1) }}%</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Objetivos y Preguntas -->
        <div class="p-4 sm:p-6">
          <h4 class="text-lg font-medium text-gray-900 mb-4">{{ t('reports.test.objectives.title') }}</h4>
          <div class="space-y-4">
            <div
              v-for="objective in test.objectives.list"
              :key="objective.id"
              class="bg-gray-50 rounded-lg p-4"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-2">
                <h5 class="font-medium text-gray-900">{{ objective.name }}</h5>
                <span
                  class="px-2 py-1 text-sm font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': objective.mastery >= 80,
                    'bg-yellow-100 text-yellow-800': objective.mastery >= 60 && objective.mastery < 80,
                    'bg-red-100 text-red-800': objective.mastery < 60
                  }"
                >
                  {{ objective.mastery }}%
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-3">{{ objective.description }}</p>
              
              <!-- Preguntas del Objetivo -->
              <div class="space-y-2">
                <div
                  v-for="question in objective.questions.filter(q => 
                    filteredQuestions.some(fq => fq.id === q.id)
                  )"
                  :key="question.id"
                  class="flex items-start space-x-3 bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  @click="openQuestionModal(question)"
                >
                  <span
                    class="mt-1 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                    :class="{
                      'bg-green-100 text-green-800': question.correct,
                      'bg-red-100 text-red-800': !question.correct,
                      'bg-yellow-100 text-yellow-800': !question.correct && !question.answered
                    }"
                  >
                    {{ question.correct ? '✓' : question.answered ? '✗' : '?' }}
                  </span>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ question.text }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ question.explanation }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles de Pregunta -->
    <div v-if="showQuestionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-medium text-gray-900">Detalles de la Pregunta</h3>
            <button @click="closeQuestionModal" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedQuestion" class="space-y-4">
            <div class="flex items-start space-x-3">
              <span
                class="mt-1 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                :class="{
                  'bg-green-100 text-green-800': selectedQuestion.correct,
                  'bg-red-100 text-red-800': !selectedQuestion.correct
                }"
              >
                {{ selectedQuestion.correct ? '✓' : '✗' }}
              </span>
              <p class="text-base text-gray-900">{{ selectedQuestion.text }}</p>
            </div>

            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-700">Opciones:</p>
              <div class="space-y-2">
                <div
                  v-for="option in selectedQuestion.options"
                  :key="option.id"
                  class="p-3 rounded-lg border"
                  :class="{
                    'border-green-500 bg-green-50': option.correct,
                    'border-red-500 bg-red-50': !option.correct && option.id === selectedQuestion.userAnswer,
                    'border-gray-200': !option.correct && option.id !== selectedQuestion.userAnswer
                  }"
                >
                  <div class="flex items-center">
                    <span class="font-medium mr-2">{{ option.id }}.</span>
                    <span>{{ option.text }}</span>
                    <span v-if="option.correct" class="ml-2 text-green-600">(Correcta)</span>
                    <span v-if="!option.correct && option.id === selectedQuestion.userAnswer" class="ml-2 text-red-600">(Tu respuesta)</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-blue-800 mb-1">Explicación:</p>
              <p class="text-sm text-blue-700">{{ selectedQuestion.explanation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 