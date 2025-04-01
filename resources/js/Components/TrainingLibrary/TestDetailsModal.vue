<template>
  <TransitionRoot appear :show="true" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
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

              <div class="mt-4">
                <div class="grid grid-cols-2 gap-4">
                  <!-- Información básica -->
                  <div class="space-y-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">{{ t('training.details.type') }}</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ t(`training.type.${test.type}`) }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">{{ t('training.details.difficulty') }}</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ t(`training.difficulty.${test.difficulty}`) }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">{{ t('training.details.role') }}</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ test.role }}</p>
                    </div>
                  </div>

                  <!-- Competencias y tecnologías -->
                  <div class="space-y-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">{{ t('training.details.competencies') }}</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ test.competencies }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">{{ t('training.details.technologies') }}</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ test.technologies }}</p>
                    </div>
                  </div>
                </div>

                <!-- Progreso y estadísticas (solo para tests activos) -->
                <div v-if="test.status === 'active'" class="mt-6 border-t border-gray-200 pt-6">
                  <div class="space-y-4">
      
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <h5 class="text-sm font-medium text-gray-500">{{ t('training.details.lastScore') }}</h5>
                        <p class="mt-1 text-sm text-gray-900">{{ test.lastScore }}%</p>
                      </div>
                      <div>
                        <h5 class="text-sm font-medium text-gray-500">{{ t('training.details.averageScore') }}</h5>
                        <p class="mt-1 text-sm text-gray-900">{{ test.averageScore }}%</p>
                      </div>
                      <div>
                        <h5 class="text-sm font-medium text-gray-500">{{ t('training.details.attempts') }}</h5>
                        <p class="mt-1 text-sm text-gray-900">{{ test.attempts }}</p>
                      </div>
                      <div>
                        <h5 class="text-sm font-medium text-gray-500">{{ t('training.details.lastAttempt') }}</h5>
                        <p class="mt-1 text-sm text-gray-900">{{ formatDate(test.lastAttemptDate) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Información de compra (solo para tests bloqueados) -->
                <div v-if="test.status === 'locked'" class="mt-6 border-t border-gray-200 pt-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">{{ t('training.details.price') }}</h4>
                      <p class="mt-1 text-2xl font-bold text-gray-900">{{ test.price }}€</p>
                    </div>
                    <a :href="test.purchaseUrl" target="_blank" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      {{ t('training.details.purchase') }}
                    </a>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="$emit('close')"
                >
                  {{ t('common.close') }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const props = defineProps({
  test: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 