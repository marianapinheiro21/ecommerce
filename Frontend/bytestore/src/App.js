import React, { useEffect, useState } from 'react';
import './App.css';

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
    <div className="App">
      <header className="App-header">
        <h1> Produtos Disponíveis </h1>
        <ul>
          {produtos.map(produto => (
            <li key={produto.id}>
              <h2>{produto.name}</h2>
              <p>{produto.descricao}</p>
              <p>Preco: ${produto.preco}</p>
              <p>Stock: ${produto.stock}</p>
              {produto.imagens.length > 0 && (
                <div>
                  {produto.imagens.map((img, index) => (
                    <img key={index} src={img.imagem} alt={produto.nome} style={{ width: '100px', height: '100px'}}></img>
                    
                  ))}
                </div>
              )}
              </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
