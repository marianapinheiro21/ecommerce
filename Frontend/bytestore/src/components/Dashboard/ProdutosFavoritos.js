import React, { useEffect, useState } from 'react';
import { listarFavoritos } from '../../services/Api'; // Certifique-se de importar corretamente

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
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProdutosFavoritos;
