import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCliente } from '../../../services/Api'; // Import the API function
import { useAuth } from '../../../context/AuthContext';
import './LoginClienteForm.css';


const LoginClienteForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate(); 
    const { login } = useAuth();


    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const data = await loginCliente(credentials);

            console.log(data);  // To check the entire response object
            console.log(data.access_token);  // To ensure access token exists
            console.log(data.message);  // To check the message content

            if (data.access_token && data.message === "Cliente login successful"){
                //localStorage.setItem('accessToken', data.access_token)
                console.log('Login Successful', data);
                login(data.access_token, 'cliente');
                navigate('/dashboard');
                //login(data.access_token);
            }
            else{
                setError(data.message || 'Failed to Login. Please try again')
            }

        } catch (error) {
            if(error.response && error.response.data){
                setError(error.response.data.message)
            } else{
                setError('Failed to Login. Please try again later')
            }
        }
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setCredentials(prev => ({ ...prev, [name]:value}))
    };

    const handleCreateAccount = () =>{
        navigate('/register');
    }

    const handleLojista = () =>{
        navigate('/lojista/login');
    }
    return (
        <div className="login-container">
            
            <form className="login-form" onSubmit={handleLogin}>
            <h1>Bem-Vind@, Cliente</h1>       
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        id="email"
                        name='email'
                        value={credentials.email}
                        onChange={handleChange}
                    />
                
                <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}

                <button onClick={handleCreateAccount}>Create Account</button> 
                <button onClick={handleLojista}>És um Lojista?</button> 
            </form>

            
        </div>
    );
};

export default LoginClienteForm;