import React, { useState, useEffect } from 'react';
import { getDadosPessoais, updateCliente } from '../../services/Api';

function DadosPessoais() {
    // Estado para armazenar os dados do cliente
    const [dados, setDados] = useState({
        nome: '',
        email: '',
        nif: '',
        ntelefone: '',
        morada: '',
        password: '', // Caso você precise de senha
    });
    
    const [editando, setEditando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        // Busca os dados pessoais quando o componente for montado
        const fetchDados = async () => {
            try {
                const response = await getDadosPessoais();
                setDados(response);
            } catch (error) {
                setErro('Erro ao buscar dados pessoais.');
            }
        };
        
        fetchDados();
    }, []);

    // Função para alternar o modo de edição
    const handleEditClick = () => {
        setEditando(true);
    };

    // Função para salvar as alterações
    const handleSaveClick = async () => {
        try {
            await updateCliente(dados); // Atualiza os dados do cliente
            setEditando(false); // Sai do modo de edição após sucesso
        } catch (error) {
            setErro('Erro ao salvar alterações.');
        }
    };

    // Função para lidar com a mudança nos campos de entrada
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDados((prevDados) => ({
            ...prevDados,
            [name]: value,
        }));
    };

    return (
        <div>
            <h2>Dados Pessoais</h2>
            {erro && <div style={{ color: 'red' }}>{erro}</div>}

            <div>
                <div>
                    <label>Nome:</label>
                    {editando ? (
                        <input
                            type="text"
                            name="nome"
                            value={dados.nome}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{dados.nome}</p>
                    )}
                </div>

                <div>
                    <label>Email:</label>
                    {editando ? (
                        <input
                            type="email"
                            name="email"
                            value={dados.email}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{dados.email}</p>
                    )}
                </div>

                <div>
                    <label>NIF:</label>
                    {editando ? (
                        <input
                            type="text"
                            name="nif"
                            value={dados.nif}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{dados.nif}</p>
                    )}
                </div>

                <div>
                    <label>Telefone:</label>
                    {editando ? (
                        <input
                            type="text"
                            name="ntelefone"
                            value={dados.ntelefone}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{dados.ntelefone}</p>
                    )}
                </div>

                <div>
                    <label>Endereço:</label>
                    {editando ? (
                        <input
                            type="text"
                            name="morada"
                            value={dados.morada}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{dados.morada}</p>
                    )}
                </div>

                <div>
                    <label>Senha:</label>
                    {editando ? (
                        <input
                            type="password"
                            name="password"
                            value={dados.password}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>******</p> // Ocultando a senha para segurança
                    )}
                </div>

                <div>
                    {editando ? (
                        <button onClick={handleSaveClick}>Salvar Alterações</button>
                    ) : (
                        <button onClick={handleEditClick}>Editar Dados Pessoais</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DadosPessoais;
