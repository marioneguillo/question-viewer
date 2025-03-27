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
              <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
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
                  <div v-for="(tests, category) in groupedTests" :key="category" class="mb-6 last:mb-0">
                    <div class="flex items-center gap-2 mb-3">
                      <component :is="getCategoryIcon(category)" class="w-5 h-5 text-gray-400" />
                      <h4 class="text-sm font-medium text-gray-500">{{ category }}</h4>
                    </div>
                    <div class="space-y-2">
                      <div v-for="test in tests" :key="test.id"
                           @click="selectTest(test)"
                           class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                           :class="{ 'bg-blue-50': test.id === activeTest.id }">
                        <component :is="getCertificationIcon(test.certification)" 
                                  class="w-6 h-6 text-gray-600" />
                        <div class="flex-1">
                          <div class="text-sm font-medium text-gray-900">{{ test.certification }}</div>
                          <div class="text-xs text-gray-500">{{ test.mode === 'practice' ? t('dashboard.activeTest.practiceMode') : t('dashboard.activeTest.certificationMode') }}</div>
                        </div>
                        <div class="text-sm font-medium text-gray-900">{{ test.bestScore }}%</div>
                      </div>
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
} from '@heroicons/vue/24/outline'

const { t } = useTranslation()

const searchQuery = ref('')
const showDropdown = ref(false)
const showHistory = ref(false)

// Datos de ejemplo para los tests activos
const tests = ref([
  {
    id: 1,
    certification: 'Microsoft Azure Fundamentals (AZ-900)',
    category: 'Cloud',
    mode: 'practice',
    description: t('tests.AZ-900.description'),
    bestScore: 85,
    attempts: 5,
    averageScore: 80,
    averageTime: '45 minutos',
    lastAttemptDate: '15 Ene 2025',
    recentAttempts: [
      { number: 1, date: '15 Ene 2025', time: '10:00', score: 85 },
      { number: 2, date: '16 Ene 2025', time: '11:00', score: 78 },
      { number: 3, date: '17 Ene 2025', time: '12:00', score: 82 },
      { number: 4, date: '18 Ene 2025', time: '13:00', score: 75 },
      { number: 5, date: '19 Ene 2025', time: '14:00', score: 80 }
    ]
  },
  {
    id: 2,
    certification: 'AWS Cloud Practitioner',
    category: 'Cloud',
    mode: 'certification',
    description: t('tests.SAA-C03.description'),
    bestScore: 92,
    attempts: 3,
    averageScore: 88,
    averageTime: '60 minutos',
    lastAttemptDate: '18 Ene 2025',
    recentAttempts: [
      { number: 1, date: '18 Ene 2025', time: '14:00', score: 92 },
      { number: 2, date: '19 Ene 2025', time: '15:00', score: 85 }
    ]
  },
  {
    id: 3,
    certification: 'CompTIA Security+',
    category: 'Security',
    mode: 'practice',
    description: t('tests.SY0-601.description'),
    bestScore: 78,
    attempts: 2,
    averageScore: 75,
    averageTime: '75 minutos',
    lastAttemptDate: '20 Ene 2025',
    recentAttempts: [
      { number: 1, date: '20 Ene 2025', time: '16:00', score: 78 },
      { number: 2, date: '21 Ene 2025', time: '17:00', score: 72 }
    ]
  },
  {
    id: 4,
    certification: 'CompTIA Linux+',
    category: 'Operating Systems',
    mode: 'practice',
    description: t('tests.LPIC-1.description'),
    bestScore: 88,
    attempts: 4,
    averageScore: 85,
    averageTime: '60 minutos',
    lastAttemptDate: '22 Ene 2025',
    recentAttempts: [
      { number: 1, date: '22 Ene 2025', time: '18:00', score: 88 },
      { number: 2, date: '23 Ene 2025', time: '19:00', score: 82 }
    ]
  }
])

const activeTest = ref(tests.value[0])

const filteredTests = computed(() => {
  if (!searchQuery.value) return tests.value
  const query = searchQuery.value.toLowerCase()
  return tests.value.filter(test => 
    test.certification.toLowerCase().includes(query) ||
    test.category.toLowerCase().includes(query) ||
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
  activeTest.value = test
  showDropdown.value = false
}

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
</script>
