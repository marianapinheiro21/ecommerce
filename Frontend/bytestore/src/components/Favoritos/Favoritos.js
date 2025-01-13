import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardMedia, 
    CardContent, 
    CardActions,
    IconButton,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { listarFavoritos, removerFavorito } from '../../services/Api';
import { useAuth } from '../../context/AuthContext';

const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { authToken } = useAuth();

    const loadFavoritos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await listarFavoritos();
            setFavoritos(response.favoritos || []);
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
            setError('Erro ao carregar seus favoritos. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
            return;
        }
        loadFavoritos();

        // Atualizar quando houver mudanças nos favoritos
        window.addEventListener('favoritesUpdated', loadFavoritos);
        return () => window.removeEventListener('favoritesUpdated', loadFavoritos);
    }, [authToken, navigate]);

    const handleRemoverFavorito = async (produtoId) => {
        try {
            await removerFavorito(produtoId);
            loadFavoritos(); // Recarrega a lista após remover
        } catch (error) {
            console.error('Erro ao remover dos favoritos:', error);
            setError('Erro ao remover dos favoritos. Por favor, tente novamente.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Meus Favoritos
            </Typography>

            {favoritos.length === 0 ? (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: 2,
                    mt: 4 
                }}>
                    <Typography>Você ainda não tem produtos favoritos</Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/')}
                        sx={{ backgroundColor: '#B6CDCC' }}
                    >
                        Explorar Produtos
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {favoritos.map((favorito) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={favorito.Produto}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={favorito.imagem || '/placeholder.png'}
                                    alt={favorito.Produto}
                                    sx={{ objectFit: 'contain', p: 1 }}
                                    onClick={() => navigate(`/produto/${favorito.id}`)}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {favorito.Produto}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {favorito.Descricao}
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                        R$ {favorito.Preço}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between' }}>
                                    <IconButton 
                                        onClick={() => handleRemoverFavorito(favorito.id)}
                                        color="error"
                                    >
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => navigate(`/produto/${favorito.id}`)}
                                        color="primary"
                                    >
                                        <ShoppingCartIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Favoritos;