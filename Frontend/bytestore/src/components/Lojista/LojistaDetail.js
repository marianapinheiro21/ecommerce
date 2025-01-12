import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Paper,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Fade,
  Chip,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:8000/api';

const StyledBackButton = styled(Link)({
  textDecoration: 'none',
  color: '#1976d2',
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  marginBottom: '20px',
  '&:hover': {
    color: '#1565c0',
  },
});

const InfoItem = ({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    {icon}
    <Typography variant="body1" sx={{ ml: 2 }}>
      {text}
    </Typography>
  </Box>
);

const getStockColor = (stock) => {
  if (stock === 0) return { bg: '#ffebee', text: '#d32f2f' };
  if (stock < 5) return { bg: '#fff3e0', text: '#ef6c00' };
  if (stock < 10) return { bg: '#f1f8e9', text: '#689f38' };
  return { bg: '#e8f5e9', text: '#2e7d32' };
};

function LojistaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lojista, setLojista] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  };

  const handleAddToCart = async (productId, event) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Necessário iniciar sessão',
        text: 'Para adicionar ao carrinho, inicie sessão ou crie uma conta',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Iniciar Sessão',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${API_URL}/add-to-carrinho/`,
        { produto_id: productId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      Swal.fire('Sucesso!', 'Produto adicionado ao carrinho!', 'success');
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else {
        Swal.fire('Erro!', 'Não foi possível adicionar ao carrinho', 'error');
      }
    }
  };

  const handleAddToFavorites = async (productId, event) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Necessário iniciar sessão',
        text: 'Para adicionar aos favoritos, inicie sessão ou crie uma conta',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Iniciar Sessão',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${API_URL}/adicionar_favorito/`,
        { produto_id: productId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      Swal.fire('Sucesso!', 'Produto adicionado aos favoritos!', 'success');
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else {
        Swal.fire('Erro!', 'Não foi possível adicionar aos favoritos', 'error');
      }
    }
  };
  useEffect(() => {
    checkAuthStatus();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [lojistaResponse, produtosResponse] = await Promise.all([
          axios.get(`${API_URL}/lojistas/${id}/`),
          axios.get(`${API_URL}/produtos/lista?lojista=${id}`)
        ]);

        setLojista(lojistaResponse.data);
        setProdutos(produtosResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (error.response?.status === 404) {
          setError('Lojista não encontrado');
        } else if (error.response?.status === 403) {
          setError('Acesso não autorizado');
        } else {
          setError('Erro ao carregar informações. Tente novamente mais tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleProdutoClick = (produtoId) => {
    navigate(`/produto/${produtoId}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <StyledBackButton to="/lojista">
          <ArrowBackIcon sx={{ mr: 1 }} />
          VOLTAR
        </StyledBackButton>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!lojista) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <div>
          <StyledBackButton to="/lojista">
            <ArrowBackIcon sx={{ mr: 1 }} />
            VOLTAR
          </StyledBackButton>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4,
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 500,
                color: '#333',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <StorefrontIcon sx={{ mr: 2 }} />
              {lojista.nome}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <InfoItem 
                icon={<EmailIcon color="primary" />} 
                text={lojista.email} 
              />
              
              {lojista.ntelefone && (
                <InfoItem 
                  icon={<PhoneIcon color="primary" />} 
                  text={lojista.ntelefone} 
                />
              )}
              
              {lojista.morada && (
                <InfoItem 
                  icon={<LocationOnIcon color="primary" />} 
                  text={lojista.morada} 
                />
              )}
              
              {lojista.nif && (
                <InfoItem 
                  icon={<ReceiptIcon color="primary" />} 
                  text={`NIF: ${lojista.nif}`} 
                />
              )}
            </Box>
          </Paper>

          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              fontWeight: 500,
              color: '#333',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <StorefrontIcon sx={{ mr: 2 }} />
            Produtos deste Lojista
            <Chip 
              label={`${produtos.length} produtos`} 
              sx={{ ml: 2 }}
              color="primary"
            />
          </Typography>

          <Grid container spacing={3}>
            {produtos.length > 0 ? (
              produtos.map((produto) => {
                const stockColor = getStockColor(produto.stock);
                return (
                  <Grid item xs={12} sm={6} md={4} key={produto.id}>
                    <Fade in timeout={1000}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                          },
                          cursor: 'pointer'
                        }}
                        onClick={() => handleProdutoClick(produto.id)}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={produto.imagem || 'https://via.placeholder.com/200'}
                          alt={produto.nome}
                          sx={{ 
                            objectFit: 'cover',
                            backgroundColor: 'rgba(0,0,0,0.05)'
                          }}
                          loading="lazy"
                        />
                        <CardContent>
                          <Typography 
                            gutterBottom 
                            variant="h6" 
                            component="div"
                            sx={{ color: '#333' }}
                          >
                            {produto.nome}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              mb: 1,
                              color: '#1976d2',
                              fontWeight: 600
                            }}
                          >
                            €{produto.preco}
                          </Typography>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: stockColor.bg,
                              color: stockColor.text,
                              fontSize: '0.875rem',
                              fontWeight: 500
                            }}
                          >
                            Stock: {produto.stock}
                          </Box>
                          {produto.descricao && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mt: 2,
                                color: '#666'
                              }}
                            >
                              {produto.descricao}
                            </Typography>
                          )}
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            mt: 2,
                            gap: 1 
                          }}>
                            <IconButton 
                              size="small"
                              color="inherit"
                              sx={{
                                '&:hover': {
                                  color: 'error.main'
                                }
                              }}
                              onClick={(e) => handleAddToFavorites(produto.id, e)}
                            >
                              <FavoriteIcon />
                            </IconButton>
                            <IconButton 
                              size="small"
                              color="inherit"
                              sx={{
                                '&:hover': {
                                  color: 'primary.main'
                                }
                              }}
                              onClick={(e) => handleAddToCart(produto.id, e)}
                            >
                              <ShoppingCartIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                )
              })
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">
                  Este lojista ainda não tem produtos cadastrados.
                </Alert>
              </Grid>
            )}
          </Grid>
        </div>
      </Fade>
    </Container>
  );
}

export default LojistaDetail;