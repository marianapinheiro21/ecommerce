import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProdutoDetalhe = () => {
  const { id } = useParams(); // Obtém o ID do produto da URL
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Faz uma requisição ao backend para buscar os detalhes do produto
    axios.get(`/api/produtos/detalhes/${id}/`)
      .then((response) => {
        setProduto(response.data);
      })
      .catch((error) => {
        console.error('Erro ao carregar o produto:', error);
        setErro('Erro ao carregar o produto.');
      });
  }, [id]);

  if (erro) {
    return <div className="container mt-5">{erro}</div>;
  }

  if (!produto) {
    return <div className="container mt-5">Carregando...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Coluna da imagem principal */}
        <div className="col-md-6">
          <img
            src={produto.imagens.length > 0 ? produto.imagens[0].imagem : 'https://via.placeholder.com/600'}
            alt={produto.nome}
            className="img-fluid rounded"
          />
          {/* Galeria de imagens */}
          <div className="d-flex mt-3">
            {produto.imagens.map((imagemObj, index) => (
              <img
                key={index}
                src={imagemObj.imagem}
                alt={produto.nome}
                className="img-thumbnail me-2"
                style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => console.log(`Clicaste na imagem ${index + 1}`)} // Pode ser usado para trocar a imagem principal
              />
            ))}
          </div>
        </div>

        {/* Coluna das informações do produto */}
        <div className="col-md-6">
          <h1 className="fw-bold">{produto.nome}</h1>
          <p className="text-muted">Categoria: <span className="fw-normal">{produto.categoria || 'N/A'}</span></p>
          <h3 className="text-success">€{produto.preco}</h3>
          <p>{produto.descricao}</p>
          <p>Stock disponível: <strong>{produto.stock}</strong></p>

          {/* Controles de quantidade e botão de adicionar ao carrinho */}
          <div className="d-flex align-items-center mt-4">
            <input
              type="number"
              defaultValue={1}
              min={1}
              max={produto.stock}
              className="form-control me-3"
              style={{ width: '100px' }}
            />
            <button className="btn btn-primary btn-lg">
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutoDetalhe;