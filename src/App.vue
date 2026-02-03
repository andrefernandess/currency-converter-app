<script setup>
import { ref, watch } from 'vue'
import UserSelect from './components/UserSelect.vue'
import ConversionForm from './components/ConversionForm.vue'
import TransactionList from './components/TransactionList.vue'
import { createConversion, getTransactions } from './services/api'

// Estado
const userId = ref(null)
const transactions = ref([])
const loadingConversion = ref(false)
const loadingTransactions = ref(false)
const error = ref(null)
const successMessage = ref(null)

// Busca transações quando o userId muda
watch(userId, async (newUserId) => {
    if (newUserId) {
        loadingTransactions.value = true
        try {
            transactions.value = await getTransactions(newUserId)
        } catch (err) {
            console.error('Erro ao buscar transações:', err)
            transactions.value = []
        } finally {
            loadingTransactions.value = false
        }
    } else {
        transactions.value = []
    }
})

// Buscar transações
const fetchTransactions = async () => {
  if (!userId.value) return

  loadingTransactions.value = true
  error.value = null

  try {
    const data = await getTransactions(userId.value)
    transactions.value = data.transactions || data || []
  } catch (err) {
    console.error('Erro ao buscar transações:', err)
    error.value = 'Erro ao carregar histórico de transações'
    transactions.value = []
  } finally {
    loadingTransactions.value = false
  }
}

// Realizar conversão
const handleConversion = async ({ fromCurrency, toCurrency, amount }) => {
  loadingConversion.value = true
  error.value = null
  successMessage.value = null

  try {
    const result = await createConversion(userId.value, fromCurrency, toCurrency, amount)
    
    successMessage.value = `✅ Convertido! ${amount} ${fromCurrency} = ${result.to_value} ${toCurrency}`
    
    // Atualiza a lista de transações
    await fetchTransactions()

    // Limpa mensagem de sucesso após 5 segundos
    setTimeout(() => {
      successMessage.value = null
    }, 5000)
  } catch (err) {
    console.error('Erro na conversão:', err)
    error.value = err.response?.data?.error || 'Erro ao realizar conversão'
  } finally {
    loadingConversion.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 py-8 px-4">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">💱 Currency Converter</h1>
        <p class="text-gray-400">Converta moedas em tempo real</p>
      </div>

      <!-- Mensagem de erro -->
      <div
        v-if="error"
        class="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6"
      >
        {{ error }}
      </div>

      <!-- Mensagem de sucesso -->
      <div
        v-if="successMessage"
        class="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6"
      >
        {{ successMessage }}
      </div>

      <!-- User Select -->
      <UserSelect v-model="userId" />

      <!-- Conversion Form -->
      <ConversionForm
        :userId="userId"
        :loading="loadingConversion"
        @submit="handleConversion"
      />

      <!-- Transaction List -->
      <TransactionList
        :transactions="transactions"
        :loading="loadingTransactions"
      />
    </div>
  </div>
</template>
