from django.urls import path
from . import views
from projpsi.views import index

app_name= 'projpsi'



urlpatterns = [

    path('cliente/', views.clientes, name='cliente'),
    path('logista/', views.logista, name='logista'),
    path('carrinho/', views.carrinho, name='carrinho'),
    path('produto/', views.produto, name='produto'),
    path('lista/', views.my_view, name='lista'),
]
