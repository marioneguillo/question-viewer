<template>
  <div class="bg-white rounded-2xl p-8 shadow-sm">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">{{ t('dashboard.calendar.title') }}</h2>
      <div class="flex items-center gap-4">
        <div class="text-sm font-medium text-gray-600">
          {{ currentMonth }} {{ currentYear }}
        </div>
        <div class="flex gap-2">
          <button @click="previousMonth" class="p-1.5 hover:bg-gray-100 rounded-lg">
            <ChevronLeftIcon class="w-4 h-4 text-gray-600" />
          </button>
          <button @click="nextMonth" class="p-1.5 hover:bg-gray-100 rounded-lg">
            <ChevronRightIcon class="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>

    <!-- Contenedor principal dividido -->
    <div class="grid grid-cols-2 gap-8">
      <!-- Lado izquierdo: Calendario -->
      <div>
        <!-- Filtros -->
        <div class="flex gap-3 mb-4">
          <button 
            @click="toggleFilter('practice')"
            class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors"
            :class="filters.practice ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
            {{ t('dashboard.activeTest.practiceMode') }}
          </button>
          <button 
            @click="toggleFilter('certification')"
            class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors"
            :class="filters.certification ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
            {{ t('dashboard.activeTest.certificationMode') }}
          </button>
        </div>

        <!-- Días de la semana -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div v-for="day in weekDays" 
               :key="day" 
               class="text-center text-sm font-medium text-gray-500 py-2">
            {{ t(`dashboard.calendar.days.${day}`) }}
          </div>
        </div>

        <!-- Calendario -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Días del mes -->
          <div v-for="day in calendarDays" :key="day.date || 'empty'" 
               class="relative h-12">
            <button 
              v-if="day.date"
              @click="selectDate(day)"
              class="w-full h-full rounded-lg flex flex-col items-center justify-center transition-colors relative"
              :class="{
                'bg-blue-50': isSelectedDate(day.date),
                'hover:bg-gray-50': !day.hasAttempts && !isSpecialDate(day.date),
                'hover:bg-gray-50/50': day.hasAttempts || isSpecialDate(day.date),
                'bg-green-100': isActivationDate(day.date),
                'bg-red-100': isExpirationDate(day.date),
                'ring-2 ring-blue-500': day.date === today
              }"
            >
              <div class="relative flex flex-col items-center">
                <span class="text-base font-medium">{{ day.dayNumber }}</span>
                <div v-if="day.hasAttempts || isSpecialDate(day.date)" class="mt-1 flex gap-1">
                  <div v-if="day.hasAttempts" class="w-2 h-2 rounded-full"
                       :class="getAttemptTypeColor(day.attemptTypes)">
                  </div>
                  <div v-if="isActivationDate(day.date)" class="w-2 h-2 rounded-full bg-green-500"></div>
                  <div v-if="isExpirationDate(day.date)" class="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
              </div>
            </button>
            <div v-else class="w-full h-full"></div>
          </div>
        </div>
      </div>

      <!-- Detalles del día seleccionado -->
      <div class="border-l border-gray-200 pl-8">
        <div class="h-full flex flex-col">
          <div class="flex-1 overflow-y-auto">
            <div v-if="!selectedDate" class="h-full flex items-center justify-center">
              <div class="text-center">
                <CalendarIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p class="text-base text-gray-500">{{ t('dashboard.calendar.selectDate') }}</p>
              </div>
            </div>
            <div v-else>
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-xl font-medium text-gray-900">
                  {{ formatDate(selectedDate) }}
                </h3>
              </div>
              <div class="space-y-6">
                <!-- Detalles de activación -->
                <div v-if="isActivationDate(selectedDate)" 
                     class="bg-green-50 rounded-xl p-6 border border-green-100">
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-green-100 rounded-lg">
                      <CheckBadgeIcon class="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 class="text-base font-medium text-green-800">
                        {{ t('dashboard.calendar.activationDate') }}
                      </h3>
                      <p class="text-sm text-green-700 mt-2">
                        {{ t('dashboard.calendar.activationDescription') }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Detalles de expiración -->
                <div v-if="isExpirationDate(selectedDate)" 
                     class="bg-red-50 rounded-xl p-6 border border-red-100">
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-red-100 rounded-lg">
                      <ExclamationTriangleIcon class="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 class="text-base font-medium text-red-800">
                        {{ t('dashboard.calendar.expirationDate') }}
                      </h3>
                      <p class="text-sm text-red-700 mt-2">
                        {{ t('dashboard.calendar.expirationDescription') }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Intentos del día -->
                <div v-if="selectedDateAttempts.length > 0" class="space-y-4">
                  <h3 class="text-base font-medium text-gray-900">
                    {{ t('dashboard.calendar.attempts') }}
                  </h3>
                  <div v-for="attempt in selectedDateAttempts" 
                       :key="attempt.id" 
                       class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div class="font-medium text-gray-900">{{ attempt.testName }}</div>
                      <div class="text-sm text-gray-500 mt-1">{{ t('dashboard.activeTest.time') }}: {{ attempt.time }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-medium" :class="getScoreColor(attempt.score)">
                        {{ attempt.score }}%
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ t('dashboard.activeTest.minutes', { minutes: attempt.duration.replace(' min', '') }) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Mensaje cuando no hay intentos -->
                <div v-if="selectedDateAttempts.length === 0 && !isSpecialDate(selectedDate)" 
                     class="text-center py-12">
                  <div class="text-base text-gray-500">
                    {{ t('dashboard.calendar.noAttempts') }}
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const { t } = useTranslation()

// Definir props
const props = defineProps({
  activeTest: {
    type: Object,
    required: true
  }
})

// Estado del calendario
const currentDate = ref(new Date())
const selectedDate = ref(null)
const selectedDateAttempts = ref([])
const filters = ref({
  practice: true,
  certification: true
})

// Fechas especiales del test activo
const activeTestDates = computed(() => ({
  activationDate: props.activeTest?.activationDate || '',
  expirationDate: props.activeTest?.expirationDate || ''
}))

// Filtrar intentos del test activo
const attempts = computed(() => {
  if (!props.activeTest?.attempts) return []
  return props.activeTest.attempts
})

// Funciones auxiliares
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-')
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  return 'text-red-600'
}

const toggleFilter = (type) => {
  filters.value[type] = !filters.value[type]
}

const getAttemptTypeColor = (types) => {
  if (types.includes('certification') && types.includes('practice')) {
    return 'bg-gradient-to-r from-green-500 to-yellow-500'
  }
  if (types.includes('certification')) {
    return 'bg-yellow-500'
  }
  if (types.includes('practice')) {
    return 'bg-green-500'
  }
  return 'bg-gray-500'
}

const selectDate = (day) => {
  selectedDate.value = day.date
  selectedDateAttempts.value = attempts.value.filter(attempt => 
    attempt.date === day.date && 
    filters.value[attempt.type]
  )
}

const isSelectedDate = (date) => {
  return selectedDate.value === date
}

const isSpecialDate = (date) => {
  return isActivationDate(date) || isExpirationDate(date)
}

const isActivationDate = (date) => {
  return date === activeTestDates.value.activationDate
}

const isExpirationDate = (date) => {
  return date === activeTestDates.value.expirationDate
}

// Días de la semana (lunes primero)
const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

// Estado del calendario
const currentMonth = computed(() => {
  return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentDate.value)
})
const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

// Obtener la fecha actual en formato YYYY-MM-DD
const today = computed(() => {
  return formatDateToYYYYMMDD(new Date())
})

// Computed para los días del calendario
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []

  // Agregar espacios vacíos antes del primer día del mes
  const firstDayOfWeek = firstDay.getDay() // 0 = domingo, 1 = lunes, ..., 6 = sábado
  // Ajustar para que la semana empiece en lunes
  const emptyDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  for (let i = 0; i < emptyDays; i++) {
    days.push({
      date: '',
      dayNumber: '',
      isCurrentMonth: false,
      hasAttempts: false,
      attemptTypes: []
    })
  }

  // Agregar días del mes actual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    const dateString = formatDateToYYYYMMDD(date)
    const dayAttempts = attempts.value.filter(attempt => 
      attempt.date === dateString && 
      filters.value[attempt.type]
    )
    
    // Obtener tipos únicos de intentos
    const uniqueAttemptTypes = [...new Set(dayAttempts.map(attempt => attempt.type))]
    
    days.push({
      date: dateString,
      dayNumber: i,
      isCurrentMonth: true,
      hasAttempts: dayAttempts.length > 0,
      attemptTypes: uniqueAttemptTypes
    })
  }

  return days
})

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

// Inicializar el calendario
const initializeCalendar = () => {
  const now = new Date()
  const currentDay = {
    date: formatDateToYYYYMMDD(now),
    dayNumber: now.getDate(),
    isCurrentMonth: true,
    hasAttempts: attempts.value.some(attempt => attempt.date === formatDateToYYYYMMDD(now)),
    attemptTypes: [...new Set(attempts.value
      .filter(attempt => attempt.date === formatDateToYYYYMMDD(now))
      .map(attempt => attempt.type))]
  }
  selectDate(currentDay)
}

// Seleccionar el día actual por defecto
onMounted(() => {
  // Asegurarse de que el mes actual esté visible
  currentDate.value = new Date()
  initializeCalendar()
})

// Observar cambios en el test activo
watch(() => props.activeTest, (newTest) => {
  if (!newTest) return

  // Si no hay fecha seleccionada, inicializar el calendario
  if (!selectedDate.value) {
    initializeCalendar()
  } else {
    // Actualizar la selección de fecha si el día actual no tiene intentos del nuevo test
    const hasAttemptsOnSelectedDate = attempts.value.some(
      attempt => attempt.date === selectedDate.value
    )
    if (!hasAttemptsOnSelectedDate) {
      // Buscar el último intento del nuevo test
      const lastAttempt = attempts.value[attempts.value.length - 1]
      if (lastAttempt) {
        selectDate({
          date: lastAttempt.date,
          dayNumber: new Date(lastAttempt.date).getDate(),
          isCurrentMonth: true,
          hasAttempts: true,
          attemptTypes: [...new Set(attempts.value
            .filter(attempt => attempt.date === lastAttempt.date)
            .map(attempt => attempt.type))]
        })
      }
    }
  }
}, { immediate: true, deep: true })
</script> 