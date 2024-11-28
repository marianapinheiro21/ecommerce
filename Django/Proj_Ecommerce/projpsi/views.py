from django.shortcuts import render
from django.http import HttpResponse
from projpsi.models import *
# Create your views here.

def my_view(request):
    objects = Cliente.objects.all()
    return HttpResponse(objects)

def index(request):
    return render(request, "./projpsi/index2.html")

def clientes(request):
    return HttpResponse("Hello!!")

def logista(request):
    return HttpResponse("Hello! How can I help you?")

def carrinho(request):
    return HttpResponse('Aqui estão os seus produtos!')

def produto(request):
    return HttpResponse("O produto que procuras está aqui :)")