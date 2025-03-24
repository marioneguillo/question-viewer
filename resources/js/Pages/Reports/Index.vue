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
            <div class="mt-4 flex items-center text-sm">
              <span class="text-green-600 font-medium">+2</span>
              <span class="text-gray-600 ml-1">{{ t('reports.metrics.vsLastMonth') }}</span>
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
            <div class="mt-4 flex items-center text-sm">
              <span class="text-green-600 font-medium">+5.2%</span>
              <span class="text-gray-600 ml-1">{{ t('reports.metrics.vsLastMonth') }}</span>
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
            <div class="mt-4 flex items-center text-sm">
              <span class="text-green-600 font-medium">+8.3</span>
              <span class="text-gray-600 ml-1">{{ t('reports.metrics.vsLastMonth') }}</span>
            </div>
          </div>

          <div class="bg-white rounded-xl border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ t('reports.metrics.certifications') }}</p>
                <p class="mt-1 text-2xl font-semibold text-gray-900">1</p>
              </div>
              <div class="p-3 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-green-600 font-medium">+1</span>
              <span class="text-gray-600 ml-1">{{ t('reports.metrics.vsLastMonth') }}</span>
            </div>
          </div>
        </div>

        <!-- Gráficos y análisis -->
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

        <!-- Reportes de Tests -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ t('reports.test.title') }}</h2>
          <div class="grid grid-cols-1 gap-6">
            <TestReport v-for="test in reports" :key="test.id" :test="test" />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import TestReport from '@/Components/Reports/TestReport.vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import { testReports } from '@/data/testReports'

const { t } = useTranslation()
const reports = ref(testReports)
</script> 