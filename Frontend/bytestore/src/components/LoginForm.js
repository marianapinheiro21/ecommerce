import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCliente, createCliente } from '../services/Api'; // Import the API function
import './LoginForm.css';


const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Usando o hook useNavigate
    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const data = await loginCliente(credentials);

            if (data.access_token){
                localStorage.setItem('acessToken', data.access_token)
                console.log('Login Successful', data);
                window.location.href='/dashboard';
            }
            else{
                setError('Failed to Login. Please try again')
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
        navigate('/create-account');
    }

    return (
        <div className="login-form">
            <form onSubmit={handleLogin}>
                   
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
            </form>
            <button onClick={handleCreateAccount}>Create Account</button> 
        </div>
    );
};

export default LoginForm;