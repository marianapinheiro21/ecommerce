import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Loading from '../Loading/Loading';

const API_URL = 'http://localhost:8000/api';

function LojistaList() {
  const [lojistas, setLojistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLojistas = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/lojistas/`);
        setLojistas(response.data);
      } catch (error) {
        console.error('Erro ao carregar lojistas:', error);
        setError('Erro ao carregar a lista de lojistas');
      } finally {
        setLoading(false);
      }
    };

    fetchLojistas();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Nossas Lojas
      </Typography>

      <Grid container spacing={3}>
        {lojistas.map((lojista) => (
          <Grid item xs={12} sm={6} md={4} key={lojista.id}>
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
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <StorefrontIcon />
                  </Avatar>
                  <Typography variant="h6">
                    {lojista.nome}
                  </Typography>
                </Box>

                {lojista.email && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      mb: 1 
                    }}
                  >
                    <EmailIcon fontSize="small" />
                    {lojista.email}
                  </Typography>
                )}

                {lojista.ntelefone && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      mb: 1 
                    }}
                  >
                    <PhoneIcon fontSize="small" />
                    {lojista.ntelefone}
                  </Typography>
                )}

                {lojista.morada && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      mb: 2 
                    }}
                  >
                    <LocationOnIcon fontSize="small" />
                    {lojista.morada}
                  </Typography>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/lojista/${lojista.id}`)}
                >
                  Ver Produtos
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {lojistas.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" textAlign="center">
              Nenhuma loja encontrada.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default LojistaList;