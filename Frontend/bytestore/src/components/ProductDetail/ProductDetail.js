import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Grid,
  Paper,
  Container,
  Breadcrumbs,
  Link,
  Chip
} from '@mui/material';

// Icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';

// Components
import Loading from '../../components/Loading/Loading';

// Styled Components
const ProductWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  borderRadius: '15px',
}));

const PriceTag = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '2rem',
  fontWeight: 'bold',
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '15px',
  marginTop: '20px',
  fontSize: '1.1rem',
}));

const API_URL = 'http://localhost:8000/api';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  };

  const handleAddToCart = async () => {
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
      await axios.post(`${API_URL}/add-to-carrinho/`, 
        { produto_id: id },
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

  const handleAddToFavorites = async () => {
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
      await axios.post(`${API_URL}/adicionar_favorito/`, 
        { produto_id: id },
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

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Confira este produto: ${product.nome}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      email: `mailto:?subject=${product.nome}&body=Veja este produto: ${url}`
    };

    window.open(shareUrls[platform], '_blank');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/produtos/detalhes/${id}/`);
        setProduct(response.data);
        
        if (response.data.categoria) {
          const relatedResponse = await axios.get(
            `${API_URL}/produtos/categoria/${response.data.categoria}/`
          );
          setRelatedProducts(
            relatedResponse.data.filter(p => p.id !== parseInt(id)).slice(0, 4)
          );
        }
      } catch (error) {
        setError(error);
        if (error.response?.status === 404) {
          Swal.fire({
            title: 'Produto não encontrado',
            text: 'O produto que procura não existe ou foi removido',
            icon: 'error',
            confirmButtonText: 'Voltar para produtos',
          }).then(() => {
            navigate('/produtos');
          });
        } else {
          Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível carregar o produto. Tente novamente mais tarde.',
            icon: 'error',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      checkAuthStatus();
    }
  }, [id, navigate]);

  if (isLoading) return <Loading />;
  if (error) return <Typography color="error">Erro ao carregar o produto.</Typography>;
  if (!product) return null;

  return (
    <Container maxWidth="lg">
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 2, px: 2, py: 2 }}
      >
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          Início
        </Link>
        {product.categoria && (
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate(`/categoria/${product.categoria}`)}
            sx={{ cursor: 'pointer' }}
          >
            {product.categoria_nome}
          </Link>
        )}
        <Typography color="text.primary">{product.nome}</Typography>
      </Breadcrumbs>

      <Box sx={{ py: 4 }}>
        <ProductWrapper elevation={3}>
          <Grid container spacing={4}>
            {/* Imagens do Produto */}
            <Grid item xs={12} md={6}>
              {product.imagens && product.imagens.length > 0 ? (
                <Box>
                  <img
                    src={product.imagens[selectedImage].imagem}
                    alt={product.nome}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '500px',
                      objectFit: 'contain'
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {product.imagens.map((img, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={img.imagem}
                        alt={`${product.nome} - imagem ${index + 1}`}
                        sx={{
                          width: 80,
                          height: 80,
                          cursor: 'pointer',
                          border: selectedImage === index ? '2px solid primary.main' : 'none',
                        }}
                        onClick={() => setSelectedImage(index)}
                      />
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography>Sem imagens disponíveis</Typography>
                </Box>
              )}
            </Grid>

            {/* Detalhes do Produto */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {product.nome}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <PriceTag>{parseFloat(product.preco).toFixed(2)} €</PriceTag>
                <IconButton 
                  onClick={handleAddToFavorites}
                  color={product.isFavorite ? "error" : "default"}
                >
                  <FavoriteIcon />
                </IconButton>
              </Box>

              <Chip 
                label={product.stock > 10 ? 'Muitas unidades' : `${product.stock} unidades`}
                color={product.stock > 10 ? 'success' : 'warning'}
                sx={{ mb: 2 }}
              />

              <Typography variant="body1" paragraph>
                {product.descricao}
              </Typography>

              {product.lojista && (
                <Paper 
                  sx={{ 
                    p: 2, 
                    mt: 3, 
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1 
                      }}
                    >
                      <StorefrontIcon />
                      Vendido por: {product.lojista.nome}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/lojista/${product.lojista.id}`)}
                      startIcon={<StorefrontIcon />}
                    >
                      Ver Loja
                    </Button>
                  </Box>
                </Paper>
              )}

              <AddToCartButton
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                Adicionar ao Carrinho
              </AddToCartButton>

              <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
                <IconButton color="primary" onClick={() => handleShare('facebook')}>
                  <FacebookIcon />
                </IconButton>
                <IconButton color="info" onClick={() => handleShare('twitter')}>
                  <TwitterIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleShare('email')}>
                  <EmailIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </ProductWrapper>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <ProductWrapper elevation={3}>
            <Typography variant="h5" gutterBottom>
              Produtos Relacionados
            </Typography>
            <Grid container spacing={2}>
              {relatedProducts.map((relatedProduct) => (
                <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                    onClick={() => navigate(`/produto/${relatedProduct.id}`)}
                  >
                    <Box
                      component="img"
                      src={relatedProduct.imagens?.[0]?.imagem}
                      alt={relatedProduct.nome}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 2
                      }}
                    />
                    <Typography variant="h6" noWrap>
                      {relatedProduct.nome}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {parseFloat(relatedProduct.preco).toFixed(2)} €
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </ProductWrapper>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetail;