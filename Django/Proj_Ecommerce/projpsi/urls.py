from django.urls import path
from . import views

"""
No cabeçalho do site queremos:
    * carrinho no lado Direito
    * Nome / Imagem do site no centro do cabeçalho
    * Barra de pesquisa
    * Botão de menu (3 barrinhas) no lado Esquerdo (drop Down Menu)
        * Area Logista (Em último)
        * Area Cliente (Em cima)
        * Várias Categorias de Produtos
            
            
No Rodapé:
    * Sobre nós
    * Informação Legal 
    * Informação de taxas e tempos de entrega
    * Imagem Portugal 2030
    * Imagem do LinkedIn, para depois conectar com os nossos (hiperligação)            
    * Apoio ao Cliente (Tentar)   
    
    
Falta criar template 404

Página inicial:
    * Ciclo de imgens de produtos a serem anunciados. "Oportunidades". Vão deslizando/alternando
    * "Quadrados" com imagem e texto a representar as várias categorias de produtos
    
    
Página Novos Clientes
    * Formulário a preencher com todas as infos necesárias
    * Podemos por um check para notificações
    * tentar receber um mail automático para confirmar a criação de conta
    
Página Novos Logistas
    * Formulário a preencher com todas as infos necesárias
    * Podemos por um check para notificações
    * tentar receber um mail automático para confirmar a criação de conta

Página Área Cliente
    * Dados Pessoais do Cliente
    * Possibilidade de alteração dos dados pessoais
    * Acesso ao Histórico de Compras    
    
Página Área Logista
    * Dados da Loja/Logista
    * Possibilidade de alteração dos dados
    * Acesso ao Histórico de Vendas
    * Acesso a relatórios gerados quando pedido
    
Página Carrinho
    * Mostra já os produtos já em fase de check-out
    * Possibilidade de ateração da morada e contacto telefónico
    * Mostra total e total com desconto e/ou portes
    * tentar receber um mail automático com os detalhes da compra (após check-out)
    
Página Produtos
    * Criar uma página para cada categoria de produtos
    * Filtros do Lado esquerdo do ecrã
    * A pesquisa de "filtros deve ser feita consoante palavras chaves na Descrição do produto
    * Quem trata desta página adiciona à BD os produtos que vão estar visiveis

        CATEGORIAS DE PRODUTOS:
            * Computadores Portáteis
            * Computadores Torre
            * Componentes (?)
            * Monitores
            * Periférios (Rato/Teclado/Camara web/...)
            * Acessórios e Audio
    
Página Sobre nós / Informação Legal / Informação de taxas e tempos de entrega 
    * Páginas todas feitas utilizando o mesmo template
    * Apenas texto
    * Urls diferentes
    
Página Apoio ao Cliente
    * Verificiar que o cliente tem log-in feito
    * Apenas uma caixa de texto e botão para enviar
    * tentar receber um mail automático com a reclamação
    
    
"""

urlpatterns = [
    path('cliente/', views.clientes, name='cliente'),
    path('logista/', views.logista, name='logista'),
    path('carrinho/', views.carrinho, name='carrinho'),
    path('produto/', views.produto, name='produto'),
    path('lista/', views.my_view, name='lista'),
]