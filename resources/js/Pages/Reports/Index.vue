<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Encabezado -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">{{ t('reports.title') }}</h1>
          <p class="mt-2 text-sm text-gray-600">{{ t('reports.subtitle') }}</p>
        </div>

        <!-- Métricas principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ t('reports.metrics.totalTests') }}</p>
                <p class="mt-1 text-2xl font-semibold text-gray-900">{{ reports.length }}</p>
              </div>
              <div class="p-3 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ t('reports.metrics.avgScore') }}</p>
                <p class="mt-1 text-2xl font-semibold text-gray-900">78.5%</p>
              </div>
              <div class="p-3 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ t('reports.metrics.studyHours') }}</p>
                <p class="mt-1 text-2xl font-semibold text-gray-900">24.5</p>
              </div>
              <div class="p-3 bg-yellow-100 rounded-lg">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ t('badges.title') }}</p>
                <p class="mt-1 text-2xl font-semibold text-gray-900">1</p>
              </div>
              <div class="p-3 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>  

        <!-- Gráficos y análisis -->
         <!---
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-xl border p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('reports.charts.certificationPerformance') }}</h3>
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p class="text-gray-500">Gráfico de rendimiento por certificación</p>
            </div>
            <div class="mt-4 flex justify-end">
              <button class="text-sm text-blue-600 hover:text-blue-800">
                {{ t('reports.charts.viewDetails') }}
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl border p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('reports.charts.weeklyActivity') }}</h3>
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p class="text-gray-500">Gráfico de actividad semanal</p>
            </div>
            <div class="mt-4 flex justify-end">
              <button class="text-sm text-blue-600 hover:text-blue-800">
                {{ t('reports.charts.viewDetails') }}
              </button>
            </div>
          </div>
        </div>
        -->
        <!-- Reportes de Tests -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ t('reports.test.title') }}</h2>
          
          <!-- Buscador -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('reports.test.searchPlaceholder')"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Grid de Tests -->
          <div v-if="!selectedTest" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="test in filteredTests"
              :key="test.id"
              class="bg-white rounded-xl border p-6 hover:border-blue-500 transition-colors duration-200 cursor-pointer flex flex-col"
              @click="selectTest(test)"
            >
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="text-lg font-medium text-gray-900">{{ test.name }}</h4>
                    <span class="mt-2 inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {{ test.category }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ test.lastAttempt.duration }}
                  </div>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': test.lastAttempt.passed,
                      'bg-red-100 text-red-800': !test.lastAttempt.passed
                    }"
                  >
                    {{ test.lastAttempt.score }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Detalles del Test Seleccionado -->
          <div v-else class="bg-white rounded-xl border p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-4">
                <button
                  @click="selectedTest = null"
                  class="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h3 class="text-xl font-medium text-gray-900">{{ selectedTest.name }}</h3>
              </div>
            </div>
            <TestReport :test="selectedTest" />
          </div>

                  <!-- Recomendaciones -->
        <div class="bg-white rounded-xl border p-6 mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('reports.recommendations.title') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-4 bg-blue-50 rounded-lg">
              <div class="flex items-center mb-3">
                <div class="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900">{{ t('reports.recommendations.items.weakAreas.title') }}</h4>
              </div>
              <p class="text-sm text-gray-600">{{ t('reports.recommendations.items.weakAreas.description') }}</p>
              <button class="mt-4 text-sm text-blue-600 hover:text-blue-800">
                {{ t('reports.recommendations.takeAction') }}
              </button>
            </div>

            <div class="p-4 bg-green-50 rounded-lg">
              <div class="flex items-center mb-3">
                <div class="p-2 bg-green-100 rounded-lg mr-3">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900">{{ t('reports.recommendations.items.nextCertification.title') }}</h4>
              </div>
              <p class="text-sm text-gray-600">{{ t('reports.recommendations.items.nextCertification.description') }}</p>
              <button class="mt-4 text-sm text-green-600 hover:text-green-800">
                {{ t('reports.recommendations.takeAction') }}
              </button>
            </div>

            <div class="p-4 bg-purple-50 rounded-lg">
              <div class="flex items-center mb-3">
                <div class="p-2 bg-purple-100 rounded-lg mr-3">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900">{{ t('reports.recommendations.items.studyGroup.title') }}</h4>
              </div>
              <p class="text-sm text-gray-600">{{ t('reports.recommendations.items.studyGroup.description') }}</p>
              <button class="mt-4 text-sm text-purple-600 hover:text-purple-800">
                {{ t('reports.recommendations.takeAction') }}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import TestReport from '@/Components/Reports/TestReport.vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import { testReports } from '@/data/testReports'

const { t } = useTranslation()
const reports = ref(testReports)
const searchQuery = ref('')
const selectedTest = ref(null)

// Filtrar tests
const filteredTests = computed(() => {
  return reports.value.filter(test => 
    test.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectTest = (test) => {
  selectedTest.value = test
}
</script> 