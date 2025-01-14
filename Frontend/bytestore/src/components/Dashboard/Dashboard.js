import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DadosPessoais from './DadosPessoais'; 
import ProdutosFavoritos from './ProdutosFavoritos';
import axios from 'axios';
import './Dashboard.css';
import CircleComponents from '../CircleComponents/CircleComponents';

function Dashboard() {
    const [error, setError] = useState('');  
    const navigate = useNavigate(); 
    const [cliente, setCliente] = useState(null);
    const [mostrarDadosPessoais, setMostrarDadosPessoais] = useState(false); 


    // Efeito para garantir que o usuário esteja autenticado
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login'); 
        } else {
            // Se houver access token, buscamos os dados do cliente
            axios.get('api/cliente/dados/', { 
                headers: { 'Authorization': `Bearer ${accessToken}` } 
            })
            .then(response => {
                setCliente(response.data);  // Armazena os dados do cliente no estado
            })
            .catch(error => {
                console.error('Erro ao buscar dados do cliente:', error);
                setError('Erro ao carregar os dados do cliente');
            });
        }
    }, [navigate]);

    function goToProducts() {
        navigate("/produtos");
      }


    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken'); // Pegue o refresh token armazenado
        const accessToken = localStorage.getItem('accessToken'); // Pegue o access token armazenado
        if (!refreshToken) {
            console.error('Refresh token não encontrado');
            return;
        }
    
        try {
            // Envia o refresh token no corpo da requisição POST
            const response = await axios.post('/api/logout/', 
                { refresh: refreshToken }, // Aqui enviamos o refresh token no corpo
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}` // Usando o access token para autorização
                    }
                }
            );
    
            // Se o logout for bem-sucedido, remova ambos os tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
    
            // Redireciona o usuário para a página de login
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error.response ? error.response.data : error.message);
            setError('Erro ao fazer logout');
        }

    };

    const toggleDadosPessoais = () => {
        setMostrarDadosPessoais(!mostrarDadosPessoais); // Alterna a visibilidade dos dados pessoais
    };
      

    return (
        <div class="div-container">
        <CircleComponents />
            <h1>Bem-vindo de Volta, {cliente ? cliente.nome : 'Carregando...'}!</h1> {/* Exibe o nome do cliente ou 'Carregando...' */}

            <section>
                <button class="fazer-compras" onClick={goToProducts}>
                    Clique aqui para comprar os seus produtos!
                </button>
            </section>

            
            <section className="dados-pessoais">
                <button onClick={toggleDadosPessoais}>
                    {mostrarDadosPessoais ? 'Ocultar seus dados pessoais' : 'Dados Pessoais'}
                </button>

                {/* Exibe os dados pessoais se o estado `mostrarDadosPessoais` for true */}
                {mostrarDadosPessoais && <DadosPessoais />}
            </section>

            <section class="produtos-favoritos">
                <ProdutosFavoritos />
            </section>

            <section >
                <button class="button-logout" onClick={handleLogout}>Logout</button>
            </section>
        </div>
    );
}

export default Dashboard;
