import React, { useEffect, useState } from 'react';
import { logoutUser } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DadosPessoaisLojista from './DadosPessoaisLojista';
import { fetchLojistaSales } from '../../services/Api';
import './DashboardLojista.css'

function DashboardLojista() {
    //const [error, setError] = useState('');  // Declarando o state para o erro
    const { authToken, userType, logout } = useAuth();
    const navigate = useNavigate();
    const [sales, setSales] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (authToken) {
            setLoading(true);
            fetchLojistaSales(authToken).then(data => {
                setSales(data);
                setLoading(false);
            }).catch(err => {
                setError('Failed to fetch sales data.');
                setLoading(false);
            });
        }
    }, [authToken]);

    const handleAddProductClick = () => {
        if (authToken && userType === 'lojista') {
            navigate('/lojista/produtos/novo');
        } else {
            // Handle unauthenticated or unauthorized user
            navigate('/lojista/login');
        }
    };
    

    return (
        <div className="dashboard-container">

            <h1>Dashboard do Lojista</h1>
            <button onClick={handleAddProductClick}>Add New Product</button>
            {error && <p>{error}</p>}
            {loading ? (
                <p>Loading sales data...</p>
            ) : (
                <section>
                    <h2>Estes são os seus ganhos desde que se juntou à Byte Store:</h2>
                    <p>${sales ? sales.totalSales : 'Data not available'}</p>
                    <p>Obrigada Pelo seu Apoio</p>
                </section>
            )}

            <section className="dados-pessoais">
                <h2>Dados Pessoais</h2>
                <DadosPessoaisLojista />
            </section>

            <section>
                <button className="button-logout" onClick={logout}>Logout</button>
            </section>
        </div>
    );

}

export default DashboardLojista;
