<script setup>
import { ref, watch, onMounted } from 'vue'
import { getUsers } from '../services/api'

const props = defineProps({
    modelValue: {
        type: Number,
        default: null
    }
})

const emit = defineEmits(['update:modelValue'])

const selectedUserId = ref(props.modelValue || '')
const users = ref([])
const loading = ref(false)
const error = ref(null)

// Busca usuários ao montar o componente
onMounted(async () => {
    await fetchUsers()
})

const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
        users.value = await getUsers()
    } catch (err) {
        error.value = 'Erro ao carregar usuários'
        console.error(err)
    } finally {
        loading.value = false
    }
}

// Emite mudança quando selecionar usuário
watch(selectedUserId, (newValue) => {
    const parsed = parseInt(newValue)
    emit('update:modelValue', isNaN(parsed) ? null : parsed)
})

// Atualiza se o modelValue mudar externamente
watch(() => props.modelValue, (newValue) => {
    selectedUserId.value = newValue || ''
})
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-4 mb-6">
    <label class="block text-sm font-medium text-gray-300 mb-2">
      Usuário
    </label>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center text-gray-400">
      <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      Carregando usuários...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-red-400 text-sm">
      {{ error }}
      <button 
        @click="fetchUsers" 
        class="ml-2 underline hover:text-red-300"
      >
        Tentar novamente
      </button>
    </div>

    <!-- Select -->
    <select
      v-else
      v-model="selectedUserId"
      class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
             text-white focus:outline-none focus:ring-2 
             focus:ring-blue-500 focus:border-transparent
             cursor-pointer"
    >
      <option value="" disabled>Selecione um usuário</option>
      <option 
        v-for="user in users" 
        :key="user.id" 
        :value="user.id"
      >
        {{ user.name }} ({{ user.email }})
      </option>
    </select>

    <!-- Empty state -->
    <p v-if="!loading && !error && users.length === 0" class="text-gray-400 text-sm mt-2">
      Nenhum usuário cadastrado
    </p>
  </div>
</template>
