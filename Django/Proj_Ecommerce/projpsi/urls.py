from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from django.conf.urls import handler403, handler404, handler500
from .views import *
from . import views


urlpatterns = [
    path('', index, name='index'),
    #path('registar/cliente/', novoCliente, name='novoCliente'),
    path('api/cliente/registo/', ClienteRegistrationAPIView.as_view(), name='api_registro_cliente'),
    path('api/cliente/dados/', ClienteDadosView.as_view(), name='cliente-dados'),
    path('api/lojista/registo/', LojistaRegistrationAPIView.as_view(), name='api_registro_lojista'),
    path('api/cliente/login/', ClienteLoginAPIView.as_view(), name='cliente_login'),
    path('api/lojista/login/', LojistaLoginAPIView.as_view(), name='lojista_login'),
    path('api/logout/', LogoutAPIView.as_view(), name='logout'),
    path('api/produtos/create/', ProdutoCreateAPIView.as_view(), name='produto-create'),
    path('api/add-to-carrinho/', CarrinhoProdutoAPIView.as_view(), name='add-to-carrinho'),
    path('api/remove-to-cart/', RemoverProdutosCarrinhoAPIView.as_view(), name='remove-to-cart'),
    path('api/venda/create/', CreateVendaAPIView.as_view(), name='create-venda'),
    path('api/carrinho/update/', UpdateCarrinhoProdutoAPIView.as_view(), name='update-carrinho-produto'),

    path('api/carrinho/', ProdutosNoCarrinhoAPIView.as_view(), name='produtos-no-carrinho'),
    path('api/produtos-comprados/', ProdutosCompradosAPIView.as_view(), name='produtos-comprados'),
    path('api/lojistas/', PublicLojistaListAPIView.as_view(), name='public_lojista_list'),
    path('api/lojistas/<int:user_id>/', LojistaDetailView.as_view(), name='lojista-detail'),
    path('api/lojista/me/', PrivateLojistaAPIView.as_view(), name='lojista_detail'),
    #path('api/cliente/<int:pk>/', ClienteUpdateAPIView.as_view(), name='cliente-update'),
    #path('api/cliente/editar/', ClienteUpdateAPIView.as_view(), name='editar_cliente'),
    path('api/cliente/update/', ClienteUpdateAPIView.as_view(), name='cliente-update'),
    path('lojista/update/', LojistaUpdateAPIView.as_view(), name='lojista-update'),
    #path('api/lojista/<int:pk>/', LojistaUpdateAPIView.as_view(), name='lojista-update'),
    path('api/produtos/detalhes/<int:pk>/', ProdutoDetalheView.as_view(), name='produto-detalhe'),
    path('api/produtos/categorias/', CategoriaChoicesAPIView.as_view(), name='categoria_choices'),
    path('api/produtos/categoria/<str:categoria>/',ProdutoPorCategoriaAPIView.as_view(), name='produtos-por-categoria'),
    path('api/lojista/vendas/', LojistaVendasAPIView.as_view(), name='lojista-vendas'),
    path('api/lojista/produtos/', LojistaProdutosAPIView.as_view(), name='lojista-produtos'),
    #path('registar/lojista/', novoLojista, name='novoLojista'),
    #path('sucesso/', sucesso, name='sucesso'), 
    #path('criar_login/', criar_login, name='criar_login'),
    #path('lojista/addProduto/sucesso/', sucesso_produto, name='adicionar_produto_successo'), 
    #path('login/cliente/', cliente_login, name='cliente_login'), 
    #path('login/lojista/', lojista_login, name='lojista_login'), 
    #path('lojista/addProduto/', adicionar_produto, name='adicionar_produto'), 
    path('api/produtos/lista', ProdutoListaView.as_view(), name='produtos-lista'),
    path('api/cart/count/', views.get_cart_count, name='cart-count'),
    path('api/favorites/count/', views.get_favorites_count, name='favorites-count'),
    path('api/produtos/search/', views.search_produtos, name='search-produtos'),
    #path('lojista/', LojistaListaView.as_view(), name='lojista-lista'),
    path('lojista_dados/', lojista_dados, name='lojista_dados'),
    path('carrinho/', carrinho, name='carrinho'),
    path('favoritos/', favoritos, name='favoritos'),
    path('api/adicionar_favorito/', AdicionarFavoritoAPIView.as_view(), name='adicionar_favorito'),
    path('api/remover/favorito/', RemoverFavoritoAPIView.as_view(), name='remover_favorito'),
    path('api/listar/favorito/', GetFavoritosAPIView.as_view(), name='listar_favorito'),
    path('api/buscar/produto/', BuscarProdutosAPIView.as_view(), name='buscar_produto'),
    path('api/cliente/editar/', ClienteUpdateAPIView.as_view(), name='cliente-editar'),
    path('produto/', produto, name='produto'),
    path('produto/computadores/', produtos_computadores, name='produtos_computadores'),
    path('produto/acessorios/', produtos_acessorios, name='produtos_acessorios'),
    path('produto/portateis/', produtos_portateis, name='produtos_portateis'),
    path('api/produtos/update/<int:pk>/', views.ProdutoUpdateAPIView.as_view(), name='produto-update'),
    path('api/lojista/produtos-sold/', ProdutosSoldAPIView.as_view(), name='produtos-sold'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler403 = 'projpsi.views.denied_access'
handler404 = 'projpsi.views.not_found'
handler500='projpsi.views.server_error'