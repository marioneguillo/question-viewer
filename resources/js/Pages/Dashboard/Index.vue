<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Encabezado -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('dashboard.welcome', { name: 'Mario' }) }}</h1>
        <p class="mt-2 text-sm text-gray-600">{{ t('dashboard.subtitle') }}</p>
      </div>

      <!-- Grid Principal -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Test Activo -->
        <div class="col-span-1">
          <ActiveTest />
        </div>

        <!-- Estadísticas -->
        <div class="col-span-1">
          <Statistics />
        </div>

        <!-- Tests Populares -->
        <div class="col-span-1">
          <PopularTests />
        </div>

        <!-- Calendario -->
        <div class="col-span-1 md:col-span-2 lg:col-span-3">
          <Calendar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTranslation } from '@/composables/useTranslation'
import { ref } from 'vue'
import ActiveTest from '@/Components/Dashboard/ActiveTest.vue'
import PopularTests from '@/Components/Dashboard/PopularTests.vue'
import Statistics from '@/Components/Dashboard/Statistics.vue'
import Calendar from '@/Components/Dashboard/Calendar.vue'

const { t } = useTranslation()
</script> 