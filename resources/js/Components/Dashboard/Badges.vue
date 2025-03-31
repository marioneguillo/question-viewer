<template>
      <!-- Métricas principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ t('badges.totalBadges') }}</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900">{{ totalBadges }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <TrophyIcon class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ t('dashboard.badges.progress') }}</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900">{{ Math.round((badgesEarned / totalBadges) * 100) }}%</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-green-600 transition-all duration-500"
                   :style="{ width: `${(badgesEarned / totalBadges) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid de Badges -->
      <div class="bg-white rounded-xl border p-6">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="badge in badges" :key="badge.id"
               class="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors group">
            <div class="relative">
              <!-- Imagen del Badge -->
              <div class="aspect-square rounded-lg overflow-hidden mb-3 bg-white shadow-sm">
                <img :src="badge.image" 
                     :alt="badge.name"
                     class="w-full h-full object-contain p-2"
                     :class="{ 'opacity-50': !badge.earned }" />
              </div>
              
              <!-- Estado del Badge -->
              <div v-if="badge.earned" 
                   class="absolute top-2 right-2 p-1.5 bg-green-500 rounded-full">
                <CheckIcon class="w-4 h-4 text-white" />
              </div>
            </div>

            <!-- Información del Badge -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-1">{{ badge.name }}</h4>
              <p class="text-xs text-gray-500 mb-2">{{ badge.description }}</p>
              
              <!-- Progreso del Badge -->
              <div v-if="!badge.earned" class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-500">{{ t('dashboard.badges.progress') }}</span>
                  <span class="text-gray-900">{{ badge.progress }}/{{ badge.required }}</span>
                </div>
                <div class="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-green-600 transition-all duration-500"
                       :style="{ width: `${(badge.progress / badge.required) * 100}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import { TrophyIcon, CheckIcon } from '@heroicons/vue/24/outline'

const { t } = useTranslation()

const props = defineProps({
  badges: {
    type: Array,
    required: true,
    default: () => []
  }
})

const badgesEarned = computed(() => props.badges?.filter(badge => badge.earned).length ?? 0)
const totalBadges = computed(() => props.badges?.length ?? 0)
</script> 