<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
    <!-- Encabezado de la tarjeta -->
    <div class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 :class="[
            'text-lg font-semibold',
            test.status === 'active' ? 'text-blue-900' :
            test.status === 'inactive' ? 'text-yellow-900' :
            'text-red-900'
          ]">{{ test.name }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ test.description }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="toggleFavorite" class="text-gray-400 hover:text-yellow-500 transition-colors duration-200">
            <StarIcon :class="['h-5 w-5', { 'fill-current text-yellow-500': test.isFavorite }]" />
          </button>
          <button @click="showDetails" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <EllipsisVerticalIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Badges de estado y tipo -->
      <div class="mt-4 flex items-center gap-2">
        <span class="px-2 py-1 text-xs font-medium rounded-full" 
              :class="{
                'bg-green-100 text-green-800': test.status === 'active',
                'bg-yellow-100 text-yellow-800': test.status === 'inactive',
                'bg-red-100 text-red-800': test.status === 'locked'
              }">
          {{ t(`training.status.${test.status}`) }}
        </span>
        <span class="px-2 py-1 text-xs font-medium rounded-full" 
              :class="{
                'bg-blue-100 text-blue-800': test.type === 'practice',
                'bg-purple-100 text-purple-800': test.type === 'elearning',
                'bg-orange-100 text-orange-800': test.type === 'assessment',
                'bg-indigo-100 text-indigo-800': test.type === 'certkit'
              }">
          {{ t(`training.type.${test.type}`) }}
        </span>
      </div>

      <!-- Barra de progreso para tests activos -->
      <div v-if="test.status === 'active'" class="mt-4">
        
        <!-- Puntuaciones -->
        <div class="mt-4 grid grid-cols-2 gap-4">
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
      </div>
    </div>

    <!-- Pie de la tarjeta -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <!-- Botón principal según el estado -->
        <button v-if="test.status === 'active'"
                class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
          <PlayIcon class="h-5 w-5 mr-2" />
          {{ t('training.start') }}
        </button>
        <button v-if="test.status === 'inactive'"
                class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200">
          <ClockIcon class="h-5 w-5 mr-2" />
          {{ t('training.activate') }}
        </button>
        <button v-if="test.status === 'locked'"
                class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
          <ShoppingCartIcon class="h-5 w-5 mr-2" />
          {{ t('training.purchase') }}
        </button>

        <!-- Botón de detalles siempre presente -->
        <button @click="showDetails" 
                class="inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
          <InformationCircleIcon class="h-5 w-5 mr-2" />
          {{ t('training.details.description') }}
        </button>
      </div>
    </div>

    <!-- Modal de detalles -->
    <TransitionRoot appear :show="showDetailsModal" as="template">
      <Dialog as="div" @close="closeDetails" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ test.name }}
                </DialogTitle>

                <div class="mt-4 space-y-4">
                  <!-- Información básica -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-sm font-medium text-gray-500">{{ t('training.details.type') }}</div>
                      <div class="mt-1 text-sm text-gray-900">{{ t(`training.type.${test.type}`) }}</div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-500">{{ t('training.details.difficulty') }}</div>
                      <div class="mt-1 text-sm text-gray-900">{{ t(`training.difficulty.${test.difficulty}`) }}</div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-500">{{ t('training.details.role') }}</div>
                      <div class="mt-1 text-sm text-gray-900">{{ test.role }}</div>
                    </div>
      
                  </div>

                  <!-- Fechas de activación y expiración -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-sm font-medium text-gray-500">{{ t('training.activationDate') }}</div>
                      <div class="mt-1 text-sm text-gray-900">{{ formatDate(test.activationDate) }}</div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-500">{{ t('training.expirationDate') }}</div>
                      <div class="mt-1 text-sm text-gray-900">{{ formatDate(test.expirationDate) }}</div>
                    </div>
                  </div>

                  <!-- Competencias y tecnologías -->
                  <div>
                    <div class="text-sm font-medium text-gray-500">{{ t('training.competencies') }}</div>
                    <div class="mt-1 text-sm text-gray-900">{{ test.competencies }}</div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-500">{{ t('training.technologies') }}</div>
                    <div class="mt-1 text-sm text-gray-900">{{ test.technologies }}</div>
                  </div>

                  <!-- Badges y certificaciones -->
                  <div v-if="test.hasBadge" class="flex items-center space-x-2">
                    <CheckBadgeIcon class="h-5 w-5 text-blue-500" />
                    <span class="text-sm text-gray-900">{{ t('training.hasBadge') }}</span>
                  </div>

                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeDetails"
                  >
                    {{ t('training.close') }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import {
  StarIcon,
  PlayIcon,
  ShoppingCartIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  CheckBadgeIcon,
  InformationCircleIcon,
  ChartBarIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

const { t } = useTranslation()

const props = defineProps({
  test: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-favorite'])

const showDetailsModal = ref(false)

const toggleFavorite = () => {
  emit('toggle-favorite', props.test.id)
}

const showDetails = () => {
  showDetailsModal.value = true
}

const closeDetails = () => {
  showDetailsModal.value = false
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}
</script> 