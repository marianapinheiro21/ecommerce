import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerLojista } from '../../../services/Api';
import './LojistaRegistrationForm.css';


const LojistaRegistrationForm = () => {
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
            const data = await registerLojista(formData);
            console.log('Registration successful', data);
            navigate('/login/lojista'); // Redirect to login after registration
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <div className="registration-form-container">
            <h1>Crie a sua conta de Lojista na ByteStore!</h1>
            <form className="registration-form" onSubmit={handleSubmit}>
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
        </div>
    );
};

export default LojistaRegistrationForm;
