from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from django.conf.urls import handler404, handler500
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('registar/cliente/', views.novoCliente, name='novoCliente'),
    path('registar/lojista/', views.novoLojista, name='novoLojista'),
    path('sucesso/', views.sucesso, name='sucesso'), 
    path('login/cliente/', views.cliente_login, name='cliente_login'), 
    path('login/Lojista/', views.lojista_login, name='lojista_login'), 
    path('lojista/addProduto/', views.adicionar_produto, name='adicionar_produto'), 
    path('products/', views.ProdutoListaView.as_view(), name='produtos-lista'),
    path('lojista/', views.lojista, name='lojista'),
    path('lojista_dados/', views.lojista_dados, name='lojista_dados'),
    path('carrinho/', views.carrinho, name='carrinho'),
    path('produto/', views.produto, name='produto'),
    path('produto/computadores/', views.produtos_computadores, name='produtos_computadores'),
    path('produto/acessorios/', views.produtos_acessorios, name='produtos_acessorios'),
    path('produto/portateis/', views.produtos_portateis, name='produtos_portateis'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = 'projpsi.views.not_found'
handler500='projpsi.views.server_error'