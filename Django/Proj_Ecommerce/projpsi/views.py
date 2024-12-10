from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404
from projpsi.models import *
from .forms import *
# Create your views here.

def my_view(request): #Lista todos os cientes
    clients_list = Cliente.objects.all()
    output = ", ".join([c.nome for c in clients_list])
    return HttpResponse(output)


def not_found(request, exception):
    return render(request, '404.html', status=404)

def server_error(request):
    return render(request, '500.html', status=500)

def index(request):
    return render(request, "index.html")

def novoCliente(request):
    if request.method == 'POST':
        form = ClienteRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('sucesso')
    else:
        form = ClienteRegistrationForm()
            
    return render(request, 'newClient.html', {'form':form})

def sucesso(request):
    return render(request, 'sucesso.html')
    
def logista(request):
    return HttpResponse("Hello! How can I help you?")

def carrinho(request):
    return HttpResponse('Aqui estão os seus produtos!')

def produto(request):
    return HttpResponse("O produto que procuras está aqui :)")