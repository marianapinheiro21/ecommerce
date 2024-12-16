from django.urls import path
from django.conf.urls import handler404, handler500
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('novocliente/', views.novoCliente, name='novoCliente'),
    path('novologista/', views.novoLogista, name='novoLogista'),
    path('sucesso/', views.sucesso, name='sucesso'),
    path('login/cliente', views.cliente_login, name='cliente_login'),
    path('login/logista', views.logista_login, name='logista_login'),
    path('logista/', views.logista, name='logista'),
    path('carrinho/', views.carrinho, name='carrinho'),
    path('produto/', views.produto, name='produto'),
    path('produto/computadores/', views.produtos_computadores, name='produtos_computadores'),
    path('produto/acessorios/', views.produtos_acessorios, name='produtos_acessorios'),
    path('produto/portateis/', views.produtos_portateis, name='produtos_portateis'),
    path('lista/', views.my_view, name='lista'),
]

handler404 = 'projpsi.views.not_found'
handler500='projpsi.views.server_error'