<template>
  <AppLayout>
    <div class="space-y-8">
      <!-- Saludo -->
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-light text-gray-900">{{ t('common.welcome', { name: user.name }) }}</h2>
      </div>

      <!-- Panel de Test Activo -->
      <ActiveTest @test-selected="handleTestChange" />
      
      <!-- Product Code Registration -->
      <ProductCodeRegistration />

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

      <!-- Calendario -->
      <div class="space-y-8">
        <Calendar :active-test="activeTest" />
      </div>

      <!-- Estadísticas y badges  -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Estadísticas y Progreso Semanal -->
        <div class="space-y-8">
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
          </div>         

          <!-- Badges de Certificaciones -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-gray-900">{{ t('dashboard.badges.title') }}</h2>
              <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                {{ t('dashboard.badges.viewAll') }}
              </button>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div v-for="badge in certificationBadges" 
                   :key="badge.id" 
                   class="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div class="relative">
                  <img :src="badge.image" 
                       :alt="badge.certification"
                       class="w-16 h-16 object-contain mb-2" />
                  <div v-if="badge.status === 'completed'" 
                       class="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <CheckBadgeIcon class="w-4 h-4 text-white" />
                  </div>
                </div>
                <div class="text-sm font-medium text-center text-gray-900">{{ badge.certification }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ badge.date }}</div>
                <div v-if="badge.status === 'completed'" 
                     class="mt-2 text-xs text-green-600 flex items-center gap-1">
                  {{ badge.score }}%
                </div>
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
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import { 
  ClockIcon,
  CalendarIcon,
  CloudIcon,
  CubeIcon,
  CommandLineIcon,
  ServerIcon,
  ShieldCheckIcon,
  ArrowTopRightOnSquareIcon,
  UserGroupIcon,
  StarIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline'
import { useTranslation } from '@/composables/useTranslation'
import Calendar from '@/Components/Dashboard/Calendar.vue'
import ProductCodeRegistration from '@/Components/Dashboard/ProductCodeRegistration.vue'
import ActiveTest from '@/Components/Dashboard/ActiveTest.vue'
import Badges from '@/Components/Dashboard/Badges.vue'
import { testReports } from '@/data/testReports'

const { t } = useTranslation()
const reports = ref(testReports)
const isSidebarCollapsed = ref(false)

// Persistencia del estado del sidebar
onMounted(() => {
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    isSidebarCollapsed.value = JSON.parse(savedState)
  }
})

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed.value))
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

const stats = {
  testsCompleted: 12,
  avgScore: 85,
  studyHours: 24
}

const upcomingTests = [
  {
    id: 1,
    certification: 'AZ-900',
    description: 'Microsoft Azure Fundamentals - Practice Test 4',
    date: '15 Ene 2025',
    time: '10:00',
    mode: 'practice'
  },
  {
    id: 2,
    certification: 'AWS',
    description: 'AWS Cloud Practitioner - Certification Exam',
    date: '18 Ene 2025',
    time: '15:30',
    mode: 'certification'
  },
  {
    id: 3,
    certification: 'Docker',
    description: 'Docker Fundamentals - Practice Test 2',
    date: '20 Ene 2025',
    time: '11:00',
    mode: 'practice'
  }
]

const showHistory = ref(false)

// Datos de progreso semanal
const weeklyProgress = ref([
  { name: t('dashboard.calendar.days.mon'), progress: 75, tests: 3 },
  { name: t('dashboard.calendar.days.tue'), progress: 60, tests: 2 },
  { name: t('dashboard.calendar.days.wed'), progress: 90, tests: 4 },
  { name: t('dashboard.calendar.days.thu'), progress: 45, tests: 2 },
  { name: t('dashboard.calendar.days.fri'), progress: 85, tests: 3 },
  { name: t('dashboard.calendar.days.sat'), progress: 30, tests: 1 },
  { name: t('dashboard.calendar.days.sun'), progress: 15, tests: 1 }
])

// Datos de badges de certificaciones
const certificationBadges = [
  {
    id: 1,
    certification: 'AZ-900',
    date: 'Ene 2025',
    status: 'completed',
    score: 100,
    image: '/images/AZ-900-badge.png'
  },
  {
    id: 2,
    certification: 'AWS',
    date: 'Feb 2025',
    status: 'completed',
    score: 95,
    image: '/images/AZ-900-badge.png'
  },
  {
    id: 3,
    certification: 'Security+',
    date: 'Mar 2025',
    status: 'completed',
    score: 90,
    image: '/images/AZ-900-badge.png'
  }
]

// Estado del test activo
const activeTest = ref({
  id: 1,
  certification: 'Microsoft Azure Fundamentals (AZ-900)',
  mode: 'practice'
})

// Manejar el cambio de test
const handleTestChange = (test) => {
  activeTest.value = test
}
</script> 