from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('cliente/', views.clientes, name='cliente'),
    path('logista/', views.logista, name='logista'),
    path('logista_dados/', views.logista_dados, name='logista_dados'),
    path('carrinho/', views.carrinho, name='carrinho'),
    path('produto/', views.produto, name='produto'),
    path('lista/', views.my_view, name='lista'),
]
