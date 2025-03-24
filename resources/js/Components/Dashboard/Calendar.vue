<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ t('dashboard.calendar.title') }}</h2>

    <div class="space-y-4">
      <div v-for="event in upcomingEvents" :key="event.id" class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span class="text-sm font-medium text-blue-600">{{ event.day }}</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-900">{{ event.title }}</h3>
          <p class="text-xs text-gray-500">{{ event.time }}</p>
        </div>
        <div class="flex-shrink-0">
          <span :class="getStatusClass(event.status)" class="text-xs font-medium">
            {{ t(`dashboard.calendar.status.${event.status}`) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const upcomingEvents = [
  {
    id: 1,
    day: '15',
    title: t('tests.AZ-900.title'),
    time: '10:00 AM',
    status: 'scheduled'
  },
  {
    id: 2,
    day: '18',
    title: t('tests.SAA-C03.title'),
    time: '2:00 PM',
    status: 'pending'
  },
  {
    id: 3,
    day: '20',
    title: t('tests.SY0-601.title'),
    time: '11:00 AM',
    status: 'completed'
  }
]

const getStatusClass = (status) => {
  const classes = {
    scheduled: 'text-blue-600 bg-blue-50 px-2 py-1 rounded-full',
    pending: 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full',
    completed: 'text-green-600 bg-green-50 px-2 py-1 rounded-full'
  }
  return classes[status]
}
</script> 