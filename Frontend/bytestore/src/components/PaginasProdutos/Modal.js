import React from "react";
import './modal.css'

function Modal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px', // Ensure width is in px or another unit
    backgroundColor: 'white',
    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
    padding: '20px'
  }}>
          <h2>Bem Vindo!</h2>
          <p>Inicia sessão ou cria conta para teres uma experiência personalizada!</p>
          <div className="modal-buttons">
            <button onClick={() => {
              onClose();
              window.location.href = '/login'; // Navigate to login
            }}>Iniciar Sessão</button>
            <button onClick={() => {
              onClose();
              window.location.href = '/register'; // Navigate to register
            }}>Criar Conta</button>
          </div>
        </div>
      </div>
    );
  }

export default Modal;