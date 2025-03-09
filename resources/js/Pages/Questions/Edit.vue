<template>
  <AppLayout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Editar Pregunta
      </h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
          <form @submit.prevent="submit">
            <!-- Tipo de pregunta -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700">Tipo de Pregunta</label>
              <div class="mt-2 space-x-4">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="form.type" value="single_choice" class="text-blue-600 focus:ring-blue-500" />
                  <span class="ml-2">Opción Única</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="form.type" value="multiple_choice" class="text-blue-600 focus:ring-blue-500" />
                  <span class="ml-2">Opción Múltiple</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="form.type" value="drag_drop" class="text-blue-600 focus:ring-blue-500" />
                  <span class="ml-2">Arrastrar y Soltar</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="form.type" value="reorder_list" class="text-blue-600 focus:ring-blue-500" />
                  <span class="ml-2">Ordenar Lista</span>
                </label>
              </div>
              <div v-if="form.errors.type" class="mt-2 text-sm text-red-600">{{ form.errors.type }}</div>
            </div>

            <!-- Enunciado -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Enunciado de la Pregunta
              </label>
              <RichTextEditor
                v-model="form.stem"
                class="mt-1"
              />
              <p v-if="form.errors.stem" class="mt-2 text-sm text-red-600">{{ form.errors.stem }}</p>
            </div>

            <!-- Opciones -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-4">
                <label class="block text-sm font-medium text-gray-700">
                  {{ form.type === 'drag_drop' ? 'Elementos para ordenar' : 'Opciones de Respuesta' }}
                </label>
                <button
                  type="button"
                  @click="addOption"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar Opción
                </button>
              </div>

              <div class="space-y-4">
                <div v-for="(option, index) in form.options" :key="index" class="flex items-center space-x-4">
                  <div class="flex-grow">
                    <input
                      type="text"
                      v-model="option.text"
                      :placeholder="form.type === 'drag_drop' ? `Elemento ${index + 1}` : `Opción ${index + 1}`"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div class="flex items-center space-x-4 flex-shrink-0">
                    <label class="inline-flex items-center whitespace-nowrap">
                      <input
                        :type="form.type === 'single_choice' ? 'radio' : 'checkbox'"
                        v-model="option.is_correct"
                        :name="form.type === 'single_choice' ? 'correct_answer' : `option_${index}`"
                        class="text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span class="ml-2 text-sm text-gray-600">
                        {{ form.type === 'drag_drop' ? 'Posición correcta' : 'Correcta' }}
                      </span>
                    </label>
                    <button
                      type="button"
                      @click="removeOption(index)"
                      class="text-gray-400 hover:text-red-600 transition-colors duration-200"
                      :disabled="form.options.length <= 2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-500">
                {{ 
                  form.type === 'drag_drop' 
                    ? 'Marca la casilla "Posición correcta" para los elementos que deben estar en esa posición específica.'
                    : form.type === 'multiple_choice'
                      ? 'Puedes seleccionar múltiples respuestas correctas.'
                      : 'Selecciona solo una respuesta correcta.'
                }}
              </p>
            </div>

            <!-- Explicación -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Explicación de la Respuesta
              </label>
              <RichTextEditor
                v-model="form.explanation"
                class="mt-1"
              />
              <p v-if="form.errors.explanation" class="mt-2 text-sm text-red-600">{{ form.errors.explanation }}</p>
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="router.visit('/dashboard')"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { useForm } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import { router } from '@inertiajs/vue3'
import RichTextEditor from '@/Components/RichTextEditor.vue'

export default {
  components: {
    AppLayout,
    RichTextEditor
  },
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const form = useForm({
      type: props.question.type,
      stem: props.question.stem,
      explanation: props.question.explanation,
      options: props.question.options.map(option => ({
        text: option.text,
        is_correct: option.is_correct,
        id: option.id
      }))
    })

    const addOption = () => {
      form.options.push({
        text: '',
        is_correct: false
      })
    }

    const removeOption = (index) => {
      if (form.options.length > 2) {
        form.options.splice(index, 1)
      }
    }

    const submit = () => {
      form.put(`/questions/${props.question.id}`, {
        onSuccess: () => {
          router.visit(`/questions/${props.question.id}`)
        }
      })
    }

    const cancel = () => {
      router.visit(`/questions/${props.question.id}`)
    }

    return {
      form,
      addOption,
      removeOption,
      submit,
      cancel,
      router
    }
  }
}
</script> 