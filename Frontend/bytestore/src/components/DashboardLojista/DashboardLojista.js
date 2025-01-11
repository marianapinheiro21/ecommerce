import React from 'react';
import { logoutUser } from '../../services/Api';

function DashboardLojista() {
    //const [error, setError] = useState('');  // Declarando o state para o erro


    

    return (
        <div className="div-container">

            <h1>Dashboard do Lojista</h1>
            {/* Seção de dados pessoais */}
            

            {/* Logout */}
            <section >
                <button className="button-logout" onClick={logoutUser}>Logout</button>
            </section>
        </div>
    );
}

export default DashboardLojista;
