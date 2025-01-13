import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import './ProdutosCarrinho.css';

const ProdutosCarrinho = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [precoTotal, setPrecoTotal] = useState([]); 

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/carrinho', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Token de autenticação
        }
    });
      const data = await response.json();

      const produtos = data.map((carrinhoProdutos) => {
        return {...carrinhoProdutos.produto}
      })

      setProdutos(produtos);

      let precoTotalDosProdutos = 0

      produtos.forEach((produto) => {
        precoTotalDosProdutos += Number(produto.preco)
      })

      console.log(produtos);
      console.log("precoTotalDosProdutos: ", precoTotalDosProdutos);

      setPrecoTotal(precoTotalDosProdutos)
      
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);
  
  
  const removerDoCarrinho = async (produtoId) => {
    try {
      const response = await fetch('http://localhost:8000/api/remove-to-cart/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Token de autenticação
        },
        body: JSON.stringify({
          produto_id: produtoId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        fetchData(); 
        alert('Produto removido do carrinho com sucesso!');
      } else {
        const error = await response.json();
        alert('Erro ao remover o produto do carrinho: ' + error.error);
      }
    } catch (error) {
      console.error('Erro ao remover produto do carrinho:', error);
    }
    
}
const handleCheckout = () => {
      navigate('/checkout');
    };

  //Ser feliz

  return (
    
    <div className="todosProdutos-container">
    <ul className="todos-produtos-ul">
      {produtos.map(produto => (
        <li className="todos-produtos-li" key={produto.id}>
          <h2>{produto.nome}</h2>
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

          <button 
            className=""
            onClick={() => removerDoCarrinho(produto.id)} 
          >Remover produto</button>
        </li>
      ))}
    </ul>

    <h1>Preco Total: {precoTotal}</h1>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
      <button onClick={handleCheckout} style={{ padding: '10px 20px', fontSize: '16px' }}>Finalizar Compra</button>
    </div>
    
  </div>

  );
};

export default ProdutosCarrinho;
