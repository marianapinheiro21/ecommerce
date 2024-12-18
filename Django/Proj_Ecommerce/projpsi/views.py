from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseForbidden
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from rest_framework import generics
from .models import *
from .forms import *
from .serializers import *

# Create your views here.

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

def novoLojista(request):
    if request.method == 'POST':
        form = LojistaRegistrationForm(request.POST)
        if form.is_valid():
            user=form.save()
            login(request, user)
            return redirect('adicionar_produto')
            #return redirect('lojista_dashboard') -> Ainda não criada
    else:
        form = LojistaRegistrationForm()
            
    return render(request, 'newLojista.html', {'form':form})

def sucesso(request):
    return render(request, 'sucesso.html')

def sucesso_produto(request):
    return render(request, 'sucesso_addProduto.html')

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
    
def lojista_login(request):
    if request.method == 'POST':
        form = CustomLoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']
            # Check if the user is a Lojista
            if not hasattr(user, 'lojista'):
                form.add_error(None, "Este usuário não está registrado como Lojista")
            else:
                login(request, user)
                return redirect('adicionar_produto') 
                #return redirect('lojista_dashboard') -> Ainda não criada
    else:
        form = CustomLoginForm()

    return render(request, 'lojista_login.html', {'form': form})

@login_required
def adicionar_produto(request): 
    if not hasattr(request.user, 'lojista'):
        return HttpResponseForbidden("Apenas lojistas podem adicionar produtos.")
    
    if request.method == 'POST':
        form = ProdutoForm(request.POST, request.FILES)  
        formset = ProdutoImagemFormSet(request.POST, request.FILES, queryset=ProdutoImagem.objects.none())  
        
        
        if form.is_valid() and formset.is_valid():
            produto = form.save(commit=False)
            produto.lojista = request.user.lojista
            produto.save() 
            imagens = formset.save(commit=False)
            for imagem in imagens:
                imagem.produto = produto  
                imagem.save()  
            return redirect('adicionar_produto_successo')
            #return redirect ('sucesso') #Tenho que criar outra página de sucesso
        else: 
            print("Form errors:", form.errors)
            print("Formset errors:", formset.errors)
    else:
        form = ProdutoForm()
        formset = ProdutoImagemFormSet(queryset=ProdutoImagem.objects.none())
    return render(request, 'addProduct.html', {'form':form, 'formset': formset})

class ProdutoListaView(generics.ListAPIView):
    queryset = Produto.objects.all().select_related('lojista', 'lojista__user')
    serializer_class = ProdutoSerializer
    
    def get_serializer_context(self):
        return {'request': self.request}

def lojista(request):
    lojistas = lojista.objects.all()
    context = {
        'lojistas': lojistas,
    }
    return render (request,'projpsi/lojista_list.html',context)

def lojista_dados(request):
    return render(request, 'projpsi/lojista_dados.html')

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
