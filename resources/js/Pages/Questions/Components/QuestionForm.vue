<template>
  <div>
    <!-- Enunciado -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Enunciado de la Pregunta
      </label>
      <textarea
        v-model="form.stem"
        rows="3"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      ></textarea>
      <p v-if="form.errors.stem" class="mt-2 text-sm text-red-600">{{ form.errors.stem }}</p>
    </div>

    <!-- Texto de fondo (solo para drag_drop) -->
    <div v-if="form.type === 'drag_drop'" class="mb-6">
      <label class="block text-sm font-medium text-gray-700">Texto de Fondo</label>
      <div class="mt-1">
        <textarea
          v-model="form.background_text"
          rows="6"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          placeholder="Escribe aquí el texto donde se insertarán las palabras..."
        ></textarea>
        <p class="mt-1 text-sm text-gray-500">
          Escribe el texto completo y usa [SLOT] para indicar donde irán las palabras que se deben arrastrar.
        </p>
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700">Huecos Detectados</label>
        <div class="mt-2 space-y-2">
          <div v-for="(slot, index) in detectedSlots" :key="index" class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Hueco {{ index + 1 }}</span>
            <input
              type="number"
              v-model="form.slots[index]"
              class="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              :max="form.options.length"
              placeholder="Pos."
            />
            <span class="text-sm text-gray-500">
              Indica qué opción debe ir en este hueco (1-{{ form.options.length }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Opciones según el tipo de pregunta -->
    <div v-if="['single_choice', 'multiple_choice'].includes(form.type)" class="space-y-4">
      <div class="flex justify-between items-center mb-4">
        <label class="block text-sm font-medium text-gray-700">Opciones de Respuesta</label>
        <button
          type="button"
          @click="addOption"
          class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              :placeholder="`Opción ${index + 1}`"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div class="flex items-center space-x-3">
            <label class="inline-flex items-center">
              <input
                :type="form.type === 'single_choice' ? 'radio' : 'checkbox'"
                v-model="option.is_correct"
                :name="form.type === 'single_choice' ? 'correct_answer' : ''"
                :value="true"
                class="text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span class="ml-2 text-sm text-gray-600">Correcta</span>
            </label>
            <button
              type="button"
              @click="removeOption(index)"
              class="text-red-600 hover:text-red-800"
              :disabled="form.options.length <= 2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <p class="mt-2 text-sm text-gray-500">
        {{ form.type === 'multiple_choice' ? 'Puedes seleccionar múltiples respuestas correctas.' : 'Selecciona solo una respuesta correcta.' }}
      </p>
    </div>

    <div v-else-if="form.type === 'drag_drop'" class="space-y-4">
      <div class="flex justify-between items-center mb-4">
        <label class="block text-sm font-medium text-gray-700">Elementos para Arrastrar</label>
        <button
          type="button"
          @click="addOption"
          class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Agregar Elemento
        </button>
      </div>

      <div class="space-y-4">
        <div v-for="(option, index) in form.options" :key="index" class="flex items-center space-x-4">
          <div class="flex-grow">
            <input
              type="text"
              v-model="option.text"
              :placeholder="`Elemento ${index + 1}`"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="button"
            @click="removeOption(index)"
            class="text-red-600 hover:text-red-800"
            :disabled="form.options.length <= 2"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <p class="mt-2 text-sm text-gray-500">
        Agrega los elementos que se podrán arrastrar a los huecos del texto.
      </p>
    </div>

    <div v-else-if="form.type === 'reorder_list'" class="space-y-4">
      <!-- Encabezado y botones -->
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-medium text-gray-900">Elementos a Ordenar</h3>
          <p class="mt-1 text-sm text-gray-500">
            Agrega elementos y establece el orden correcto en el que deben aparecer.
          </p>
        </div>
        <div class="flex space-x-2">
          <button
            type="button"
            @click="reorderElements"
            class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="form.options.length < 2"
          >
            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Ordenar Automáticamente
          </button>
          <button
            type="button"
            @click="addOption"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Elemento
          </button>
        </div>
      </div>

      <!-- Lista de elementos ordenables -->
      <div class="bg-gray-50 rounded-lg p-4">
        <draggable
          v-model="form.options"
          class="space-y-2"
          handle=".handle"
          item-key="id"
          @end="updateOrder"
          :animation="200"
          ghost-class="opacity-50"
        >
          <template #item="{ element, index }">
            <div 
              class="flex items-center space-x-3 bg-white p-4 rounded-lg border transition-colors duration-200"
              :class="{
                'border-gray-200 hover:border-blue-200': isValidOrder(element.correct_order),
                'border-red-300 bg-red-50': !isValidOrder(element.correct_order)
              }"
            >
              <!-- Indicador de orden y mango para arrastrar -->
              <div class="flex items-center space-x-2">
                <div class="handle cursor-move hover:bg-gray-100 p-1 rounded">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full font-medium text-gray-700">
                  {{ element.correct_order || '?' }}
                </div>
              </div>

              <!-- Campo de texto -->
              <div class="flex-1">
                <input
                  type="text"
                  v-model="element.text"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  :placeholder="'Elemento ' + (index + 1)"
                >
                <div class="mt-1 flex items-center space-x-2">
                  <label class="text-sm text-gray-600">Orden correcto:</label>
                  <input
                    type="number"
                    v-model="element.correct_order"
                    min="1"
                    :max="form.options.length"
                    class="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    :class="{
                      'border-red-300 focus:border-red-500 focus:ring-red-200': !isValidOrder(element.correct_order)
                    }"
                    @change="validateOrder"
                  >
                  <span v-if="!isValidOrder(element.correct_order)" class="text-xs text-red-500">
                    Orden inválido
                  </span>
                </div>
              </div>

              <!-- Botón eliminar -->
              <button
                type="button"
                @click="removeOption(index)"
                class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                :disabled="form.options.length <= 2"
                :title="form.options.length <= 2 ? 'Se requieren al menos dos elementos' : 'Eliminar elemento'"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </template>
        </draggable>

        <!-- Mensaje cuando no hay elementos -->
        <div v-if="form.options.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay elementos</h3>
          <p class="mt-1 text-sm text-gray-500">
            Comienza agregando algunos elementos usando el botón de arriba.
          </p>
        </div>
      </div>

      <!-- Mensajes de validación -->
      <div class="rounded-md bg-blue-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">Instrucciones</h3>
            <div class="mt-2 text-sm text-blue-700">
              <ul class="list-disc pl-5 space-y-1">
                <li>Arrastra los elementos usando el ícono de las líneas para reordenarlos</li>
                <li>Establece el orden correcto usando los números (del 1 al {{ form.options.length }})</li>
                <li>Cada elemento debe tener un orden único y consecutivo</li>
                <li>Puedes usar el botón "Ordenar Automáticamente" para asignar órdenes consecutivos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Validación de opciones -->
      <div v-if="form.errors.options" class="mt-2 rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error de validación</h3>
            <div class="mt-2 text-sm text-red-700">
              {{ form.errors.options }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Estado de la validación -->
      <div v-if="orderValidationMessage" class="mt-2 rounded-md p-4" :class="{
        'bg-red-50': hasOrderError,
        'bg-green-50': !hasOrderError
      }">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg v-if="hasOrderError" class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium" :class="{
              'text-red-800': hasOrderError,
              'text-green-800': !hasOrderError
            }">
              Estado de la validación
            </h3>
            <div class="mt-2 text-sm" :class="{
              'text-red-700': hasOrderError,
              'text-green-700': !hasOrderError
            }">
              {{ orderValidationMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Explicación -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Explicación (opcional)
      </label>
      <textarea
        v-model="form.explanation"
        rows="3"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      ></textarea>
      <p v-if="form.errors.explanation" class="mt-2 text-sm text-red-600">{{ form.errors.explanation }}</p>
    </div>

    <!-- Botones de acción -->
    <div class="flex justify-end space-x-3 pt-4 border-t">
      <button
        type="button"
        @click="router.visit('/questions')"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="submit"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Guardar Pregunta
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import draggable from 'vuedraggable'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  question: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submitted'])

const form = useForm({
  type: props.type || 'single_choice',
  stem: props.question?.stem || '',
  explanation: props.question?.explanation || '',
  options: props.question?.options || [
    { text: '', is_correct: false },
    { text: '', is_correct: false }
  ],
  background_text: props.question?.background_text || '',
  slots: props.question?.slots || []
})

// Observar cambios en el tipo
watch(() => props.type, (newType) => {
  form.type = newType
}, { immediate: true })

// Detectar slots para drag_drop
const detectedSlots = computed(() => {
  if (!form.background_text) return []
  const matches = form.background_text.match(/\[SLOT\]/g)
  return matches ? matches : []
})

// Asegurarse de que el tipo se establezca correctamente
onMounted(() => {
  form.type = props.type
  
  // Si es una pregunta de reorder_list y no hay opciones, inicializar con estructura correcta
  if (form.type === 'reorder_list' && form.options.length === 0) {
    form.options = []
  }
})

const orderValidationMessage = ref('')
const hasOrderError = ref(false)

const isValidOrder = (order) => {
  if (!order) return false
  const orderNum = parseInt(order)
  if (isNaN(orderNum)) return false
  if (orderNum < 1 || orderNum > form.options.length) return false
  
  const orders = form.options.map(opt => parseInt(opt.correct_order))
  return orders.filter(o => o === orderNum).length === 1
}

const validateOrder = () => {
  if (form.type !== 'reorder_list') return true
  
  const orders = form.options.map(opt => parseInt(opt.correct_order))
  const uniqueOrders = new Set(orders)
  
  if (uniqueOrders.size !== form.options.length) {
    orderValidationMessage.value = 'Hay órdenes duplicados. Cada elemento debe tener un orden único.'
    hasOrderError.value = true
    return false
  }
  
  const sortedOrders = [...orders].sort((a, b) => a - b)
  const isConsecutive = sortedOrders.every((num, idx) => num === idx + 1)
  
  if (!isConsecutive) {
    orderValidationMessage.value = 'Los órdenes deben ser consecutivos del 1 al ' + form.options.length
    hasOrderError.value = true
    return false
  }
  
  orderValidationMessage.value = 'El orden es válido'
  hasOrderError.value = false
  return true
}

const reorderElements = () => {
  if (form.type !== 'reorder_list') return
  
  form.options.forEach((option, index) => {
    option.correct_order = index + 1
  })
  validateOrder()
}

const updateOrder = () => {
  if (form.type === 'reorder_list') {
    validateOrder()
  }
}

// Función para agregar una nueva opción
const addOption = () => {
  if (form.type === 'reorder_list') {
    const newOption = {
      id: Date.now(),
      text: '',
      correct_order: form.options.length + 1
    }
    form.options.push(newOption)
  } else if (form.type === 'drag_drop') {
    form.options.push({
      text: '',
      is_correct: false
    })
    form.slots.push(form.options.length)
  } else {
    form.options.push({
      text: '',
      is_correct: false
    })
  }
}

// Función para eliminar una opción
const removeOption = (index) => {
  if (form.type === 'reorder_list' && form.options.length <= 2) {
    return
  }
  
  form.options.splice(index, 1)
  
  // Reordenar los correct_order después de eliminar
  if (form.type === 'reorder_list') {
    form.options.forEach((option, idx) => {
      if (option.correct_order > index + 1) {
        option.correct_order--
      }
    })
    validateOrder()
  }
  
  // Actualizar slots para drag_drop
  if (form.type === 'drag_drop') {
    form.slots = form.slots.map(slot => {
      if (slot > index) return slot - 1
      if (slot === index) return null
      return slot
    }).filter(slot => slot !== null)
  }
}

// Función para validar el formulario antes de enviar
const validateForm = () => {
  let isValid = true
  const errors = {}

  // Validación básica
  if (!form.stem.trim()) {
    errors.stem = 'El enunciado es requerido'
    isValid = false
  }

  if (form.options.length < 2) {
    errors.options = 'Se requieren al menos dos opciones'
    isValid = false
  }

  // Validaciones específicas por tipo
  if (form.type === 'reorder_list') {
    // Verificar que todos los elementos tengan texto y orden
    const hasEmptyFields = form.options.some(opt => !opt.text.trim() || !opt.correct_order)
    if (hasEmptyFields) {
      errors.options = 'Todos los elementos deben tener texto y orden'
      isValid = false
    }

    // Verificar que los órdenes sean únicos y consecutivos
    if (!validateOrder()) {
      errors.options = orderValidationMessage.value
      isValid = false
    }
  }

  form.clearErrors()
  if (!isValid) {
    form.setError(errors)
  }

  return isValid
}

// Función para enviar el formulario
const submit = () => {
  if (!validateForm()) return

  if (props.question) {
    form.put(`/questions/${props.question.id}`, {
      onSuccess: () => emit('submitted')
    })
  } else {
    form.post('/questions', {
      onSuccess: () => emit('submitted')
    })
  }
}
</script> 