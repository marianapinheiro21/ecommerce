import React, { useEffect, useState } from 'react';
import { listarFavoritos } from '../../services/Api'; // Certifique-se de importar corretamente
import axios from 'axios';

const ProdutosFavoritos = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Função para buscar favoritos
        const fetchFavoritos = async () => {
            try {
                const data = await listarFavoritos(); // Chama a função da API
                console.log('Favoritos recebidos:', data); // Imprima para verificar os dados
                if (Array.isArray(data.favoritos)) {  // Verifique se 'favoritos' é um array
                    setFavoritos(data.favoritos); // Armazene os favoritos no estado
                } else {
                    setError('Dados de favoritos inválidos');
                }
            } catch (err) {
                setError('Erro ao buscar os favoritos');
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritos();
    }, []);


    const removerFavorito = async (produtoId) => {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            setError('Você precisa estar logado para remover um favorito');
            return;
        }
        
        try {
            // Verifique se o produtoId está sendo passado corretamente
            console.log('Produto ID enviado:', produtoId);
    
            // Enviar a requisição DELETE com o produto_id no corpo
            const response = await axios.delete('/api/remover/favorito/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: { produto_id: produtoId } // Enviar produto_id no corpo da requisição
            });
    
            setFavoritos(favoritos.filter(produto => produto.id !== produtoId));
            console.log('Produto removido com sucesso:', response.data);
        } catch (err) {
            console.error('Erro ao remover favorito:', err);
    
            if (err.response) {
                console.log('Erro detalhes:', err.response.data);
                setError(`Erro: ${err.response.data.error || err.response.data.detail}`);
            } else {
                setError('Erro desconhecido ao remover favorito');
            }
        }
    };
    
 
    
    // Verifique se está carregando ou se houve erro
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
