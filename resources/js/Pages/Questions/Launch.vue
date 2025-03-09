<template>
  <AppLayout>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
          Vista Previa de la Pregunta
        </h2>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500">
            Pregunta {{ currentQuestionIndex + 1 }} de {{ totalQuestions }}
          </span>
          <button
            @click="goBack"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver
          </button>
        </div>
      </div>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <!-- Menú de configuración superior -->
        <div class="bg-white shadow-sm rounded-lg mb-6">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6" aria-label="Configuración">
              <button
                class="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
                aria-current="page"
              >
                Vista Previa
              </button>
              <button
                class="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Configuración
              </button>
              <button
                class="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Estadísticas
              </button>
            </nav>
          </div>
          <div class="px-6 py-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {{ question.type === 'single_choice' ? 'Opción Única' : question.type === 'multiple_choice' ? 'Opción Múltiple' : 'Arrastrar y Soltar' }}
                </span>
              </div>
              <div class="flex items-center space-x-4">
                <button
                  v-if="!showAnswers"
                  @click="showAnswers = true"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Mostrar Respuestas
                </button>
                <button
                  v-else
                  @click="showAnswers = false"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  Ocultar Respuestas
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido principal -->
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
          <div class="p-6">
            <!-- Componente específico según el tipo de pregunta -->
            <component
              :is="question.type === 'single_choice' ? 'SingleChoiceQuestion' : 
                   question.type === 'multiple_choice' ? 'MultipleChoiceQuestion' : 'DragDropQuestion'"
              :question="question"
              :show-answers="showAnswers"
              @answer-selected="selectedOptions = $event"
            />
          </div>
        </div>

        <!-- Menú inferior con navegación -->
        <div class="bg-white shadow-sm rounded-lg mt-6">
          <div class="px-6 py-4">
            <div class="flex items-center justify-center">
              <div class="flex items-center space-x-6">
                <button
                  @click="navigateToQuestion('prev')"
                  class="group inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!hasPrevQuestion"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Pregunta Anterior
                </button>
                <span class="text-sm text-gray-500">
                  Pregunta {{ currentQuestionIndex + 1 }} de {{ totalQuestions }}
                </span>
                <button
                  @click="navigateToQuestion('next')"
                  class="group inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!hasNextQuestion"
                >
                  Siguiente Pregunta
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '@/Layouts/AppLayout.vue'
import { router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import SingleChoiceQuestion from './Components/SingleChoiceQuestion.vue'
import MultipleChoiceQuestion from './Components/MultipleChoiceQuestion.vue'
import DragDropQuestion from './Components/DragDropQuestion.vue'

export default {
  components: {
    AppLayout,
    SingleChoiceQuestion,
    MultipleChoiceQuestion,
    DragDropQuestion
  },
  props: {
    question: {
      type: Object,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    currentQuestionIndex: {
      type: Number,
      required: true
    },
    navigation: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const showAnswers = ref(false)
    const selectedOptions = ref([])

    const toggleAnswers = () => {
      showAnswers.value = !showAnswers.value
    }

    const goBack = () => {
      router.visit('/dashboard')
    }

    const navigateToQuestion = (direction) => {
      const targetId = direction === 'next' ? 
        props.navigation.nextQuestionId : 
        props.navigation.previousQuestionId;
        
      if (targetId) {
        router.visit(`/questions/${targetId}/launch`)
      }
    }

    return {
      router,
      showAnswers,
      selectedOptions,
      toggleAnswers,
      goBack,
      navigateToQuestion,
      hasNextQuestion: computed(() => props.navigation.nextQuestionId !== null),
      hasPrevQuestion: computed(() => props.navigation.previousQuestionId !== null)
    }
  }
}
</script> 