<template>
  <AppLayout>
    <div class="space-y-8">
      <!-- Saludo -->
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-light text-gray-900">{{ t('common.welcome', { name: user.name }) }}</h2>
      </div>

      <!-- Panel de Test Activo -->
      <div class="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
        <div class="max-w-7xl mx-auto">
          <!-- Test Activo -->
          <div v-if="activeTest" class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <!-- Encabezado con degradado -->
            <div class="relative h-24 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center px-8">
              <div class="absolute inset-0 bg-black/10"></div>
              <div class="relative z-10 flex items-center justify-between w-full">
                <div class="flex items-center gap-4">
                  <div class="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <component :is="getCertificationIcon(activeTest.certification)" 
                              class="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-white">{{ activeTest.certification }}</h3>
                    <div :class="[
                      'text-sm inline-flex items-center gap-1 px-2 py-0.5 rounded-full',
                      activeTest.mode === 'practice' 
                        ? 'bg-green-500/20 text-green-100' 
                        : 'bg-yellow-500/20 text-yellow-100'
                    ]">
                      <div class="w-1.5 h-1.5 rounded-full" 
                           :class="activeTest.mode === 'practice' ? 'bg-green-400' : 'bg-yellow-400'" />
                      {{ activeTest.mode === 'practice' ? t('dashboard.activeTest.practiceMode') : t('dashboard.activeTest.certificationMode') }}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold text-white">{{ activeTest.bestScore }}%</div>
                  <div class="text-sm text-white/80">{{ t('dashboard.activeTest.bestScore') }}</div>
                </div>
              </div>
            </div>

            <!-- Contenido principal -->
            <div class="p-8">
              <!-- Descripción y Botón de Inicio -->
              <div class="flex items-start justify-between gap-8 mb-8">
                <p class="text-gray-600 flex-1">{{ activeTest.description }}</p>
                <button class="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-sm group">
                  <PlayIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {{ t('dashboard.activeTest.startTest') }}
                </button>
              </div>

              <!-- Métricas en cards -->
              <div class="grid grid-cols-3 gap-4 mb-8">
                <!-- Total de intentos -->
                <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div class="flex items-center justify-between mb-3">
                    <div class="text-sm font-medium text-gray-600">{{ t('dashboard.activeTest.attempts') }}</div>
                    <ChartBarIcon class="w-5 h-5 text-blue-600" />
                  </div>
                  <div class="text-lg font-semibold text-gray-900">{{ activeTest.attempts }}</div>
                  <div class="text-sm text-gray-500 mt-1">{{ t('dashboard.activeTest.lastAttempt', { date: activeTest.lastAttemptDate }) }}</div>
                </div>

                <!-- Puntuación media -->
                <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div class="flex items-center justify-between mb-3">
                    <div class="text-sm font-medium text-gray-600">{{ t('dashboard.activeTest.average') }}</div>
                    <QuestionMarkCircleIcon class="w-5 h-5 text-green-600" />
                  </div>
                  <div class="text-lg font-semibold text-gray-900">{{ activeTest.averageScore }}%</div>
                  <div class="text-sm text-gray-500 mt-1">{{ t('dashboard.activeTest.averageTime') }}</div>
                </div>

                <!-- Tiempo medio -->
                <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div class="flex items-center justify-between mb-3">
                    <div class="text-sm font-medium text-gray-600">{{ t('dashboard.activeTest.bestScore') }}</div>
                    <ClockIcon class="w-5 h-5 text-indigo-600" />
                  </div>
                  <div class="text-lg font-semibold text-gray-900">{{ activeTest.averageTime }}</div>
                  <div class="text-sm text-gray-500 mt-1">{{ t('dashboard.activeTest.averageTime') }}</div>
                </div>
              </div>

              <!-- Historial de intentos colapsable -->
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <button @click="showHistory = !showHistory"
                        class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div class="flex items-center gap-2">
                    <h4 class="text-sm font-medium text-gray-900">{{ t('dashboard.activeTest.history') }}</h4>
                    <span class="text-xs text-gray-500">({{ activeTest.recentAttempts.length }} {{ t('dashboard.activeTest.attempts') }})</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-500">{{ t('dashboard.activeTest.viewStatistics') }}</span>
                    <ChevronDownIcon class="w-5 h-5 text-gray-500 transition-transform duration-200"
                                   :class="{ 'rotate-180': showHistory }" />
                  </div>
                </button>
                
                <div v-show="showHistory" class="divide-y divide-gray-100">
                  <div v-for="(attempt, index) in activeTest.recentAttempts" :key="index"
                       class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div class="flex items-center gap-3">
                      <div class="text-sm font-medium text-gray-900">{{ t('dashboard.activeTest.attemptNumber', { number: attempt.number }) }}</div>
                      <div class="text-sm text-gray-500">{{ attempt.date }}</div>
                    </div>
                    <div class="flex items-center gap-4">
                      <div class="flex items-center gap-2">
                        <ClockIcon class="w-4 h-4 text-gray-400" />
                        <span class="text-sm text-gray-600">{{ t('dashboard.activeTest.time') }}: {{ attempt.time }}</span>
                      </div>
                      <div class="text-sm font-medium" 
                           :class="attempt.score >= 70 ? 'text-green-600' : 'text-gray-900'">
                        {{ attempt.score }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tests Populares -->
      <div class="bg-white rounded-2xl p-8 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">{{ t('dashboard.popularTests.title') }}</h3>
          <a href="https://www.measureup.com" target="_blank" class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            {{ t('dashboard.popularTests.viewMeasureUp') }}
            <ArrowTopRightOnSquareIcon class="w-4 h-4" />
          </a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Microsoft Azure (AZ-104) -->
          <div class="group relative bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100 hover:border-blue-200 transition-all">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            <div class="relative">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-blue-100 rounded-lg">
                  <CloudIcon class="w-6 h-6 text-blue-600" />
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ t('tests.AZ-900.title') }}</h4>
                  <p class="text-sm text-gray-500 mb-3">{{ t('tests.AZ-900.description') }}</p>
                  <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-1">
                      <UserGroupIcon class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-600">{{ t('dashboard.popularTests.students', { count: '12.5k' }) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <StarIcon class="w-4 h-4 text-yellow-400" />
                      <span class="text-gray-600">{{ t('dashboard.popularTests.rating') }}: 4.8</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <div class="text-lg font-semibold text-gray-900"></div>
                <button class="text-sm font-medium text-blue-600 hover:text-blue-700">{{ t('dashboard.popularTests.details') }}</button>
              </div>
            </div>
          </div>

          <!-- AWS Solutions Architect -->
          <div class="group relative bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-100 hover:border-orange-200 transition-all">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            <div class="relative">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-orange-100 rounded-lg">
                  <CloudIcon class="w-6 h-6 text-orange-600" />
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ t('tests.SAA-C03.title') }}</h4>
                  <p class="text-sm text-gray-500 mb-3">{{ t('tests.SAA-C03.description') }}</p>
                  <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-1">
                      <UserGroupIcon class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-600">{{ t('dashboard.popularTests.students', { count: '15.2k' }) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <StarIcon class="w-4 h-4 text-yellow-400" />
                      <span class="text-gray-600">{{ t('dashboard.popularTests.rating') }}: 4.9</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <div class="text-lg font-semibold text-gray-900"></div>
                <button class="text-sm font-medium text-orange-600 hover:text-orange-700">{{ t('dashboard.popularTests.details') }}</button>
              </div>
            </div>
          </div>

          <!-- CompTIA Security+ -->
          <div class="group relative bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100 hover:border-green-200 transition-all">
            <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            <div class="relative">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-green-100 rounded-lg">
                  <ShieldCheckIcon class="w-6 h-6 text-green-600" />
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ t('tests.SY0-601.title') }}</h4>
                  <p class="text-sm text-gray-500 mb-3">{{ t('tests.SY0-601.description') }}</p>
                  <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-1">
                      <UserGroupIcon class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-600">{{ t('dashboard.popularTests.students', { count: '9.8k' }) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <StarIcon class="w-4 h-4 text-yellow-400" />
                      <span class="text-gray-600">{{ t('dashboard.popularTests.rating') }}: 4.7</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <div class="text-lg font-semibold text-gray-900"></div>
                <button class="text-sm font-medium text-green-600 hover:text-green-700">{{ t('dashboard.popularTests.details') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas y Calendario -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Estadísticas -->
        <div class="bg-white rounded-2xl p-8 shadow-sm">
          <h3 class="text-xl font-semibold mb-6">{{ t('dashboard.statistics.title') }}</h3>
          <div class="grid grid-cols-3 gap-6">
            <div class="space-y-2">
              <div class="text-3xl font-semibold">{{ stats.testsCompleted }}</div>
              <div class="text-sm text-gray-600">{{ t('dashboard.statistics.testsCompleted') }}</div>
            </div>
            <div class="space-y-2">
              <div class="text-3xl font-semibold">{{ stats.avgScore }}%</div>
              <div class="text-sm text-gray-600">{{ t('dashboard.statistics.avgScore') }}</div>
            </div>
            <div class="space-y-2">
              <div class="text-3xl font-semibold">{{ stats.studyHours }}</div>
              <div class="text-sm text-gray-600">{{ t('dashboard.statistics.studyHours') }}</div>
            </div>
          </div>
          <div class="mt-6">
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-4">
                <div class="text-sm font-medium text-gray-600">{{ t('dashboard.statistics.weeklyProgress') }}</div>
                <div class="text-sm text-blue-600">{{ t('dashboard.statistics.viewDetails') }}</div>
              </div>
              <!-- Gráfico de actividad -->
              <div class="h-32 flex items-end gap-2">
                <div v-for="day in activityData" :key="day.name" class="flex-1">
                  <div class="bg-blue-100 rounded-t-md hover:bg-blue-200 transition-colors" 
                       :style="{ height: `${day.value}%` }" />
                </div>
              </div>
              <div class="flex justify-between mt-2 text-xs text-gray-500">
                <span>{{ t('dashboard.calendar.days.sun') }}</span>
                <span>{{ t('dashboard.calendar.days.mon') }}</span>
                <span>{{ t('dashboard.calendar.days.tue') }}</span>
                <span>{{ t('dashboard.calendar.days.wed') }}</span>
                <span>{{ t('dashboard.calendar.days.thu') }}</span>
                <span>{{ t('dashboard.calendar.days.fri') }}</span>
                <span>{{ t('dashboard.calendar.days.sat') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendario y Próximos Tests -->
        <div class="space-y-8">
          <!-- Calendario -->
          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold">{{ t('dashboard.calendar.title') }}</h3>
              <div class="flex gap-2">
                <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
                </button>
                <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRightIcon class="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <!-- Grid del calendario -->
            <div class="grid grid-cols-7 gap-2 text-sm">
              <div v-for="day in ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']" 
                   :key="day" 
                   class="text-center text-gray-500 font-medium py-2">
                {{ day }}
              </div>
              <div v-for="date in calendarDates" 
                   :key="date.day"
                   @click="selectDate(date)"
                   class="relative text-center py-2 rounded-lg cursor-pointer"
                   :class="[
                     date.isToday ? 'bg-blue-600 text-white' : 'hover:bg-gray-100',
                     date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                     date.hasEvent ? 'font-semibold' : ''
                   ]">
                {{ date.day }}
                <div v-if="date.hasEvent" class="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div class="w-1 h-1 rounded-full"
                       :class="date.eventType === 'practice' ? 'bg-green-500' : 'bg-yellow-500'" />
                </div>
              </div>
            </div>
          </div>

          <!-- Próximos Tests -->
          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold">{{ t('dashboard.upcomingTests.title') }}</h3>
              <button class="text-sm text-blue-600 hover:text-blue-700">{{ t('dashboard.upcomingTests.viewAll') }}</button>
            </div>
            <div class="space-y-4">
              <div v-for="test in upcomingTests" 
                   :key="test.id"
                   class="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div :class="[
                    'p-3 rounded-lg',
                    test.mode === 'practice' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                ]">
                  <component :is="getCertificationIcon(test.certification)" class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-medium text-gray-900">{{ test.certification }}</h4>
                    <span :class="[
                      'text-xs px-2 py-1 rounded-full',
                      test.mode === 'practice' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    ]">
                      {{ test.mode === 'practice' ? t('dashboard.upcomingTests.practice') : t('dashboard.upcomingTests.certification') }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500">{{ test.description }}</p>
                  <div class="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <CalendarIcon class="w-4 h-4" />
                    <span>{{ t('dashboard.upcomingTests.date') }}: {{ test.date }}</span>
                    <ClockIcon class="w-4 h-4 ml-2" />
                    <span>{{ t('dashboard.upcomingTests.time') }}: {{ test.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ClockIcon,
  CalendarIcon,
  QuestionMarkCircleIcon,
  CloudIcon,
  CubeIcon,
  CommandLineIcon,
  ServerIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
  UserGroupIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

// Estado del calendario
const currentDate = ref(new Date())
const currentMonth = computed(() => {
  return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentDate.value)
})

// Funciones del calendario
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

const selectDate = (date) => {
  if (date.hasEvent) {
    // Mostrar modal o navegación al test programado
    console.log('Test programado para:', date)
  }
}

// Función para obtener el icono según la certificación
const getCertificationIcon = (certification) => {
  const icons = {
    'AZ-900': CloudIcon,
    'AWS': CloudIcon,
    'Docker': CubeIcon,
    'Kubernetes': ServerIcon,
    'Security+': ShieldCheckIcon,
    'Linux': CommandLineIcon
  }
  return icons[certification] || CloudIcon
}

// Datos de ejemplo
const user = {
  name: 'Mario'
}

const activeTest = {
  certification: 'Microsoft Azure Fundamentals (AZ-900)',
  description: 'Evaluación de conocimientos fundamentales de Microsoft Azure, incluyendo conceptos de nube, servicios principales y aspectos de seguridad.',
  bestScore: 85,
  attempts: 5,
  averageScore: 80,
  averageTime: '45 minutos',
  lastAttemptDate: '15 Oct 2023',
  recentAttempts: [
    { number: 1, date: '15 Oct 2023', time: '10:00', score: 85 },
    { number: 2, date: '16 Oct 2023', time: '11:00', score: 78 },
    { number: 3, date: '17 Oct 2023', time: '12:00', score: 82 },
    { number: 4, date: '18 Oct 2023', time: '13:00', score: 75 },
    { number: 5, date: '19 Oct 2023', time: '14:00', score: 80 }
  ]
}

const certificationsInProgress = [
  {
    id: 1,
    name: 'AZ-900',
    testsCompleted: 3,
    totalTests: 5,
    progress: 60,
  },
  {
    id: 2,
    name: 'AWS',
    testsCompleted: 4,
    totalTests: 6,
    progress: 75,
  },
  {
    id: 3,
    name: 'Docker',
    testsCompleted: 2,
    totalTests: 8,
    progress: 25,
  }
]

const stats = {
  testsCompleted: 12,
  avgScore: 85,
  studyHours: 24
}

const activityData = [
  { name: 'Lun', value: 60 },
  { name: 'Mar', value: 45 },
  { name: 'Mié', value: 75 },
  { name: 'Jue', value: 30 },
  { name: 'Vie', value: 85 },
  { name: 'Sáb', value: 25 },
  { name: 'Dom', value: 40 }
]

// Generar datos del calendario con eventos
const calendarDates = Array.from({ length: 35 }, (_, i) => ({
  day: ((i - 2 + 31) % 31) + 1,
  isCurrentMonth: i >= 2 && i < 33,
  isToday: i === 16,
  hasEvent: [5, 12, 18, 25].includes(((i - 2 + 31) % 31) + 1),
  eventType: [5, 18].includes(((i - 2 + 31) % 31) + 1) ? 'practice' : 'certification'
}))

const upcomingTests = [
  {
    id: 1,
    certification: 'AZ-900',
    description: 'Microsoft Azure Fundamentals - Practice Test 4',
    date: '15 Oct 2023',
    time: '10:00',
    mode: 'practice'
  },
  {
    id: 2,
    certification: 'AWS',
    description: 'AWS Cloud Practitioner - Certification Exam',
    date: '18 Oct 2023',
    time: '15:30',
    mode: 'certification'
  },
  {
    id: 3,
    certification: 'Docker',
    description: 'Docker Fundamentals - Practice Test 2',
    date: '20 Oct 2023',
    time: '11:00',
    mode: 'practice'
  }
]

const showHistory = ref(false)
</script> 