from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from django.conf.urls import handler404, handler500
from .views import *


urlpatterns = [
    path('', index, name='index'),
    #path('registar/cliente/', novoCliente, name='novoCliente'),
    path('api/cliente/registo/', ClienteRegistrationAPIView.as_view(), name='api_registro_cliente'),
    path('api/lojista/registo/', LojistaRegistrationAPIView.as_view(), name='api_registro_lojista'),
    path('api/login/cliente/', ClienteLoginAPIView.as_view(), name='cliente_login'),
    path('api/login/lojista/', LojistaLoginAPIView.as_view(), name='lojista_login'),
    path('api/logout/', LogoutAPIView.as_view(), name='logout'),
    #path('registar/lojista/', novoLojista, name='novoLojista'),
    path('sucesso/', sucesso, name='sucesso'), 
    path('criar_login/', criar_login, name='criar_login'),
    path('lojista/addProduto/sucesso/', sucesso_produto, name='adicionar_produto_successo'), 
    #path('login/cliente/', cliente_login, name='cliente_login'), 
    #path('login/lojista/', lojista_login, name='lojista_login'), 
    path('lojista/addProduto/', adicionar_produto, name='adicionar_produto'), 
    path('products/', ProdutoListaView.as_view(), name='produtos-lista'),
    path('lojista/', LojistaListaView.as_view(), name='lojista-lista'),
    path('lojista_dados/', lojista_dados, name='lojista_dados'),
    path('carrinho/', carrinho, name='carrinho'),
    path('favoritos/', favoritos, name='favoritos'),
    path('produto/', produto, name='produto'),
    path('produto/computadores/', produtos_computadores, name='produtos_computadores'),
    path('produto/acessorios/', produtos_acessorios, name='produtos_acessorios'),
    path('produto/portateis/', produtos_portateis, name='produtos_portateis'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = 'projpsi.views.not_found'
handler500='projpsi.views.server_error'