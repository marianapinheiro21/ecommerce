// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('accessToken'));
    const [userType, setUserType] = useState(localStorage.getItem('userType'));

   /* useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decoded = jwtDecode(token);
            setAuth({ user: decoded.sub, role: decoded.role });
        }
    }, []);*/

    const login = (token, userType) => {
        setAuthToken(token);
        localStorage.setItem('accessToken', token);
        setUserType(userType);
        localStorage.setItem('userType', userType);
        
    };

    /*const login = async (token) => {
        setAuthToken(token);
        localStorage.setItem('accessToken', token);

        const decoded = jwtDecode(token);
        try {
            // Assuming you have an endpoint to fetch user details by user ID
            const response = await axios.get(`/api/user/${decoded.sub}/type`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userType = response.data.isCliente ? 'cliente' : 'utilizador';
            setUserType(userType);
            localStorage.setItem('userType', userType);
        } catch (error) {
            console.error('Error fetching user type:', error);
        }
    };*/

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userType');
        setAuthToken(null);
        setUserType(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, userType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

