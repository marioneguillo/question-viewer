<template>
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
                    <div class="flex items-center gap-2">
                      <h3 class="text-lg font-medium text-white">{{ activeTest.certification }}</h3>
                      <button @click="showDropdown = !showDropdown"
                              class="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
                              :title="t('dashboard.activeTest.changeTest')">
                        <span class="text-sm text-white/90">{{ t('dashboard.activeTest.change') }}</span>
                        <ChevronDownIcon class="w-4 h-4 text-white transition-transform duration-200"
                                       :class="{ 'rotate-180': showDropdown }" />
                      </button>
                    </div>
                    <div :class="[
                      'text-sm inline-flex items-center gap-1 px-2 py-0.5 rounded-full mt-1',
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

            <!-- Selector de Tests (Modal) -->
            <div v-if="showDropdown" 
                 class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                 @click.self="showDropdown = false">
              <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div class="p-4 border-b border-gray-100">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900">{{ t('dashboard.activeTest.selectTest') }}</h3>
                    <button @click="showDropdown = false"
                            class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <XMarkIcon class="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                <div class="p-4 border-b border-gray-100">
                  <div class="relative">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text"
                           v-model="searchQuery"
                           :placeholder="t('dashboard.activeTest.searchTests')"
                           class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                
                <div class="flex-1 overflow-y-auto p-4">
                  <div v-for="(group, category) in groupedTests" :key="category" class="mb-4">
                    <div class="text-sm font-medium text-gray-500 mb-2">{{ category }}</div>
                    <div class="space-y-2">
                      <button 
                        v-for="test in group" 
                        :key="test.id"
                        @click="selectTest(test)"
                        class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        :class="{ 'bg-blue-50': activeTest.id === test.id }"
                      >
                        <div class="flex items-center gap-3">
                          <div :class="[
                            'p-2 rounded-lg',
                            test.mode === 'practice' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          ]">
                            <component :is="getCertificationIcon(test.certification)" class="w-5 h-5" />
                          </div>
                          <div class="text-left">
                            <div class="font-medium text-gray-900">{{ test.certification }}</div>
                            <div class="text-sm text-gray-500">{{ test.mode === 'practice' ? t('dashboard.activeTest.practiceMode') : t('dashboard.activeTest.certificationMode') }}</div>
                            <div class="text-xs text-gray-400 mt-1">
                              <p>{{ t('dashboard.activeTest.activationDate') }}: {{ formatDate(test.activationDate) }}</p>
                              <p>{{ t('dashboard.activeTest.expirationDate') }}: {{ formatDate(test.expirationDate) }}</p>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center gap-4">
                          <div class="text-right">
                            <div class="text-sm font-medium text-gray-900">
                              {{ test.attempts.length }} {{ t('dashboard.activeTest.attempts') }}
                            </div>
                            <div class="text-xs text-gray-500">
                              {{ t('dashboard.activeTest.lastAttempt') }}: {{ test.attempts.length > 0 ? formatDate(test.attempts[test.attempts.length - 1].date) : '-' }}
                            </div>
                          </div>
                          <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contenido principal -->
            <div class="p-8">
              <!-- Descripción y Botón de Inicio -->
              <div class="flex items-start justify-between gap-8 mb-8">
                <p class="text-gray-600 flex-1">{{ activeTest.description }}</p>
                <Link
                  href="/questions/start-all"
                  class="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-sm group"
                >
                  <PlayIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {{ t('dashboard.activeTest.startTest') }}
                </Link>
              </div>  

              <!-- Métricas en cards -->
              <div class="grid grid-cols-3 gap-4 mb-8">
                <!-- Total de intentos -->
                <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div class="flex items-center justify-between mb-3">
                    <div class="text-sm font-medium text-gray-600">{{ t('dashboard.activeTest.attempts') }}</div>
                    <ChartBarIcon class="w-5 h-5 text-blue-600" />
                  </div>
                  <div class="text-lg font-semibold text-gray-900">{{ activeTest.totalAttempts }}</div>
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
                    <span class="text-xs text-gray-500">({{ activeTest.totalAttempts }} {{ t('dashboard.activeTest.attempts') }})</span>
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

</template>

<script setup>
import { ref, computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import { Link } from '@inertiajs/vue3'
import { 
  ClockIcon,
  QuestionMarkCircleIcon,
  CloudIcon,
  CubeIcon,
  CommandLineIcon,
  ServerIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  PlayIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const { t } = useTranslation()

const searchQuery = ref('')
const showDropdown = ref(false)
const showHistory = ref(false)

const tests = ref([
  {
    id: 1,
    certification: 'Microsoft Azure Fundamentals (AZ-900)',
    category: 'Cloud',
    mode: 'practice',
    attempts: [
      {
        id: 1,
        date: '2025-03-25',
        score: 85,
        time: '10:00',
        duration: '45 min',
        type: 'practice'
      },
      {
        id: 2,
        date: '2025-03-26',
        score: 78,
        time: '11:00',
        duration: '42 min',
        type: 'practice'
      },
      {
        id: 3,
        date: '2025-03-27',
        score: 82,
        time: '12:00',
        duration: '40 min',
        type: 'practice'
      },
      {
        id: 4,
        date: '2025-03-28',
        score: 92,
        time: '15:30',
        duration: '35 min',
        type: 'certification'
      }
    ],
    activationDate: '2025-03-15',
    expirationDate: '2025-04-15'
  },
  {
    id: 2,
    certification: 'AWS Cloud Practitioner',
    category: 'Cloud',
    mode: 'practice',
    attempts: [],
    activationDate: '2025-03-20',
    expirationDate: '2025-04-20'
  },
  {
    id: 3,
    certification: 'Docker Fundamentals',
    category: 'Containers',
    mode: 'practice',
    attempts: [],
    activationDate: '2025-03-25',
    expirationDate: '2025-04-25'
  },
  {
    id: 4,
    certification: 'CompTIA Security+',
    category: 'Security',
    mode: 'certification',
    attempts: [
      {
        id: 1,
        date: '2025-03-20',
        score: 88,
        time: '14:00',
        duration: '60 min',
        type: 'certification'
      }
    ],
    activationDate: '2025-03-10',
    expirationDate: '2025-04-10'
  },
  {
    id: 5,
    certification: 'CompTIA Linux+',
    category: 'Operating Systems',
    mode: 'practice',
    attempts: [
      {
        id: 1,
        date: '2025-03-22',
        score: 85,
        time: '16:00',
        duration: '45 min',
        type: 'practice'
      },
      {
        id: 2,
        date: '2025-03-23',
        score: 92,
        time: '11:00',
        duration: '40 min',
        type: 'practice'
      }
    ],
    activationDate: '2025-03-15',
    expirationDate: '2025-04-15'
  },
  {
    id: 6,
    certification: 'Kubernetes Administrator',
    category: 'Containers',
    mode: 'certification',
    attempts: [
      {
        id: 1,
        date: '2025-03-24',
        score: 78,
        time: '13:00',
        duration: '50 min',
        type: 'practice'
      },
      {
        id: 2,
        date: '2025-03-25',
        score: 85,
        time: '14:00',
        duration: '45 min',
        type: 'practice'
      },
      {
        id: 3,
        date: '2025-03-26',
        score: 92,
        time: '15:30',
        duration: '35 min',
        type: 'certification'
      }
    ],
    activationDate: '2025-03-25',
    expirationDate: '2025-04-25'
  },
  {
    id: 7,
    certification: 'Network+',
    category: 'Networking',
    mode: 'practice',
    attempts: [
      {
        id: 1,
        date: '2025-03-12',
        score: 78,
        time: '13:00',
        duration: '50 min',
        type: 'practice'
      },
      {
        id: 2,
        date: '2025-03-15',
        score: 85,
        time: '14:00',
        duration: '45 min',
        type: 'practice'
      },
      {
        id: 3,
        date: '2025-03-16',
        score: 92,
        time: '15:30',
        duration: '35 min',
        type: 'certification'
      },
      {
        id: 4,
        date: '2025-03-16',
        score: 88,
        time: '14:00',  
        duration: '60 min',
        type: 'practice'
      },
      {
        id: 5,
        date: '2025-03-16',
        score: 50,
        time: '13:00',  
        duration: '60 min',
        type: 'practice'
      }
    ],
    activationDate: '2025-03-02',
    expirationDate: '2025-04-20'
  }
])

// Test activo (inicialmente el primero)
const activeTest = ref({
  ...tests.value[0],
  bestScore: tests.value[0].attempts.length > 0 
    ? Math.max(...tests.value[0].attempts.map(a => a.score))
    : 0,
  totalAttempts: tests.value[0].attempts.length,
  averageScore: tests.value[0].attempts.length > 0
    ? Math.round(tests.value[0].attempts.reduce((acc, curr) => acc + curr.score, 0) / tests.value[0].attempts.length)
    : 0,
  averageTime: tests.value[0].attempts.length > 0
    ? tests.value[0].attempts[0].duration
    : '0 min',
  lastAttemptDate: tests.value[0].attempts.length > 0
    ? new Date(tests.value[0].attempts[tests.value[0].attempts.length - 1].date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : '-',
  recentAttempts: tests.value[0].attempts.map((attempt, index) => ({
    number: index + 1,
    date: new Date(attempt.date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    time: attempt.time,
    score: attempt.score
  })),
  description: t(`tests.${tests.value[0].certification.split('(')[1]?.replace(')', '') || tests.value[0].certification.replace(/\s+/g, '')}.description`)
})

const filteredTests = computed(() => {
  if (!searchQuery.value) return tests.value
  const query = searchQuery.value.toLowerCase()
  return tests.value.filter(test => 
    test.certification.toLowerCase().includes(query) ||
    test.category.toLowerCase().includes(query) ||
    test.mode.toLowerCase().includes(query) ||
    (test.mode === 'practice' ? t('dashboard.activeTest.practiceMode') : t('dashboard.activeTest.certificationMode')).toLowerCase().includes(query)
  )
})

const groupedTests = computed(() => {
  const filtered = filteredTests.value
  const groups = {}
  
  filtered.forEach(test => {
    if (!groups[test.category]) {
      groups[test.category] = []
    }
    groups[test.category].push(test)
  })
  
  return groups
})

const selectTest = (test) => {
  if (!test) return

  // Crear un objeto con la estructura completa del test
  const newActiveTest = {
    ...test,
    bestScore: test.attempts.length > 0 
      ? Math.max(...test.attempts.map(a => a.score))
      : 0,
    totalAttempts: test.attempts.length,
    averageScore: test.attempts.length > 0
      ? Math.round(test.attempts.reduce((acc, curr) => acc + curr.score, 0) / test.attempts.length)
      : 0,
    averageTime: test.attempts.length > 0
      ? test.attempts[0].duration
      : '0 min',
    lastAttemptDate: test.attempts.length > 0
      ? new Date(test.attempts[test.attempts.length - 1].date).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : '-',
    recentAttempts: test.attempts.map((attempt, index) => ({
      number: index + 1,
      date: new Date(attempt.date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: attempt.time,
      score: attempt.score
    })),
    description: t(`tests.${test.certification.split('(')[1]?.replace(')', '') || test.certification.replace(/\s+/g, '')}.description`)
  }

  // Actualizar el test activo
  activeTest.value = newActiveTest
  showDropdown.value = false

  // Emitir el evento con el test seleccionado
  emit('test-selected', newActiveTest)
}

// Definir los eventos que emite el componente
const emit = defineEmits(['test-selected'])

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

const getCategoryIcon = (category) => {
  const icons = {
    'Cloud': CloudIcon,
    'Security': ShieldCheckIcon,
    'Operating Systems': CommandLineIcon,
    'Containers': CubeIcon,
    'Networking': ServerIcon
  }
  return icons[category] || QuestionMarkCircleIcon
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>
