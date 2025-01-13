import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ('./ProdutosVendidos.css')

const ProdutosVendidos = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSoldProducts = async () => {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/lojista/produtos-sold/', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setProducts(response.data);
            } catch (err) {
                setError('An error occurred while fetching the sold products.');
                console.error(err);
            }
            setLoading(false);
        };

        fetchSoldProducts();
    }, []);

    const navigateToProduct = (productId) => {
        navigate(`/produto/${productId}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="product-list">
            {products.map(product => (
                <div key={product.produto_id} className="product-card">
                    <h3 onClick={() => navigateToProduct(product.produto_id)} style={{ cursor: 'pointer' }}>
                        {product.produto__nome}
                    </h3>
                    <div className="product-image">
                        <img src={product.produto__imagem || 'path/to/default/image.jpg'} alt={product.produto__nome} />
                    </div>
                    <p>Preço: €{product.produto__preco.toFixed(2)}</p>
                    <p>Quantidade Vendida: {product.total_quantity}</p>
                </div>
            ))}
        </div>
    );
};

export default ProdutosVendidos;