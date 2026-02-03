import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});


/**
 * Realiza uma nova conversão de moeda
 * @param {number} user_id - ID do usuário
 * @param {string} fromCurrency - Moeda de origem (ex: "USD")
 * @param {string} toCurrency - Moeda de destino (ex: "BRL")
 * @param {number} amount - Valor a ser convertido
 */

export const createConversion = async (user_id, from_currency, to_currency, amount) => {
    const response = await api.post('/api/v1/convert', {
        user_id,
        from_currency,
        to_currency,
        amount,
    });
    return response.data;
};

/**
 * Busca o histórico de transações do usuário
 * @param {number} user_id - ID do usuário
 */

export const getTransactions = async (user_id) => {
    const response = await api.get('/api/v1/transactions', {
        params: { user_id },
    });
    return response.data;
}

export const getUsers = async () => {
    const response = await api.get('/api/v1/users');
    return response.data;
}

/**
 * Cria um novo usuário
 * @param {string} name - Nome do usuário
 * @param {string} email - Email do usuário
 */
export const createUser = async (name, email) => {
    const response = await api.post('/api/v1/users', {
        name,
        email,
    });
    return response.data;
}

export default api;
