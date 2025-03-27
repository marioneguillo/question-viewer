<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">{{ t('dashboard.productRegistration.title') }}</h2>
      </div>
    </div>

    <!-- Formulario de registro -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <input
          type="text"
          id="code"
          v-model="form.code"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          :placeholder="t('dashboard.productRegistration.codePlaceholder')"
        />
      </div>

      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            v-model="form.acceptedTerms"
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="terms" class="font-medium text-gray-700">
            {{ t('dashboard.productRegistration.acceptTerms') }}
          </label>
          <button
            type="button"
            @click="showTermsModal = true"
            class="text-blue-600 hover:text-blue-500 ml-1"
          >
            {{ t('dashboard.productRegistration.readTerms') }}
          </button>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="!form.acceptedTerms || !form.code"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ t('dashboard.productRegistration.register') }}
        </button>
      </div>
    </form>

    <!-- Modal de términos y condiciones -->
    <TransitionRoot appear :show="showTermsModal" as="template">
      <Dialog as="div" @close="showTermsModal = false" class="relative z-10">
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ t('dashboard.productRegistration.termsTitle') }}
                </DialogTitle>
                <div class="mt-4">
                  <div class="prose prose-sm text-gray-500">
                    {{ t('dashboard.productRegistration.termsContent') }}
                  </div>
                </div>
                <div class="mt-6 flex justify-end">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="showTermsModal = false"
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

const { t } = useTranslation()
const showTermsModal = ref(false)

const form = ref({
  code: '',
  acceptedTerms: false
})

const handleSubmit = () => {
  // Aquí iría la lógica para registrar el código
  console.log('Form submitted:', form.value)
  form.value = { code: '', acceptedTerms: false }
}
</script> 