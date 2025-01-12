import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Loading from '../Loading/Loading';

const API_URL = 'http://localhost:8000/api';

const ProductCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const ProductImage = styled('img')({
  width: '100%',
  height: 200,
  objectFit: 'contain',
  marginBottom: '1rem',
  borderRadius: '4px',
});

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

function ProdutosComputadorFixo() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('nome');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/produtos/categoria/computador%20fixo');
        const data = await response.json();
        setProdutos(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Função para navegar para a página de detalhes
  const handleProductClick = (productId) => {
    navigate(`/produto/${productId}`);
  };

  // Função para evitar navegação quando clicar nos ícones
  const handleIconClick = (e, action) => {
    e.stopPropagation(); // Impede que o clique propague para o card
    // Aqui você pode adicionar a lógica para favoritos e carrinho
    console.log(action);
  };

  const filteredProducts = produtos
    .filter(product => 
      product.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (orderBy === 'preco_asc') return a.preco - b.preco;
      if (orderBy === 'preco_desc') return b.preco - a.preco;
      return (a.nome || '').localeCompare(b.nome || '');
    });

  if (loading) return <Loading />;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 4 }}>
        Computadores Fixos
      </Typography>

      <FilterPaper elevation={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar computadores"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={orderBy}
                label="Ordenar por"
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <MenuItem value="nome">Nome</MenuItem>
                <MenuItem value="preco_asc">Preço - Menor para Maior</MenuItem>
                <MenuItem value="preco_desc">Preço - Maior para Menor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </FilterPaper>

      <Grid container spacing={3}>
        {filteredProducts.map((produto) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={produto.id}>
            <ProductCard 
              elevation={3}
              onClick={() => handleProductClick(produto.id)}
            >
              {produto.imagens && produto.imagens.length > 0 && (
                <ProductImage
                  src={produto.imagens[0].imagem}
                  alt={produto.nome}
                />
              )}
              <Typography variant="h6" noWrap>
                {produto.nome}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {produto.descricao}
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {parseFloat(produto.preco).toFixed(2)} €
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {produto.stock} unidades
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton 
                    size="small"
                    onClick={(e) => handleIconClick(e, 'favorite')}
                  >
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={(e) => handleIconClick(e, 'cart')}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                </Box>
              </Box>
            </ProductCard>
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Typography variant="h6" textAlign="center" sx={{ my: 4 }}>
          Nenhum computador encontrado.
        </Typography>
      )}
    </Container>
  );
}

export default ProdutosComputadorFixo;