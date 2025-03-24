<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ t('dashboard.statistics.title') }}</h2>

    <div class="grid grid-cols-2 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">12</div>
        <div class="text-sm text-gray-500">{{ t('dashboard.statistics.completedTests') }}</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">85%</div>
        <div class="text-sm text-gray-500">{{ t('dashboard.statistics.averageScore') }}</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-purple-600">3</div>
        <div class="text-sm text-gray-500">{{ t('dashboard.statistics.certifications') }}</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-orange-600">8h</div>
        <div class="text-sm text-gray-500">{{ t('dashboard.statistics.studyTime') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()
</script> 