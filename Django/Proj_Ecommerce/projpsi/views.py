from django.shortcuts import render, redirect
from django.db.models import Sum
from django.http import HttpResponseNotFound, HttpResponseServerError, HttpResponseForbidden
from django.contrib.auth.models import AbstractBaseUser
from django.utils.timezone import now
from django.http import HttpResponse, HttpResponseForbidden
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from .models import *
from .forms import *
from .serializers import *

import logging

# Create your views here.

def denied_access(request, exception=None):
    #return render(request,'403.html', status=403)
    return HttpResponseForbidden('403 Forbidden: You do not have permission to access this resource.')

def not_found(request, exception):
    #return render(request, '404.html', status=404)
    return HttpResponseNotFound('404 Not Found: The resource does not exist.')

def server_error(request):
    #return render(request, '500.html', status=500)
    return HttpResponseServerError('500 Internal Server Error: An error occurred on the server.')


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

class ClienteRegistrationAPIView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Use POST with nome, email, password, nif, ntelefone, and morada to register a new client."})
    
    def post(self, request, *args, **kwargs):
        serializer = ClienteRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Cliente registrado com sucesso!", "user_id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LojistaRegistrationAPIView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Use POST with nome, email, password, nif, ntelefone, and morada to register a new client."})
    
    def post(self, request, *args, **kwargs):
        serializer = LojistaRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Lojista registrado com sucesso!", "user_id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClienteLoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        request.data.update({'user_type': 'cliente'})
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            tokens = serializer.validated_data
            return Response({
                'access_token': tokens['access'],
                'refresh_token': tokens['refresh'],
                'message': 'Cliente login successful'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LojistaLoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        request.data.update({'user_type': 'lojista'})
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            tokens = serializer.validated_data
            return Response({
                'access_token': tokens['access'],
                'refresh_token': tokens['refresh'],
                'message': 'Lojista login successful'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (TokenError, InvalidToken) as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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


class ProdutoCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not hasattr(request.user, 'lojista'):
            return Response({"error": "Only Lojistas can add products."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProdutoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(lojista=request.user.lojista)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProdutoPorCategoriaAPIView(APIView):
    
    def get(self, request, categoria, format=None):
        produtos = Produto.objects.filter(categoria=categoria)
        
        if not produtos.exists():
            return Response({"error": "Nenhum produto encontrado para esta categoria."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProdutoSerializer(produtos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ClienteUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            cliente = Cliente.objects.get(pk=pk)
            if cliente.user != user:
                return None  
            return cliente
        except Cliente.DoesNotExist:
            return None

    def put(self, request, pk, format=None):
        cliente = self.get_object(pk, request.user)
        if cliente is None:
            return Response({"error": "Cliente não encontrado ou acesso negado."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ClienteSerializer(cliente, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Cliente atualizado com sucesso!", "cliente": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LojistaUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            lojista = Lojista.objects.get(pk=pk)
            if lojista.user != user:
                return None 
            return lojista
        except Lojista.DoesNotExist:
            return None

    def put(self, request, pk, format=None):
        lojista = self.get_object(pk, request.user)
        if lojista is None:
            return Response({"error": "Lojista não encontrado ou acesso negado."}, status=status.HTTP_404_NOT_FOUND)

        serializer = LojistaSerializer(lojista, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Lojista atualizado com sucesso!", "lojista": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




    
@login_required
def adicionar_produto(request): 
    if not hasattr(request.user, 'lojista'):

        return HttpResponseForbidden("Apenas Lojistas podem adicionar produtos.")

    
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
    

class LojistaListaView(generics.ListAPIView):
    queryset = Lojista.objects.all().select_related('user')
    serializer_class = LojistaSerializer

    def get_serializer_context(self):
        return {'request': self.request}



def  lojista(request):
    lojista = Lojista.objects.all()
    context = {
        'lojista': lojista,
    }
    
    return render(request, 'projpsi/lojista_list.html', context)

def lojista_dados(request):
    return render(request, 'projpsi/lojista_dados.html')

def dashboard(request):
    total_lucro = CarrinhoProduto.objects.aaggregate(price=Sum('price'))
    total_pedidos = CarrinhoProduto.objects.all()
    total_produtos = Produto.objects.all()
    pedido_recente = User.objects.all().order_by('')[:6]

    mes = now().month
    mes_lucro = (CarrinhoProduto.objects.filter(mes=mes).aaggregate(price=Sum('price')))


    context = {
        'total_lucro ' : total_lucro,
        'total_pedidos' : total_pedidos,
        'total_produtos' : total_produtos,
        'pedido_recente' : pedido_recente,
        'mes_lucro' : mes_lucro,
    }
    return render(request, "projpsi/dashboard.html", context)


def criar_login(request):
    return render(request, 'projpsi/criar_login.html')


def carrinho(request):
    return render(request, 'projpsi/carrinho.html')

def favoritos(request):
    return HttpResponse('Aqui estão os seus favoritos!')

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
