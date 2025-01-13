import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import './TodosProdutos.css';
import Modal from './Modal'
import CircleComponents from "../CircleComponents/CircleComponents";

function ProdutosPeriferico(){
    const [produtos, setProdutos] = useState([]); // Initializing state to hold products
    const [favoritos, setFavoritos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const { authToken, userType, logout } = useAuth();
   
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:8000/api/produtos/categoria/perif%C3%A9rico')
            const data =await response.json();
            setProdutos(data);
          } catch(error) {
            console.error('Error fetching data: ', error);
          }
        };
        fetchData(); // Call the function to fetch data
    }, []); // Dependency array is empty, effect runs only once
    
  
  
  // Função para adicionar produto ao carrinho 
  const adicionarAoCarrinho = async (produtoId) => {
    console.log('Attempting to add to cart:', produtoId)
    console.log('Token:', localStorage.getItem('accessToken'));

    if (authToken && userType === 'cliente') { 
      try {
          // Requisição POST para adicionar o produto ao carrinho
          const response = await fetch('http://localhost:8000/api/add-to-carrinho/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Token de autenticação
            },
            body: JSON.stringify({
              produto: produtoId,   // Envia o ID do produto
              quantidade: 1
            }),
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
      } else{
        setModalContent('Please log in or register to add items to your cart.');
        setShowModal(true);
      }
  };

  const favoritarProduto = async (produtoId) => {
    console.log('Attempting to fave to cart:', produtoId)
    console.log('Token:', localStorage.getItem('accessToken'));
    console.log('userType:', localStorage.getItem('userType'));

    if (!localStorage.getItem('accessToken') || localStorage.getItem('userType') !== 'cliente') { 
      console.log('Hellooooooo');
      console.log('Conditions not met, showing modal');
      setModalContent('Please log in or register to proceed.');setShowModal(true);
      return;
    } else{
      const token = localStorage.getItem('accessToken');
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
    }
      
  };


  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    console.log("Modal should be showing:", showModal);
  }, [showModal]);

  return (
    <div className="todosProdutos-container">
      <CircleComponents />
      <ul className="todos-produtos-ul">
        {produtos.map(produto => (
          <li className="todos-produtos-li" key={produto.id}>
            <h2>{produto.nome}</h2>
            
            <div className="product-image">
            {produto.imagens.length > 0 ? (
              <img src={produto.imagens[0].imagem} alt={produto.nome} />
            ) : (
              <span className="no-image">No image available</span>
            )}
          </div>
          <p>Preço: {produto.preco}€</p>
             
            <div className="produto-actions">
              <button 
                className="add-to-cart-btn"
                onClick={() => adicionarAoCarrinho(produto.id)} // Chama a função para adicionar ao carrinho
              >
                Adicionar ao carrinho 🛒
              </button>
              <button 
                className={`favoritar-icon ${favoritos.includes(produto.id) ? 'favorito' : ''}`}
                onClick={() => favoritarProduto(produto.id)}
              >
                ❤
              </button>
              
              
            </div>
            
          </li>
        ))}
        {showModal && (console.log("Rendering Modal with content: ", modalContent),
                <Modal
                  isOpen={setShowModal}
                  onClose={closeModal}
                />)}
      </ul>
    </div>
  );

}


export default ProdutosPeriferico;