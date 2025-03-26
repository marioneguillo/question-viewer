<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">{{ t('dashboard.calendar.title') }}</h2>
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

    <!-- Filtros -->
    <div class="flex gap-3 mb-3">
      <button 
        @click="toggleFilter('practice')"
        class="flex items-center gap-1.5 px-2 py-1 text-xs rounded-full transition-colors"
        :class="filters.practice ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        <div class="w-2 h-2 rounded-full bg-green-500"></div>
        {{ t('dashboard.activeTest.practiceMode') }}
      </button>
      <button 
        @click="toggleFilter('certification')"
        class="flex items-center gap-1.5 px-2 py-1 text-xs rounded-full transition-colors"
        :class="filters.certification ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
        {{ t('dashboard.activeTest.certificationMode') }}
      </button>
    </div>

    <!-- Días de la semana -->
    <div class="grid grid-cols-7 gap-0.5 mb-1">
      <span v-for="day in weekDays" :key="day" class="text-center text-xs font-medium text-gray-500">
        {{ t(`dashboard.calendar.days.${day}`) }}
      </span>
    </div>

    <!-- Calendario -->
    <div class="grid grid-cols-7 gap-0.5">
      <div v-for="day in calendarDays" :key="day.date" 
           class="aspect-square p-1 relative">
        <button 
          @click="selectDate(day)"
          class="w-full h-full rounded-lg flex flex-col items-center justify-center transition-colors relative"
          :class="{
            'bg-blue-50': isSelectedDate(day.date),
            'text-gray-400': !day.isCurrentMonth,
            'hover:bg-gray-50': !day.hasAttempts,
            'hover:bg-gray-50/50': day.hasAttempts
          }"
        >
          <div class="relative flex flex-col items-center">
            <span class="text-sm font-medium">{{ day.dayNumber }}</span>
            <div v-if="day.hasAttempts" class="mt-0.5">
              <div class="w-1.5 h-1.5 rounded-full"
                   :class="getAttemptTypeColor(day.attemptTypes)">
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Modal de detalles -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ formatDate(selectedDate) }}
                </DialogTitle>
                <div class="mt-4">
                  <div v-if="selectedDateAttempts.length === 0" class="text-sm text-gray-500">
                    {{ t('dashboard.calendar.noAttempts') }}
                  </div>
                  <div v-else class="space-y-3">
                    <div v-for="attempt in selectedDateAttempts" :key="attempt.id" 
                         class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div class="font-medium text-gray-900">{{ attempt.testName }}</div>
                        <div class="text-sm text-gray-500">{{ t('dashboard.activeTest.time') }}: {{ attempt.time }}</div>
                      </div>
                      <div class="text-right">
                        <div class="font-medium" :class="getScoreColor(attempt.score)">
                          {{ attempt.score }}%
                        </div>
                        <div class="text-sm text-gray-500">{{ t('dashboard.activeTest.minutes', { minutes: attempt.duration.replace(' min', '') }) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-6">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeModal"
                  >
                    {{ t('common.close') }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

const { t } = useTranslation()

const currentDate = ref(new Date())
const selectedDate = ref(null)
const isModalOpen = ref(false)
const selectedDateAttempts = ref([])
const filters = ref({
  practice: true,
  certification: true
})

// Días de la semana
const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

// Datos de ejemplo de intentos (esto debería venir del backend)
const attempts = ref([
  {
    id: 1,
    date: '2025-01-15',
    testName: 'Microsoft Azure Fundamentals (AZ-900)',
    score: 85,
    time: '10:00',
    duration: '45 min',
    type: 'practice'
  },
  {
    id: 2,
    date: '2025-01-16',
    testName: 'Microsoft Azure Fundamentals (AZ-900)',
    score: 78,
    time: '11:00',
    duration: '42 min',
    type: 'practice'
  },
  {
    id: 3,
    date: '2025-01-17',
    testName: 'Microsoft Azure Fundamentals (AZ-900)',
    score: 82,
    time: '12:00',
    duration: '40 min',
    type: 'practice'
  },
  {
    id: 4,
    date: '2025-01-18',
    testName: 'AWS Cloud Practitioner',
    score: 92,
    time: '15:30',
    duration: '35 min',
    type: 'certification'
  },
  {
    id: 5,
    date: '2025-01-19',
    testName: 'Microsoft Azure Fundamentals (AZ-900)',
    score: 80,
    time: '14:00',
    duration: '45 min',
    type: 'practice'
  },
  {
    id: 6,
    date: '2025-01-20',
    testName: 'Docker Fundamentals',
    score: 88,
    time: '11:00',
    duration: '30 min',
    type: 'certification'
  }
])

// Estado del calendario
const currentMonth = computed(() => {
  return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentDate.value)
})
const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

// Computed para los días del calendario
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []

  // Agregar días del mes actual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    const dateString = date.toISOString().split('T')[0]
    const dayAttempts = attempts.value.filter(attempt => 
      attempt.date === dateString && 
      filters.value[attempt.type]
    )
    
    days.push({
      date: dateString,
      dayNumber: i,
      isCurrentMonth: true,
      hasAttempts: dayAttempts.length > 0,
      attemptTypes: dayAttempts.map(attempt => attempt.type)
    })
  }

  return days
})

// Funciones auxiliares
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
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedDate.value = null
  selectedDateAttempts.value = []
}

const isSelectedDate = (date) => {
  return selectedDate.value === date
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
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

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}
</script> 