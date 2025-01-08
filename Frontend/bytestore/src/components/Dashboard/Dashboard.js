import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DadosPessoais from './DadosPessoais'; 
import HistoricoCompras from './HistoricoCompras';
import ProdutosFavoritos from './ProdutosFavoritos';

function Dashboard() {
    const navigate = useNavigate(); // Usando useNavigate

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            // Redireciona para login se não estiver autenticado
            navigate('/login'); // Substituindo history.push por navigate
        }
    }, [navigate]);

    return (
        <div>
            <h1>Dashboard do Cliente</h1>
            {/* Seção de dados pessoais */}
            <section>
                <h2>Dados Pessoais</h2>
                <DadosPessoais />
            </section>

            {/* Seção de histórico de compras */}
            <section>
                <h2>Histórico de Compras</h2>
                <HistoricoCompras />
            </section>

            {/* Seção de produtos favoritos */}
            <section>
                <h2>Produtos Favoritos</h2>
                <ProdutosFavoritos />
            </section>
        </div>
    );
}

export default Dashboard;
