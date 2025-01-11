import React from 'react';
import { Link } from 'react-router-dom';
import './CircleComponents.css';
import acessorioImg from '../../assets/acessorio.png'; 
import computerImg from '../../assets/computer.png';
import portatilImg from '../../assets/portatil.png';




function CircleComponents() {
    return (
        <section className="components">
            <div className="components-container" id="components-container">
                <Link to="/produtos/computadores" className="component">
                    <div className="circle">
                    <img src={computerImg} alt="Portátil" />
                    </div>
                    <span>Computadores</span>
                </Link>
                
                <Link to="/produtos/portateis" className="component">
                    <div className="circle">
                    <img src={portatilImg} alt="Portátil" />
                    </div>
                    <span>Portátil</span>
                </Link>

                <Link to="/produtos/acessorios" className="component">
                    <div className="circle">
                    <img src={acessorioImg} alt="Portátil" />
                    </div>
                    <span>Acessórios</span>
                </Link> 
            </div>
        </section>
    );
}

export default CircleComponents;
