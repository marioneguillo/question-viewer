<template>
  <div class="flex h-full flex-1 flex-col bg-white">
    <div class="flex h-16 shrink-0 items-center px-6 justify-between">
      <img v-if="!isCollapsed" class="w-auto" src="/images/measureup-logo.webp" alt="Logo" />
      <button 
        v-if="!isMobile"
        @click="$emit('toggle-collapse')"
        class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronLeftIcon 
          class="w-5 h-5 text-gray-500 transition-transform duration-300"
          :class="{ 'rotate-180': isCollapsed }"
        />
      </button>
    </div>
    <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <a
                  :href="item.href"
                  :class="[
                    item.current 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  ]"
                >
                  <component :is="item.icon" 
                    :class="[
                      item.current 
                        ? 'text-blue-600' 
                        : 'text-gray-400 group-hover:text-blue-600',
                      'h-6 w-6 shrink-0'
                    ]"
                    aria-hidden="true" />
                  <span v-show="!isCollapsed">{{ item.name }}</span>
                </a>
              </li>
            </ul>
          </li>
          <li class="mt-auto">
            <a
              href="#"
              class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <Cog6ToothIcon
                class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                aria-hidden="true"
              />
              <span v-show="!isCollapsed">Configuration</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import {
  HomeIcon,
  AcademicCapIcon,
  DocumentIcon,
  ShoppingBagIcon,
  NewspaperIcon,
  UserIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  ChevronLeftIcon
} from '@heroicons/vue/24/outline'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const props = defineProps({
  navigation: {
    type: Array,
    required: true
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-collapse'])

const iconMap = {
  HomeIcon,
  AcademicCapIcon,
  DocumentIcon,
  ShoppingBagIcon,
  NewspaperIcon,
  UserIcon,
  EnvelopeIcon,
  DocumentChartBarIcon
}

const getIcon = (iconName) => {
  return iconMap[iconName]
}
</script> 