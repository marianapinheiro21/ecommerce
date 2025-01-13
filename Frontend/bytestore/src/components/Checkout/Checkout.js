import React, { useEffect } from "react";
import DadosPessoais from "../Dashboard/DadosPessoais";
import { useNavigate } from "react-router-dom";
import { createVenda } from "../../services/Api";


function Checkout() {
    const navigate = useNavigate();
    
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            
            navigate('/login'); 
        }
    }, [navigate]);

    const handleFinalizePurchase = async () => {
        const accessToken = localStorage.getItem('accessToken');  
        if (!accessToken) {
          console.error('Access Token is missing');
          return;
        }
    
        const result = await createVenda(accessToken);
        if (result && result.id) {  // Assuming the response includes an id upon success
          navigate('/sucesso');  // Navigate to the success page
        } else {
          console.error('Failed to finalize the purchase');
        }
    };

    return(
        <div className="checkout-container">
            <div className="checkout-content">
                <h3>Confirme os seus dados pessoais</h3>
                <DadosPessoais />
                <p>Se deixar o seu nif em Branco, a sua compra será processada sem ele.</p>
                <p>Caso deixar a morada em branco, o cliente compromete-se a levantar a sua compra em loja.</p>
                <button onClick={handleFinalizePurchase} className="finalize-button">
                    Finalizar Compra
                </button>
            </div>
        </div>
        
    );
}
export default Checkout;