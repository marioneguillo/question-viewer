<template>
  <div class="flex flex-col h-full">
    <!-- Enunciado (siempre visible en la parte superior) -->
    <div class="bg-gray-50 p-6 rounded-lg mb-6 flex-shrink-0">
      <h2 class="text-xl font-medium text-gray-900">{{ question.stem }}</h2>
    </div>

    <!-- Opciones (con scroll si es necesario) -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <div class="space-y-3 pr-2">
        <slot name="options"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
    showAnswers: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style> 