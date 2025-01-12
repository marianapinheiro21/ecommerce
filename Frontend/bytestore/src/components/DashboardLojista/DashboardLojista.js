import React, { useContext } from 'react';
import { logoutUser } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function DashboardLojista() {
    //const [error, setError] = useState('');  // Declarando o state para o erro
    const { authToken, userType, logout } = useAuth();
    const navigate = useNavigate();

    const handleAddProductClick = () => {
        if (authToken && userType === 'lojista') {
            navigate('/lojista/produtos/novo');
        } else {
            // Handle unauthenticated or unauthorized user
            navigate('/lojista/login');
        }
    };
    

    return (
        <div className="div-container">

            <h1>Dashboard do Lojista</h1>
            {/* Seção de dados pessoais */}
            
            <div>
            <h1>Dashboard</h1>
            <button onClick={handleAddProductClick}>Add New Product</button>
            {/* Other dashboard content */}
            </div>

            {/* Logout */}
            <section >
                <button className="button-logout" onClick={logoutUser}>Logout</button>
            </section>
        </div>
    );
}

export default DashboardLojista;
