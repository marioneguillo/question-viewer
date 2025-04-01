<template>
  <div class="group perspective">
    <div :class="[
      'relative w-full h-full transition-all duration-500 transform-style-3d',
      isFlipped ? 'rotate-y-180' : ''
    ]">
      <!-- Frente de la tarjeta -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
        <!-- Encabezado con gradiente según el estado -->
        <div :class="[
          'p-4',
          test.status === 'active' ? 'bg-gradient-to-r from-blue-50 to-blue-100' :
          test.status === 'inactive' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' :
          'bg-gradient-to-r from-red-50 to-red-100'
        ]">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-start gap-3">
                <div :class="[
                  'p-2 rounded-lg',
                  test.status === 'active' ? 'bg-blue-100' :
                  test.status === 'inactive' ? 'bg-yellow-100' :
                  'bg-red-100'
                ]">
                  <component
                    :is="testIcon"
                    :class="[
                      'h-6 w-6',
                      test.status === 'active' ? 'text-blue-600' :
                      test.status === 'inactive' ? 'text-yellow-600' :
                      'text-red-600'
                    ]"
                  />
                </div>
                <div class="min-w-0">
                  <h3 class="text-lg font-semibold text-gray-900 break-words line-clamp-2 h-[3.5rem]">{{ test.name }}</h3>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                @click="toggleFavorite"
                class="p-1.5 text-gray-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-white/50"
              >
                <StarIcon
                  :class="[
                    'h-5 w-5',
                    test.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Contenido principal -->
        <div class="flex-1 p-4">
          <!-- Métricas de progreso -->
          <div v-if="test.status !== 'locked'" class="grid grid-cols-2 gap-4 mb-4">
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <ChartBarIcon class="h-4 w-4 text-green-600" />
                <span class="text-sm font-medium text-gray-700">{{ t('training.lastScore') }}</span>
              </div>
              <div class="text-2xl font-bold text-gray-900">{{ test.lastScore || '0' }}%</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <AcademicCapIcon class="h-4 w-4 text-blue-600" />
                <span class="text-sm font-medium text-gray-700">{{ t('training.averageScore') }}</span>
              </div>
              <div class="text-2xl font-bold text-gray-900">{{ test.averageScore || '0' }}%</div>
            </div>
          </div>

          <!-- Nivel y tipo -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="px-2.5 py-1 rounded-full text-xs font-medium"
                   :class="[
                     test.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                     test.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                     'bg-purple-100 text-purple-700'
                   ]">
                {{ t(`training.difficulty.${test.difficulty}`) }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {{ t(`training.type.${test.type}`) }}
              </div>
            </div>
          </div>

          <!-- Badge -->
          <div v-if="test.hasBadge" class="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
            <CheckBadgeIcon class="h-5 w-5 text-blue-600" />
            <span class="text-sm font-medium text-blue-700">{{ t('training.includesCertification') }}</span>
          </div>
        </div>

        <!-- Acciones (siempre al final) -->
        <div class="p-4 border-t border-gray-100">
          <div class="flex gap-2">
            <template v-if="test.status === 'active'">
              <button
                @click="startTest"
                class="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {{ t('training.start') }}
              </button>
              <button
                @click="isFlipped = true"
                class="inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <InformationCircleIcon class="h-5 w-5" />
              </button>
            </template>
            <template v-else-if="test.status === 'inactive'">
              <button
                @click="activateTest"
                class="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
              >
                {{ t('training.activate') }}
              </button>
              <button
                @click="tryDemo"
                class="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {{ t('training.tryDemo') }}
              </button>
              <button
                @click="isFlipped = true"
                class="inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <InformationCircleIcon class="h-5 w-5" />
              </button>
            </template>
            <template v-else>
              <button
                @click="activateTest"
                class="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                {{ t('training.activate') }}
              </button>
              <button
                @click="tryDemo"
                class="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {{ t('training.tryDemo') }}
              </button>
              <button
                @click="isFlipped = true"
                class="inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <InformationCircleIcon class="h-5 w-5" />
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Reverso de la tarjeta -->
      <div class="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full rotate-y-180 backface-hidden">
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">{{ t('training.details') }}</h3>
            <button
              @click="isFlipped = false"
              class="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div class="flex-1 p-4 overflow-y-auto">
          <div class="space-y-4">
            <!-- Detalles del test -->
            <div class="absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg p-6 flex flex-col backface-hidden">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">{{ t('training.details') }}</h3>
                <button @click="isFlipped = false" class="text-gray-400 hover:text-gray-600">
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Información principal -->
              <div class="space-y-6 flex-1 overflow-y-auto">
                <!-- Job Role y Tecnología -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-blue-50 rounded-lg p-4">
                    <div class="flex items-center mb-2">
                      <UserIcon class="h-5 w-5 text-blue-500 mr-2" />
                      <h4 class="text-sm font-medium text-blue-700">{{ t('training.jobRole') }}</h4>
                    </div>
                    <p class="text-sm text-blue-900">{{ test.role }}</p>
                  </div>
                  <div class="bg-purple-50 rounded-lg p-4">
                    <div class="flex items-center mb-2">
                      <CodeBracketIcon class="h-5 w-5 text-purple-500 mr-2" />
                      <h4 class="text-sm font-medium text-purple-700">{{ t('training.technologies') }}</h4>
                    </div>
                    <p class="text-sm text-purple-900">{{ test.technologies }}</p>
                  </div>
                </div>

                <!-- Fechas importantes -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">{{ t('training.importantDates') }}</h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">{{ t('training.activationDate') }}</span>
                      <span class="text-sm font-medium text-gray-900">{{ formatDate(test.activationDate) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">{{ t('training.expirationDate') }}</span>
                      <span class="text-sm font-medium text-gray-900">{{ formatDate(test.expirationDate) }}</span>
                    </div>
                  </div>
                </div>

                <!-- UUID -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center mb-2">
                    <FingerPrintIcon class="h-5 w-5 text-gray-500 mr-2" />
                    <h4 class="text-sm font-medium text-gray-700">Key</h4>
                  </div>
                  <p class="font-mono text-sm text-gray-900 break-all">{{ test.uuid }}</p>
                </div>            
              </div>

              <!-- Botón de volver -->
              <div class="mt-6 pt-4 border-t border-gray-200">
                <button
                  @click="isFlipped = false"
                  class="w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  {{ t('training.backToFront') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-200">
          <button
            @click="isFlipped = false"
            class="w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            {{ t('training.backToFront') }}
          </button>
        </div>
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
  CheckBadgeIcon,
  ChartBarIcon,
  XMarkIcon,
  InformationCircleIcon,
  UserIcon,
  CodeBracketIcon,
  FingerPrintIcon
} from '@heroicons/vue/24/outline'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps({
  test: {
    type: Object,
    required: true
  }
})

const { t, locale } = useTranslation()
const isFlipped = ref(false)

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

<style scoped>
.perspective {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style> 