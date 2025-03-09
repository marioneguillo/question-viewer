<script setup>
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import { Link } from '@inertiajs/vue3';

defineProps({
    questions: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <Head title="Preguntas" />

    <AppLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Preguntas
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <div class="mb-4">
                            <Link
                                href="/questions/create"
                                class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                            >
                                Nueva Pregunta
                            </Link>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="question in questions" :key="question.id" class="bg-white p-4 rounded-lg shadow">
                                <h3 class="text-lg font-semibold mb-2">{{ question.title }}</h3>
                                <p class="text-gray-600 mb-2">{{ question.description }}</p>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-500">
                                        Tipo: {{ question.type.replace('_', ' ') }}
                                    </span>
                                    <Link
                                        :href="`/questions/${question.id}`"
                                        class="text-blue-600 hover:text-blue-800"
                                    >
                                        Ver
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template> 