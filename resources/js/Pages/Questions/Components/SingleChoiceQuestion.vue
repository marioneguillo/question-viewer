<template>
  <BaseQuestion :question="question" :show-answers="showAnswers">
    <template #options>
      <label v-for="option in question.options" :key="option.id" 
           class="block p-4 border rounded-lg cursor-pointer transition-all duration-200"
           :class="{
             'bg-green-50 border-green-200': showAnswers && option.is_correct,
             'bg-red-50 border-red-200': showAnswers && !option.is_correct && selectedOption === option.id,
             'hover:bg-gray-50': !showAnswers,
             'bg-blue-50 border-blue-300 shadow-sm': !showAnswers && selectedOption === option.id
           }">
        <div class="flex items-start">
          <input
            type="radio"
            name="answer"
            :value="option.id"
            v-model="selectedOption"
            :disabled="showAnswers"
            class="sr-only"
          />
          <span class="flex-grow" :class="{
            'text-green-700 font-medium': showAnswers && option.is_correct,
            'text-red-700': showAnswers && !option.is_correct && selectedOption === option.id,
            'text-gray-700': !showAnswers && selectedOption !== option.id,
            'text-blue-700 font-medium': !showAnswers && selectedOption === option.id
          }">{{ option.text }}</span>
        </div>
        <div v-if="showAnswers" class="mt-2 text-sm">
          <template v-if="option.is_correct">
            <span class="text-green-600">Respuesta correcta</span>
          </template>
          <template v-else-if="selectedOption === option.id">
            <span class="text-red-600">Seleccionada incorrectamente</span>
          </template>
        </div>
      </label>
    </template>
  </BaseQuestion>
</template>

<script>
import { ref, watch } from 'vue'
import BaseQuestion from './BaseQuestion.vue'

export default {
  components: {
    BaseQuestion
  },
  props: {
    question: {
      type: Object,
      required: true
    },
    showAnswers: {
      type: Boolean,
      default: false
    }
  },
  emits: ['answer-selected'],
  setup(props, { emit }) {
    const selectedOption = ref(null)

    watch(selectedOption, (newValue) => {
      emit('answer-selected', [newValue])
    })

    return {
      selectedOption
    }
  }
}
</script> 