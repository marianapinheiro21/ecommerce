from django.shortcuts import render
from django.http import HttpResponse, Http404
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
    logista = Logista.objects.all()
    context= {
        'logista':logista,
    }
    return render (request,'projpsi/logista_list.html',context)

def carrinho(request):
    return HttpResponse('Aqui estão os seus produtos!')

def produtos_computadores(request):
    return render(request, 'projpsi/produtos_computadores.html')

def produtos_acessorios(request):
    return render(request, 'projpsi/produtos_acessorios.html')

def produtos_portateis(request):
    return render(request, 'projpsi/produtos_portateis.html')

def produto(request):
    categoria = request.GET.get('categoria')  # Recebe a categoria como parâmetro
    if categoria == 'computadores':
        return render(request, 'projpsi/produtos_computadores.html')
    elif categoria == 'acessorios':
        return render(request, 'projpsi/produtos_acessorios.html')
    elif categoria == 'portateis':
        return render(request, 'projpsi/produtos_portateis.html')
    else:
        return render(request, 'projpsi/produtos_geral.html')  # Página geral
