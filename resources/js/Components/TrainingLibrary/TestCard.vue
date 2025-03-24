<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Encabezado -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <component
              :is="testIcon"
              class="h-5 w-5 text-blue-500"
            />
            <h3 class="text-lg font-semibold text-gray-900">{{ test.name }}</h3>
          </div>
          <p class="mt-1 text-sm text-gray-500">{{ test.description }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="toggleFavorite"
            class="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <StarIcon
              :class="[
                'h-5 w-5',
                test.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
              ]"
            />
          </button>
          <button
            @click="showDetails = !showDetails"
            class="p-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <ChevronDownIcon
              :class="[
                'h-5 w-5 transform transition-transform',
                showDetails ? 'rotate-180' : ''
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Información principal -->
    <div class="p-4">
      <!-- Barra de progreso (solo para tests activos o inactivos) -->
      <div v-if="test.status !== 'locked'" class="mb-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-gray-700">{{ t('training.progress') }}</span>
          <span class="text-sm text-gray-500">{{ test.progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${test.progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Información rápida -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="text-center">
          <div class="text-sm text-gray-500">{{ t('training.questions') }}</div>
          <div class="text-lg font-semibold text-gray-900">{{ test.questions }}</div>
        </div>
        <div class="text-center">
          <div class="text-sm text-gray-500">{{ t('training.level') }}</div>
          <div class="text-lg font-semibold text-gray-900">{{ t(`training.difficulty.${test.difficulty}`) }}</div>
        </div>
      </div>

      <!-- Detalles expandibles -->
      <div
        v-show="showDetails"
        class="mt-4 pt-4 border-t border-gray-200"
      >
        <div class="space-y-4">
          <!-- Rol y tecnologías -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500">{{ t('training.profile') }}</div>
              <div class="font-medium text-gray-900">{{ test.role }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">{{ t('training.technologies') }}</div>
              <div class="font-medium text-gray-900">{{ test.technologies }}</div>
            </div>
          </div>

          <!-- Competencias -->
          <div>
            <div class="text-sm text-gray-500">{{ t('training.skills') }}</div>
            <div class="font-medium text-gray-900">{{ test.competencies }}</div>
          </div>

          <!-- Último acceso -->
          <div v-if="test.lastAccess">
            <div class="text-sm text-gray-500">{{ t('training.lastAccess') }}</div>
            <div class="font-medium text-gray-900">{{ formatDate(test.lastAccess) }}</div>
          </div>

          <!-- Badge -->
          <div v-if="test.hasBadge" class="flex items-center gap-2">
            <CheckBadgeIcon class="h-5 w-5 text-blue-500" />
            <span class="text-sm font-medium text-blue-600">{{ t('training.includesCertification') }}</span>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="mt-4 flex gap-2">
        <template v-if="test.status === 'active'">
          <button
            @click="startTest"
            class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {{ t('training.start') }}
          </button>
        </template>
        <template v-else-if="test.status === 'inactive'">
          <button
            @click="activateTest"
            class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
          >
            {{ t('training.activate') }}
          </button>
          <button
            @click="tryDemo"
            class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {{ t('training.tryDemo') }}
          </button>
        </template>
        <template v-else>
          <button
            @click="activateTest"
            class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            {{ t('training.activate') }}
          </button>
          <button
            @click="tryDemo"
            class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {{ t('training.tryDemo') }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  BookOpenIcon,
  AcademicCapIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  StarIcon,
  ChevronDownIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps({
  test: {
    type: Object,
    required: true
  }
})

const { t, locale } = useTranslation()
const showDetails = ref(false)

const testIcon = computed(() => {
  switch (props.test.type) {
    case 'practice':
      return DocumentTextIcon
    case 'elearning':
      return BookOpenIcon
    case 'assessment':
      return DocumentCheckIcon
    case 'certkit':
      return AcademicCapIcon
    default:
      return DocumentTextIcon
  }
})

const toggleFavorite = () => {
  props.test.isFavorite = !props.test.isFavorite
}

const startTest = () => {
  console.log('Comenzando test:', props.test.id)
}

const activateTest = () => {
  console.log('Activando test:', props.test.id)
}

const tryDemo = () => {
  console.log('Probando demo:', props.test.id)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 