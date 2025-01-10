import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCliente } from '../../../services/Api';
const ClienteRegistrationForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        nome: '',
        password: '', 
        nif: '',
        ntelefone: '',
        morada: ''
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await registerCliente(formData);
            console.log('Registration successful', data);
            navigate('/login'); // Redirect to login after registration
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Nome: </label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
            
            <label>Email: </label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            
            <label>Password: </label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />

            <label>Nif: </label>
            <input type="number" name="nif" value={formData.nif} onChange={handleChange} />

            <label>Número de Telefone: </label>
            <input type="number" name="ntelefone" value={formData.ntelefone} onChange={handleChange} />

            <label>Morada: </label>
            <input type="text" name="morada" value={formData.morada} onChange={handleChange} />
            
            <button type="submit">Register</button>
        </form>
    );
};

export default ClienteRegistrationForm;
