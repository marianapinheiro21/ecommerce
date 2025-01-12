import React from 'react';
import { Link } from 'react-router-dom';
import './CircleComponents.css';
import perifericoImg from '../../assets/acessorio.png'; 
import computerImg from '../../assets/computer.png';
import portatilImg from '../../assets/portatil.png';
import acessorioImg from '../../assets/acessorio2.png'
import todosImg from '../../assets/setup.png'



function CircleComponents() {
    return (
        <section className="components">
            <div className="components-container" id="components-container">
                <Link to="/produtos/computadoresfixos" className="component">
                    <div className="circle">
                    <img src={computerImg} alt="Fixo" />
                    </div>
                    <span>Computadores Fixos</span>
                </Link>
                
                <Link to="/produtos/portateis" className="component">
                    <div className="circle">
                    <img src={portatilImg} alt="Portátil" />
                    </div>
                    <span>Portátil</span>
                </Link>

                <Link to="/produtos/perifericos" className="component">
                    <div className="circle">
                    <img src={perifericoImg} alt="Acessorio" />
                    </div>
                    <span>Periféricos</span>
                </Link> 

                <Link to="/produtos/acessorios" className="component">
                    <div className="circle">
                    <img src={acessorioImg} alt="Acessorio" />
                    </div>
                    <span>Acessórios</span>
                </Link> 



                <Link to="/produtos" className="component">
                    <div className="circle">
                    <img src={todosImg} alt="Acessorio" />
                    </div>
                    <span>Todos os Produtos</span>
                </Link> 
            </div>
        </section>
    );
}

export default CircleComponents;
