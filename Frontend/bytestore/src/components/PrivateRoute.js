// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { authToken, userType } = useAuth();
    const location = useLocation();
    
    console.log("Auth Token:", authToken); // Check the value of authToken
    console.log("User Type:", userType); // Check the value of userType
    console.log("Allowed Roles:", allowedRoles); // Check the value of allowedRoles
    
     
    if (!authToken || !allowedRoles.includes(userType)) {
        const redirectTo = authToken ? '/unauthorized' : '/login';
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
    return children;
};

export default PrivateRoute;
