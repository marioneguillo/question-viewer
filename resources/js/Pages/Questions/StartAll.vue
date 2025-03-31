<template>
  <AppLayout>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
          Pregunta {{ currentIndex + 1 }} de {{ questions.length }}
        </h2>
      </div>
    </template>

    <!-- Menú de Opciones -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Navegación y Progreso -->
          <div class="flex items-center space-x-4">
            <button
              @click="previousQuestion"
              :disabled="currentIndex === 0"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Indicador de Progreso -->
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-1">
                <span class="text-lg font-semibold text-blue-600">{{ currentIndex + 1 }}</span>
                <span class="text-gray-500">/</span>
                <span class="text-gray-600">{{ questions.length }}</span>
              </div>
              <div class="w-32 h-2 bg-gray-200 rounded-full">
                <div class="h-2 bg-blue-600 rounded-full" :style="{ width: progressPercentage + '%' }"></div>
              </div>
            </div>

            <button
              @click="nextQuestion"
              :disabled="currentIndex === questions.length - 1"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Opciones -->
          <div class="flex items-center space-x-4">
            <!-- Mostrar Respuesta y Explicación -->
            <button
              @click="toggleShowSolution"
              class="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm"
              :class="showSolution ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'"
            >
              <svg v-if="!showSolution" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ showSolution ? 'Ocultar Solución' : 'Ver Solución' }}
            </button>

            <!-- Configuración -->
            <button
              @click="showSettings = !showSettings"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
              :class="{ 'bg-gray-100': showSettings }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuración
            </button>

            <!-- Salir -->
            <button
              @click="router.visit('/dashboard')"
              class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de Configuración -->
    <div v-if="showSettings" class="bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <h3 class="text-sm font-medium text-gray-900">Opciones de Visualización</h3>
            <div class="space-y-1">
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="settings.showQuestionNumbers" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <span class="ml-2 text-sm text-gray-600">Mostrar números de pregunta</span>
              </label>
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-sm font-medium text-gray-900">Opciones de Navegación</h3>
            <div class="space-y-1">
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="settings.autoNextQuestion" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <span class="ml-2 text-sm text-gray-600">Avanzar automáticamente al responder</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div class="mx-auto">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div class="p-6">
            <!-- Pregunta Actual -->
            <div v-if="currentQuestion && !showReport" class="space-y-6">
              <!-- Tipo de Pregunta -->
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                  :class="{
                    'bg-blue-100 text-blue-800': currentQuestion.type === 'single_choice',
                    'bg-green-100 text-green-800': currentQuestion.type === 'multiple_choice',
                    'bg-purple-100 text-purple-800': currentQuestion.type === 'drag_drop'
                  }"
                >
                  {{ getTypeLabel(currentQuestion.type) }}
                </span>
                <span class="text-sm text-gray-500">
                  Pregunta {{ currentIndex + 1 }} de {{ questions.length }}
                </span>
              </div>

              <!-- Componente específico según el tipo -->
              <component
                :is="getQuestionComponent(currentQuestion.type)"
                :question="currentQuestion"
                :showAnswers="showSolution"
                :showExplanation="showSolution"
                @answer-selected="handleAnswerSelected"
              />

              <!-- Explicación -->
              <div v-if="showSolution && currentQuestion.explanation" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 class="text-sm font-medium text-blue-800 mb-2">Explicación:</h4>
                <p class="text-blue-900">{{ currentQuestion.explanation }}</p>
              </div>

              <!-- Botón de Finalizar (solo en la última pregunta) -->
              <div v-if="isLastQuestion" class="mt-6 flex justify-center">
                <button
                  @click="finishQuiz"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Finalizar y Ver Resultados
                </button>
              </div>
            </div>

            <!-- Reporte Final -->
            <div v-if="showReport" class="space-y-8">
              <div class="text-center">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Reporte Final</h2>
                <p class="text-gray-600">Has completado todas las preguntas</p>
              </div>

              <!-- Botón de Descargar PDF -->
              <div class="flex justify-center">
                <button
                  @click="generatePDF"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar PDF
                </button>
              </div>

              <!-- Contenido para el PDF -->
              <div id="reportContent" class="bg-white p-8">
                <!-- Título del Reporte -->
                <div class="text-center mb-8">
                  <h2 class="text-2xl font-bold text-gray-900">Reporte de Evaluación</h2>
                  <p class="text-gray-600 mt-2">Resumen de resultados</p>
                </div>

                <!-- Estadísticas -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div class="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div class="text-3xl font-bold text-blue-600 mb-2">{{ getAnsweredQuestionsCount() }}</div>
                    <div class="text-sm text-gray-600">Preguntas Respondidas</div>
                  </div>
                  <div class="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div class="text-3xl font-bold text-green-600 mb-2">{{ getCorrectAnswersCount() }}</div>
                    <div class="text-sm text-gray-600">Respuestas Correctas</div>
                  </div>
                  <div class="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div class="text-3xl font-bold text-purple-600 mb-2">
                      {{ Math.round((getCorrectAnswersCount() / questions.length) * 100) }}%
                    </div>
                    <div class="text-sm text-gray-600">Porcentaje de Acierto</div>
                  </div>
                </div>

                <!-- Lista de Preguntas -->
                <div class="mt-8">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalle de Preguntas</h3>
                  <div class="space-y-3">
                    <div
                      v-for="(question, index) in questions"
                      :key="question.id"
                      class="w-full p-4 rounded-lg border"
                      :class="{
                        'border-green-200 bg-green-50': isQuestionCorrect(index),
                        'border-red-200 bg-red-50': !isQuestionCorrect(index) && userAnswers[index],
                        'border-gray-200': !userAnswers[index]
                      }"
                    >
                      <div class="flex items-center space-x-3">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
                              :class="{
                                'bg-green-100 text-green-800': isQuestionCorrect(index),
                                'bg-red-100 text-red-800': !isQuestionCorrect(index) && userAnswers[index],
                                'bg-gray-100 text-gray-800': !userAnswers[index]
                              }">
                          {{ index + 1 }}
                        </span>
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900">
                            {{ truncateText(question.stem, 100) }}
                          </p>
                          <div class="flex items-center space-x-2 mt-1">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                  :class="{
                                    'bg-blue-100 text-blue-800': question.type === 'single_choice',
                                    'bg-green-100 text-green-800': question.type === 'multiple_choice',
                                    'bg-purple-100 text-purple-800': question.type === 'drag_drop',
                                    'bg-yellow-100 text-yellow-800': question.type === 'reorder_list'
                                  }">
                              {{ getTypeLabel(question.type) }}
                            </span>
                            <span class="text-sm text-gray-500">
                              {{ getQuestionStatus(index) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lista de Preguntas Interactiva (fuera del PDF) -->
              <div class="mt-8">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">Resumen de Preguntas</h3>
                  
                  <!-- Filtros -->
                  <div class="flex space-x-2">
                    <button
                      @click="selectedFilter = 'all'"
                      class="px-3 py-1 rounded-md text-sm font-medium"
                      :class="selectedFilter === 'all' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'"
                    >
                      Todas
                    </button>
                    <button
                      @click="selectedFilter = 'correct'"
                      class="px-3 py-1 rounded-md text-sm font-medium"
                      :class="selectedFilter === 'correct' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'"
                    >
                      Correctas
                    </button>
                    <button
                      @click="selectedFilter = 'incorrect'"
                      class="px-3 py-1 rounded-md text-sm font-medium"
                      :class="selectedFilter === 'incorrect' ? 'bg-red-100 text-red-800' : 'text-gray-600 hover:bg-gray-100'"
                    >
                      Incorrectas
                    </button>
                    <button
                      @click="selectedFilter = 'unanswered'"
                      class="px-3 py-1 rounded-md text-sm font-medium"
                      :class="selectedFilter === 'unanswered' ? 'bg-gray-100 text-gray-800' : 'text-gray-600 hover:bg-gray-100'"
                    >
                      Sin Responder
                    </button>
                  </div>
                </div>
                <div class="space-y-3">
                  <button
                    v-for="(question, index) in filteredQuestions"
                    :key="question.id"
                    @click="showQuestionDetail(getRealQuestionIndex(index))"
                    class="w-full text-left p-4 rounded-lg border transition-colors duration-200 hover:bg-gray-50"
                    :class="{
                      'border-green-200 bg-green-50': isQuestionCorrect(getRealQuestionIndex(index)),
                      'border-red-200 bg-red-50': !isQuestionCorrect(getRealQuestionIndex(index)) && userAnswers[getRealQuestionIndex(index)],
                      'border-gray-200': !userAnswers[getRealQuestionIndex(index)]
                    }"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3 flex-1">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
                              :class="{
                                'bg-green-100 text-green-800': isQuestionCorrect(getRealQuestionIndex(index)),
                                'bg-red-100 text-red-800': !isQuestionCorrect(getRealQuestionIndex(index)) && userAnswers[getRealQuestionIndex(index)],
                                'bg-gray-100 text-gray-800': !userAnswers[getRealQuestionIndex(index)]
                              }">
                          {{ index + 1 }}
                        </span>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">
                            {{ truncateText(question.stem, 100) }}
                          </p>
                          <div class="flex items-center space-x-2 mt-1">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                  :class="{
                                    'bg-blue-100 text-blue-800': question.type === 'single_choice',
                                    'bg-green-100 text-green-800': question.type === 'multiple_choice',
                                    'bg-purple-100 text-purple-800': question.type === 'drag_drop'
                                  }">
                              {{ getTypeLabel(question.type) }}
                            </span>
                            <span class="text-sm text-gray-500">
                              {{ getQuestionStatus(getRealQuestionIndex(index)) }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Modal de Detalle de Pregunta -->
              <div v-if="selectedQuestionIndex !== null" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                      <h3 class="text-lg font-semibold">Pregunta {{ selectedQuestionIndex + 1 }}</h3>
                      <button @click="selectedQuestionIndex = null" class="text-gray-400 hover:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div class="space-y-6">
                      <!-- Contenido de la pregunta -->
                      <div class="prose max-w-none">
                        <div v-html="questions[selectedQuestionIndex].stem"></div>
                      </div>

                      <!-- Respuestas -->
                      <div class="mt-4">
                        <component
                          :is="getQuestionComponent(questions[selectedQuestionIndex].type)"
                          :question="{
                            ...questions[selectedQuestionIndex],
                            stem: '' // Enviamos el stem vacío para evitar duplicación
                          }"
                          :showAnswers="true"
                          :selectedAnswer="userAnswers[selectedQuestionIndex]"
                          disabled
                        />
                      </div>

                      <!-- Explicación -->
                      <div v-if="questions[selectedQuestionIndex].explanation" class="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 class="text-sm font-medium text-blue-800 mb-2">Explicación:</h4>
                        <div class="text-blue-900" v-html="questions[selectedQuestionIndex].explanation"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botón para volver al dashboard -->
              <div class="flex justify-center mt-8">
                <button
                  @click="router.visit('/dashboard')"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver al Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import SingleChoiceQuestion from '@/Pages/Questions/Components/SingleChoiceQuestion.vue'
import MultipleChoiceQuestion from '@/Pages/Questions/Components/MultipleChoiceQuestion.vue'
import DragDropQuestion from '@/Pages/Questions/Components/DragDropQuestion.vue'
import ReorderListQuestion from '@/Pages/Questions/Components/ReorderListQuestion.vue'
import { router } from '@inertiajs/vue3'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const props = defineProps({
  questions: {
    type: Array,
    required: true
  }
})

const currentIndex = ref(0)
const showSolution = ref(false)
const showSettings = ref(false)
const showReport = ref(false)
const selectedFilter = ref('all')
const userAnswers = ref(new Array(props.questions.length).fill(null))
const settings = ref({
  showQuestionNumbers: true,
  autoNextQuestion: false
})

const currentQuestion = computed(() => props.questions[currentIndex.value])
const progressPercentage = computed(() => ((currentIndex.value + 1) / props.questions.length) * 100)
const isLastQuestion = computed(() => currentIndex.value === props.questions.length - 1)

const handleAnswerSelected = (selectedAnswer) => {
  // Guardar la respuesta del usuario
  userAnswers.value[currentIndex.value] = selectedAnswer

  if (settings.value.autoNextQuestion) {
    // Esperar 500ms y luego avanzar a la siguiente pregunta
    setTimeout(() => {
      if (currentIndex.value < props.questions.length - 1) {
        nextQuestion()
      }
    }, 500)
  }
}

const nextQuestion = () => {
  if (currentIndex.value < props.questions.length - 1) {
    currentIndex.value++
    showSolution.value = false
  }
}

const previousQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showSolution.value = false
  }
}

const toggleShowSolution = () => {
  showSolution.value = !showSolution.value
}

const finishQuiz = () => {
  showReport.value = true
}

const getCorrectAnswersCount = () => {
  return userAnswers.value.reduce((count, answer, index) => {
    if (!answer) return count
    
    const question = props.questions[index]
    if (question.type === 'single_choice' || question.type === 'multiple_choice') {
      const correctAnswers = question.options.filter(opt => opt.is_correct).map(opt => opt.id)
      const isCorrect = Array.isArray(answer) 
        ? answer.length === correctAnswers.length && answer.every(id => correctAnswers.includes(id))
        : correctAnswers.includes(answer)
      return count + (isCorrect ? 1 : 0)
    } else if (question.type === 'drag_drop') {
      const isCorrect = answer.every((id, slotIndex) => {
        const correctOptionIndex = question.slots[slotIndex] - 1
        return question.options[correctOptionIndex].id === id
      })
      return count + (isCorrect ? 1 : 0)
    } else if (question.type === 'reorder_list') {
      if (!Array.isArray(answer)) return count
      const isCorrect = answer.every((id, currentIndex) => {
        const option = question.options.find(opt => opt.id === id)
        return option && option.correct_order === currentIndex + 1
      })
      return count + (isCorrect ? 1 : 0)
    }
    return count
  }, 0)
}

const getAnsweredQuestionsCount = () => {
  return userAnswers.value.filter(answer => answer !== null).length
}

const getQuestionComponent = (type) => {
  switch (type) {
    case 'single_choice':
      return SingleChoiceQuestion
    case 'multiple_choice':
      return MultipleChoiceQuestion
    case 'drag_drop':
      return DragDropQuestion
    case 'reorder_list':
      return ReorderListQuestion
    default:
      return null
  }
}

const getTypeLabel = (type) => {
  switch (type) {
    case 'single_choice':
      return 'Opción Única'
    case 'multiple_choice':
      return 'Opción Múltiple'
    case 'drag_drop':
      return 'Arrastrar y Soltar'
    case 'reorder_list':
      return 'Ordenar Lista'
    default:
      return 'Desconocido'
  }
}

const isQuestionCorrect = (index) => {
  if (!userAnswers.value[index]) return false
  
  const question = props.questions[index]
  if (question.type === 'single_choice' || question.type === 'multiple_choice') {
    const correctAnswers = question.options.filter(opt => opt.is_correct).map(opt => opt.id)
    const isCorrect = Array.isArray(userAnswers.value[index]) 
      ? userAnswers.value[index].length === correctAnswers.length && userAnswers.value[index].every(id => correctAnswers.includes(id))
      : correctAnswers.includes(userAnswers.value[index])
    return isCorrect
  } else if (question.type === 'drag_drop') {
    const isCorrect = userAnswers.value[index].every((id, slotIndex) => {
      const correctOptionIndex = question.slots[slotIndex] - 1
      return question.options[correctOptionIndex].id === id
    })
    return isCorrect
  } else if (question.type === 'reorder_list') {
    if (!Array.isArray(userAnswers.value[index])) return false
    return userAnswers.value[index].every((id, currentIndex) => {
      const option = question.options.find(opt => opt.id === id)
      return option && option.correct_order === currentIndex + 1
    })
  }
  return false
}

const getQuestionStatus = (index) => {
  if (!userAnswers.value[index]) return 'Sin Responder'
  
  const question = props.questions[index]
  if (question.type === 'single_choice' || question.type === 'multiple_choice') {
    const correctAnswers = question.options.filter(opt => opt.is_correct).map(opt => opt.id)
    const isCorrect = Array.isArray(userAnswers.value[index]) 
      ? userAnswers.value[index].length === correctAnswers.length && userAnswers.value[index].every(id => correctAnswers.includes(id))
      : correctAnswers.includes(userAnswers.value[index])
    return isCorrect ? 'Correcto' : 'Incorrecto'
  } else if (question.type === 'drag_drop') {
    const isCorrect = userAnswers.value[index].every((id, slotIndex) => {
      const correctOptionIndex = question.slots[slotIndex] - 1
      return question.options[correctOptionIndex].id === id
    })
    return isCorrect ? 'Correcto' : 'Incorrecto'
  } else if (question.type === 'reorder_list') {
    if (!Array.isArray(userAnswers.value[index])) return 'Desconocido'
    const isCorrect = userAnswers.value[index].every((id, currentIndex) => {
      const option = question.options.find(opt => opt.id === id)
      return option && option.correct_order === currentIndex + 1
    })
    return isCorrect ? 'Correcto' : 'Incorrecto'
  }
  return 'Desconocido'
}

const selectedQuestionIndex = ref(null)

const showQuestionDetail = (index) => {
  selectedQuestionIndex.value = index
}

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
}

// Computed para filtrar las preguntas según el estado
const filteredQuestions = computed(() => {
  return props.questions.filter((question, index) => {
    if (selectedFilter.value === 'all') return true
    if (selectedFilter.value === 'correct') return isQuestionCorrect(index)
    if (selectedFilter.value === 'incorrect') return !isQuestionCorrect(index) && userAnswers.value[index] !== null
    if (selectedFilter.value === 'unanswered') return userAnswers.value[index] === null
    return true
  })
})

// Función para obtener el índice real de la pregunta
const getRealQuestionIndex = (filteredIndex) => {
  const question = filteredQuestions.value[filteredIndex]
  return props.questions.findIndex(q => q.id === question.id)
}

const generatePDF = async () => {
  try {
    // Capturar el contenido del reporte
    const reportContent = document.getElementById('reportContent')
    const canvas = await html2canvas(reportContent, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    // Crear nuevo documento PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Calcular dimensiones
    const imgWidth = 210 // A4 width
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const pageHeight = 297 // A4 height

    // Añadir la imagen al PDF
    let heightLeft = imgHeight
    let position = 0
    let firstPage = true

    // Añadir título
    if (firstPage) {
      pdf.setFontSize(20)
      pdf.text('Reporte de Evaluación', 105, 20, { align: 'center' })
      position = 30
      firstPage = false
    }

    // Añadir la imagen por páginas si es necesario
    while (heightLeft >= 0) {
      pdf.addImage(
        canvas,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        '',
        'FAST'
      )
      heightLeft -= pageHeight
      if (heightLeft > 0) {
        pdf.addPage()
        position = 0
      }
    }

    // Descargar el PDF
    pdf.save('reporte-evaluacion.pdf')
  } catch (error) {
    console.error('Error al generar el PDF:', error)
  }
}
</script> 