import React, { useEffect, useState } from 'react';
import { listarFavoritos } from '../../services/Api';
import axios from 'axios';

const ProdutosFavoritos = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   
    const fetchFavoritos = async () => {
        try {
            const data = await listarFavoritos(); 
            console.log('Favoritos recebidos:', data); 
            if (Array.isArray(data.favoritos)) { 
                setFavoritos(data.favoritos); 
            } else {
                setError('Dados de favoritos inválidos');
            }
        } catch (err) {
            setError('Erro ao buscar os favoritos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavoritos();
    }, []);

    const removerFavorito = async (produtoId) => {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            setError('Você precisa estar logado para remover um favorito');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8000/api/remover/favorito/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  
                },
                body: JSON.stringify({
                    produto_id: produtoId  
                })
            });
    
            if (response.ok) {
                const result = await response.json();
            
                fetchFavoritos();
                alert('Produto removido com sucesso:');
            } else {
                const error = await response.json();
                alert('Erro ao remover favorito:' + error.error);
            }
        } catch (error) {
            console.error('Erro ao remover ', error);
        }
    };
    
    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h3>Produtos Favoritos</h3>
            <ul>
                {favoritos.map((produto, index) => (
                    <li key={index}>
                        <strong>{produto.Produto}</strong>
                        <p>{produto.Descricao}</p>
                        <p>{produto.Preço}</p>
                        <p>{produto.categoria}</p>
                        <button onClick={() => removerFavorito(produto.id)}>Remover Favorito</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProdutosFavoritos;