<template>
  <div>
    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
      @click="closeFilters"
    ></div>

    <!-- Panel de filtros -->
    <div
      :class="[
        'fixed inset-y-0 left-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="h-full flex flex-col">
        <!-- Encabezado -->
        <div class="px-4 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">{{ t('training.filters.title') }}</h3>
            <button
              @click="closeFilters"
              class="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- Contenido -->
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <!-- Búsqueda -->
          <div class="mb-4">
            <div class="relative">
              <input
                type="text"
                v-model="localFilters.search"
                :placeholder="t('training.filters.searchPlaceholder')"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <!-- Filtros rápidos -->
          <div class="space-y-4">
            <!-- Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('training.filters.status') }}</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="status in statuses"
                  :key="status.value"
                  @click="toggleFilter('statuses', status.value)"
                  :class="[
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    localFilters.statuses.includes(status.value)
                      ? status.activeClass
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ status.label }}
                </button>
              </div>
            </div>

            <!-- Tipo de producto -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('training.filters.type') }}</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="type in productTypes"
                  :key="type.value"
                  @click="toggleFilter('productTypes', type.value)"
                  :class="[
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    localFilters.productTypes.includes(type.value)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ type.label }}
                </button>
              </div>
            </div>

            <!-- Dificultad -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('training.filters.difficulty') }}</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="difficulty in difficulties"
                  :key="difficulty.value"
                  @click="toggleFilter('difficulties', difficulty.value)"
                  :class="[
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    localFilters.difficulties.includes(difficulty.value)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ difficulty.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="px-4 py-4 border-t border-gray-200">
          <div class="flex gap-2">
            <button
              @click="resetFilters"
              class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {{ t('training.filters.clear') }}
            </button>
            <button
              @click="applyFilters"
              class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {{ t('training.filters.apply') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['filter', 'close'])
const { t } = useTranslation()

const localFilters = ref({
  search: '',
  statuses: [],
  productTypes: [],
  difficulties: []
})

const statuses = [
  { label: t('training.status.active'), value: 'active', activeClass: 'bg-green-100 text-green-800' },
  { label: t('training.status.inactive'), value: 'inactive', activeClass: 'bg-yellow-100 text-yellow-800' },
  { label: t('training.status.locked'), value: 'locked', activeClass: 'bg-red-100 text-red-800' }
]

const productTypes = [
  { label: t('training.type.practice'), value: 'practice' },
  { label: t('training.type.elearning'), value: 'elearning' },
  { label: t('training.type.assessment'), value: 'assessment' },
  { label: t('training.type.certkit'), value: 'certkit' }
]

const difficulties = [
  { label: t('training.difficulty.beginner'), value: 'beginner' },
  { label: t('training.difficulty.intermediate'), value: 'intermediate' },
  { label: t('training.difficulty.advanced'), value: 'advanced' }
]

const closeFilters = () => {
  emit('close', false)
}

const toggleFilter = (filterType, value) => {
  const index = localFilters.value[filterType].indexOf(value)
  if (index === -1) {
    localFilters.value[filterType].push(value)
  } else {
    localFilters.value[filterType].splice(index, 1)
  }
}

const applyFilters = () => {
  emit('filter', { ...localFilters.value })
  closeFilters()
}

const resetFilters = () => {
  localFilters.value = {
    search: '',
    statuses: [],
    productTypes: [],
    difficulties: []
  }
  emit('filter', { ...localFilters.value })
  closeFilters()
}

// Emitir cambios automáticamente cuando cambie la búsqueda
watch(() => localFilters.value.search, (newValue) => {
  emit('filter', { ...localFilters.value })
})
</script> 