import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation} from 'react-router-dom';
import Header from './components/Header'; // Ensure you have this component
import HomePage from './components/HomePage'; // Create or adjust this component as necessary
import LoginForm from './components/LoginForm'; // Adjust path as necessary

//import Dashboard from './components/Dashboard'; // Adjust path as necessary

import './App.css';

const PrivateRoute = ({ children }) => {
  const location = useLocation(); // Get the current location to pass to Navigate for redirecting back after login
  const accessToken = localStorage.getItem('accessToken'); // Check if the user is authenticated

  return accessToken ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

function App() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/produtos/')
        const data =await response.json();
        setProdutos(data);
      } catch(error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
             {/*<Route path="/create-account" element={<CreateAccountForm />} />
            Add more routes as needed */}
          </Routes>
          {/*<h1> Produtos Disponíveis </h1>
          <ul>
            {produtos.map(produto => (
              <li key={produto.id}>
                <h2>{produto.name}</h2>
                <p>{produto.descricao}</p>
                <p>Preco: {produto.preco}€</p>
                <p>Stock: {produto.stock}</p>
                {produto.imagens.length > 0 && (
                  <div>
                    {produto.imagens.map((img, index) => (
                      <img key={index} src={img.imagem} alt={produto.nome} style={{ width: '100px', height: '100px'}}></img>
                      
                    ))}
                  </div>
                )}
                </li>
            ))}
          </ul> */}
      </div>
    </Router>
  );
}

export default App;
