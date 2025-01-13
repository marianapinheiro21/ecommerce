import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getCartCount, 
    getFavoritesCount, 
    searchProducts, 
    logoutUser 
} from '../../services/Api';
import logo from '../../assets/byte-store2.png';
import {
    AppBar,
    Toolbar,
    IconButton,
    Badge,
    TextField,
    Button,
    Menu,
    MenuItem,
    Typography,
    Box,
    Container,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    ShoppingCart,
    Favorite,
    Person,
    Search,
    Menu as MenuIcon,
    Home,
    ExitToApp
} from '@mui/icons-material';

const Header = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [cartCount, setCartCount] = useState(0);
    const [favCount, setFavCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [userMenu, setUserMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const token = localStorage.getItem('accessToken');
    const isLoggedIn = !!token;

    useEffect(() => {
    if (isLoggedIn) {
        console.log("Fetching counts...");  // Debug log
        fetchCounts();
    }
}, [isLoggedIn]);

const fetchCounts = async () => {
    if (!isLoggedIn || (localStorage.getItem('userType')==='lojista')) return;
    
    try {
        console.log("Starting fetchCounts...");  // Debug log
        const [cartData, favData] = await Promise.all([
            getCartCount(),
            getFavoritesCount()
        ]);
        
        console.log("Cart count:", cartData);  // Debug log
        console.log("Fav count:", favData);    // Debug log
        
        setCartCount(cartData);
        setFavCount(favData);
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
};

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length >= 3) {
            setIsSearching(true);
            try {
                const results = await searchProducts(value);
                setSearchResults(results);
            } catch (error) {
                console.error('Error searching:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userType');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleDashboard = async() => {
        if (localStorage.getItem('userType')==='lojista'){
            navigate('/lojista/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#B6CDCC' }}>
            <Container maxWidth="xl">
                <Toolbar 
                    disableGutters 
                    sx={{ 
                        height: '120px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 24px',
                    }}
                >
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setMobileMenuOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    {/* Logo à esquerda */}
                    <Box
                        component="img"
                        sx={{
                            height: 100,
                            width: 'auto',
                            cursor: 'pointer',
                            display: { xs: 'none', md: 'block' },
                            position: 'absolute',
                            left: 24,
                        }}
                        alt="Byte Store"
                        src={logo}
                        onClick={() => navigate('/')}
                    />

                    {/* Barra de Pesquisa Centralizada */}
                    <Box sx={{ 
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '30%',
                        zIndex: 1
                    }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Pesquisar produtos..."
                            value={searchTerm}
                            onChange={handleSearch}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: 1,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                            InputProps={{
                                endAdornment: isSearching ? 
                                    <CircularProgress size={20} /> : 
                                    <Search />,
                                sx: {
                                    fontSize: '0.9rem',
                                }
                            }}
                        />
                        {isSearchFocused && searchResults.length > 0 && (
                            <Box sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                bgcolor: 'background.paper',
                                boxShadow: 3,
                                borderRadius: 1,
                                maxHeight: 300,
                                overflow: 'auto',
                                zIndex: 1000
                            }}>
                                {searchResults.map((product) => (
                                    <MenuItem 
                                        key={product.id}
                                        onClick={() => {
                                            navigate(`/produto/${product.id}`);
                                            setSearchResults([]);
                                            setSearchTerm('');
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            {product.imagem && (
                                                <Box
                                                    component="img"
                                                    src={product.imagem}
                                                    sx={{ width: 40, height: 40, mr: 2, objectFit: 'cover' }}
                                                    alt={product.nome}
                                                />
                                            )}
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle2">{product.nome}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {product.preco.toLocaleString('pt-PT', {
                                                        style: 'currency',
                                                        currency: 'EUR'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Ícones de Ação */}
                    {!isMobile && isLoggedIn && (
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            marginLeft: 'auto'
                        }}>
                            <IconButton 
                                color="inherit"
                                onClick={() => navigate('/produtos/carrinho')}
                            >
                                <Badge badgeContent={cartCount} color="error">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>

                            <IconButton 
                                color="inherit"
                                onClick={() => navigate('/favoritos')}
                            >
                                <Badge badgeContent={favCount} color="error">
                                    <Favorite />
                                </Badge>
                            </IconButton>

                            <IconButton
                                onClick={(e) => setUserMenu(e.currentTarget)}
                                color="inherit"
                            >
                                <Person />
                            </IconButton>
                        </Box>
                    )}

                    {/* Botão de Login */}
                    {!isMobile && !isLoggedIn && (
                        <Button 
                            color="inherit"
                            onClick={() => navigate('/login')}
                            sx={{ marginLeft: 'auto' }}
                        >
                            Entrar
                        </Button>
                    )}

                    {/* Menu do Usuário */}
                    <Menu
                        anchorEl={userMenu}
                        open={Boolean(userMenu)}
                        onClose={() => setUserMenu(null)}
                    >
                        <MenuItem onClick={() => {
                            setUserMenu(null);
                            handleDashboard();
                            
                        }}>
                            Dashboard
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setUserMenu(null);
                            handleLogout();
                        }}>
                            Sair
                        </MenuItem>
                    </Menu>

                    {/* Menu Mobile */}
                    <Drawer
                        anchor="left"
                        open={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                    >
                        <Box sx={{ width: 250 }}>
                            <List>
                                <ListItem button onClick={() => {
                                    setMobileMenuOpen(false);
                                    navigate('/');
                                }}>
                                    <ListItemIcon>
                                        <Home />
                                    </ListItemIcon>
                                    <ListItemText primary="Início" />
                                </ListItem>

                                {isLoggedIn ? (
                                    <>
                                        <ListItem button onClick={() => {
                                            setMobileMenuOpen(false);
                                            navigate('/produtos/carrinho');
                                        }}>
                                            <ListItemIcon>
                                                <Badge badgeContent={cartCount} color="error">
                                                    <ShoppingCart />
                                                </Badge>
                                            </ListItemIcon>
                                            <ListItemText primary="Carrinho" />
                                        </ListItem>

                                        <ListItem button onClick={() => {
                                            setMobileMenuOpen(false);
                                            navigate('/favoritos');
                                        }}>
                                            <ListItemIcon>
                                                <Badge badgeContent={favCount} color="error">
                                                    <Favorite />
                                                </Badge>
                                            </ListItemIcon>
                                            <ListItemText primary="Favoritos" />
                                        </ListItem>

                                        <ListItem button onClick={() => {
                                            setMobileMenuOpen(false);
                                            navigate('/perfil');
                                        }}>
                                            <ListItemIcon>
                                                <Person />
                                            </ListItemIcon>
                                            <ListItemText primary="Perfil" />
                                        </ListItem>

                                        <Divider />

                                        <ListItem button onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleLogout();
                                        }}>
                                            <ListItemIcon>
                                                <ExitToApp />
                                            </ListItemIcon>
                                            <ListItemText primary="Sair" />
                                        </ListItem>
                                    </>
                                ) : (
                                    <ListItem button onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate('/login');
                                    }}>
                                        <ListItemIcon>
                                            <Person />
                                        </ListItemIcon>
                                        <ListItemText primary="Entrar" />
                                    </ListItem>
                                )}
                            </List>
                        </Box>
                    </Drawer>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;