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
        imagens: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleFileChange = (e) => {
        console.log("files selected: ", e.target.files); 
        setFormData({
            ...formData,
            imagens: Array.from(e.target.files)  // Convert FileList to an array
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('nome', formData.nome);
        formDataToSend.append('preco', parseFloat(formData.preco));
        formDataToSend.append('descricao', formData.descricao);
        formDataToSend.append('stock', parseInt(formData.stock));
        formDataToSend.append('categoria', formData.categoria);

        console.log("Uploading files:", formData.imagens);
        formData.imagens.forEach((imagens, index) => {
            console.log(`Adding image ${index+1}: ${imagens.name}`);
            formDataToSend.append(`imagens[${index}]`, imagens);  // Name matches Django expectation
        });

        try {
            const result = await adicionarProdutos(formDataToSend, authToken);
            console.log("Server response: ",result); 
            navigate('/lojista/dashboard');  // Navigate to success page or handle success state
        } catch (error) {
            console.error('Failed to add product:', error);
            // Optionally handle the error in UI
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="add-product-form">
            <h1>Adicione aqui o seu Produto!</h1>
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
                <input type="file" multiple onChange={handleFileChange} accept='image/*' />
                <button type="submit">OK!</button>
            </form>
        </div>
    );
};

export default AdicionarProdutos;