--USE Proj_PSI;
--GO

--CREATE SCHEMA IF NOT EXISTS ;

DROP TABLE CARRINHO_PRODUTO;

DROP TABLE FAVORITO;
DROP TABLE VENDA;
DROP TABLE PRODUTO;
DROP TABLE CARRINHO;
DROP TABLE CLIENTE;
DROP TABLE LOGISTA;


CREATE TABLE IF NOT EXISTS UTILIZADOR(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    nif NUMERIC(9, 0) NULL,
    ntelefone NUMERIC(9, 0) NULL,
    morada VARCHAR(50) NULL,
    password VARCHAR(128) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE NULL,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE CLIENTE (
    user_id INTEGER NOT NULL UNIQUE REFERENCES user (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id)
);

CREATE TABLE LOGISTA (
    user_id INTEGER NOT NULL UNIQUE REFERENCES user (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id)
);


--CREATE TABLE IF NOT EXISTS CLIENTE(

	--id 			SERIAL PRIMARY KEY,
	--NIF			NUMERIC(9,0) UNIQUE,
	--Nome		varchar NOT NULL, 
	--Email		varchar NOT NULL UNIQUE,
	--Password		varchar NOT NULL, 
	--NTelefone	NUMERIC(9,0),
	--Morada		varchar,
	--last_login TIMESTAMP WITH TIME ZONE, -- campos usados pelo Django para acesso e autenticação.
    --is_superuser BOOLEAN NOT NULL DEFAULT false,
	--is_active BOOLEAN NOT NULL DEFAULT true,
    --is_staff BOOLEAN NOT NULL DEFAULT false,
    --date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
--);

--CREATE TABLE IF NOT EXISTS LOGISTA(

	--id 			SERIAL PRIMARY KEY,
	--NIF			NUMERIC(9,0) UNIQUE NOT NULL,
	--Nome		varchar NOT NULL, 
	--Email		varchar NOT NULL UNIQUE,
	--Password		varchar NOT NULL, 
	--NTelefone	NUMERIC(9,0) NOT NULL,
	--Morada		varchar NOT NULL,
	--last_login TIMESTAMP WITH TIME ZONE, -- campos usados pelo Django para acesso e autenticação.
    --is_superuser BOOLEAN NOT NULL DEFAULT false,
	--is_active BOOLEAN NOT NULL DEFAULT true,
    --is_staff BOOLEAN NOT NULL DEFAULT false,
    --date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
--);


CREATE TABLE IF NOT EXISTS PRODUTO(
	id	SERIAL PRIMARY KEY, 
	ID_LOGISTA 	INTEGER NOT NULL,
	Stock		INTEGER NOT NULL,
	Nome		VARCHAR NOT NULL,
	Preco		NUMERIC(10,2) NOT NULL,
	Descricao	VARCHAR, 
	Categoria	VARCHAR,

	FOREIGN KEY (ID_LOGISTA) REFERENCES LOGISTA(user_id)
);



CREATE TABLE IF NOT EXISTS CARRINHO(
	id	SERIAL PRIMARY KEY,
	ID_CLIENTE	INTEGER NOT NULL,
	TOTAL		NUMERIC(10,2),

	FOREIGN KEY (ID_CLIENTE) REFERENCES CLIENTE(user_id)
);



CREATE TABLE IF NOT EXISTS FAVORITO(
	id		SERIAL PRIMARY KEY,
	ID_CLIENTE	INTEGER NOT NULL,
	PRODUTO_ID	INTEGER NOT NULL,

	FOREIGN KEY (ID_CLIENTE) REFERENCES CLIENTE(user_id),
	FOREIGN KEY (PRODUTO_ID) REFERENCES PRODUTO(id)
);


CREATE TABLE IF NOT EXISTS VENDA(
	id	SERIAL PRIMARY KEY,
	CARRINHO_ID	INTEGER,
	DATA_VENDA	DATE, 

	FOREIGN KEY (CARRINHO_ID) REFERENCES CARRINHO(id)
);

CREATE TABLE IF NOT EXISTS CARRINHO_PRODUTO(
	ID_C_P		SERIAL PRIMARY KEY, 
	CARRINHO_ID	INTEGER NOT NULL,
	VENDA_ID	INTEGER,
	PRODUTO_ID	INTEGER NOT NULL,
	QUANTIDADE	INTEGER NOT NULL,

	FOREIGN KEY (CARRINHO_ID) REFERENCES CARRINHO(id),
	FOREIGN KEY (PRODUTO_ID) REFERENCES PRODUTO(id), 
	FOREIGN KEY (VENDA_ID) REFERENCES VENDA(id)
);


--------------------------------------------------------------------------------------------
--------------------------- ADICIONAR CONTEÚDOS INICIAIS------------------------------------
--------------------------------------------------------------------------------------------


--INSERT INTO CLIENTE
--VALUES
--('123456789', 'Maria do Mar', 'mariadomar@mail.com', '123Oliveira4', '987654321', 'Rua do Oceano n14'),
--('134677985', 'Rodrigo Alteres', 'strongrodrigo@mail.pt', 'homemforte', '989898989', 'Rua do ginasio n5'),
--('242424242', 'Mariana Pinheiro', 'marianapinheiro@ua.pt', 'palavrapass', '916562734', 'a minha rua n27');


--INSERT INTO LOGISTA
--VALUES
--('454545454', 'loja fixe', 'fixe@store.pt', 'password', '888888889', 'rua bacana n45'),
--('124578986', 'Loja do Mestre André', 'mestreandre@store.pt', 'passdaloja', '326598147', 'Rua da loja n12');


--INSERT INTO PRODUTO(Stock, Nome, Preco, Descricao, Categoria)
--VALUES
--('3', 'OLAOLA', '14', 'JVNÇDFJNV', 'JKBVJBJ'),
--('5', 'PIUPIU', '20', 'TICOTICO', 'JNJFDJJJ'),
--('9', 'BACALHAU', '50', 'ZAZA', 'ANONIO');