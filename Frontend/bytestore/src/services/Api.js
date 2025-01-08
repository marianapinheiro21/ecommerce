import axios from 'axios';

const API_URL = 'http://localhost:8000/api';  

// Axios instance
const apiInstance = axios.create({
    baseURL: API_URL
});

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};


// Set the auth token for any request
apiInstance.interceptors.request.use(config => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));


apiInstance.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        console.log('Token expired, logging out user.');
        logoutUser();
        window.location='/login';
    }
    return Promise.reject(error);
});


// Function to log in a user
export const loginCliente = async (credentials) => {
    console.log('Credentials being sent:', credentials);

    try {
        const response = await axios.post(`${API_URL}/cliente/login/`, credentials);
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        return response.data; // Returns the data part of the response from server
    } catch (error) {
        console.error('Login error:', error.response);
        throw error;
    }
};

export const loginLojista = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/lojista/login/`, credentials);
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        return response.data; // Returns the data part of the response from server
    } catch (error) {
        console.error('Login error:', error.response);
        throw error;
    }
};


export const logoutUser = async () => {
    try {
        const token = getAccessToken();
        await apiInstance.post('/logout/', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location = '/login';  // Redirect to login page
    }
};


// Function to fetch cart data by user ID
export const fetchCarrinho = async () => {
    try {
        const response = await axios.get(`${API_URL}/carrinho/`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        });
        
        return response.data; // Returns the data part of the response from server
    } catch (error) {
        console.error('Fetch cart error:', error.response);
        throw error;
    }
};


/////////////// PRODUTOS FAVORITOS ////////////////////

export const listarFavoritos = async () => {
    const token = localStorage.getItem('accessToken'); // Pegando o token do localStorage
    try {
        const response = await axios.get('/api/listar/favorito/', {
            headers: {
                'Authorization': `Bearer ${token}` // Incluindo o token no cabeçalho
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Função para buscar os dados pessoais
export const getDadosPessoais = async () => {
    try {
        const response = await api.get('/api/dados-pessoais/'); // Ajuste o endpoint para sua API
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Função para atualizar os dados do cliente
export const updateCliente = async (dados) => {
    try {
        const response = await api.put('/cliente/', dados); // Endpoint para atualização
        return response.data; // Dados atualizados retornados pela API
    } catch (error) {
        throw error;
    }
};
