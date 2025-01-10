import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DadosPessoais = () => {
    const [dados, setDados] = useState({
        nome: '',
        email: '',
        ntelefone: '',
    });
    const [isEditing, setIsEditing] = useState(false);  // Controla se o formulário de edição está visível
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchDados = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await axios.get('/api/cliente/dados/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDados(response.data); // Preenche com os dados obtidos da API
            } catch (error) {
                setError('Erro ao carregar dados pessoais.');
            } finally {
                setLoading(false);
            }
        };

        fetchDados();
    }, []);

    // Função para enviar a atualização dos dados
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');

        try {
            const response = await axios.patch('/api/cliente/editar/', dados, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setSuccess(true); // Indica que a atualização foi bem-sucedida
            setError(null);
            setIsEditing(false); // Volta para o modo de visualização após salvar
        } catch (error) {
            setError('Erro ao atualizar dados pessoais.');
            setSuccess(false);
        }
    };

    // Exibe o formulário de edição ou os dados do cliente
    return (
        <div>
            {loading ? (
                <div>Carregando...</div>
            ) : (
                <>
                    {!isEditing ? (
                        // Exibe os dados pessoais
                        <div>
                            <p><strong>Nome:</strong> {dados.nome}</p>
                            <p><strong>Email:</strong> {dados.email}</p>
                            <p><strong>Nif:</strong> {dados.nif}</p>
                            <p><strong>Telefone:</strong> {dados.ntelefone}</p>
                            <p><strong>Morada:</strong> {dados.morada}</p>
                            <button class="alterar-dados-pessoais" onClick={() => setIsEditing(true)}>Alterar Dados Pessoais</button>
                        </div>
                    ) : (
                        // Exibe o formulário de edição
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="nome">Nome</label>
                                <input
                                    type="text"
                                    id="nome"
                                    value={dados.nome}
                                    onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={dados.email}
                                    onChange={(e) => setDados({ ...dados, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="nif">Nif</label>
                                <input
                                    type="number"
                                    id="nif"
                                    value={dados.nif}
                                    onChange={(e) => setDados({ ...dados, nif: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="telefone">Telefone</label>
                                <input
                                    type="number"
                                    id="telefone"
                                    value={dados.ntelefone}
                                    onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="morada">Morada</label>
                                <input
                                    type="text"
                                    id="morada"
                                    value={dados.morada}
                                    onChange={(e) => setDados({ ...dados, morada: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit">Salvar</button>
                        </form>
                    )}

                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {success && <div style={{ color: 'green' }}>Dados atualizados com sucesso!</div>}
                </>
            )}
        </div>
    );
};

export default DadosPessoais;
