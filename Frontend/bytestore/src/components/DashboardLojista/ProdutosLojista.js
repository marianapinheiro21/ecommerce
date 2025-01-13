import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProdutosLojista = () => {
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                navigate('/lojista/login');
                return;
            }
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/lojista/produtos/', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setProducts(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate('/lojista/login');
                } else {
                    setError('An error occurred while fetching the products.');
                    console.error(err);
                }
            }
            setLoading(false);
        };

        fetchProducts();
    }, [navigate]);

    const handleEdit = (produto) => {
        setEditProductId(produto.id);
        setEditData(produto);
    };

    const handleSave = async () => {
        const accessToken = localStorage.getItem('accessToken');
        try {
            await axios.put(`http://127.0.0.1:8000/api/produtos/update/${editProductId}/`, editData, {
                headers: { Authorization: `Bearer ${accessToken}`,
                           'Content-Type': 'application/json' }
            });
            const updatedProducts = products.map(prod => prod.id === editProductId ? { ...prod, ...editData } : prod);
            setProducts(updatedProducts);
            setEditProductId(null);
        } catch (err) {
            setError('Failed to save the produto.');
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="produto-list">
            {products.map(produto => (
                <div key={produto.id} className="produto-card">
                    {editProductId === produto.id ? (
                        <div>
                            <input type="text" value={editData.nome} name="nome" onChange={handleChange} />
                            <input type="text" value={editData.descricao} name="descricao" onChange={handleChange} />
                            <input type="number" value={editData.preco} name="preco" onChange={handleChange} />
                            <input type="number" value={editData.stock} name="stock" onChange={handleChange} />
                            <button onClick={handleSave}>Save</button>
                        </div>
                    ) : (
                        <>
                            <h3>{produto.nome}</h3>
                            <div className="product-image">
                                {produto.imagens.length > 0 ? (
                                      <img src={produto.imagens[0].imagem} alt={produto.nome} />
                                    ) : (
                                      <span className="no-image">No image available</span>
                                    )}
                            </div>        
                            <p>Preço: {produto.preco}€</p>
                            <p>Stock: {produto.stock}</p>
                            <p>Descrição: {produto.descricao}</p>
                            <p>Categoria: {produto.categoria}</p>
                            <button onClick={() => handleEdit(produto)}>Edit this produto</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProdutosLojista;
