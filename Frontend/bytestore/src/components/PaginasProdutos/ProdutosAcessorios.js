import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { BrowserRouter as Router } from "react-router-dom";

function ProdutosAcessorios(){
    
    const [produtos, setProdutos] = useState([]); // Initializing state to hold products

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:8000/api/produtos/categoria/acess%C3%B3rio')
            const data =await response.json();
            setProdutos(data);
          } catch(error) {
            console.error('Error fetching data: ', error);
          }
        };
        fetchData(); // Call the function to fetch data
    }, []); // Dependency array is empty, effect runs only once
    
    return(
        <div>
            <h1> Produtos Disponíveis </h1>
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
            </ul>
        </div>
    )
}
export default ProdutosAcessorios;