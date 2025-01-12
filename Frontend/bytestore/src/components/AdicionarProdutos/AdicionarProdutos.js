import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, fetchWithAuth } from '../../context/AuthContext';  // Ensure the path is correct
import { adicionarProdutos } from '../../services/Api';
import './AdicionarProdutos.css';

const AdicionarProdutos = () => {
    const { authToken } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        preco: '',
        descricao: '',
        stock: '',
        categoria: '',
        imagens: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleFileChange = (e) => {
        setFormData({...formData, imagens: e.target.files[0]});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await adicionarProdutos(formData, authToken);
            navigate('/lojista/dashboard');  // Navigate to success page or handle success state
        } catch (error) {
            console.error('Failed to add product:', error);
            // Optionally handle the error in UI
        }
    };

    return (
        <div>
            <h1>Adicione aqui o seu Produto!</h1>
            <form onSubmit={handleSubmit} className="add-product-form">
                <input type="text" name="nome" placeholder="Name" value={formData.nome} onChange={handleInputChange} />
                <input type="number" name="preco" placeholder="Price" value={formData.preco} onChange={handleInputChange} />
                <textarea name="descricao" placeholder="Description" value={formData.descricao} onChange={handleInputChange} />
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleInputChange} />
                <select name="categoria" value={formData.categoria} onChange={handleInputChange}>
                    <option value="">Select a category</option>
                    <option value="computador fixo">Computador Fixo</option>
                    <option value="computador portátil">Computador Portátil</option>
                    <option value="periférico">Periférico</option>
                    <option value="acessório">Acessório</option>
                </select>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">OK!</button>
            </form>
        </div>
    );
};

export default AdicionarProdutos;