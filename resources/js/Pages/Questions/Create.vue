<template>
  <AppLayout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Crear Nueva Pregunta
      </h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
          <!-- Tipo de pregunta -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700">Tipo de Pregunta</label>
            <div class="mt-2 space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="selectedType" value="single_choice" class="text-blue-600 focus:ring-blue-500" />
                <span class="ml-2">Opción Única</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="selectedType" value="multiple_choice" class="text-blue-600 focus:ring-blue-500" />
                <span class="ml-2">Opción Múltiple</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="selectedType" value="drag_drop" class="text-blue-600 focus:ring-blue-500" />
                <span class="ml-2">Arrastrar y Soltar</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="selectedType" value="reorder_list" class="text-blue-600 focus:ring-blue-500" />
                <span class="ml-2">Ordenar Lista</span>
              </label>
            </div>
          </div>

          <!-- Formulario de pregunta -->
          <QuestionForm
            :type="selectedType"
            @submitted="onSubmitted"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import QuestionForm from '@/Pages/Questions/Components/QuestionForm.vue'
import { router } from '@inertiajs/vue3'

const props = defineProps({
  type: {
    type: String,
    default: 'single_choice'
  }
})

const selectedType = ref(props.type)

const onSubmitted = () => {
  router.visit('/questions')
}
</script> 