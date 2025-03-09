<template>
  <div class="space-y-4">
    <!-- Enunciado de la pregunta -->
    <div class="prose max-w-none" v-html="question.stem"></div>

    <!-- Lista reordenable -->
    <div class="space-y-2">
      <draggable
        v-model="localAnswer"
        :disabled="disabled"
        class="space-y-2"
        @change="handleChange"
        item-key="id"
      >
        <template #item="{ element }">
          <div
            class="flex items-center p-4 bg-white border rounded-lg shadow-sm cursor-move"
            :class="{
              'border-gray-200 hover:border-blue-500': !disabled && !showAnswers,
              'border-green-500': showAnswers && isOptionInCorrectPosition(element),
              'border-red-500': showAnswers && !isOptionInCorrectPosition(element)
            }"
          >
            <div class="flex-1">
              <p class="text-gray-900">{{ element.text }}</p>
            </div>
            <!-- Indicador de arrastre -->
            <svg
              v-if="!disabled"
              class="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Indicador de correcto/incorrecto -->
            <div v-if="showAnswers" class="ml-2">
              <svg
                v-if="isOptionInCorrectPosition(element)"
                class="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <svg
                v-else
                class="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Mostrar orden correcto cuando showAnswers es true -->
    <div v-if="showAnswers" class="mt-4 p-4 bg-blue-50 rounded-lg">
      <h4 class="text-sm font-medium text-blue-800 mb-2">Orden Correcto:</h4>
      <div class="space-y-2">
        <div
          v-for="(option, index) in correctOrder"
          :key="option.id"
          class="p-3 bg-white border border-blue-200 rounded-lg"
        >
          <span class="font-medium text-blue-900">{{ index + 1 }}.</span>
          <span class="text-blue-800">{{ option.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  showAnswers: {
    type: Boolean,
    default: false
  },
  selectedAnswer: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['answer-selected'])

// Respuesta local que se puede reordenar
const localAnswer = ref(props.question.options.map(opt => ({ ...opt })))

// Orden correcto de las opciones
const correctOrder = computed(() => {
  return [...props.question.options].sort((a, b) => a.correct_order - b.correct_order)
})

// Verificar si una opción está en la posición correcta
const isOptionInCorrectPosition = (option) => {
  const currentIndex = localAnswer.value.findIndex(opt => opt.id === option.id)
  const correctIndex = correctOrder.value.findIndex(opt => opt.id === option.id)
  return currentIndex === correctIndex
}

// Manejar cambios en el orden
const handleChange = () => {
  emit('answer-selected', localAnswer.value.map(opt => opt.id))
}

// Actualizar la lista local cuando cambia selectedAnswer
watch(() => props.selectedAnswer, (newAnswer) => {
  if (newAnswer && newAnswer.length > 0) {
    localAnswer.value = newAnswer.map(id => {
      return props.question.options.find(opt => opt.id === id)
    })
  }
}, { deep: true })
</script> 