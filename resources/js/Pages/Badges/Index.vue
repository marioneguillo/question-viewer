<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Encabezado -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">{{ t('badges.title') }}</h1>
          <p class="mt-2 text-sm text-gray-600">{{ t('badges.subtitle') }}</p>
        </div>
        <Badges :badges="badges" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import Badges from '@/Components/Dashboard/Badges.vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

// Definir las props para recibir los badges del controlador
defineProps({
  badges: {
    type: Array,
    required: true
  }
})
</script> 