import React, { useState, useEffect }  from 'react';
import { AppBar, Toolbar, IconButton, Modal, Typography, Button, InputBase } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import logo from '../assets/byte-store2.png'; 

import { Link, useNavigate } from 'react-router-dom';

import { logoutUser } from '../services/Api'; 

import './Header.css';

const Header = () => {
    
    //const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);  


    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleOpen = () => {
       // if (localStorage.getItem('accessToken')) {
         //   navigate ('/dashboard');
        //} else {
            setIsModalOpen(true);
        //}
    };

    const handleClose = () => setIsModalOpen(false);
    
    const handleLogin = () => {
        handleClose();
        navigate('/login');
        
    };

    const handleCreateAccountCliente = () => {
        handleClose();
        navigate('/create-account');  // Redirects to create account page
      };


    return (
        <nav>
            <AppBar position="static" style= {{ background: '#B6CDCC' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>

                    <div className='logo-container'>
                        <Link to="/">
                            <img src= {logo} alt="ByteStore Logo" style={{ height: '100px' }}/>
                            <div style= {{ flexGrow: 1 }} />
                        </Link>
                    </div>

                    <div className="search-container">
                        <SearchIcon style={{ 
                            position: 'absolute', 
                            left: '10px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: 'white' /* Ensuring the icon is visible against a white background */
                            }} />
                        <InputBase
                            placeholder="Search.."
                            style={{ 
                                paddingLeft: '40px',
                                width: '100%',
                                borderRadius: '20px',
                                background: 'white',
                                color: 'gray'
                            }} 
                        />
                    </div>

                    <div className="icons-container">
                        <Button color="inherit" onClick={handleOpen}>
                            <AccountCircle />
                        </Button>
                    
                        <Modal
                          open={isModalOpen}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <div style={{ 
                                position: 'absolute',  // Typically, modal content might be absolutely positioned.
                                top: '50%',            // Centered vertically.
                                left: '50%',           // Centered horizontally.
                                transform: 'translate(-50%, -50%)', // Adjusts positioning to center.
                                width: 400,            // Specifies a width for the modal.
                                backgroundColor: 'white', // Background color of the modal.
                                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)', // Adds some shadow.
                                padding: '20px'       // Padding inside the modal. 
                                }}>
                            <h2>Bem Vindo!</h2>
                            <p>Inicia sessão ou cria conta para teres uma experiência personalizada!</p>
                            <Button onClick={handleLogin}>Iniciar Sessão</Button>
                            <Button onClick={handleCreateAccountCliente}>Criar Conta</Button>
                          </div>
                        </Modal>
                        <IconButton color="inherit">
                            <ShoppingCartIcon />
                        </IconButton>
                    </div>    
                </Toolbar>
            </AppBar>


            <nav>
      
    </nav>
        </nav>
    );
};

export default Header;

