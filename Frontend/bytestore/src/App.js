import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation} from 'react-router-dom';
import Header from './components/Header/Header'; // Ensure you have this component
import HomePage from './components/HomePage/HomePage'; // Create or adjust this component as necessary
import LoginForm from './components/Login/Cliente/LoginForm'; // Adjust path as necessary
import TodosProdutos from './components/PaginasProdutos/TodosProdutos';
import ProdutosComputadorFixo from './components/PaginasProdutos/ProdutosComputadorFixo';
import ProdutosAcessorios from './components/PaginasProdutos/ProdutosAcessorios';
import ProdutosComputadorPortatil from './components/PaginasProdutos/ProdutosComputadorPortatil';
import ProdutosPeriferico from './components/PaginasProdutos/ProdutosPeriferico';

import ErrorBoundary from './ErrorBoundary'; 
import Dashboard from './components/Dashboard/Dashboard'; // Adicione o componente Dashboard
import ProdutoDetalhe from './pages/ProdutoDetalhe';

import PrivateRoute from './components/PrivateRoute';
import './App.css';


function App() {
  
  useEffect(() => {
    // Clear the accessToken on initial app load
    localStorage.removeItem('accessToken');
  }, []);


  return (
    <div>
      <Header />
      <ErrorBoundary>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/produto/:id" element={<ProdutoDetalhe />} />
          <Route path="/produtos" element={<TodosProdutos />} />
          <Route path="/produtos/acessorios" element={<ProdutosAcessorios />} />
          <Route path="/produtos/computadoresfixos" element={<ProdutosComputadorFixo />} />
          <Route path="/produtos/portateis" element={<ProdutosComputadorPortatil />} />
          <Route path="/produtos/perifericos" element={<ProdutosPeriferico />} />


          {/* Rota privada para o Dashboard do Cliente */}
          <Route path="/dashboard" element={<PrivateRoute allowedRoles={['cliente']}><Dashboard /></PrivateRoute>}  />
          {/* Add more routes as needed */}
          {/*<Route path="/create-account" element={<CreateAccountForm />} />
          Add more routes as needed */}
        </Routes>
      </ErrorBoundary> 
    </div>
  );
}

export default App;
