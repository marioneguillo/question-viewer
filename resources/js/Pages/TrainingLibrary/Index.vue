<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Encabezado -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">{{ t('training.title') }}</h1>
          <p class="mt-2 text-sm text-gray-600">{{ t('training.subtitle') }}</p>
        </div>

        <!-- Barra de búsqueda y filtros -->
        <div class="flex flex-col md:flex-row gap-4 mb-8">
          <div class="flex-1">
            <div class="relative">
              <input type="text"
                     v-model="searchQuery"
                     :placeholder="t('training.searchPlaceholder')"
                     class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="toggleView"
                    class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-sm">
              <div class="relative">
                <component :is="currentView === 'grid' ? TableCellsIcon : Squares2X2Icon" class="w-4 h-4" />
              </div>
              {{ currentView === 'grid' ? t('training.view.table') : t('training.view.grid') }}
            </button>
            <button @click="showMobileFilters = true"
                    class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-sm">
              <div class="relative">
                <FunnelIcon class="w-4 h-4" />
                <span v-if="hasActiveFilters" class="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </div>
              {{ t('training.filters.title') }}
            </button>
          </div>
        </div>

        <!-- Contenido principal -->
        <div class="flex flex-col">
          <!-- Lista de tests -->
          <div class="flex-1">
            <!-- Resumen de tests y filtros -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900">{{ t('training.summary') }}</h2>
                <!-- Indicador de filtros activos -->
                <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
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
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all duration-200">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-blue-700">{{ t('training.totalTests') }}</div>
                      <div class="text-3xl font-bold text-blue-900 mt-1">{{ filteredTests.length }}</div>
                    </div>
                    <div class="p-3 bg-blue-200 rounded-lg">
                      <AcademicCapIcon class="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all duration-200">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-green-700">{{ t('training.activeTests') }}</div>
                      <div class="text-3xl font-bold text-green-900 mt-1">{{ activeTests.length }}</div>
                    </div>
                    <div class="p-3 bg-green-200 rounded-lg">
                      <CheckCircleIcon class="h-6 w-6 text-green-700" />
                    </div>
                  </div>
     
                </div>
                <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6 hover:shadow-md transition-all duration-200">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-yellow-700">{{ t('training.inactiveTests') }}</div>
                      <div class="text-3xl font-bold text-yellow-900 mt-1">{{ inactiveTests.length }}</div>
                    </div>
                    <div class="p-3 bg-yellow-200 rounded-lg">
                      <ClockIcon class="h-6 w-6 text-yellow-700" />
                    </div>
                  </div>
        
                </div>
                <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-all duration-200">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-red-700">{{ t('training.lockedTests') }}</div>
                      <div class="text-3xl font-bold text-red-900 mt-1">{{ lockedTests.length }}</div>
                    </div>
                    <div class="p-3 bg-red-200 rounded-lg">
                      <LockClosedIcon class="h-6 w-6 text-red-700" />
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
              
              <!-- Vista Grid -->
              <div v-if="currentView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <TestCard
                  v-for="test in activeTests"
                  :key="test.id"
                  :test="test"
                  class="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                />
              </div>

              <!-- Vista Tabla -->
              <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="test in activeTests" :key="test.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-12 w-12">
                              <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <BookOpenIcon class="h-7 w-7 text-blue-600" />
                              </div>
                            </div>
                            <div class="ml-4 flex-1">
                              <div class="text-base font-medium text-gray-900">{{ test.name }}</div>
                              <div class="mt-1 flex items-center gap-3">
                                <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full text-blue-800 border border-blue-200">
                                  {{ t(`training.type.${test.type}`) }}
                                </span>
                                <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full" 
                                      :class="{
                                        'bg-green-100 text-green-800': test.difficulty === 'beginner',
                                        'bg-yellow-100 text-yellow-800': test.difficulty === 'intermediate',
                                        'bg-red-100 text-red-800': test.difficulty === 'advanced'
                                      }">
                                  {{ t(`training.difficulty.${test.difficulty}`) }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center justify-end space-x-4">
                            <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" :title="t('training.table.start')">
                              <PlayIcon class="h-5 w-5 mr-2" />
                              {{ t('training.table.start') }}
                            </button>
                            <button @click="showTestDetails(test)" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" :title="t('training.table.details')">
                              <InformationCircleIcon class="h-5 w-5 mr-2" />
                              {{ t('training.table.details') }}
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
              
              <!-- Vista Grid -->
              <div v-if="currentView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <TestCard
                  v-for="test in inactiveTests"
                  :key="test.id"
                  :test="test"
                  class="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                />
              </div>

              <!-- Vista Tabla -->
              <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="test in inactiveTests" :key="test.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-12 w-12">
                              <div class="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <BookOpenIcon class="h-7 w-7 text-yellow-600" />
                              </div>
                            </div>
                            <div class="ml-4 flex-1">
                              <div class="text-base font-medium text-gray-900">{{ test.name }}</div>
                              <div class="mt-1 flex items-center gap-3">
                                <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full text-yellow-800 border border-yellow-200">
                                  {{ t(`training.type.${test.type}`) }}
                                </span>
                                <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full" 
                                      :class="{
                                        'bg-green-100 text-green-800': test.difficulty === 'beginner',
                                        'bg-yellow-100 text-yellow-800': test.difficulty === 'intermediate',
                                        'bg-red-100 text-red-800': test.difficulty === 'advanced'
                                      }">
                                  {{ t(`training.difficulty.${test.difficulty}`) }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center justify-end space-x-4">
                            <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" :title="t('training.table.start')">
                              <PlayIcon class="h-5 w-5 mr-2" />
                              {{ t('training.table.start') }}
                            </button>
                            <button @click="showTestDetails(test)" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" :title="t('training.table.details')">
                              <InformationCircleIcon class="h-5 w-5 mr-2" />
                              {{ t('training.table.details') }}
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
              
              <!-- Vista Grid -->
              <div v-if="currentView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <TestCard
                  v-for="test in lockedTests"
                  :key="test.id"
                  :test="test"
                  class="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                />
              </div>

              <!-- Vista Tabla -->
              <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="test in lockedTests" :key="test.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-12 w-12">
                              <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                <BookOpenIcon class="h-7 w-7 text-red-600" />
                              </div>
                            </div>
                            <div class="ml-4 flex-1">
                              <div class="text-base font-medium text-gray-900">{{ test.name }}</div>
                              <div class="mt-1 flex items-center gap-3">
                                <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full text-red-800 border border-red-200">
                                  {{ t(`training.type.${test.type}`) }}
                                </span>
                                <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full" 
                                      :class="{
                                        'bg-green-100 text-green-800': test.difficulty === 'beginner',
                                        'bg-yellow-100 text-yellow-800': test.difficulty === 'intermediate',
                                        'bg-red-100 text-red-800': test.difficulty === 'advanced'
                                      }">
                                  {{ t(`training.difficulty.${test.difficulty}`) }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center justify-end space-x-4">
                            <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" :title="t('training.table.purchase')">
                              <ShoppingCartIcon class="h-5 w-5 mr-2" />
                              {{ t('training.table.purchase') }}
                            </button>
                            <button @click="showTestDetails(test)" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" :title="t('training.table.details')">
                              <InformationCircleIcon class="h-5 w-5 mr-2" />
                              {{ t('training.table.details') }}
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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

      <!-- Componente de Filtros -->
      <TestFilters 
        :is-open="showMobileFilters" 
        @close="showMobileFilters = $event"
        @filter="handleFilter"
      />

      <!-- Modal de detalles del test -->
      <TestDetailsModal
        v-if="showDetailsModal"
        :test="selectedTest"
        @close="showDetailsModal = false"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import TestCard from '@/Components/TrainingLibrary/TestCard.vue'
import TestFilters from '@/Components/TrainingLibrary/TestFilters.vue'
import TestDetailsModal from '@/Components/TrainingLibrary/TestDetailsModal.vue'
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  FunnelIcon,
  XMarkIcon,
  BookOpenIcon,
  AcademicCapIcon,
  TableCellsIcon,
  Squares2X2Icon,
  StarIcon,
  PlayIcon,
  InformationCircleIcon,
  ShoppingCartIcon
} from '@heroicons/vue/24/outline'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

// Estado para filtros móviles
const showMobileFilters = ref(false)

// Búsqueda global
const searchQuery = ref('')

// Estado para la vista actual
const currentView = ref('grid')

// Estado para el modal de detalles
const showDetailsModal = ref(false)
const selectedTest = ref(null)

// Datos de ejemplo - En producción, esto vendría de una API
const tests = ref([
  // Tests Activos
  {
    id: 1,
    name: 'AZ-900: Microsoft Azure Fundamentals',
    type: 'practice',
    status: 'active',
    progress: 75,
    lastAccess: '2024-03-15',
    questions: 50,
    competencies: 'Cloud Computing, Azure Services',
    role: 'Cloud Solutions Architect',
    technologies: 'Azure, Cloud Computing, Infrastructure as Code',
    difficulty: 'beginner',
    hasBadge: true,
    isFavorite: true,
    price: '49.99',
    rating: 4.8,
    reviews: 128,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    activationDate: '2024-01-15',
    expirationDate: '2024-12-31',
    lastScore: 85,
    averageScore: 78,
    attempts: 12,
    lastAttemptDate: '2024-03-15T14:30:00Z'
  },
  {
    id: 2,
    name: 'AZ-104: Azure Administrator Associate',
    type: 'practice',
    status: 'active',
    progress: 45,
    lastAccess: '2024-03-14',
    questions: 55,
    competencies: 'Azure Administration, Cloud Management',
    role: 'Cloud Infrastructure Engineer',
    technologies: 'Azure, Terraform, Kubernetes',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: false,
    price: '69.99',
    rating: 4.7,
    reviews: 95,
    uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    activationDate: '2024-02-01',
    expirationDate: '2024-12-31',
    lastScore: 72,
    averageScore: 68,
    attempts: 8,
    lastAttemptDate: '2024-03-14T16:45:00Z'
  },
  {
    id: 3,
    name: 'AZ-204: Azure Developer Associate',
    type: 'practice',
    status: 'active',
    progress: 30,
    lastAccess: '2024-03-13',
    questions: 60,
    competencies: 'Azure Development, Cloud Applications',
    role: 'Full Stack Developer',
    technologies: 'Azure, .NET Core, React, Node.js',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: true,
    price: '79.99',
    rating: 4.6,
    reviews: 85,
    uuid: '7ba7b810-9dad-11d1-80b4-00c04fd430c9',
    activationDate: '2024-02-15',
    expirationDate: '2024-12-31',
    lastScore: 65,
    averageScore: 62,
    attempts: 5,
    lastAttemptDate: '2024-03-13T09:15:00Z'
  },
  // Tests Inactivos
  {
    id: 4,
    name: 'AZ-305: Azure Solutions Architect Expert',
    type: 'practice',
    status: 'inactive',
    progress: 0,
    lastAccess: null,
    questions: 70,
    competencies: 'Azure Architecture, Cloud Solutions',
    role: 'Enterprise Architect',
    technologies: 'Azure, Microservices, Event-Driven Architecture',
    difficulty: 'advanced',
    hasBadge: true,
    isFavorite: false,
    price: '99.99',
    rating: 4.9,
    reviews: 45,
    uuid: '8ba7b810-9dad-11d1-80b4-00c04fd430d0',
    activationDate: '2024-03-01',
    expirationDate: '2024-12-31',
    lastScore: null,
    averageScore: null,
    attempts: 0,
    lastAttemptDate: null
  },
  {
    id: 5,
    name: 'AZ-400: Azure DevOps Engineer Expert',
    type: 'practice',
    status: 'inactive',
    progress: 0,
    lastAccess: null,
    questions: 65,
    competencies: 'DevOps, CI/CD, Azure DevOps',
    role: 'DevOps Engineer',
    technologies: 'Azure, Git, Docker, Kubernetes, Jenkins',
    difficulty: 'advanced',
    hasBadge: true,
    isFavorite: false,
    price: '89.99',
    rating: 4.8,
    reviews: 78,
    uuid: '9ba7b810-9dad-11d1-80b4-00c04fd430d1',
    activationDate: '2024-03-10',
    expirationDate: '2024-12-31',
    lastScore: null,
    averageScore: null,
    attempts: 0,
    lastAttemptDate: null
  },
  // Tests Bloqueados
  {
    id: 6,
    name: 'AWS Solutions Architect Associate',
    type: 'practice',
    status: 'locked',
    progress: 0,
    lastAccess: null,
    questions: 65,
    competencies: 'AWS Architecture, Cloud Solutions',
    role: 'Cloud Solutions Architect',
    technologies: 'AWS, CloudFormation, Lambda, S3',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: false,
    price: '89.99',
    rating: 4.7,
    reviews: 156,
    purchaseUrl: 'https://example.com/purchase/aws-saa',
    uuid: '0ba7b810-9dad-11d1-80b4-00c04fd430d2',
    activationDate: null,
    expirationDate: null,
    lastScore: null,
    averageScore: null,
    attempts: 0,
    lastAttemptDate: null
  },
  {
    id: 7,
    name: 'AWS Developer Associate',
    type: 'practice',
    status: 'locked',
    progress: 0,
    lastAccess: null,
    questions: 60,
    competencies: 'AWS Development, Cloud Applications',
    role: 'Backend Developer',
    technologies: 'AWS, Python, DynamoDB, API Gateway',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: false,
    price: '79.99',
    rating: 4.6,
    reviews: 98,
    purchaseUrl: 'https://example.com/purchase/aws-dva',
    uuid: '1ba7b810-9dad-11d1-80b4-00c04fd430d3',
    activationDate: null,
    expirationDate: null,
    lastScore: null,
    averageScore: null,
    attempts: 0,
    lastAttemptDate: null
  },
  {
    id: 8,
    name: 'AWS SysOps Administrator Associate',
    type: 'practice',
    status: 'locked',
    progress: 0,
    lastAccess: null,
    questions: 55,
    competencies: 'AWS Administration, Cloud Management',
    role: 'Cloud Operations Engineer',
    technologies: 'AWS, CloudWatch, Systems Manager, EC2',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: false,
    price: '79.99',
    rating: 4.5,
    reviews: 87,
    purchaseUrl: 'https://example.com/purchase/aws-soa',
    uuid: '2ba7b810-9dad-11d1-80b4-00c04fd430d4',
    activationDate: null,
    expirationDate: null,
    lastScore: null,
    averageScore: null,
    attempts: 0,
    lastAttemptDate: null
  },
  // Otros tipos de productos
  {
    id: 9,
    name: 'Azure Fundamentals eLearning',
    type: 'elearning',
    status: 'active',
    progress: 60,
    lastAccess: '2024-03-12',
    questions: 0,
    competencies: 'Azure Basics, Cloud Computing',
    role: 'Cloud Beginner',
    technologies: 'Azure, Cloud Computing, Virtual Machines',
    difficulty: 'beginner',
    hasBadge: true,
    isFavorite: true,
    price: '149.99',
    rating: 4.8,
    reviews: 234,
    uuid: '3ba7b810-9dad-11d1-80b4-00c04fd430d5',
    activationDate: '2024-01-01',
    expirationDate: '2024-12-31',
    lastScore: 85,
    averageScore: 82,
    attempts: 15,
    lastAttemptDate: '2024-03-12T11:20:00Z'
  },
  {
    id: 10,
    name: 'Azure Security Assessment',
    type: 'assessment',
    status: 'inactive',
    progress: 0,
    lastAccess: null,
    questions: 40,
    competencies: 'Azure Security, Cloud Security',
    role: 'Security Engineer',
    technologies: 'Azure, Security, Compliance, Identity Management',
    difficulty: 'advanced',
    hasBadge: true,
    isFavorite: false,
    price: '59.99',
    rating: 4.7,
    reviews: 67,
    uuid: '4ba7b810-9dad-11d1-80b4-00c04fd430d6',
    activationDate: '2024-03-05',
    expirationDate: '2024-12-31',
    lastScore: null,
    averageScore: null,
    attempts: 0,
    lastAttemptDate: null
  },
  {
    id: 11,
    name: 'Azure Developer CertKit',
    type: 'certkit',
    status: 'locked',
    progress: 0,
    lastAccess: null,
    questions: 0,
    competencies: 'Azure Development, Cloud Applications',
    role: 'Cloud Developer',
    technologies: 'Azure, .NET Core, Microservices, Event Hubs',
    difficulty: 'intermediate',
    hasBadge: true,
    isFavorite: false,
    price: '199.99',
    rating: 4.9,
    reviews: 89,
    purchaseUrl: 'https://example.com/purchase/az-204-certkit',
    uuid: '5ba7b810-9dad-11d1-80b4-00c04fd430d7',
    activationDate: null,
    expirationDate: null,
    lastScore: null,
    averageScore: null,
    attempts: 0,
    lastAttemptDate: null
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

// Función para alternar entre vistas
const toggleView = () => {
  currentView.value = currentView.value === 'grid' ? 'table' : 'grid'
}

// Función para mostrar los detalles del test
const showTestDetails = (test) => {
  selectedTest.value = test
  showDetailsModal.value = true
}
</script> 