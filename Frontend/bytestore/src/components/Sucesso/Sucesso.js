import React from 'react';
import './Sucesso.css'; // Make sure the CSS file is correctly linked

function Sucesso() {
    return (
        <div className="success-container">
            <div className="success-content">
                <h1>Obrigada pela sua compra!</h1>
                <p>A encomenda será despachada até no máximo 3 dias úteis após o pagamento.</p>
                <p>Receberá no seu email a referência multibanco para pagamento.</p>
                <p>Os melhores cumprimentos,</p>
                <strong>Byte Store</strong>
            </div>
        </div>
    );
}
export default Sucesso;