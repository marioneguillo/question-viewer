<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import { Head, Link } from '@inertiajs/vue3'
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'
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

const confirmDelete = () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer.')) {
        router.delete(`/questions/${props.question.id}`)
    }
}

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

<template>
    <Head :title="question.stem" />

    <AppLayout>
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Vista de Pregunta
                </h2>
                <div class="flex space-x-3">
                    <Link
                        :href="`/questions/${question.id}/edit`"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                    </Link>
                    <button
                        @click="confirmDelete"
                        class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                    </button>
                </div>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <!-- Tipo de Pregunta -->
                        <div class="mb-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                :class="{
                                    'bg-blue-100 text-blue-800': question.type === 'single_choice',
                                    'bg-green-100 text-green-800': question.type === 'multiple_choice',
                                    'bg-purple-100 text-purple-800': question.type === 'drag_drop'
                                }">
                                {{ getTypeLabel(question.type) }}
                            </span>
                        </div>

                        <!-- Componente específico según el tipo -->
                        <component
                            :is="getQuestionComponent(question.type)"
                            :question="question"
                            :showAnswers="showAnswers"
                            @answer-selected="handleAnswerSelected"
                        />

                        <!-- Botón para mostrar/ocultar solución -->
                        <div class="mt-6 flex justify-center">
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
                                Volver al Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script>
import AppLayout from '@/Layouts/AppLayout.vue'
import { Head, Link } from '@inertiajs/vue3'
import { router } from '@inertiajs/vue3'

export default {
    components: {
        AppLayout,
        Head,
        Link
    },
    props: {
        question: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        return { router }
    }
}
</script> 