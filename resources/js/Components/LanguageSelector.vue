<template>
  <div class="relative">
    <button @click="isOpen = !isOpen"
            class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
      <component :is="currentLanguageIcon" class="w-5 h-5" />
      <span class="font-medium">{{ currentLanguage.name }}</span>
      <ChevronDownIcon class="w-4 h-4" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Menú desplegable -->
    <div v-if="isOpen"
         class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
      <div class="py-1">
        <button v-for="language in languages" 
                :key="language.code"
                @click="selectLanguage(language)"
                class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <component :is="language.icon" class="w-5 h-5" />
          {{ language.name }}
          <CheckIcon v-if="language.code === locale" 
                    class="w-4 h-4 text-blue-600 ml-auto" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/outline'
import SpainIcon from './Icons/SpainIcon.vue'
import UKIcon from './Icons/UKIcon.vue'
import { useTranslation } from '@/composables/useTranslation'

const { setLocale, locale } = useTranslation()

const isOpen = ref(false)

const languages = [
  {
    code: 'en',
    name: 'English',
    icon: UKIcon
  },
  {
    code: 'es',
    name: 'Español',
    icon: SpainIcon
  }
]

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === locale.value)
})

const currentLanguageIcon = computed(() => {
  return currentLanguage.value.icon
})

const selectLanguage = (language) => {
  setLocale(language.code)
  isOpen.value = false
}

// Cerrar el menú cuando se hace clic fuera
const closeOnClickOutside = (e) => {
  if (isOpen.value && !e.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script> 