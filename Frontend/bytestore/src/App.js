import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation} from 'react-router-dom';
import Header from './components/Header'; // Ensure you have this component
import HomePage from './components/HomePage'; // Create or adjust this component as necessary
import LoginForm from './components/LoginForm'; // Adjust path as necessary

import Dashboard from './components/Dashboard/Dashboard'; // Adicione o componente Dashboard
import ProdutoDetalhe from './pages/ProdutoDetalhe';

//import Dashboard from './components/Dashboard'; // Adjust path as necessary

import './App.css';

//const PrivateRoute = ({ children }) => {
 // const location = useLocation(); // Get the current location to pass to Navigate for redirecting back after login
  //const accessToken = localStorage.getItem('accessToken'); // Check if the user is authenticated

 // return accessToken ? children : <Navigate to="/login" state={{ from: location }} replace />;
//};


const PrivateRoute = ({ children }) => {
  const location = useLocation(); // Obter a localização atual
  const accessToken = localStorage.getItem('accessToken'); // Verificar se o token de acesso está presente

  // Se o usuário não estiver autenticado, redireciona para /login com o estado da localização atual
  return accessToken ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

function App() {
  
  useEffect(() => {
    // Clear the accessToken on initial app load
    localStorage.removeItem('accessToken');
  }, []);


  return (
    <Router>
      <div>
        <Header />
        <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/produto/:id" element={<ProdutoDetalhe />} />

          {/* Rota privada para o Dashboard do Cliente */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

            {/* Add more routes as needed */}

             {/*<Route path="/create-account" element={<CreateAccountForm />} />
            Add more routes as needed */}

          </Routes>
      </div>
    </Router>
  );
}

export default App;
