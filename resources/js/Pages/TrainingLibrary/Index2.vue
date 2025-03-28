<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="text-center md:text-left">
              <h1 class="text-3xl font-bold text-white">Biblioteca de Formación</h1>
              <p class="mt-2 text-lg text-blue-100">
                Explora nuestra colección de tests y cursos de formación
              </p>
            </div>
            <div class="mt-4 md:mt-0">
              <div class="relative">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Buscar tests o cursos..."
                  class="w-full md:w-96 pl-10 pr-4 py-2 border border-transparent rounded-md focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Resumen y filtros -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Resumen de tests</h2>
            <div class="flex items-center gap-2">
              <!-- Botón de filtros móvil -->
              <button 
                @click="showMobileFilters = true"
                class="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
              >
                <FunnelIcon class="w-5 h-5" />
              </button>

              <!-- Filtros desktop -->
              <div class="hidden md:flex gap-2">
                <select v-model="statusFilter"
                        class="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="locked">Bloqueados</option>
                </select>

                <select v-model="categoryFilter"
                        class="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">Todas las categorías</option>
                  <option value="microsoft">Microsoft</option>
                  <option value="aws">AWS</option>
                  <option value="google">Google Cloud</option>
                  <option value="devops">DevOps</option>
                  <option value="programming">Programación</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Resumen de estadísticas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon class="h-6 w-6 text-green-600" />
                </div>
                <div class="ml-4">
                  <div class="text-sm text-gray-500">Tests Activos</div>
                  <div class="text-2xl font-semibold text-gray-900">{{ activeTestsCount }}</div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="flex items-center">
                <div class="p-2 bg-yellow-100 rounded-lg">
                  <ClockIcon class="h-6 w-6 text-yellow-600" />
                </div>
                <div class="ml-4">
                  <div class="text-sm text-gray-500">Tests Inactivos</div>
                  <div class="text-2xl font-semibold text-gray-900">{{ inactiveTestsCount }}</div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="flex items-center">
                <div class="p-2 bg-red-100 rounded-lg">
                  <LockClosedIcon class="h-6 w-6 text-red-600" />
                </div>
                <div class="ml-4">
                  <div class="text-sm text-gray-500">Tests Bloqueados</div>
                  <div class="text-2xl font-semibold text-gray-900">{{ lockedTestsCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Componente de filtros móvil -->
        <TestFilters 
          :is-open="showMobileFilters" 
          @close="showMobileFilters = $event"
          @filter="handleFilter"
        />

        <!-- Lista de Tests por Categoría -->
        <div class="space-y-6">
          <div v-for="category in groupedTests" :key="category.name" class="bg-white rounded-lg border overflow-hidden">
            <!-- Encabezado de categoría -->
            <div class="px-4 py-3 bg-gray-50 border-b">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <component :is="getCategoryIcon(category.name)" class="w-5 h-5 text-gray-600" />
                  <h2 class="font-medium text-gray-900">{{ category.name }}</h2>
                </div>
                <span class="text-sm text-gray-500">{{ category.tests.length }} tests</span>
              </div>
            </div>

            <!-- Lista de tests -->
            <div class="divide-y divide-gray-100">
              <div v-for="test in category.tests" 
                   :key="test.id"
                   class="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                   @click="toggleTestDetails(test.id)">
                <div class="flex items-center justify-between">
                  <!-- Información del test -->
                  <div class="flex items-center gap-3">
                    <div :class="[
                      'p-2 rounded-md',
                      test.status === 'active' ? 'bg-blue-50' : 'bg-gray-50'
                    ]">
                      <component :is="getTestIcon(test.type)" 
                               :class="[
                                 'w-4 h-4',
                                 test.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                               ]" />
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900 text-sm">{{ test.name }}</h3>
                      <p class="text-xs text-gray-500">{{ test.description }}</p>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-gray-500">{{ test.questions }} preguntas</span>
                        <span class="text-xs text-gray-300">•</span>
                        <span class="text-xs text-gray-500">{{ test.passingScore }}% para aprobar</span>
                      </div>
                    </div>
                  </div>

                  <!-- Acciones -->
                  <div class="flex items-center gap-2">
                    <!-- Estado y acciones principales -->
                    <div class="flex items-center gap-2">
                      <span :class="[
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        test.status === 'active' 
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-700'
                      ]">
                        {{ test.status === 'active' ? 'Activo' : 'Bloqueado' }}
                      </span>

                      <!-- Botones de acción rápida -->
                      <div class="flex items-center gap-1" @click.stop>
                        <button v-if="test.status === 'locked'"
                                @click="activateTest(test.id)"
                                class="p-1.5 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50"
                                title="Activar test">
                          <PlayIcon class="w-4 h-4" />
                        </button>
                        <button v-if="test.status === 'active'"
                                @click="startTest(test.id)"
                                class="p-1.5 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50"
                                title="Iniciar test">
                          <PlayIcon class="w-4 h-4" />
                        </button>
                        <button v-if="test.status === 'active'"
                                @click="startDemo(test.id)"
                                class="p-1.5 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50"
                                title="Ver demo">
                          <EyeIcon class="w-4 h-4" />
                        </button>
                        <button v-if="test.status === 'active'"
                                @click="viewResults(test.id)"
                                class="p-1.5 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50"
                                title="Ver resultados">
                          <ChartBarIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Detalles expandibles -->
                <div v-if="expandedTest === test.id" 
                     class="mt-4 pt-4 border-t border-gray-100 bg-gray-50 rounded-lg p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Información del test -->
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                      <div class="flex items-center gap-2 mb-4">
                        <div class="p-2 bg-blue-50 rounded-lg">
                          <component :is="getTestIcon(test.type)" 
                                   class="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 class="font-medium text-gray-900">Información del test</h4>
                      </div>
                      <div class="space-y-3">
                        <div class="flex justify-between items-center">
                          <span class="text-gray-500">Tipo</span>
                          <span class="font-medium text-gray-900">
                            {{ test.type === 'certification' ? 'Certificación' : 'Curso' }}
                          </span>
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-gray-500">Categoría</span>
                          <div class="flex items-center gap-2">
                            <component :is="getCategoryIcon(category.name)" 
                                     class="w-4 h-4 text-gray-600" />
                            <span class="font-medium text-gray-900">{{ category.name }}</span>
                          </div>
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-gray-500">Preguntas</span>
                          <span class="font-medium text-gray-900">{{ test.questions }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-gray-500">Puntuación para aprobar</span>
                          <span class="font-medium text-gray-900">{{ test.passingScore }}%</span>
                        </div>
                      </div>
                    </div>

                    <!-- Historial -->
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                      <div class="flex items-center gap-2 mb-4">
                        <div class="p-2 bg-purple-50 rounded-lg">
                          <ClockIcon class="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 class="font-medium text-gray-900">Historial</h4>
                      </div>
                      <div class="space-y-3">
                        <div class="flex justify-between items-center">
                          <span class="text-gray-500">Intentos</span>
                          <span class="font-medium text-gray-900">{{ test.attempts }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-gray-500">Último intento</span>
                          <span class="font-medium text-gray-900">
                            {{ test.lastAttempt ? new Date(test.lastAttempt).toLocaleDateString() : 'Ninguno' }}
                          </span>
                        </div>
                      </div>
                    </div>
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
import TestFilters from '@/Components/TrainingLibrary/TestFilters.vue'
import { 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  EllipsisVerticalIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  CloudIcon,
  ServerIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon,
  PlayIcon,
  EyeIcon,
  ChartBarIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'

// Estado
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const expandedTest = ref(null)
const showMobileFilters = ref(false)

// Datos de ejemplo
const tests = ref([
  {
    id: 1,
    name: 'AZ-900: Microsoft Azure Fundamentals',
    description: 'Aprende los conceptos básicos de computación en la nube y servicios de Azure',
    type: 'certification',
    category: 'microsoft',
    status: 'active',
    questions: 45,
    passingScore: 70,
    attempts: 3,
    lastAttempt: '2024-03-15'
  },
  {
    id: 2,
    name: 'AWS Solutions Architect Associate',
    description: 'Guía completa de arquitectura AWS',
    type: 'course',
    category: 'aws',
    status: 'locked',
    questions: 65,
    passingScore: 72,
    attempts: 0,
    lastAttempt: null
  },
  {
    id: 3,
    name: 'Google Cloud Platform Essentials',
    description: 'Fundamentos de GCP y servicios principales',
    type: 'certification',
    category: 'google',
    status: 'active',
    questions: 50,
    passingScore: 70,
    attempts: 1,
    lastAttempt: '2024-03-10'
  },
  {
    id: 4,
    name: 'Docker y Kubernetes Básico',
    description: 'Introducción a contenedores y orquestación',
    type: 'course',
    category: 'devops',
    status: 'locked',
    questions: 40,
    passingScore: 65,
    attempts: 0,
    lastAttempt: null
  },
  {
    id: 5,
    name: 'DevOps Fundamentals',
    description: 'Conceptos básicos de DevOps y CI/CD',
    type: 'course',
    category: 'devops',
    status: 'active',
    questions: 35,
    passingScore: 60,
    attempts: 2,
    lastAttempt: '2024-03-12'
  },
  {
    id: 6,
    name: 'Python Avanzado',
    description: 'Programación avanzada en Python',
    type: 'course',
    category: 'programming',
    status: 'locked',
    questions: 55,
    passingScore: 75,
    attempts: 0,
    lastAttempt: null
  },
  {
    id: 7,
    name: 'Machine Learning Básico',
    description: 'Introducción a conceptos de ML',
    type: 'course',
    category: 'programming',
    status: 'active',
    questions: 45,
    passingScore: 70,
    attempts: 1,
    lastAttempt: '2024-03-08'
  },
  {
    id: 8,
    name: 'Seguridad en la Nube',
    description: 'Mejores prácticas de seguridad cloud',
    type: 'certification',
    category: 'aws',
    status: 'locked',
    questions: 60,
    passingScore: 75,
    attempts: 0,
    lastAttempt: null
  },
  {
    id: 9,
    name: 'Terraform Fundamentals',
    description: 'Infraestructura como código con Terraform',
    type: 'course',
    category: 'devops',
    status: 'active',
    questions: 40,
    passingScore: 65,
    attempts: 3,
    lastAttempt: '2024-03-14'
  },
  {
    id: 10,
    name: 'Git Avanzado',
    description: 'Control de versiones avanzado con Git',
    type: 'course',
    category: 'devops',
    status: 'locked',
    questions: 35,
    passingScore: 60,
    attempts: 0,
    lastAttempt: null
  },
])

// Contadores de tests
const activeTestsCount = computed(() => tests.value.filter(test => test.status === 'active').length)
const inactiveTestsCount = computed(() => tests.value.filter(test => test.status === 'inactive').length)
const lockedTestsCount = computed(() => tests.value.filter(test => test.status === 'locked').length)

// Agrupación por categorías
const groupedTests = computed(() => {
  let filtered = tests.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(test => 
      test.name.toLowerCase().includes(query) ||
      test.description.toLowerCase().includes(query)
    )
  }

  // Filtro por estado
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(test => test.status === statusFilter.value)
  }

  // Filtro por categoría
  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(test => test.category === categoryFilter.value)
  }

  // Agrupar por categoría
  const categories = {
    microsoft: { name: 'Microsoft', icon: CloudIcon, tests: [] },
    aws: { name: 'AWS', icon: CloudIcon, tests: [] },
    google: { name: 'Google Cloud', icon: CloudIcon, tests: [] },
    devops: { name: 'DevOps', icon: WrenchScrewdriverIcon, tests: [] },
    programming: { name: 'Programación', icon: CodeBracketIcon, tests: [] }
  }

  filtered.forEach(test => {
    if (categories[test.category]) {
      categories[test.category].tests.push(test)
    }
  })

  // Convertir a array y filtrar categorías vacías
  return Object.values(categories).filter(category => category.tests.length > 0)
})

// Funciones de acción
const toggleTestDetails = (testId) => {
  expandedTest.value = expandedTest.value === testId ? null : testId
}

const activateTest = (testId) => {
  const test = tests.value.find(t => t.id === testId)
  if (test) {
    test.status = 'active'
  }
}

const startTest = (testId) => {
  console.log('Iniciando test:', testId)
}

const startDemo = (testId) => {
  console.log('Iniciando demo:', testId)
}

const viewResults = (testId) => {
  console.log('Ver resultados:', testId)
}

// Función para obtener el icono según el tipo de test
const getTestIcon = (type) => {
  switch (type) {
    case 'certification':
      return AcademicCapIcon
    case 'course':
      return VideoCameraIcon
    default:
      return DocumentTextIcon
  }
}

// Función para obtener el icono según la categoría
const getCategoryIcon = (category) => {
  switch (category) {
    case 'microsoft':
    case 'aws':
    case 'google':
      return CloudIcon
    case 'devops':
      return WrenchScrewdriverIcon
    case 'programming':
      return CodeBracketIcon
    default:
      return ServerIcon
  }
}

// Función para manejar los filtros
const handleFilter = (filters) => {
  statusFilter.value = filters.status
  categoryFilter.value = filters.category
  showMobileFilters.value = false
}
</script> 