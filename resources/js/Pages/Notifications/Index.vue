<template>
  <AppLayout>
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div class="p-6 bg-white border-b border-gray-200">
            <h1 class="text-2xl font-semibold text-gray-900">
              {{ $t('notifications.title') }}
            </h1>

            <!-- Filtros -->
            <div class="mt-4 flex space-x-2">
              <button
                v-for="filter in filters"
                :key="filter.value"
                @click="currentFilter = filter.value"
                :class="[
                  'rounded-full px-3 py-1 text-sm font-medium',
                  currentFilter === filter.value
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ filter.label }}
                <span
                  v-if="filter.count > 0"
                  class="ml-1 rounded-full bg-gray-200 px-2 text-xs"
                >
                  {{ filter.count }}
                </span>
              </button>
            </div>

            <!-- Lista de notificaciones -->
            <div class="mt-6 space-y-4">
              <div v-if="filteredNotifications.length === 0" class="text-center py-4 text-gray-500">
                {{ $t('notifications.noNotifications') }}
              </div>
              <div v-else>
                <div
                  v-for="notification in filteredNotifications"
                  :key="notification.id"
                  :class="[
                    'rounded-lg p-4 transition-colors',
                    notification.read
                      ? 'bg-white'
                      : 'bg-blue-50'
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <component
                          :is="getNotificationIcon(notification.type)"
                          class="h-5 w-5 mr-2"
                          :class="getNotificationIconColor(notification.type)"
                        />
                        <span class="font-medium text-gray-900">
                          {{ notification.title }}
                        </span>
                      </div>
                      <p class="mt-1 text-sm text-gray-600">
                        {{ notification.message }}
                      </p>
                      <div class="mt-2 flex items-center text-xs text-gray-500">
                        <ClockIcon class="h-4 w-4 mr-1" />
                        {{ formatDate(notification.date) }}
                      </div>
                    </div>
                    <div class="ml-4 flex items-center space-x-2">
                      <button
                        v-if="!notification.read"
                        @click="markAsRead(notification.id)"
                        class="text-blue-600 hover:text-blue-800"
                      >
                        <CheckIcon class="h-5 w-5" />
                      </button>
                      <button
                        @click="deleteNotification(notification.id)"
                        class="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
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
import { BellIcon, CheckIcon, TrashIcon, ClockIcon, DocumentTextIcon, TrophyIcon, CogIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/Layouts/AppLayout.vue'

const { t } = useI18n()

const currentFilter = ref('all')

// Datos de ejemplo - En producción, esto vendría de una API
const notifications = ref([
  {
    id: 1,
    type: 'test',
    title: t('notifications.newTestAvailable'),
    message: t('notifications.newTestMessage', { test: 'AZ-900' }),
    date: new Date('2024-03-15T10:30:00'),
    read: false
  },
  {
    id: 2,
    type: 'achievement',
    title: t('notifications.achievementUnlocked'),
    message: t('notifications.achievementMessage', { achievement: 'First Test Completed' }),
    date: new Date('2024-03-14T15:45:00'),
    read: true
  },
  {
    id: 3,
    type: 'reminder',
    title: t('notifications.testReminder'),
    message: t('notifications.testReminderMessage', { test: 'AZ-204', date: '2024-03-20' }),
    date: new Date('2024-03-14T09:15:00'),
    read: false
  },
  {
    id: 4,
    type: 'system',
    title: t('notifications.systemUpdate'),
    message: t('notifications.systemUpdateMessage'),
    date: new Date('2024-03-13T14:20:00'),
    read: true
  }
])

const getNotificationCountByType = (type) => {
  return notifications.value.filter(n => n.type === type).length
}

const filters = computed(() => [
  { label: t('notifications.all'), value: 'all', count: notifications.value.length },
  { label: t('notifications.unread'), value: 'unread', count: unreadCount.value },
  { label: t('notifications.tests'), value: 'test', count: getNotificationCountByType('test') },
  { label: t('notifications.achievements'), value: 'achievement', count: getNotificationCountByType('achievement') }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const filteredNotifications = computed(() => {
  if (currentFilter.value === 'all') return notifications.value
  if (currentFilter.value === 'unread') return notifications.value.filter(n => !n.read)
  return notifications.value.filter(n => n.type === currentFilter.value)
})

const getNotificationIcon = (type) => {
  const icons = {
    test: DocumentTextIcon,
    achievement: TrophyIcon,
    reminder: BellIcon,
    system: CogIcon
  }
  return icons[type] || BellIcon
}

const getNotificationIconColor = (type) => {
  const colors = {
    test: 'text-blue-500',
    achievement: 'text-yellow-500',
    reminder: 'text-green-500',
    system: 'text-gray-500'
  }
  return colors[type] || 'text-gray-500'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) notification.read = true
}

const deleteNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}
</script> 