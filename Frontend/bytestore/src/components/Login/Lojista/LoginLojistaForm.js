import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginLojista } from '../../../services/Api';
import { useAuth } from '../../../context/AuthContext';
import './LoginLojistaForm.css';


const LoginLojistaForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate(); 
    const { login, authToken, userType } = useAuth();

    useEffect(() => {
        if (authToken && userType === 'lojista') {
          navigate('/lojista/dashboard');
        }
      }, [authToken, userType, navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const data = await loginLojista(credentials);

            console.log(data);  // To check the entire response object
            console.log(data.access_token);  // To ensure access token exists
            console.log(data.message);  // To check the message content

            if (data.access_token && data.message === "Lojista login successful"){
                //localStorage.setItem('acessToken', data.access_token)
                console.log('Login Successful', data);
                login(data.access_token, 'lojista');
                //navigate('/lojista/dashboard');
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
        navigate('/lojista/register');
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
            <h1> Bem-Vindo!</h1>       
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
            </form>

            
        </div>
    );
};

export default LoginLojistaForm;