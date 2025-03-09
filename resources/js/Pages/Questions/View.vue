<template>
    <Head :title="question.stem" />

    <AppLayout>
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Vista de Pregunta
                </h2>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <!-- Tipo de Pregunta y Botón de Solución -->
                        <div class="mb-4 flex justify-between items-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                :class="{
                                    'bg-blue-100 text-blue-800': question.type === 'single_choice',
                                    'bg-green-100 text-green-800': question.type === 'multiple_choice',
                                    'bg-purple-100 text-purple-800': question.type === 'drag_drop'
                                }">
                                {{ getTypeLabel(question.type) }}
                            </span>

                            <!-- Botón para mostrar/ocultar solución -->
                            <button
                                @click="toggleShowAnswers"
                                class="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm"
                                :class="showAnswers ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'"
                            >
                                <svg v-if="!showAnswers" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ showAnswers ? 'Ocultar Solución' : 'Ver Solución' }}
                            </button>
                        </div>

                        <!-- Componente específico según el tipo -->
                        <component
                            :is="getQuestionComponent(question.type)"
                            :question="question"
                            :showAnswers="showAnswers"
                            @answer-selected="handleAnswerSelected"
                        />

                        <!-- Explicación (cuando se muestran las respuestas) -->
                        <div v-if="showAnswers && question.explanation" class="mt-6">
                            <h3 class="text-lg font-semibold mb-2">Explicación</h3>
                            <div class="p-4 bg-blue-50 rounded-lg">
                                <p class="text-blue-800">{{ question.explanation }}</p>
                            </div>
                        </div>

                        <!-- Botón para volver -->
                        <div class="mt-8 flex justify-end">
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
import { ref } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import { Head } from '@inertiajs/vue3'
import { router } from '@inertiajs/vue3'
import SingleChoiceQuestion from '@/Pages/Questions/Components/SingleChoiceQuestion.vue'
import MultipleChoiceQuestion from '@/Pages/Questions/Components/MultipleChoiceQuestion.vue'
import DragDropQuestion from '@/Pages/Questions/Components/DragDropQuestion.vue'

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
})

const showAnswers = ref(false)

const toggleShowAnswers = () => {
    showAnswers.value = !showAnswers.value
}

const handleAnswerSelected = (selectedAnswer) => {
    // Aquí puedes manejar la respuesta seleccionada si lo necesitas
    console.log('Respuesta seleccionada:', selectedAnswer)
}

const getQuestionComponent = (type) => {
    switch (type) {
        case 'single_choice':
            return SingleChoiceQuestion
        case 'multiple_choice':
            return MultipleChoiceQuestion
        case 'drag_drop':
            return DragDropQuestion
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
</script> 