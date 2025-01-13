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
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response=await axios.post(`${API_URL}/cliente/login/`, JSON.stringify(credentials), config);
        console.log('Server response:', response.data);
        //const { access_token, refresh_token } = response.data;
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        return response.data; // Returns the data part of the response from server
    } catch (error) {
        console.error('Login error:', error.response);
        throw error.response.data;
    }
};

export const registerCliente = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/cliente/registo/`, credentials);
        return response.data;
    } catch (error) {
        console.error('Error registering cliente:', error);
        throw error;
    }
};

export const registerLojista = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/lojista/registo/`, credentials);
        return response.data;
    } catch (error) {
        console.error('Error registering lojista:', error);
        throw error;
    }
};


export const loginLojista = async (credentials) => {
    console.log('Credentials being sent:', credentials);

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response=await axios.post(`${API_URL}/lojista/login/`, JSON.stringify(credentials), config);
        //const { access_token, refresh_token } = response.data;
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        return response.data; // Returns the data part of the response from server
    } catch (error) {
        console.error('Login error:', error.response);
        throw error.response.data;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token; // Retorna true se existir token, false caso contrário
};

export const logoutUser = async () => {
    try {
        const token = getAccessToken();
        const refreshToken = localStorage.getItem('refreshToken'); 
        await apiInstance.post('/logout/', {refresh: refreshToken}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location = '/';  // Redirect to login page
    }
};


export const adicionarProdutos = async (formData, token) => {
    const url = `${API_URL}/produtos/create/`;
    /*const formData = new FormData();

    formData.append('nome', productData.nome);
    formData.append('preco', productData.preco);
    formData.append('descricao', productData.descricao);
    formData.append('stock', productData.stock);
    formData.append('categoria', productData.categoria);

    if (productData.imagens && productData.imagens.length > 0) {
        productData.imagens.forEach(file => {
            formData.append('imagens', file);
        });
    } else {
        console.error('No images to upload');
    } */

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` 
            },
            body: formData
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || "Failed to add product.");
        }

        return await response.json();
    } catch (error) {
        console.error("API error:", error.message);
        throw error;
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
    console.log(localStorage.getItem('accessToken')); 
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

// Verificar se um produto está nos favoritos
export const verificarFavorito = async (produtoId) => {
    try {
        const favoritos = await listarFavoritos();
        return favoritos.favoritos.some(fav => fav.Produto.id === produtoId);
    } catch (error) {
        console.error('Erro ao verificar favorito:', error);
        return false;
    }
};

// Adicionar aos favoritos
export const adicionarFavorito = async (produtoId) => {
    try {
        const response = await apiInstance.post('/api/adicionar_favorito/', {
            produto_id: produtoId
        });
        window.dispatchEvent(new Event('favoritesUpdated'));
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        throw error;
    }
};

// Remover dos favoritos
export const removerFavorito = async (produtoId) => {
    try {
        const response = await apiInstance.delete('/api/remover/favorito/', {
            data: { produto_id: produtoId }
        });
        window.dispatchEvent(new Event('favoritesUpdated'));
        return response.data;
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        throw error;
    }
};

// Função para buscar os dados pessoais
export const getDadosPessoais = async () => {
    try {
        const response = await apiInstance.get('/api/dados-pessoais/'); // Ajuste o endpoint para sua API
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Função para atualizar os dados do cliente
export const updateCliente = async (dados) => {
    try {
        const response = await apiInstance.put('/cliente/', dados); // Endpoint para atualização
        return response.data; // Dados atualizados retornados pela API
    } catch (error) {
        throw error;
    }
};

//Procurar produtos
export const buscarProdutos = async (searchTerm) => {
    try {
        const response = await apiInstance.get(`/buscar/produto/?q=${searchTerm}`);
        return response.data;
    } catch (error) {
        console.error('Erro na busca:', error);
        throw error;
    }
};

apiInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

export const getCartCount = async () => {
    try {
        const response = await apiInstance.get('/cart/count/');
        console.log('Cart count response:', response.data);
        return response.data.count || 0;
    } catch (error) {
        console.error('Error fetching cart count:', error);
        return 0;
    }
};

export const getFavoritesCount = async () => {
    try {
        const response = await apiInstance.get('/favorites/count/');
        console.log('Favorites count response:', response.data);
        return response.data.count || 0;
    } catch (error) {
        console.error('Error fetching favorites count:', error);
        return 0;
    }
};
export const searchProducts = async (query) => {
    try {
        const response = await apiInstance.get(`/produtos/search/?q=${query}`);
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
};