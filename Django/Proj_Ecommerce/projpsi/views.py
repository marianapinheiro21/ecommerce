from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from projpsi.models import *
from .forms import *
# Create your views here.

def my_view(request): #Lista todos os clientes -> Apenas Teste
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
            user=form.save()
            login(request, user)
            return redirect('sucesso')
    else:
        form = ClienteRegistrationForm()
            
    return render(request, 'newClient.html', {'form':form})

def novoLogista(request):
    if request.method == 'POST':
        form = LogistaRegistrationForm(request.POST)
        if form.is_valid():
            user=form.save()
            login(request, user)
            return redirect('sucesso')
    else:
        form = LogistaRegistrationForm()
            
    return render(request, 'newLogista.html', {'form':form})

def sucesso(request):
    return render(request, 'sucesso.html')


def cliente_login(request):
    
    if request.method=='POST':
        form=CustomLoginForm(request.POST)
        if form.is_valid():
            user=form.cleaned_data['user']
            if not hasattr(user, 'cliente'):
                form.add_error(None, "Este usuário não está registrado como Cliente")
            else:
                login(request, user)
                return redirect('index') 
                #return redirect('cliente_dashboard') -> Ainda não criada
            
        #else:
        #    print("Form errors: ", form.errors)
            
    else:
        form=CustomLoginForm()
           
    return render(request, 'cliente_login.html', {'form': form})
    
def logista_login(request):
    if request.method == 'POST':
        form = CustomLoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']
            # Check if the user is a Logista
            if not hasattr(user, 'logista'):
                form.add_error(None, "Este usuário não está registrado como Logista")
            else:
                login(request, user)
                return redirect('index') 
                #return redirect('logista_dashboard') -> Ainda não criada
    else:
        form = CustomLoginForm()

    return render(request, 'logista_login.html', {'form': form})

def adicionar_produto(request): #Não testado
    if request.method == 'POST':
        form = ProdutoForm(request.POST, request.FILES)    
        if form.is_valid():
            form.save()
            return redirect ('sucesso')
    else:
        form = ProdutoForm()
    return render(request, 'addProduct.html', {'form':form})


def logista(request):
    logistas = Logista.objects.all()
    context = {
        'logistas': logistas,
    }
    return render (request,'projpsi/logista_list.html',context)

def logista_dados(request):
    return render(request, 'projpsi/logista_dados.html')

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
