<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900">{{ t('dashboard.popularTests.title') }}</h2>
      <a href="#" class="text-sm text-blue-600 hover:text-blue-800">{{ t('dashboard.popularTests.viewMeasureUp') }}</a>
    </div>

    <div class="space-y-4">
      <div v-for="test in popularTests" :key="test.id" class="border rounded-lg p-4 hover:bg-gray-50">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-sm font-medium text-gray-900">{{ test.title }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ test.description }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {{ test.rating }}
          </div>
          <div>{{ t('dashboard.popularTests.students', { count: test.students }) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const popularTests = [
  {
    id: 1,
    title: t('tests.AZ-900.title'),
    description: t('tests.AZ-900.description'),
    rating: '4.8',
    students: 1250
  },
  {
    id: 2,
    title: t('tests.SAA-C03.title'),
    description: t('tests.SAA-C03.description'),
    rating: '4.9',
    students: 980
  },
  {
    id: 3,
    title: t('tests.SY0-601.title'),
    description: t('tests.SY0-601.description'),
    rating: '4.7',
    students: 850
  }
]
</script> 