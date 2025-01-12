import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { BrowserRouter as Router } from "react-router-dom";
import './TodosProdutos.css';

function TodosProdutos() {
  const [produtos, setProdutos] = useState([]); // Estado para produtos
  const [favoritos, setFavoritos] = useState([]); // Estado para favoritos

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/produtos/lista');
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData(); // Chama a função para buscar os dados
  }, []); // Array de dependência vazio, executa o efeito apenas uma vez

  // Função para adicionar produto ao carrinho 
  const adicionarAoCarrinho = async (produtoId) => {
    try {
      // Requisição POST para adicionar o produto ao carrinho
      const response = await fetch('http://localhost:8000/api/add-to-carrinho/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Token de autenticação
        },
        body: JSON.stringify({ produto_id: produtoId }) // Envia o ID do produto
      });

      if (response.ok) {
        const result = await response.json();
        alert('Produto adicionado ao carrinho com sucesso!');
      } else {
        const error = await response.json();
        alert('Erro ao adicionar o produto ao carrinho: ' + error.error);
      }
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
    }
  };

  const favoritarProduto = async (produtoId) => {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token); // Verifica se o token está sendo obtido corretamente
  
    try {
      const response = await fetch('http://localhost:8000/api/adicionar_favorito/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Enviar o token de autenticação
        },
        body: JSON.stringify({ produto_id: produtoId })
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Produto favoritado com sucesso!');
        // Atualize o estado dos favoritos
        setFavoritos(prev => [...prev, produtoId]);
      } else {
        const error = await response.json();
        alert('Erro ao favoritar o produto: ' + (error.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao favoritar produto:', error);
    }
  };


  return (
    <div className="todosProdutos-container">
      <h1> Produtos Disponíveis </h1>
      <ul className="todos-produtos-ul">
        {produtos.map(produto => (
          <li className="todos-produtos-li" key={produto.id}>
            <h2>{produto.name}</h2>
            <p>{produto.descricao}</p>
            <p>Preço: {produto.preco}€</p>
            <p>Stock: {produto.stock}</p>
            {produto.imagens.length > 0 && (
              <div>
                {produto.imagens.map((img, index) => (
                  <img key={index} src={img.imagem} alt={produto.nome} style={{ width: '100px', height: '100px' }} />
                ))}
              </div>
            )}
            <div className="produto-actions">
              <button 
                className="add-to-cart-btn"
                onClick={() => adicionarAoCarrinho(produto.id)} // Chama a função para adicionar ao carrinho
              >
                Adicionar ao carrinho
              </button>
              <button 
                className={`favoritar-icon ${favoritos.includes(produto.id) ? 'favorito' : ''}`}
                onClick={() => favoritarProduto(produto.id)}
              >
                ★
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodosProdutos;
