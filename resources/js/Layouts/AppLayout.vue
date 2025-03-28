<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Sidebar para móvil -->
        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
                <TransitionChild
                    as="template"
                    enter="transition-opacity ease-linear duration-300"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-gray-900/80" />
                </TransitionChild>

                <div class="fixed inset-0 flex">
                    <TransitionChild
                        as="template"
                        enter="transition ease-in-out duration-300 transform"
                        enter-from="-translate-x-full"
                        enter-to="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leave-from="translate-x-0"
                        leave-to="-translate-x-full"
                    >
                        <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                            <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                    <span class="sr-only">Cerrar sidebar</span>
                                    <XMarkIcon class="h-6 w-6 text-gray-900" aria-hidden="true" />
                                </button>
                            </div>
                            <Sidebar :navigation="navigation" :is-mobile="true" />
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Sidebar para desktop -->
        <div 
          class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300"
          :class="isSidebarCollapsed ? 'lg:w-16' : 'lg:w-72'"
        >
            <Sidebar 
              :navigation="navigation" 
              :is-mobile="false"
              :is-collapsed="isSidebarCollapsed"
              @toggle-collapse="toggleCollapse"
            />
        </div>

        <!-- Contenido principal -->
        <div 
          class="flex flex-col min-h-screen transition-all duration-300"
          :class="{ 'lg:pl-72': !isSidebarCollapsed, 'lg:pl-16': isSidebarCollapsed }"
        >
            <!-- Header superior -->
            <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
                    <span class="sr-only">Abrir sidebar</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>

                <!-- Separador -->
                <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

                <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <!-- Barra de búsqueda -->
                    <form class="relative flex flex-1" action="#" method="GET">
                        <label for="search-field" class="sr-only">Buscar</label>
                        <MagnifyingGlassIcon
                            class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                            aria-hidden="true"
                        />
                        <input
                            id="search-field"
                            class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                            placeholder="Buscar..."
                            type="search"
                            name="search"
                        />
                    </form>

                    <!-- Acciones del header -->
                    <div class="flex items-center gap-x-4 lg:gap-x-6">
                        <!-- Notificaciones y selector de idioma -->
                        <div class="flex items-center gap-2">
                            <!-- Selector de idioma -->
                            <LanguageSelector />
                            <!-- Notificaciones -->
                            <NotificationCenter />

                            <!-- Menú de usuario -->
                            <Menu as="div" class="relative ml-3">
                                <div>
                                    <MenuButton class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                        <span class="sr-only">Abrir menú de usuario</span>
                                        <UserCircleIcon class="h-8 w-8 text-gray-400" />
                                    </MenuButton>
                                </div>
                                <transition
                                    enter-active-class="transition ease-out duration-100"
                                    enter-from-class="transform opacity-0 scale-95"
                                    enter-to-class="transform opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="transform opacity-100 scale-100"
                                    leave-to-class="transform opacity-0 scale-95"
                                >
                                    <MenuItems
                                        class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                                    >
                                        <MenuItem v-slot="{ active }">
                                            <a
                                                href="#"
                                                :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']"
                                            >
                                                {{ t('common.viewProfile') }}
                                            </a>
                                        </MenuItem>
                                        <MenuItem v-slot="{ active }">
                                            <a
                                                href="#"
                                                :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']"
                                            >
                                                {{ t('common.settings') }}
                                            </a>
                                        </MenuItem>
                                        <MenuItem v-slot="{ active }">
                                            <a
                                                href="#"
                                                :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']"
                                            >
                                                {{ t('common.signOut') }}
                                            </a>
                                        </MenuItem>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contenido de la página -->
            <main class="py-10">
                <div class="px-4 sm:px-6 lg:px-8">
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import {
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    HomeIcon,
    AcademicCapIcon,
    DocumentChartBarIcon,
    ClipboardDocumentCheckIcon,
    UserCircleIcon,
    TrophyIcon
} from '@heroicons/vue/24/outline'
import Sidebar from '@/Components/Sidebar.vue'
import { usePage } from '@inertiajs/vue3'
import LanguageSelector from '@/Components/LanguageSelector.vue'
import { useTranslation } from '@/composables/useTranslation'
import NotificationCenter from '@/Components/Notifications/NotificationCenter.vue'
import { useSidebar } from '@/composables/useSidebar'

// Estado para controlar la apertura/cierre del sidebar en móvil
const sidebarOpen = ref(false)
const page = usePage()

// Inicializar useTranslation y useSidebar
const { t } = useTranslation()
const { isSidebarCollapsed, toggleSidebar } = useSidebar()

// Configuración de la navegación
const navigation = computed(() => [
    { 
        name: t('navigation.dashboard'), 
        href: '/dashboard', 
        icon: HomeIcon, 
        current: page.url === '/dashboard' 
    },
    { 
        name: t('navigation.trainingLibrary'), 
        href: '/training-library', 
        icon: AcademicCapIcon, 
        current: page.url === '/training-library' 
    },
    { 
        name: t('navigation.trainingLibrary'), 
        href: '/training-library2', 
        icon: AcademicCapIcon, 
        current: page.url === '/training-library2' 
    },
    { 
        name: t('navigation.testing'), 
        href: '/testing', 
        icon: ClipboardDocumentCheckIcon,
        current: page.url === '/testing' 
    },
    { 
        name: t('navigation.reports'), 
        href: '/reports', 
        icon: DocumentChartBarIcon, 
        current: page.url === '/reports' 
    },
    {
        name: t('navigation.badges'),
        href: '/badges',
        icon: TrophyIcon,
        current: page.url === '/badges'
    }
])

// Función para alternar el estado colapsado del sidebar
const toggleCollapse = () => {
    toggleSidebar()
}
</script> 