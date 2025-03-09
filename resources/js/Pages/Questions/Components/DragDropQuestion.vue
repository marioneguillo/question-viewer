<template>
  <BaseQuestion :question="question" :show-answers="showAnswers">
    <template #options>
      <div class="space-y-4">
        <!-- Texto con huecos -->
        <div class="p-4 bg-white border rounded-lg">
          <div class="prose max-w-none">
            <div v-for="(part, index) in textParts" :key="index" class="inline">
              <span v-if="!part.isSlot">{{ part.text }}</span>
              <div
                v-else
                class="inline-block align-middle mx-1 w-32 h-10"
                :class="{
                  'border-2 border-dashed border-gray-300': !dropSlots[part.slotIndex],
                  'border border-gray-200 bg-white shadow-sm': dropSlots[part.slotIndex],
                  'border-blue-300 bg-blue-50': isOver === part.slotIndex,
                  'border-green-300 bg-green-50': showAnswers && isCorrectSlot(part.slotIndex),
                  'border-red-300 bg-red-50': showAnswers && !isCorrectSlot(part.slotIndex) && hasAnswer(part.slotIndex)
                }"
                @dragover.prevent
                @dragenter.prevent="dragEnter(part.slotIndex)"
                @dragleave.prevent="dragLeave(part.slotIndex)"
                @drop.prevent="drop(part.slotIndex)"
              >
                <div v-if="dropSlots[part.slotIndex]" class="flex items-center justify-between h-full px-3">
                  <span :class="{
                    'text-green-700': showAnswers && isCorrectSlot(part.slotIndex),
                    'text-red-700': showAnswers && !isCorrectSlot(part.slotIndex),
                    'text-gray-700': !showAnswers
                  }">
                    {{ dropSlots[part.slotIndex].text }}
                  </span>
                  <button
                    v-if="!showAnswers"
                    @click="removeFromSlot(part.slotIndex)"
                    class="text-gray-400 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div v-else class="flex items-center justify-center h-full">
                  <span class="text-gray-400 text-sm">Arrastra aquí</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Área de opciones disponibles -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Palabras disponibles:</h3>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(option, index) in availableOptions"
              :key="option.id"
              class="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm cursor-move"
              draggable="true"
              @dragstart="dragStart($event, option)"
              @dragend="dragEnd"
            >
              {{ option.text }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseQuestion>
</template>

<script>
import { ref, computed, watch } from 'vue'
import BaseQuestion from './BaseQuestion.vue'
import { router } from '@inertiajs/vue3'

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
    const isOver = ref(null)
    const dropSlots = ref(Array(props.question.slots?.length || 0).fill(null))

    // Añadir watcher para showAnswers
    watch(() => props.showAnswers, (newValue) => {
      if (newValue) {
        // Cuando se muestran las respuestas, rellenar con las respuestas correctas
        dropSlots.value = props.question.slots.map((slotIndex) => {
          // Restamos 1 porque los índices en slots están basados en 1
          return props.question.options[slotIndex - 1]
        })
      } else {
        // Cuando se ocultan las respuestas, limpiar los slots
        dropSlots.value = Array(props.question.slots?.length || 0).fill(null)
      }
    }, { immediate: true })

    const textParts = computed(() => {
      if (!props.question.background_text) return [];
      const parts = [];
      let lastIndex = 0;
      let slotIndex = 0;
      const regex = /\[SLOT\]/g;
      let match;

      while ((match = regex.exec(props.question.background_text)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            text: props.question.background_text.substring(lastIndex, match.index),
            isSlot: false
          });
        }
        parts.push({
          isSlot: true,
          slotIndex: slotIndex++
        });
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < props.question.background_text.length) {
        parts.push({
          text: props.question.background_text.substring(lastIndex),
          isSlot: false
        });
      }

      return parts;
    });

    const availableOptions = computed(() => {
      return props.question.options.filter(option => 
        !dropSlots.value.some(slot => slot && slot.id === option.id)
      )
    })

    const dragStart = (event, option) => {
      event.dataTransfer.setData('text/plain', JSON.stringify(option))
    }

    const dragEnd = () => {
      isOver.value = null
    }

    const dragEnter = (index) => {
      isOver.value = index
    }

    const dragLeave = (index) => {
      if (isOver.value === index) {
        isOver.value = null
      }
    }

    const drop = (index) => {
      const option = JSON.parse(event.dataTransfer.getData('text/plain'))
      if (!dropSlots.value[index]) {
        dropSlots.value[index] = option
        emit('answer-selected', dropSlots.value.map(slot => slot?.id).filter(Boolean))
      }
      isOver.value = null
    }

    const removeFromSlot = (index) => {
      dropSlots.value[index] = null
      emit('answer-selected', dropSlots.value.map(slot => slot?.id).filter(Boolean))
    }

    const isCorrectSlot = (index) => {
      const slot = dropSlots.value[index]
      if (!slot) return false
      return Number(props.question.slots[index]) === props.question.options.findIndex(opt => opt.id === slot.id) + 1
    }

    const hasAnswer = (index) => {
      return dropSlots.value[index] !== null
    }

    return {
      availableOptions,
      dropSlots,
      isOver,
      dragStart,
      dragEnd,
      dragEnter,
      dragLeave,
      drop,
      removeFromSlot,
      isCorrectSlot,
      hasAnswer,
      textParts,
      router
    }
  }
}
</script> 