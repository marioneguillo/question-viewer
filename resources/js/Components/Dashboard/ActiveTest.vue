<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900">{{ t('dashboard.activeTest.title') }}</h2>
      <span class="text-sm text-blue-600">{{ t('dashboard.activeTest.inProgress') }}</span>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-900">{{ t('tests.AZ-900.title') }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ t('tests.AZ-900.description') }}</p>
        </div>
        <div class="text-right">
          <div class="text-sm font-medium text-gray-900">45%</div>
          <div class="text-xs text-gray-500">{{ t('dashboard.activeTest.completed') }}</div>
        </div>
      </div>

      <div class="relative pt-1">
        <div class="flex mb-2 items-center justify-between">
          <div>
            <span class="text-xs font-semibold inline-block text-blue-600">
              {{ t('dashboard.activeTest.progress') }}
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
          <div style="width:45%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
        </div>
      </div>

      <div class="flex items-center justify-between text-sm">
        <div class="text-gray-500">
          {{ t('dashboard.activeTest.timeRemaining') }}: 45 min
        </div>
        <button class="text-blue-600 hover:text-blue-800">
          {{ t('dashboard.activeTest.continue') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()
</script> 