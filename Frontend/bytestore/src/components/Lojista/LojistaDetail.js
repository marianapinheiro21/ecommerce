import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Loading from '../Loading/Loading';

const API_URL = 'http://localhost:8000/api';

function LojistaDetalhe() {
  const [lojista, setLojista] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLojistaData = async () => {
      try {
        setLoading(true);
        const [lojistaResponse, produtosResponse] = await Promise.all([
          axios.get(`${API_URL}/lojista/${id}/`),
          axios.get(`${API_URL}/produtos/?lojista=${id}`)
        ]);
        
        setLojista(lojistaResponse.data);
        setProdutos(produtosResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar os dados do lojista');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLojistaData();
    }
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!lojista) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Perfil do Lojista */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <StorefrontIcon sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h4">
                {lojista.nome}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {lojista.email && (
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon />
                  {lojista.email}
                </Typography>
              )}
              
              {lojista.ntelefone && (
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon />
                  {lojista.ntelefone}
                </Typography>
              )}
              
              {lojista.morada && (
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon />
                  {lojista.morada}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de Produtos */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Produtos deste Lojista
      </Typography>

      <Grid container spacing={3}>
        {produtos.map((produto) => (
          <Grid item xs={12} sm={6} md={4} key={produto.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              {produto.imagens && produto.imagens[0] && (
                <CardMedia
                  component="img"
                  height="200"
                  image={produto.imagens[0].imagem}
                  alt={produto.nome}
                  sx={{ objectFit: 'contain', p: 2 }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {produto.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {produto.descricao}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {produto.preco.toFixed(2)} €
                </Typography>
              </CardContent>

              <CardActions>
                <Button 
                  size="small" 
                  fullWidth
                  onClick={() => navigate(`/produto/${produto.id}`)}
                >
                  Ver Detalhes
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {produtos.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" textAlign="center">
              Este lojista ainda não tem produtos cadastrados.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default LojistaDetalhe;