import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DadosPessoais from './DadosPessoais'; 
import HistoricoCompras from './HistoricoCompras';
import ProdutosFavoritos from './ProdutosFavoritos';
import axios from 'axios';
import './Dashboard.css';
import CircleComponents from '../CircleComponents/CircleComponents';

function Dashboard() {
    const [error, setError] = useState('');  // Declarando o state para o erro
    const navigate = useNavigate(); // Usando useNavigate

    // Efeito para garantir que o usuário esteja autenticado
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            // Redireciona para login se não estiver autenticado
            navigate('/login'); // Substituindo history.push por navigate
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

    return (
        <div class="div-container">
        <CircleComponents />
            <h1>Bem-vindo de Volta!</h1>
            <h2>Dashboard do Cliente</h2>
            {/* Seção de dados pessoais */}
            <section class="dados-pessoais">
                <h2>Dados Pessoais</h2>
                <DadosPessoais />
            </section>

            {/* Seção de produtos favoritos */}
            <section class="produtos-favoritos">
                <ProdutosFavoritos />
            </section>

            <section>
                <button class="btn btn-primary" onClick={goToProducts}>
                    Fazer Compras
                </button>
            
            </section>


            {/* Logout */}
            <section >
                <button class="button-logout" onClick={handleLogout}>Logout</button>
            </section>
        </div>
    );
}

export default Dashboard;
