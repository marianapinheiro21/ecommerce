import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation} from 'react-router-dom';
import Header from './components/Header/Header'; // Ensure you have this component
import HomePage from './components/HomePage/HomePage'; // Create or adjust this component as necessary
import LoginClienteForm from './components/Login/Cliente/LoginClienteForm';
import LoginLojistaForm from './components/Login/Lojista/LoginLojistaForm';
import ClienteRegistrationForm from './components/CreateAccount/Cliente/ClienteRegistrationForm';
import LojistaRegistrationForm from './components/CreateAccount/Lojista/LojistaRegistrationForm';
import TodosProdutos from './components/PaginasProdutos/TodosProdutos';
import ProdutosComputadorFixo from './components/PaginasProdutos/ProdutosComputadorFixo';
import ProdutosAcessorios from './components/PaginasProdutos/ProdutosAcessorios';
import ProdutosComputadorPortatil from './components/PaginasProdutos/ProdutosComputadorPortatil';
import ProdutosPeriferico from './components/PaginasProdutos/ProdutosPeriferico';
import DashboardLojista from './components/DashboardLojista/DashboardLojista';
import ErrorBoundary from './ErrorBoundary'; 
import Dashboard from './components/Dashboard/Dashboard'; // Adicione o componente Dashboard
import ProdutoDetalhe from './pages/ProdutoDetalhe';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './App.css';



function App() {
  
  useEffect(() => {
    // Clear the accessToken on initial app load
    localStorage.removeItem('accessToken');
  }, []);


  return (
    <div>
      <AuthProvider>
        {/**/}<Header /> 
        <ErrorBoundary>
          <Routes>

            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginClienteForm />} />
            <Route path="/register" element={<ClienteRegistrationForm />} />
            <Route path="/login/lojista" element={<LoginLojistaForm />} />
            <Route path="/register/lojista" element={<LojistaRegistrationForm />} />
            <Route path="/produto/:id" element={<ProdutoDetalhe />} />
            <Route path="/produtos" element={<TodosProdutos />} />
            <Route path="/produtos/acessorios" element={<ProdutosAcessorios />} />
            <Route path="/produtos/computadoresfixos" element={<ProdutosComputadorFixo />} />
            <Route path="/produtos/portateis" element={<ProdutosComputadorPortatil />} />
            <Route path="/produtos/perifericos" element={<ProdutosPeriferico />} />
            {/* Rota privada para o Dashboard do Cliente */}
            <Route path="/dashboard" element={<PrivateRoute allowedRoles={['cliente']}><Dashboard /></PrivateRoute>}  />
            <Route path="/dashboard/lojista" element={<PrivateRoute allowedRoles={['lojista']}><DashboardLojista /></PrivateRoute>} />
          </Routes>
        </ErrorBoundary> 
      </AuthProvider>
    </div>
  );
}

export default App;
