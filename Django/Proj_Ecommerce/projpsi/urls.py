from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('cliente/', views.clientes, name='cliente'),
    path('logista/', views.logista, name='logista'),
    path('carrinho/', views.carrinho, name='carrinho'),
    path('produto/', views.produto, name='produto'),
    path('produto/computadores/', views.produtos_computadores, name='produtos_computadores'),
    path('produto/acessorios/', views.produtos_acessorios, name='produtos_acessorios'),
    path('produto/portateis/', views.produtos_portateis, name='produtos_portateis'),
    path('lista/', views.my_view, name='lista'),
]
