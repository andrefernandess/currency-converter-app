<script setup>
import { ref, watch, onMounted } from 'vue'
import { getUsers, createUser } from '../services/api'

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
const showCreateForm = ref(false)
const creating = ref(false)
const createError = ref(null)
const createSuccess = ref(null)
const newName = ref('')
const newEmail = ref('')

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

const toggleCreateForm = () => {
    showCreateForm.value = !showCreateForm.value
    createError.value = null
    createSuccess.value = null
    if (!showCreateForm.value) {
        newName.value = ''
        newEmail.value = ''
    }
}

const handleCreateUser = async () => {
    if (!newName.value.trim() || !newEmail.value.trim()) return

    creating.value = true
    createError.value = null
    createSuccess.value = null

    try {
        const created = await createUser(newName.value.trim(), newEmail.value.trim())
        await fetchUsers()
        const createdId = created?.id || created?.user?.id
        if (createdId) {
            selectedUserId.value = createdId
        }
        createSuccess.value = 'Usuário cadastrado com sucesso'
        newName.value = ''
        newEmail.value = ''
        showCreateForm.value = false
    } catch (err) {
        const apiErrors = err.response?.data?.errors
        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
            createError.value = apiErrors.join(' | ')
        } else {
            createError.value = err.response?.data?.error || 'Erro ao cadastrar usuário'
        }
        console.error(err)
    } finally {
        creating.value = false
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

    <!-- Botão para abrir o form -->
    <button
      v-if="!loading && !error"
      @click="toggleCreateForm"
      class="mt-3 text-sm text-blue-400 hover:text-blue-300 underline"
      type="button"
    >
      {{ showCreateForm ? 'Cancelar' : 'Cadastrar novo' }}
    </button>

    <!-- Form de cadastro -->
    <div v-if="showCreateForm" class="mt-4 p-3 rounded-lg bg-gray-700/60 border border-gray-600">
      <h3 class="text-sm font-semibold text-white mb-3">Novo usuário</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1">Nome</label>
          <input
            v-model="newName"
            type="text"
            placeholder="Ex: João da Silva"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-300 mb-1">Email</label>
          <input
            v-model="newEmail"
            type="email"
            placeholder="exemplo@email.com"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div v-if="createError" class="text-red-400 text-xs mt-3">
        {{ createError }}
      </div>
      <div v-else-if="createSuccess" class="text-green-400 text-xs mt-3">
        {{ createSuccess }}
      </div>

      <button
        @click="handleCreateUser"
        :disabled="creating || !newName.trim() || !newEmail.trim()"
        class="mt-3 w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors duration-200"
        type="button"
      >
        <span v-if="creating">Salvando...</span>
        <span v-else>Salvar usuário</span>
      </button>
    </div>

    <!-- Empty state -->
    <p v-if="!loading && !error && users.length === 0" class="text-gray-400 text-sm mt-2">
      Nenhum usuário cadastrado
    </p>
  </div>
</template>
