from django.urls import path
from django.conf.urls import handler404, handler500
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('novocliente/', views.novoCliente, name='novoCliente'),
    path('sucesso/', views.sucesso, name='sucesso'),
    path('logista/', views.logista, name='logista'),
    path('carrinho/', views.carrinho, name='carrinho'),
    path('produto/', views.produto, name='produto'),
    path('lista/', views.my_view, name='lista'),
]

handler404 = 'projpsi.views.not_found'
handler500='projpsi.views.server_error'