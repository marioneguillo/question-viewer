<template>
  <div class="relative">
    <!-- Botón de notificaciones -->
    <button
      @click="toggleNotifications"
      class="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
    >
      <span class="sr-only">{{ $t('notifications.view') }}</span>
      <BellIcon class="h-6 w-6" />
      <!-- Badge de notificaciones no leídas -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Panel de notificaciones -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div class="p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ $t('notifications.title') }}
          </h3>
          <div class="flex space-x-2">
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              {{ $t('notifications.markAllRead') }}
            </button>
            <button
              @click="clearAll"
              class="text-sm text-red-600 hover:text-red-800"
            >
              {{ $t('notifications.clearAll') }}
            </button>
          </div>
        </div>

        <!-- Lista de notificaciones -->
        <div class="mt-4 max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="text-center py-4 text-gray-500">
            {{ $t('notifications.noNotifications') }}
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="notification in notifications.slice(0, 5)"
              :key="notification.id"
              :class="[
                'rounded-lg p-3 transition-colors',
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

        <!-- Acciones -->
        <div class="mt-4 border-t pt-4">
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ $t('notifications.showing', { count: notifications.length }) }}</span>
            <a
              v-if="notifications.length > 0"
              href="/notifications"
              class="text-blue-600 hover:text-blue-800"
            >
              {{ $t('notifications.viewAll') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BellIcon, CheckIcon, TrashIcon, ClockIcon, DocumentTextIcon, TrophyIcon, CogIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import { Link } from '@inertiajs/vue3'

const { t } = useI18n()

const isOpen = ref(false)

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

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

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

const toggleNotifications = () => {
  isOpen.value = !isOpen.value
}

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) notification.read = true
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const deleteNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const clearAll = () => {
  notifications.value = []
}

// Cerrar el panel cuando se hace clic fuera
const handleClickOutside = (event) => {
  if (isOpen.value && !event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script> 