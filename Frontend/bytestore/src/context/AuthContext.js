// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('accessToken'));
    const [userType, setUserType] = useState(localStorage.getItem('userType'));


    const login = (token, userType) => {
        setAuthToken(token);
        localStorage.setItem('accessToken', token);
        setUserType(userType);
        localStorage.setItem('userType', userType);
        
    };


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

