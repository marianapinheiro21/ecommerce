import React from 'react';
import Footer from '../Footer/Footer';
import Carrossel from './Carrossel/Carrossel';


import TodosProdutos from '../PaginasProdutos/TodosProdutos'; 
import CircleComponents from '../CircleComponents/CircleComponents';



import Header from '../Header/Header';


const HomePage = () => {
  return (
    <div>
      <Carrossel />
      <TodosProdutos />
      {/* Additional homepage content */}
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
  );
};

export default HomePage;
