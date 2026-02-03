<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const isExpanded = ref(false)

// Última transação (mais recente)
const latestTransaction = computed(() => {
  return props.transactions[0] || null
})

// Demais transações (exceto a primeira)
const olderTransactions = computed(() => {
  return props.transactions.slice(1)
})

// Total de transações
const totalCount = computed(() => {
  return props.transactions.length
})

const toggleExpand = () => {
  if (olderTransactions.value.length > 0) {
    isExpanded.value = !isExpanded.value
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('pt-BR')
}

const formatCurrency = (value, currency) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(value)
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden">
    <!-- Header clicável -->
    <button
      @click="toggleExpand"
      class="w-full px-6 py-4 flex items-center justify-between text-left 
             hover:bg-gray-750 transition-colors duration-200"
      :class="{ 'cursor-default': olderTransactions.length === 0 }"
    >
      <div class="flex items-center gap-2">
        <span class="text-xl">📋</span>
        <h2 class="text-xl font-semibold text-white">
          Histórico de Transações
        </h2>
        <span 
          v-if="totalCount > 0" 
          class="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full"
        >
          {{ totalCount }}
        </span>
      </div>
      
      <!-- Ícone de expand (só mostra se tiver mais transações) -->
      <svg
        v-if="olderTransactions.length > 0"
        class="w-5 h-5 text-gray-400 transition-transform duration-300"
        :class="{ 'rotate-180': isExpanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div class="px-6 pb-4">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-blue-500"></div>
        <p class="text-gray-400 mt-2">Carregando...</p>
      </div>

      <!-- Lista vazia -->
      <div v-else-if="transactions.length === 0" class="text-center py-8">
        <span class="text-gray-400">Nenhuma transação encontrada</span>
      </div>

      <!-- Transações -->
      <div v-else class="space-y-3">
        <!-- Última transação (sempre visível) -->
        <div
          v-if="latestTransaction"
          class="bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2">
              <span class="text-lg font-medium text-white">
                {{ latestTransaction.from_currency }} → {{ latestTransaction.to_currency }}
              </span>
              <span class="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded">
                Mais recente
              </span>
            </div>
            <span class="text-xs text-gray-400">
              {{ formatDate(latestTransaction.timestamp) }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400">Valor original:</span>
              <p class="text-white font-medium">
                {{ formatCurrency(latestTransaction.from_value, latestTransaction.from_currency) }}
              </p>
            </div>
            <div>
              <span class="text-gray-400">Valor convertido:</span>
              <p class="text-green-400 font-medium">
                {{ formatCurrency(latestTransaction.to_value, latestTransaction.to_currency) }}
              </p>
            </div>
          </div>
          
          <div class="mt-2 text-xs text-gray-500">
            Taxa: 1 {{ latestTransaction.from_currency }} = {{ latestTransaction.rate }} {{ latestTransaction.to_currency }}
          </div>
        </div>

        <!-- Texto pra expandir (se tiver mais) -->
        <button
          v-if="olderTransactions.length > 0 && !isExpanded"
          @click="toggleExpand"
          class="w-full text-center text-sm text-blue-400 hover:text-blue-300 
                 py-2 transition-colors duration-200"
        >
          Ver mais {{ olderTransactions.length }} transação(ões) ↓
        </button>

        <!-- Transações antigas (expandível) -->
        <div
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'"
        >
          <div class="space-y-3 pt-2">
            <div
              v-for="transaction in olderTransactions"
              :key="transaction.id"
              class="bg-gray-700 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="text-lg font-medium text-white">
                  {{ transaction.from_currency }} → {{ transaction.to_currency }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ formatDate(transaction.timestamp) }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-400">Valor original:</span>
                  <p class="text-white font-medium">
                    {{ formatCurrency(transaction.from_value, transaction.from_currency) }}
                  </p>
                </div>
                <div>
                  <span class="text-gray-400">Valor convertido:</span>
                  <p class="text-green-400 font-medium">
                    {{ formatCurrency(transaction.to_value, transaction.to_currency) }}
                  </p>
                </div>
              </div>
              
              <div class="mt-2 text-xs text-gray-500">
                Taxa: 1 {{ transaction.from_currency }} = {{ transaction.rate }} {{ transaction.to_currency }}
              </div>
            </div>
          </div>
        </div>

        <!-- Botão pra recolher -->
        <button
          v-if="isExpanded"
          @click="toggleExpand"
          class="w-full text-center text-sm text-blue-400 hover:text-blue-300 
                 py-2 transition-colors duration-200"
        >
          Mostrar menos ↑
        </button>
      </div>
    </div>
  </div>
</template>
