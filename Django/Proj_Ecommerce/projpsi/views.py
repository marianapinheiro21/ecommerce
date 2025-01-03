from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Sum
from django.http import HttpResponseNotFound, HttpResponseServerError, HttpResponseForbidden
from django.contrib.auth.models import AbstractBaseUser
from django.utils.timezone import now
from django.http import HttpResponse, HttpResponseForbidden
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.parsers import MultiPartParser, FormParser
from .models import *
from .forms import *
from .serializers import *
from .permissions import *
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from projpsi.models import Cliente, Produto, Carrinho, CarrinhoProduto
import logging
from django.conf import settings

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
    permission_classes = [IsAuthenticated, IsLojista]
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        
        serializer = ProdutoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            #produto = serializer.save(lojista=request.user.lojista)
            produto = serializer.save()
            return Response({"message": "Product created successfully.", "product_id": produto.id}, status=201)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProdutoPorCategoriaAPIView(APIView):
    
    def get(self, request, categoria, format=None):
        produtos = Produto.objects.filter(categoria=categoria)
        
        if not produtos.exists():
            return Response({"error": "Nenhum produto encontrado para esta categoria."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProdutoSerializer(produtos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ClienteUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCliente]
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ClienteSerializer

    def put(self, request, *args, **kwargs):
        cliente = getattr(request.user, 'cliente', None)
        
        if cliente is None:
            return Response({"error": "Only registered clients can edit their data."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ClienteSerializer(cliente, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Client data updated successfully."}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LojistaUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsLojista]

    def put(self, request, *args, **kwargs):
        
        lojista = getattr(request.user, 'lojista', None)
        
        if lojista is None:
            return Response({"error": "Only registered lojistas can edit their data."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = LojistaSerializer(lojista, data=request.data, partial=True)  
        
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

 #           return Response({"message": "Lojista data updated successfully."}, status=status.HTTP_200_OK)
  #      else:
   #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#
#    
#@login_required
#def adicionar_produto(request): 
#    if not hasattr(request.user, 'lojista'):
#
#        return HttpResponseForbidden("Apenas Lojistas podem adicionar produtos.")
#
#    
#    if request.method == 'POST':
#        form = ProdutoForm(request.POST, request.FILES)  
#        formset = ProdutoImagemFormSet(request.POST, request.FILES, queryset=ProdutoImagem.objects.none())  
#        
#        
#        if form.is_valid() and formset.is_valid():
#            produto = form.save(commit=False)
#            produto.lojista = request.user.lojista
#            produto.save() 
#            imagens = formset.save(commit=False)
#            for imagem in imagens:
#                imagem.produto = produto  
#                imagem.save()  
#            return redirect('adicionar_produto_successo')
#            #return redirect ('sucesso') #Tenho que criar outra página de sucesso
#        else: 
#            print("Form errors:", form.errors)
#            print("Formset errors:", formset.errors)
#    else:
#        form = ProdutoForm()
#        formset = ProdutoImagemFormSet(queryset=ProdutoImagem.objects.none())
#    return render(request, 'addProduct.html', {'form':form, 'formset': formset})
#

class ProdutoListaView(generics.ListAPIView):
    queryset = Produto.objects.all().select_related('lojista', 'lojista__user')
    serializer_class = ProdutoSerializer
    
    def get_serializer_context(self):
        return {'request': self.request}
    

class LojistaListAPIView(generics.ListAPIView):
    queryset = Lojista.objects.all() 
    serializer_class = LojistaSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        lojistas = Lojista.objects.all()
        dados_lojistas = []

        for lojista in lojistas:
            # Calcular o total ganho
            total_ganho = Produto.objects.filter(lojista=lojista).aggregate(total=models.Sum('preco'))['total'] or 0
            
            dados_lojistas.append({
                'id': lojista.id,
                'nome': lojista.nome,
                'total_ganho': total_ganho
            })

        return Response(dados_lojistas, status=status.HTTP_200_OK)

#class LojistaListaView(generics.ListAPIView):
#    queryset = Lojista.objects.all().select_related('user')
#    serializer_class = LojistaSerializer
#
#    def get_serializer_context(self):
#        return {'request': self.request}



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
    
    ###################################### API ADICIONAR FAVORITO #########################

class AdicionarFavoritoAPIView(APIView):
    permission_classes = [IsAuthenticated] #Quando for testar a API fazer login como um cliente, para não precisar passar o user, somente o produto
    
    def post(self, request, *args, **kwargs):
        user_id = request.user.id
        produto_id = request.data.get('produto_id')  
        
        if not produto_id:
            return Response({"error": "produto_id é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            produto = Produto.objects.get(id=produto_id)
        except Produto.DoesNotExist:
            return Response({"error": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        if Favorito.objects.filter(id_cliente=user_id, produto_id=produto_id).exists():
            return Response({"error": "Esta produto já foi adicionado aos favoritos"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = FavoritoSerializer(data={'id_cliente': user_id, 'produto_id': produto_id})

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Produto adicionado aos favoritos com sucesso!"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
        
class RemoverFavoritoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user_id = request.user.id
        produto_id = request.data.get ('produto_id')

        if not produto_id:
            return Response({"error": "produto_id é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            produto = Produto.objects.get(id=produto_id)
        except Produto.DoesNotExist:
            return Response({"error": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        favorito = Favorito.objects.filter(id_cliente=user_id, produto_id=produto_id).first()
        if not favorito:
            return Response({"error": "Produto não encontrado nos seus favoritos."}, status=status.HTTP_404_NOT_FOUND)
        favorito.delete()

        return Response({"message": "Produto removido dos favoritos com sucesso!"}, status=status.HTTP_200_OK)

class CarrinhoProdutoAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCliente]
    
    def post(self, request):
        cliente=request.user.cliente
        
        carrinho=Carrinho.objects.filter(cliente=cliente, venda__isnull=True).first()
        if not carrinho:
            return Response({"error": "No active Carrinho available"}, status=status.HTTP_404_NOT_FOUND)

        request.data['carrinho']=carrinho.id
        serializer=CarrinhoProdutoSerializer(data=request.data, context={'request':request})
        if serializer.is_valid():
            carrinhoproduto=serializer.save()
            return Response({
                    'message': 'Produto adicionado ao carrinho com sucesso!',
                    'carrinhoProduto': CarrinhoProdutoSerializer(carrinhoproduto).data
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class CreateVendaAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCliente]
    def post(self, request):
        serializer=VendaSerializer(data=request.data, context={'request':request})
        if serializer.is_valid():
            venda=serializer.save()
            return Response({
                'id':venda.id,
                'message': 'Venda concluida!'
            }, status=201)
        return Response(serializer.errors, status=400)
    
    
class ProdutosNoCarrinhoAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCliente]

    def get(self, request):
        cliente = request.user.cliente
        carrinho_produtos = CarrinhoProduto.objects.filter(carrinho__cliente=cliente, venda__isnull=True)
        serializer = CarrinhoProdutoSerializer(carrinho_produtos, many=True)
        return Response(serializer.data)
    
class ProdutosCompradosAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCliente]

    def get(self, request):
        cliente = request.user.cliente
        carrinho_produtos = CarrinhoProduto.objects.filter(carrinho__cliente=cliente, venda__isnull=False)
        serializer = CarrinhoProdutoSerializer(carrinho_produtos, many=True)
        return Response(serializer.data)
    
    
class LojistaVendasAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsLojista]
    serializer_class = GetVendaSerializerLojista

    def get_queryset(self):
        lojista = getattr(self.request.user, 'lojista', None)
        if not lojista:
            return Venda.objects.none()
        return Venda.objects.filter(carrinho__cliente__id=lojista.user.id)
