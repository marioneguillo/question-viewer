<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="text-center md:text-left">
              <h1 class="text-3xl font-bold text-white">{{ t('training.title') }}</h1>
              <p class="mt-2 text-lg text-blue-100">
                {{ t('training.subtitle') }}
              </p>
            </div>
            <div class="mt-4 md:mt-0">
              <div class="relative">
                <input
                  type="text"
                  v-model="searchQuery"
                  :placeholder="t('training.searchPlaceholder')"
                  class="w-full md:w-96 pl-10 pr-4 py-2 border border-transparent rounded-md focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Componente de Filtros -->
      <TestFilters 
        :is-open="showMobileFilters" 
        @close="showMobileFilters = $event"
        @filter="handleFilter"
      />

      <!-- Contenido principal -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Filtros y vista -->
        <div class="flex flex-col">
          <!-- Lista de tests -->
          <div class="flex-1">
            <!-- Resumen de tests y filtros -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900">{{ t('training.summary') }}</h2>
                <div class="flex flex-col items-end">
                  <button
                    @click="showMobileFilters = true"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                  >
                    <FunnelIcon class="h-5 w-5 mr-2" />
                    {{ t('training.filters.title') }}
                  </button>
                  <!-- Indicador de filtros activos -->
                  <div v-if="hasActiveFilters" class="mt-2 flex flex-wrap gap-2 justify-end">
                    <template v-if="filters.statuses.length > 0">
                      <span v-for="status in filters.statuses" :key="status" class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700">
                        {{ t(`training.status.${status}`) }}
                        <button @click="removeStatus(status)" class="ml-1 hover:text-blue-900">
                          <XMarkIcon class="h-3 w-3" />
                        </button>
                      </span>
                    </template>
                    <template v-if="filters.productTypes.length > 0">
                      <span v-for="type in filters.productTypes" :key="type" class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700">
                        {{ t(`training.type.${type}`) }}
                        <button @click="removeProductType(type)" class="ml-1 hover:text-blue-900">
                          <XMarkIcon class="h-3 w-3" />
                        </button>
                      </span>
                    </template>
                    <template v-if="filters.difficulties.length > 0">
                      <span v-for="difficulty in filters.difficulties" :key="difficulty" class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700">
                        {{ t(`training.difficulty.${difficulty}`) }}
                        <button @click="removeDifficulty(difficulty)" class="ml-1 hover:text-blue-900">
                          <XMarkIcon class="h-3 w-3" />
                        </button>
                      </span>
                    </template>
                    <span v-if="filters.search" class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700">
                      "{{ filters.search }}"
                      <button @click="removeSearch" class="ml-1 hover:text-blue-900">
                        <XMarkIcon class="h-3 w-3" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div class="flex items-center">
                    <div class="p-2 bg-green-100 rounded-lg">
                      <CheckCircleIcon class="h-6 w-6 text-green-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm text-gray-500">{{ t('training.status.active') }}</div>
                      <div class="text-2xl font-semibold text-gray-900">{{ activeTests.length }}</div>
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div class="flex items-center">
                    <div class="p-2 bg-yellow-100 rounded-lg">
                      <ClockIcon class="h-6 w-6 text-yellow-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm text-gray-500">{{ t('training.status.inactive') }}</div>
                      <div class="text-2xl font-semibold text-gray-900">{{ inactiveTests.length }}</div>
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div class="flex items-center">
                    <div class="p-2 bg-red-100 rounded-lg">
                      <LockClosedIcon class="h-6 w-6 text-red-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm text-gray-500">{{ t('training.status.locked') }}</div>
                      <div class="text-2xl font-semibold text-gray-900">{{ lockedTests.length }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tests activos -->
            <div v-if="activeTests.length > 0" class="mb-12">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <CheckCircleIcon class="h-5 w-5 text-green-500 mr-2" />
                  <h2 class="text-xl font-semibold text-gray-900">{{ t('training.status.active') }}</h2>
                </div>
                <span class="text-sm text-gray-500">{{ activeTests.length }} {{ t('training.tests') }}</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <TestCard
                  v-for="test in activeTests"
                  :key="test.id"
                  :test="test"
                  class="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                />
              </div>
            </div>

            <!-- Tests inactivos -->
            <div v-if="inactiveTests.length > 0" class="mb-12">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <ClockIcon class="h-5 w-5 text-yellow-500 mr-2" />
                  <h2 class="text-xl font-semibold text-gray-900">{{ t('training.status.inactive') }}</h2>
                </div>
                <span class="text-sm text-gray-500">{{ inactiveTests.length }} {{ t('training.tests') }}</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <TestCard
                  v-for="test in inactiveTests"
                  :key="test.id"
                  :test="test"
                  class="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                />
              </div>
            </div>

            <!-- Tests bloqueados -->
            <div v-if="lockedTests.length > 0">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <LockClosedIcon class="h-5 w-5 text-red-500 mr-2" />
                  <h2 class="text-xl font-semibold text-gray-900">{{ t('training.status.locked') }}</h2>
                </div>
                <span class="text-sm text-gray-500">{{ lockedTests.length }} {{ t('training.tests') }}</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <TestCard
                  v-for="test in lockedTests"
                  :key="test.id"
                  :test="test"
                  class="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                />
              </div>
            </div>

            <!-- Mensaje cuando no hay resultados -->
            <div
              v-if="activeTests.length === 0 && inactiveTests.length === 0 && lockedTests.length === 0"
              class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <MagnifyingGlassIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('training.noResults.title') }}</h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ t('training.noResults.description') }}
              </p>
              <div class="mt-6">
                <button
                  @click="resetFilters"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {{ t('training.filters.clear') }}
                </button>
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
import TestCard from '@/Components/TrainingLibrary/TestCard.vue'
import TestFilters from '@/Components/TrainingLibrary/TestFilters.vue'
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

// Estado para filtros móviles
const showMobileFilters = ref(false)

// Búsqueda global
const searchQuery = ref('')

// Datos de ejemplo - En producción, esto vendría de una API
const tests = ref([
  // Tests Activos
  {
    id: 1,
    name: 'AZ-900: Microsoft Azure Fundamentals',
    description: 'Prepárate para la certificación AZ-900 con este test de práctica completo.',
    type: 'practice',
    status: 'active',
    progress: 75,
    lastAccess: '2024-03-15',
    questions: 50,
    competencies: 'Cloud Computing, Azure Services',
    role: 'Cloud Administrator',
    technologies: 'Azure, Cloud Computing',
    difficulty: 'beginner',
    hasBadge: true,
    isFavorite: true,
    price: '49.99',
    rating: 4.8,
    reviews: 128
  },
  {
    id: 2,
    name: 'AZ-104: Azure Administrator Associate',
    description: 'Test de práctica para la certificación AZ-104 de administración en Azure.',
    type: 'practice',
    status: 'active',
    progress: 45,
    lastAccess: '2024-03-14',
    questions: 55,
    competencies: 'Azure Administration, Cloud Management',
    role: 'Cloud Administrator',
    technologies: 'Azure, Cloud Computing',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: false,
    price: '69.99',
    rating: 4.7,
    reviews: 95
  },
  {
    id: 3,
    name: 'AZ-204: Azure Developer Associate',
    description: 'Test de práctica para la certificación AZ-204 de desarrollo en Azure.',
    type: 'practice',
    status: 'active',
    progress: 30,
    lastAccess: '2024-03-13',
    questions: 60,
    competencies: 'Azure Development, Cloud Applications',
    role: 'Cloud Developer',
    technologies: 'Azure, .NET, Node.js',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: true,
    price: '79.99',
    rating: 4.6,
    reviews: 85
  },
  // Tests Inactivos
  {
    id: 4,
    name: 'AZ-305: Azure Solutions Architect Expert',
    description: 'Test de práctica para la certificación AZ-305 de arquitectura en Azure.',
    type: 'practice',
    status: 'inactive',
    progress: 0,
    lastAccess: null,
    questions: 70,
    competencies: 'Azure Architecture, Cloud Solutions',
    role: 'Cloud Architect',
    technologies: 'Azure, Cloud Computing',
    difficulty: 'advanced',
    hasBadge: true,
    isFavorite: false,
    price: '99.99',
    rating: 4.9,
    reviews: 45
  },
  {
    id: 5,
    name: 'AZ-400: Azure DevOps Engineer Expert',
    description: 'Test de práctica para la certificación AZ-400 de DevOps en Azure.',
    type: 'practice',
    status: 'inactive',
    progress: 0,
    lastAccess: null,
    questions: 65,
    competencies: 'DevOps, CI/CD, Azure DevOps',
    role: 'DevOps Engineer',
    technologies: 'Azure, DevOps, CI/CD',
    difficulty: 'advanced',
    hasBadge: true,
    isFavorite: false,
    price: '89.99',
    rating: 4.8,
    reviews: 78
  },
  // Tests Bloqueados
  {
    id: 6,
    name: 'AWS Solutions Architect Associate',
    description: 'Prepárate para la certificación AWS SAA con este test de práctica.',
    type: 'practice',
    status: 'locked',
    progress: 0,
    lastAccess: null,
    questions: 65,
    competencies: 'AWS Architecture, Cloud Solutions',
    role: 'Cloud Architect',
    technologies: 'AWS, Cloud Computing',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: false,
    price: '89.99',
    rating: 4.7,
    reviews: 156,
    purchaseUrl: 'https://example.com/purchase/aws-saa'
  },
  {
    id: 7,
    name: 'AWS Developer Associate',
    description: 'Test de práctica para la certificación AWS DVA de desarrollo.',
    type: 'practice',
    status: 'locked',
    progress: 0,
    lastAccess: null,
    questions: 60,
    competencies: 'AWS Development, Cloud Applications',
    role: 'Cloud Developer',
    technologies: 'AWS, Cloud Computing',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: false,
    price: '79.99',
    rating: 4.6,
    reviews: 98,
    purchaseUrl: 'https://example.com/purchase/aws-dva'
  },
  {
    id: 8,
    name: 'AWS SysOps Administrator Associate',
    description: 'Test de práctica para la certificación AWS SOA de administración.',
    type: 'practice',
    status: 'locked',
    progress: 0,
    lastAccess: null,
    questions: 55,
    competencies: 'AWS Administration, Cloud Management',
    role: 'Cloud Administrator',
    technologies: 'AWS, Cloud Computing',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: false,
    price: '79.99',
    rating: 4.5,
    reviews: 87,
    purchaseUrl: 'https://example.com/purchase/aws-soa'
  },
  // Otros tipos de productos
  {
    id: 9,
    name: 'Azure Fundamentals eLearning',
    description: 'Curso completo de fundamentos de Azure con ejercicios prácticos.',
    type: 'elearning',
    status: 'active',
    progress: 60,
    lastAccess: '2024-03-12',
    questions: 0,
    competencies: 'Azure Basics, Cloud Computing',
    role: 'Cloud Beginner',
    technologies: 'Azure, Cloud Computing',
    difficulty: 'beginner',
    hasBadge: true,
    isFavorite: true,
    price: '149.99',
    rating: 4.8,
    reviews: 234
  },
  {
    id: 10,
    name: 'Azure Security Assessment',
    description: 'Evaluación completa de conocimientos en seguridad de Azure.',
    type: 'assessment',
    status: 'inactive',
    progress: 0,
    lastAccess: null,
    questions: 40,
    competencies: 'Azure Security, Cloud Security',
    role: 'Security Engineer',
    technologies: 'Azure, Security',
    difficulty: 'advanced',
    hasBadge: true,
    isFavorite: false,
    price: '59.99',
    rating: 4.7,
    reviews: 67
  },
  {
    id: 11,
    name: 'Azure Developer CertKit',
    description: 'Kit completo de preparación para la certificación AZ-204.',
    type: 'certkit',
    status: 'locked',
    progress: 0,
    lastAccess: null,
    questions: 0,
    competencies: 'Azure Development, Cloud Applications',
    role: 'Cloud Developer',
    technologies: 'Azure, .NET, Node.js',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: false,
    price: '199.99',
    rating: 4.9,
    reviews: 89,
    purchaseUrl: 'https://example.com/purchase/az-204-certkit'
  }
])

// Filtros
const filters = ref({
  search: '',
  statuses: [],
  productTypes: [],
  difficulties: []
})

// Tests filtrados
const filteredTests = computed(() => {
  return tests.value.filter(test => {
    // Filtro de búsqueda global
    if (searchQuery.value && !test.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }

    // Filtro de búsqueda específica
    if (filters.value.search && !test.name.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false
    }

    // Filtro de estado
    if (filters.value.statuses.length > 0 && !filters.value.statuses.includes(test.status)) {
      return false
    }

    // Filtro de tipo de producto
    if (filters.value.productTypes.length > 0 && !filters.value.productTypes.includes(test.type)) {
      return false
    }

    // Filtro de dificultad
    if (filters.value.difficulties.length > 0 && !filters.value.difficulties.includes(test.difficulty)) {
      return false
    }

    return true
  })
})

// Tests agrupados por estado
const activeTests = computed(() => {
  return filteredTests.value.filter(test => test.status === 'active')
})

const inactiveTests = computed(() => {
  return filteredTests.value.filter(test => test.status === 'inactive')
})

const lockedTests = computed(() => {
  return filteredTests.value.filter(test => test.status === 'locked')
})

// Computed property para verificar si hay filtros activos
const hasActiveFilters = computed(() => {
  return filters.value.statuses.length > 0 ||
         filters.value.productTypes.length > 0 ||
         filters.value.difficulties.length > 0 ||
         filters.value.search !== ''
})

// Manejador de filtros
const handleFilter = (newFilters) => {
  filters.value = { ...newFilters }
}

// Resetear filtros
const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    search: '',
    statuses: [],
    productTypes: [],
    difficulties: []
  }
  showMobileFilters.value = false
}

// Añadir los métodos para eliminar filtros
const removeStatus = (status) => {
  filters.value.statuses = filters.value.statuses.filter(s => s !== status)
}

const removeProductType = (type) => {
  filters.value.productTypes = filters.value.productTypes.filter(t => t !== type)
}

const removeDifficulty = (difficulty) => {
  filters.value.difficulties = filters.value.difficulties.filter(d => d !== difficulty)
}

const removeSearch = () => {
  filters.value.search = ''
}
</script> 