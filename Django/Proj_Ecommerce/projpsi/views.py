from django.shortcuts import render
from django.http import HttpResponse
from projpsi.models import *
# Create your views here.

def my_view(request): #Lista todos os cientes
    clients_list = Cliente.objects.all()
    output = ", ".join([c.nome for c in clients_list])
    return HttpResponse(output)

def index(request):
    return render(request, "projpsi/index.html")

def index(request):
    return render(request, "./projpsi/index.html")

def clientes(request):
    return HttpResponse("Hello!!")

def logista(request):
    return HttpResponse("Hello! How can I help you?")

def carrinho(request):
    return HttpResponse('Aqui estão os seus produtos!')

def produto(request):
    return HttpResponse("O produto que procuras está aqui :)")