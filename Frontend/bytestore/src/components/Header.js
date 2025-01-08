import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, InputBase } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import logo from '../assets/byte-store2.png'; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


import { logoutUser } from '../services/Api'; 
const Header = () => {

    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');

    const handleLoginLogout = () => {
        if (accessToken) {
            logoutUser().then(() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate.push('/login'); // Redirect to login after logout 
            }); 
        } else {
            navigate.push('/login'); // Redirect to login page
        }
    };

    return (
        <nav>
            <AppBar position="static" style= {{ background: '#B6CDCC' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>

                    <img src= {logo} alt="ByteStore Logo" style={{ height: '100px' }}/>
                    <div style= {{ flexGrow: 1 }} />

                    <div style={{ position: 'relative', marginRight: '20px', marginLeft: '20px' }}>
                        <div style={{ position: 'absolute', marginLeft: '10px', marginTop: '10px', pointerEvents: 'none' }} >
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search.."
                            style={{ color: 'inherit', paddingLeft: '40px', width: '100%' }}
                        />
                    </div>

                    <Button color="inherit" onClick={handleLoginLogout}>
                        {accessToken ? 'Logout' : 'Login'}
                        <AccountCircle />
                        Login
                    </Button>
                    <IconButton color="inherit">
                        <ShoppingCartIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>


            <nav>
      <ul>
        
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
        </nav>
    );
};

export default Header;
