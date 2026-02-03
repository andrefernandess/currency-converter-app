<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  userId: {
    type: Number,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const fromCurrency = ref('USD')
const toCurrency = ref('BRL')
const amount = ref('')

const currencies = ['BRL', 'USD', 'EUR', 'JPY']

const isValid = computed(() => {
  return props.userId && fromCurrency.value && toCurrency.value && amount.value > 0
})

const handleSubmit = () => {
  if (!isValid.value) return
  
  emit('submit', {
    fromCurrency: fromCurrency.value,
    toCurrency: toCurrency.value,
    amount: parseFloat(amount.value)
  })
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-6 mb-6">
    <h2 class="text-xl font-semibold text-white mb-4">💱 Nova Conversão</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Moeda de origem -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          De
        </label>
        <select
          v-model="fromCurrency"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>

      <!-- Moeda de destino -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Para
        </label>
        <select
          v-model="toCurrency"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>

      <!-- Valor -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Valor
        </label>
        <input
          v-model="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                 focus:ring-blue-500"
        />
      </div>

      <!-- Botão -->
      <button
        type="submit"
        :disabled="!isValid || loading"
        class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
               disabled:cursor-not-allowed text-white font-medium rounded-lg 
               transition-colors duration-200"
      >
        <span v-if="loading">Convertendo...</span>
        <span v-else>Converter</span>
      </button>
    </form>
  </div>
</template>
