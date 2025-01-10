import React from 'react';
import styles from './Footer.module.css';  // Importando o CSS Module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitch, faPaypal, faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerLogo}>
        <p>O mundo da tecnologia, está cá.</p>
        <br />
        <p>Encontre-nos nas redes.</p>
        <div className={styles.footerIcons}>
          <a href=""><FontAwesomeIcon icon={faFacebook} aria-hidden="true" /></a>
          <a href=""><FontAwesomeIcon icon={faInstagram} aria-hidden="true" /></a>
          <a href=""><FontAwesomeIcon icon={faTwitch} aria-hidden="true" /></a>
        </div>
      </div>

      <ul className={styles.footerLista}>
        <li>
          <h3>Apoio ao Cliente</h3>
        </li>
        <a href=""><li>Ajuda</li></a>
        <a href=""><li>Entregas</li></a>
        <a href=""><li>Trocas</li></a>
        <a href=""><li>Devoluções</li></a>
      </ul>

      <ul className={styles.footerLista}>
        <li>
          <h3>Formas de Pagamento</h3>
        </li>
        <a href=""><FontAwesomeIcon icon={faPaypal} aria-hidden="true" /></a>
        <a href=""><FontAwesomeIcon icon={faCreditCard} aria-hidden="true" /></a>
        <a href=""><FontAwesomeIcon icon={faCcVisa} aria-hidden="true" /></a>
        <a href=""><FontAwesomeIcon icon={faCcMastercard} aria-hidden="true" /></a>
      </ul>

      <ul className={styles.footerInput}>
        <h3>Subscribe</h3>
        <p>Receba todas as novidades da E-commerce.</p>
        <div className={styles.inputFooter}>
          <input type="email" id="email" className={styles.inputFooterInput} placeholder="Digite o seu e-mail" />
          <button>
            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
          </button>
        </div>
      </ul>
    </footer>
  );
};

export default Footer;
