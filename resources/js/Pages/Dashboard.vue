<template>
  <AppLayout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Panel de Control
      </h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <!-- Botones de creación -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            v-for="type in questionTypes"
            :key="type.type"
            @click="router.visit(`/questions/create?type=${type.type}`)"
            class="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <svg 
              :class="['h-12 w-12 mb-4', type.iconColor]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="type.iconPath" 
              />
            </svg>
            <span class="text-lg font-medium text-gray-900">{{ type.name }}</span>
            <p class="mt-2 text-sm text-gray-500 text-center">
              {{ type.description }}
            </p>
          </button>
        </div>

        <!-- Lista de preguntas -->
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Preguntas Disponibles</h3>
              <Link
                href="/questions/start-all"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Iniciar Todas las Preguntas
              </Link>
            </div>
            <div class="space-y-4">
              <div v-for="question in availableQuestions" :key="question.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex-1 min-w-0 mr-4">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ question.stem }}
                  </p>
                  <p class="mt-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                      'bg-blue-100 text-blue-800': question.type === 'single_choice',
                      'bg-green-100 text-green-800': question.type === 'multiple_choice',
                      'bg-purple-100 text-purple-800': question.type === 'drag_drop',
                      'bg-yellow-100 text-yellow-800': question.type === 'reorder_list'
                    }">
                      {{ question.type_label }}
                    </span>
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <Link
                    :href="`/questions/${question.id}/view`"
                    class="inline-flex items-center px-3 py-1 border border-blue-300 text-sm leading-5 font-medium rounded-md text-blue-700 bg-white hover:text-blue-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-blue-800 active:bg-blue-50 transition ease-in-out duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver
                  </Link>
                  <Link
                    :href="`/questions/${question.id}/edit`"
                    class="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Editar
                  </Link>
                  <button
                    @click="confirmDelete(question)"
                    class="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:text-red-500 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:text-red-800 active:bg-red-50 transition ease-in-out duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
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
import AppLayout from '@/Layouts/AppLayout.vue'
import { Link } from '@inertiajs/vue3'
import { router } from '@inertiajs/vue3'

defineProps({
  availableQuestions: {
    type: Array,
    required: true
  }
})

const confirmDelete = (question) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer.')) {
    router.delete(`/questions/${question.id}`)
  }
}

const questionTypes = [
  {
    type: 'single_choice',
    name: 'Opción Única',
    description: 'Pregunta con una sola respuesta correcta',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    iconColor: 'text-blue-500'
  },
  {
    type: 'multiple_choice',
    name: 'Opción Múltiple',
    description: 'Pregunta con múltiples respuestas correctas',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2',
    iconColor: 'text-green-500'
  },
  {
    type: 'drag_drop',
    name: 'Arrastrar y Soltar',
    description: 'Pregunta donde hay que arrastrar elementos a espacios específicos',
    iconPath: 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4',
    iconColor: 'text-purple-500'
  },
  {
    type: 'reorder_list',
    name: 'Ordenar Lista',
    description: 'Pregunta donde hay que ordenar una lista de elementos',
    iconPath: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    iconColor: 'text-yellow-500'
  }
]
</script> 