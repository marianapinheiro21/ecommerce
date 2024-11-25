----------------------------------DROP DROP----------------------------------
--DROP PROCEDURE logistaadicionaproduto(numeric,character varying,numeric,numeric,character varying,character varying); 
--DROP PROCEDURE clientefavorita(numeric,numeric);
--DROP PROCEDURE NewCart(numeric);
--DROP PROCEDURE ClientAdicionaProdutoCarrinho(INTEGER, INTEGER, INTEGER);


CREATE OR REPLACE PROCEDURE LogistaAdicionaProduto(O_NifLogista NUMERIC(9,0), O_NomeProduto VARCHAR, O_Stock NUMERIC, O_Preco NUMERIC(10,2), O_descricao VARCHAR, O_categoria VARCHAR)
LANGUAGE plpgsql
AS $$
	BEGIN	
		INSERT INTO PRODUTO(Stock, Nome, Preco, Descricao, Categoria)
		VALUES (O_Stock, O_NomeProduto, O_Preco, O_descricao, O_categoria);
		
		INSERT INTO LOGISTA_PRODUTO(LOGISTA_NIF, PRODUTO_ID)
		VALUES (O_NifLogista, O_CODIGO);
		
	END;
$$;



CREATE OR REPLACE PROCEDURE ClienteFavorita(O_Nif_cliente NUMERIC(9,0), O_PRODUTO_ID NUMERIC)
LANGUAGE plpgsql
AS $$
	BEGIN
		INSERT INTO FAVORITO(NIF_CLIENTE, PRODUTO_ID)
		VALUES (O_Nif_cliente, O_PRODUTO_ID);
	END;
$$;



CREATE OR REPLACE PROCEDURE NovoCarrinho(O_USER_NIF NUMERIC(9,0))
LANGUAGE plpgsql
AS $$
	DECLARE
		O_PRECO NUMERIC = 0.00;
	BEGIN
		INSERT INTO CARRINHO(NIF_CLIENTE, TOTAL)
		VALUES(O_USER_NIF, O_PRECO);
	END;
$$;



CREATE OR REPLACE PROCEDURE ClienteAdicionaProdutoCarrinho(O_CART_ID INTEGER,O_PRODUCT_ID INTEGER,  O_QUANTITY INTEGER)
LANGUAGE plpgsql
AS $$
	BEGIN
		INSERT INTO CARRINHO_PRODUTO(CARRINHO_ID, PRODUTO_ID, QUANTITY)
		VALUES (O_CART_ID, O_PRODUCT_ID, O_QUANTITY);
		-- Falta criar uma procedure/Função que retorna o valor total do carrinho
	END;
$$;


-- FAZER UM UPDATE AUTOMÁTICO DO TOTAL DO CARRINHO

-- ADICIONAR VALORES INICIAIS

-- Alterar preço produto
-- Activar descontos
--Comprar produtos carrinho
--Alterar quantidade de produtos no carrinho
--Tirar produtos carrinho
