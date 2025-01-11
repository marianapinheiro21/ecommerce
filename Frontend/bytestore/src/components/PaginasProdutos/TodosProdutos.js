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

  // Função para alternar o estado de favorito
  const favoritarProduto = (produtoId) => {
    setFavoritos((prevFavoritos) => {
      if (prevFavoritos.includes(produtoId)) {
        // Remove dos favoritos
        return prevFavoritos.filter(id => id !== produtoId);
      } else {
        // Adiciona aos favoritos
        return [...prevFavoritos, produtoId];
      }
    });
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
              <button className="add-to-cart-btn">Adicionar ao carrinho</button>
              <span className={`favorite-icon ${favoritos.includes(produto.id) ? 'favorito' : ''}`} onClick={() => favoritarProduto(produto.id)}>
                ★
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodosProdutos;
