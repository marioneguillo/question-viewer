<template>
  <div class="bg-white rounded-lg p-4">
    <!-- Encabezado del Calendario -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <button
          @click="previousMonth"
          class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 class="text-sm font-medium text-gray-900">
          {{ currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) }}
        </h3>
        <button
          @click="nextMonth"
          class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Días de la semana -->
    <div class="grid grid-cols-7 gap-0.5 mb-1">
      <div
        v-for="day in ['D', 'L', 'M', 'X', 'J', 'V', 'S']"
        :key="day"
        class="text-center text-xs font-medium text-gray-500"
      >
        {{ day }}
      </div>
    </div>

    <!-- Días del mes -->
    <div class="grid grid-cols-7 gap-0.5">
      <button
        v-for="day in daysInMonth"
        :key="day.date.toISOString()"
        @click="selectDate(day.date)"
        class="aspect-square p-1 rounded-md text-xs transition-colors duration-200 relative"
        :class="{
          'text-gray-300': !day.isCurrentMonth,
          'text-gray-900': day.isCurrentMonth,
          'bg-indigo-50 hover:bg-indigo-100': day.hasAttempts,
          'hover:bg-gray-50': !day.hasAttempts,
          'ring-1 ring-indigo-500': selectedDate && selectedDate.toDateString() === day.date.toDateString()
        }"
      >
        {{ day.date.getDate() }}
        <div
          v-if="day.hasAttempts"
          class="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500"
        ></div>
      </button>
    </div>

    <!-- Detalles de intentos del día seleccionado -->
    <div v-if="selectedDate && getAttemptsForDate(selectedDate).length > 0" class="mt-4">
      <h4 class="text-xs font-medium text-gray-900 mb-2">
        Intentos del {{ formatDate(selectedDate) }}
      </h4>
      <div class="space-y-1.5">
        <div
          v-for="attempt in getAttemptsForDate(selectedDate)"
          :key="attempt.id"
          class="bg-gray-50 rounded-md p-2"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-900">{{ formatTime(attempt.date) }}</p>
              <p class="text-xs text-gray-500">
                {{ attempt.mode === 'certification' ? 'Certificación' : 'Práctica' }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold" :class="{
                'text-green-600': attempt.passed,
                'text-red-600': !attempt.passed
              }">
                {{ attempt.score }}%
              </p>
              <p class="text-xs text-gray-500">{{ formatDuration(attempt.duration) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  attempts: {
    type: Array,
    required: true
  }
})

const currentDate = ref(new Date())
const selectedDate = ref(null)

// Generar días del mes actual
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []

  // Añadir días del mes anterior
  const firstDayWeekday = firstDay.getDay()
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date,
      isCurrentMonth: false,
      hasAttempts: hasAttemptsOnDate(date)
    })
  }

  // Añadir días del mes actual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      isCurrentMonth: true,
      hasAttempts: hasAttemptsOnDate(date)
    })
  }

  // Añadir días del mes siguiente
  const remainingDays = 42 - days.length // 6 semanas * 7 días = 42
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      isCurrentMonth: false,
      hasAttempts: hasAttemptsOnDate(date)
    })
  }

  return days
})

// Verificar si hay intentos en una fecha específica
const hasAttemptsOnDate = (date) => {
  return props.attempts.some(attempt => {
    const attemptDate = new Date(attempt.date)
    return attemptDate.toDateString() === date.toDateString()
  })
}

// Obtener intentos de una fecha específica
const getAttemptsForDate = (date) => {
  return props.attempts.filter(attempt => {
    const attemptDate = new Date(attempt.date)
    return attemptDate.toDateString() === date.toDateString()
  })
}

// Navegar entre meses
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

// Formatear fecha
const formatDate = (date) => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Formatear hora
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

// Formatear duración
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

const emit = defineEmits(['select-date'])

const selectDate = (date) => {
  selectedDate.value = date
  emit('select-date', date)
}
</script> 