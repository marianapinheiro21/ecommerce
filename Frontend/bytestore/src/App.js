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
import AdicionarProdutos from './components/AdicionarProdutos/AdicionarProdutos';
import ProdutosCarrinho from './components/ProdutosCarrinho/ProdutosCarrinho';
import ErrorBoundary from './ErrorBoundary'; 
import Dashboard from './components/Dashboard/Dashboard'; // Adicione o componente Dashboard
import ProdutoDetalhe from './components/ProductDetail/ProductDetail';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LojistaList from './components/Lojista/LojistaList';
import LojistaDetail from './/components/Lojista/LojistaDetail';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer/Footer';
import Checkout from './components/Checkout/Checkout'
import Sucesso from './components/Sucesso/Sucesso';
import Favoritos from './components/Favoritos/Favoritos';






function App() {
  
  useEffect(() => {
    // Clear the accessToken on initial app load
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userType');
  }, []);


  return (
    <div>
      <ErrorBoundary>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginClienteForm />} />
            <Route path="/register" element={<ClienteRegistrationForm />} />
            <Route path="/lojista/login" element={<LoginLojistaForm />} />
            <Route path="/lojista/register" element={<LojistaRegistrationForm />} />
            <Route path="/lojista" element={<LojistaList />} />
            <Route path="/lojista/:id" element={<LojistaDetail />} />
            <Route path="/produto/:id" element={<ProdutoDetalhe />} />
            <Route path="/produtos" element={<TodosProdutos />} />
            <Route path="/produtos/acessorios" element={<ProdutosAcessorios />} />
            <Route path="/produtos/computadoresfixos" element={<ProdutosComputadorFixo />} />
            <Route path="/produtos/portateis" element={<ProdutosComputadorPortatil />} />
            <Route path="/produtos/perifericos" element={<ProdutosPeriferico />} />
            <Route path="/favoritos" element={<Favoritos />} />

            <Route path="/dashboard" element={<PrivateRoute allowedRoles={['cliente']}><Dashboard /></PrivateRoute>}  />
            <Route path="/produtos/carrinho" element={<PrivateRoute allowedRoles={['cliente']}><ProdutosCarrinho /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute allowedRoles={['cliente']}><Checkout /></PrivateRoute>}  />
            <Route path="/sucesso" element={<PrivateRoute allowedRoles={['cliente']}><Sucesso /></PrivateRoute>}  />
            <Route path="/lojista/dashboard" element={<PrivateRoute allowedRoles={['lojista']}><DashboardLojista /></PrivateRoute>} />
            <Route path="lojista/produtos/novo" element={<PrivateRoute allowedRoles={['lojista']}><AdicionarProdutos /></PrivateRoute>} />
            
          </Routes>
          <Footer />
        </AuthProvider>

      </ErrorBoundary> 
    </div>
  );
}

export default App;
