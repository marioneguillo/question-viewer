<template>
  <div class="bg-white rounded-xl border p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium text-gray-900">{{ t('reports.test.calendar.title') }}</h3>
      <div class="flex items-center gap-4">
        <button @click="previousWeek" class="p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="text-sm font-medium text-gray-700">{{ currentWeekRange }}</span>
        <button @click="nextWeek" class="p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Días de la semana -->
    <div class="grid grid-cols-7 gap-2 mb-4">
      <div v-for="day in weekDays" :key="day" class="text-center text-sm font-medium text-gray-500">
        {{ t(`reports.test.calendar.days.${day.toLowerCase()}`) }}
      </div>
    </div>

    <!-- Calendario -->
    <div class="grid grid-cols-7 gap-2">
      <div v-for="day in calendarDays" :key="day.date" 
           class="aspect-square p-2 border rounded-lg relative group"
           :class="{
             'bg-gray-50': !day.isCurrentMonth,
             'hover:bg-gray-50 cursor-pointer': day.hasActivity
           }"
           @click="day.hasActivity && showDayDetails(day)">
        <div class="text-sm font-medium mb-1" :class="{ 'text-gray-400': !day.isCurrentMonth }">
          {{ day.dayNumber }}
        </div>
        
        <!-- Indicadores de actividad -->
        <div v-if="day.hasActivity" class="space-y-1">
          <div v-for="attempt in day.attempts" :key="attempt.id"
               class="text-xs p-1 rounded"
               :class="{
                 'bg-blue-100 text-blue-800': attempt.mode === 'certification',
                 'bg-green-100 text-green-800': attempt.mode === 'practice'
               }">
            <div class="font-medium">
              {{ attempt.mode === 'certification' ? t('reports.test.calendar.certification') : t('reports.test.calendar.practice') }}
            </div>
            <div class="mt-0.5">
              {{ attempt.score }}%
            </div>
          </div>
        </div>

        <!-- Tooltip de previsualización -->
        <div v-if="day.hasActivity" 
             class="absolute z-10 invisible group-hover:visible bg-white border rounded-lg shadow-lg p-3 w-64 mt-2 left-1/2 transform -translate-x-1/2">
          <div class="text-sm font-medium text-gray-900 mb-2">{{ formatDate(day.date) }}</div>
          <div class="space-y-2">
            <div v-for="attempt in day.attempts" :key="attempt.id" class="text-xs">
              <div class="flex items-center justify-between">
                <span class="font-medium">{{ attempt.mode === 'certification' ? t('reports.test.calendar.certification') : t('reports.test.calendar.practice') }}</span>
                <span class="text-gray-500">{{ formatTime(attempt.date) }}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <span class="text-gray-500">{{ t('reports.test.calendar.score') }}:</span>
                  <span class="font-medium ml-1">{{ attempt.score }}%</span>
                </div>
                <div>
                  <span class="text-gray-500">{{ t('reports.test.calendar.duration') }}:</span>
                  <span class="font-medium ml-1">{{ formatDuration(attempt.duration) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">{{ t('reports.test.calendar.questions') }}:</span>
                  <span class="font-medium ml-1">{{ attempt.correctAnswers + attempt.incorrectAnswers }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del día -->
    <div v-if="selectedDay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-medium text-gray-900">
            {{ formatDate(selectedDay.date) }}
          </h4>
          <button @click="selectedDay = null" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="attempt in selectedDay.attempts" :key="attempt.id"
               class="p-4 rounded-lg border">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium"
                    :class="{
                      'text-blue-800': attempt.mode === 'certification',
                      'text-green-800': attempt.mode === 'practice'
                    }">
                {{ attempt.mode === 'certification' ? t('reports.test.calendar.certification') : t('reports.test.calendar.practice') }}
              </span>
              <span class="text-sm text-gray-500">{{ formatTime(attempt.date) }}</span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">{{ t('reports.test.calendar.score') }}:</span>
                <span class="font-medium ml-1">{{ attempt.score }}%</span>
              </div>
              <div>
                <span class="text-gray-500">{{ t('reports.test.calendar.duration') }}:</span>
                <span class="font-medium ml-1">{{ formatDuration(attempt.duration) }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ t('reports.test.calendar.questions') }}:</span>
                <span class="font-medium ml-1">{{ attempt.correctAnswers + attempt.incorrectAnswers }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ t('reports.test.calendar.correctAnswers') }}:</span>
                <span class="font-medium ml-1">{{ attempt.correctAnswers }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ t('reports.test.calendar.incorrectAnswers') }}:</span>
                <span class="font-medium ml-1">{{ attempt.incorrectAnswers }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps({
  test: {
    type: Object,
    required: true
  }
})

const { t } = useTranslation()

const currentDate = ref(new Date())
const selectedDay = ref(null)

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentWeekRange = computed(() => {
  const start = new Date(currentDate.value)
  start.setDate(start.getDate() - start.getDay())
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return `${formatDate(start)} - ${formatDate(end)}`
})

const calendarDays = computed(() => {
  const start = new Date(currentDate.value)
  start.setDate(start.getDate() - start.getDay())
  const days = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    const dayNumber = date.getDate()
    const isCurrentMonth = date.getMonth() === currentDate.value.getMonth()
    
    // Buscar intentos para este día
    const attempts = props.test.attempts.filter(attempt => {
      const attemptDate = new Date(attempt.date)
      return attemptDate.getDate() === date.getDate() &&
             attemptDate.getMonth() === date.getMonth() &&
             attemptDate.getFullYear() === date.getFullYear()
    })
    
    days.push({
      date: formatDate(date),
      dayNumber,
      isCurrentMonth,
      hasActivity: attempts.length > 0,
      attempts
    })
  }
  
  return days
})

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function formatTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function formatDuration(duration) {
  if (!duration) return ''
  // Si la duración ya está en formato "45m", devolverla tal cual
  if (duration.endsWith('m')) return duration
  // Si está en formato "45 min", convertirla a "45m"
  if (duration.endsWith(' min')) return duration.replace(' min', 'm')
  // Si no tiene formato, asumir que son minutos y añadir 'm'
  return `${duration}m`
}

function previousWeek() {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() - 7)
  currentDate.value = newDate
}

function nextWeek() {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + 7)
  currentDate.value = newDate
}

function showDayDetails(day) {
  selectedDay.value = day
}
</script> 