import React, { useState } from 'react';
import { loginCliente } from '../services/Api'; // Import the API function

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const data = await loginCliente(credentials);
            localStorage.setItem('accessToken', data.access_token);
            window.location = '/dashboard';
        } catch (error) {
            setError('Failed to login.')
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <label htmlFor="email">Email: </label>
            <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
            <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
            <button type="submit">Login</button>
            {error && <p></p>}
        </form>
    );
};

export default LoginForm;