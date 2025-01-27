from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Sum
from django.http import Http404, HttpResponseNotFound, HttpResponseServerError, HttpResponseForbidden
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
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from .models import *
from .forms import *
from .serializers import *
from .permissions import *
from rest_framework.pagination import PageNumberPagination
import json
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from projpsi.models import Cliente, Produto, Carrinho, CarrinhoProduto
import logging
from django.conf import settings
from django.db.models import Q, F, Sum#Consultas na barra de navegação
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
logger = logging.getLogger(__name__)
from rest_framework import status
from rest_framework.permissions import AllowAny 
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Produto
from .serializers import ProdutoSerializer





#####Parâmetro para o JWT#####
token_param_config = openapi.Parameter(
    'Authorization',
    openapi.IN_HEADER,
    description="Token de autenticação JWT. Exemplo: Bearer <access_token>",
    type=openapi.TYPE_STRING
)


#####Configuração do parâmetro de categoria####
categoria_param = openapi.Parameter(
    'categoria',
    openapi.IN_PATH,
    description="Escolha uma categoria",
    type=openapi.TYPE_STRING,
    enum=[choice[0] for choice in Produto.campos],  # Lista de categorias predefinidas
)

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
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        return Response({"message": "Use POST with nome, email, password, nif, ntelefone, and morada to register a new client."})
    
    def post(self, request, *args, **kwargs):
        serializer = ClienteRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Cliente registrado com sucesso!", "user_id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LojistaRegistrationAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        return Response({"message": "Use POST with nome, email, password, nif, ntelefone, and morada to register a new client."})
    
    def post(self, request, *args, **kwargs):
        serializer = LojistaRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Lojista registrado com sucesso!", "user_id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClienteLoginAPIView(APIView):
    permission_classes = [AllowAny]   ############################## 
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
    permission_classes = [AllowAny]
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

class ProdutoDetalheView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            produto = Produto.objects.get(pk=pk)
            serializer = ProdutoSerializer(produto)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Produto.DoesNotExist:
            return Response({"error": "Produto não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        
class CategoriaChoicesAPIView(APIView):
    """
    API para listar todas as opções de categorias disponíveis.
    """
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        categorias = dict(Produto.campos)  # Converte os choices em um dicionário
        return Response(categorias, status=status.HTTP_200_OK)
    

    

class ProdutoPorCategoriaAPIView(APIView):
    """
    API para listar produtos de uma categoria específica.
    """
    permission_classes = [AllowAny]
    @swagger_auto_schema(manual_parameters=[categoria_param])
    def get(self, request, categoria, format=None):
        produtos = Produto.objects.filter(categoria=categoria)
        serializer = ProdutoSerializer(produtos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    



class ClienteUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCliente]

    def get_cliente(self, request):
        """Obtém o cliente autenticado a partir do usuário."""
        cliente = getattr(request.user, 'cliente', None)
        if cliente is None:
            return None, Response({"error": "Cliente não encontrado."}, status=404)
        return cliente, None

    @swagger_auto_schema(
        manual_parameters=[token_param_config],
        operation_description="Obter os dados do cliente autenticado",
        responses={
            200: ClienteSerializer,
            404: openapi.Response("Cliente não encontrado."),
        },
    )
    def get(self, request, *args, **kwargs):
        cliente, error_response = self.get_cliente(request)
        if error_response:
            return error_response

        serializer = ClienteSerializer(cliente)
        return Response(serializer.data, status=200)

    @swagger_auto_schema(
        manual_parameters=[token_param_config],
        request_body=ClienteSerializer,
        operation_description="Atualizar os dados do cliente autenticado",
        responses={
            200: ClienteSerializer,
            400: openapi.Response("Erro na validação dos dados."),
            404: openapi.Response("Cliente não encontrado."),
        },
    )
    def put(self, request, *args, **kwargs):
        """
        Atualiza todos os campos do cliente autenticado.
        """
        return self._update(request, partial=False)

    @swagger_auto_schema(
        manual_parameters=[token_param_config],
        request_body=ClienteSerializer,
        operation_description="Atualizar parcialmente os dados do cliente autenticado",
        responses={
            200: ClienteSerializer,
            400: openapi.Response("Erro na validação dos dados."),
            404: openapi.Response("Cliente não encontrado."),
        },
    )
    def patch(self, request, *args, **kwargs):
        """
        Atualiza parcialmente os campos do cliente autenticado.
        """
        return self._update(request, partial=True)

    def _update(self, request, partial):
        cliente, error_response = self.get_cliente(request)
        if error_response:
            return error_response
        
        ################ Atualiza dados do Utilizador também
        usuario = cliente.user  # 'user' é a relação OneToOne 
        if 'nome' in request.data:
            usuario.nome = request.data['nome']
        if 'email' in request.data:
            usuario.email = request.data['email']
        if 'ntelefone' in request.data:
            usuario.ntelefone = request.data['ntelefone']
    # podemos adicionar par atualizar no Utilizador.

    
        usuario.save()

        ################# Atualiza os dados do cliente autenticado
        serializer = ClienteSerializer(cliente, data=request.data, partial=partial, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

        # Retorna mensagens de erro
        return Response({
            "error": "Erro na validação dos dados.","details": serializer.errors}, status=400)
    

class LojistaUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsLojista]
    parser_classes = (MultiPartParser, FormParser)

    def get_lojista(self, request):
        """
        Obtém o lojista autenticado.
        """
        lojista = getattr(request.user, 'lojista', None)
        if lojista is None:
            return None, Response({"error": "Apenas lojistas registados podem aceder ou editar os seus dados."}, status=status.HTTP_403_FORBIDDEN)
        return lojista, None

    def get(self, request, *args, **kwargs):
        """
        Retorna os dados do lojista autenticado.
        """
        lojista, error_response = self.get_lojista(request)
        if error_response:
            return error_response

        serializer = LojistaSerializer(lojista)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        """
        Atualiza todos os dados do lojista.
        """
        return self._update(request, partial=False)

    def patch(self, request, *args, **kwargs):
        """
        Atualiza parcialmente os dados do lojista.
        """
        return self._update(request, partial=True)

    def _update(self, request, partial):
        """
        Função auxiliar para atualização de dados do lojista.
        """
        lojista, error_response = self.get_lojista(request)
        if error_response:
            return error_response

        serializer = LojistaSerializer(lojista, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Dados do lojista atualizados com sucesso.", "data": serializer.data}, status=status.HTTP_200_OK)

        return Response({
            "error": "Erro ao atualizar os dados do lojista.",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

        
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

class ProdutoDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            produto = Produto.objects.select_related('lojista', 'lojista__user').get(pk=pk)
            serializer = ProdutoDetailSerializer(produto)
            return Response(serializer.data)
        except Produto.DoesNotExist:
            return Response(
                {"error": "Produto não encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

class ProdutoListaView(generics.ListAPIView):
    pagination_class = PageNumberPagination
    page_size = 12  
    permission_classes = [AllowAny]
    serializer_class = ProdutoSerializer

    def get_queryset(self):
        queryset = Produto.objects.all().select_related('lojista', 'lojista__user')
        lojista_id = self.request.query_params.get('lojista', None)
        
        if lojista_id:
            queryset = queryset.filter(lojista_id=lojista_id)
        
        return queryset

    def get_serializer_context(self):
        return {'request': self.request}
    

class PublicLojistaListAPIView(APIView):
    """
    API para listar todos os lojistas (dados básicos).
    Não requer autenticação.
    """
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        lojistas = Lojista.objects.select_related('user').all()
        serializer = PublicLojistaSerializer(lojistas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LojistaDetailView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, user_id):
        try:
            lojista = Lojista.objects.select_related('user').get(user_id=user_id)
            serializer = PublicLojistaSerializer(lojista)
            return Response(serializer.data)
        except Lojista.DoesNotExist:
            return Response(
                {"error": "Lojista não encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
    
class PrivateLojistaAPIView(APIView):
    """
    API para obter os dados completos do lojista autenticado.
    Requer autenticação.
    """
    permission_classes = [IsAuthenticated, IsLojista]

    def get(self, request, format=None):
        try:
            lojista = Lojista.objects.select_related('user').get(user=request.user)
        except Lojista.DoesNotExist:
            return Response(
                {"detail": "Lojista não encontrado para o usuário autenticado."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = PrivateLojistaSerializer(lojista)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    permission_classes = [IsAuthenticated, IsCliente] 
    
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
    permission_classes = [IsAuthenticated, IsCliente]

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


    
class GetFavoritosAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCliente]

    def get(self, request, *args, **kwargs):
        user_id = request.user.id

        favoritos = Favorito.objects.filter(id_cliente=user_id)

        if not favoritos.exists():
            return Response({"message": "Nenhum produto encontrado nos seus favoritos."}, status=status.HTTP_404_NOT_FOUND)

        produtos_favoritos = []
        for favorito in favoritos:
            produto = favorito.produto_id  
            produtos_favoritos.append({
                "Produto": produto.nome,
                "Descricao": produto.descricao,
                "Preço": produto.preco,
                "categoria": produto.categoria,
            })
        return Response({"favoritos": produtos_favoritos}, status=status.HTTP_200_OK)


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

class RemoverProdutosCarrinhoAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCliente]

    def delete(self, request, *args, **kwargs):
        user_id = request.user.id
        produto_id = request.data.get('produto_id')

        if not produto_id:
            return Response({"error": "produto_id é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            carrinho_produto = CarrinhoProduto.objects.get(
                carrinho__cliente=user_id,
                produto_id=produto_id
            )
        except CarrinhoProduto.DoesNotExist:
            return Response({"error": "Produto não encontrado no carrinho."}, status=status.HTTP_404_NOT_FOUND)

        if carrinho_produto.venda is not None:
            return Response({"error": "Este produto já está associado a uma venda e não pode ser removido."}, status=status.HTTP_400_BAD_REQUEST)

        carrinho = carrinho_produto.carrinho
        if not carrinho:
            return Response({"error": "Carrinho não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        preco_produto = carrinho_produto.produto.preco  
        total_antigo = carrinho.total or 0
        novo_total = total_antigo - (preco_produto * carrinho_produto.quantidade)

        if novo_total < 0:
            novo_total = 0

        carrinho_produto.delete()

        carrinho.total = novo_total
        carrinho.save()

        return Response({"message": "Produto removido do carrinho e total atualizado com sucesso!"}, status=status.HTTP_200_OK)
    
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
    serializer_class = VendaSerializer  # Ensure you have an appropriate serializer

    def get(self, request, *args, **kwargs):
        lojista_id = request.user.id
        total_sales = CarrinhoProduto.objects.filter(
            carrinho__venda__isnull=False,  # Ensures that the Carrinho is part of a Venda
            produto__lojista_id=lojista_id
        ).annotate(
            total_price=F('produto__preco') * F('quantidade')
        ).aggregate(
            total_sales=Sum('total_price')
        )

        return Response({"total_sales": total_sales['total_sales']})
    
    def get_queryset(self):
        lojista_id = self.request.user.lojista.id
        vendas = CarrinhoProduto.objects.filter(
            carrinho__venda__isnull=False,  # Ensures that the Carrinho is part of a Venda
            produto__lojista_id=lojista_id
        ).annotate(
            total_price=F('produto__preco') * F('quantidade')
        ).aggregate(
            total_sales=Sum('total_price')
        )

        return vendas
    

class ProdutosSoldAPIView(APIView):
    permission_classes = [IsAuthenticated, IsLojista]

    def get(self, request, *args, **kwargs):
        lojista_id = request.user.id
        produtos_sold = CarrinhoProduto.objects.filter(
            carrinho__venda__isnull=False,  # Ensure the Carrinho has been checked out
            produto__lojista_id=lojista_id
        ).values(
            'produto_id', 'produto__nome', 'produto__preco'
        ).annotate(
            total_quantity=Sum('quantidade')
        ).order_by('-total_quantity')

        serializer = ProdutoSoldSerializer(produtos_sold, many=True)
        return Response(serializer.data)
    
class UpdateCarrinhoProdutoAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCliente]

    def patch(self, request):
        produto_id = request.data.get('produto_id')
        nova_quantidade = request.data.get('quantidade')

        if not produto_id or nova_quantidade is None:
            return Response({"error": "produto_id e quantidade são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            carrinho_produto = CarrinhoProduto.objects.get(
                carrinho__cliente=request.user.cliente, 
                produto_id=produto_id
            )
        except CarrinhoProduto.DoesNotExist:
            return Response({"error": "Produto não encontrado no carrinho."}, status=status.HTTP_404_NOT_FOUND)

        if nova_quantidade < 1:
            return Response({"error": "Quantidade deve ser ao menos 1."}, status=status.HTTP_400_BAD_REQUEST)

        if carrinho_produto.produto.stock < nova_quantidade:
            return Response({
                "error": "Stock insuficiente. Stock disponível: {}".format(carrinho_produto.produto.stock)
            }, status=status.HTTP_400_BAD_REQUEST)

        carrinho_produto.quantidade = nova_quantidade
        carrinho_produto.save()

        carrinho = carrinho_produto.carrinho
        carrinho.total = sum(item.quantidade * item.produto.preco for item in CarrinhoProduto.objects.filter(carrinho=carrinho))
        carrinho.save()

        return Response({"message": "Quantidade atualizada com sucesso!"}, status=status.HTTP_200_OK)

class LojistaProdutosAPIView(generics.ListAPIView):
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated, IsLojista]  # Ensures the user is authenticated

    def get_queryset(self):
        """
        This view should return a list of all the products
        for the currently authenticated lojista.
        """
        lojista = self.request.user.lojista
        return Produto.objects.filter(lojista=lojista)
        
    
class ProdutoUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsLojista]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_object(self, pk):
        try:
            return Produto.objects.get(pk=pk)
        except Produto.DoesNotExist:
            raise Http404

    def put(self, request, pk, format=None):
        produto = self.get_object(pk)
        serializer = ProdutoSerializer(produto, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        
class BuscarProdutosAPIView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', None)

        if not query:
            return Response({"error": "Parâmetro obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        
        palavras = query.split()
        filtro = Q()
        for palavra in palavras:
            filtro |= Q(nome__icontains=palavra) | Q(descricao__icontains=palavra) | Q(categoria__icontains=palavra)

        produto_id = Produto.objects.filter(filtro).distinct()

        serializer = ProdutoSerializer(produto_id, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ClienteDadosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            cliente = Cliente.objects.get(user=request.user)
            data = {
                'nome': cliente.user.nome,
                'email': cliente.user.email,
                'nif': cliente.user.nif,
                'ntelefone': cliente.user.ntelefone,
                'morada': cliente.user.morada
            }
            return Response(data)
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente não encontrado'}, status=404)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart_count(request):
    try:
        cliente = Cliente.objects.get(user=request.user)
        count = CarrinhoProduto.objects.filter(
            carrinho__cliente=cliente,
            venda__isnull=True
        ).count()
        print(f"Cart count for user {request.user.email}: {count}")
        return Response({'count': count})
    except Exception as e:
        print(f"Error in get_cart_count: {str(e)}")
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorites_count(request):
    try:
        cliente = Cliente.objects.get(user=request.user)
        count = Favorito.objects.filter(
            id_cliente=cliente
        ).count()
        print(f"Favorites count for user {request.user.email}: {count}")
        return Response({'count': count})
    except Exception as e:
        print(f"Error in get_favorites_count: {str(e)}")
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
def search_produtos(request):
    """Pesquisa produtos por nome ou descrição"""
    query = request.query_params.get('q', '')
    if len(query) < 3:
        return Response([])

    try:
        produtos = Produto.objects.filter(
            Q(nome__icontains=query) |
            Q(descricao__icontains=query)
        ).select_related('lojista')  # Otimiza a query

        # Formata os resultados incluindo todas as informações necessárias
        results = []
        for produto in produtos[:10]:  # Limita a 10 resultados
            produto_data = {
                'id': produto.id,
                'nome': produto.nome,
                'preco': float(produto.preco),  # Converte Decimal para float
                'descricao': produto.descricao,
                'categoria': produto.categoria,
            }
            
            # Adiciona a primeira imagem do produto, se existir
            primeira_imagem = ProdutoImagem.objects.filter(produto=produto).first()
            if primeira_imagem:
                produto_data['imagem'] = request.build_absolute_uri(primeira_imagem.imagem.url)
            else:
                produto_data['imagem'] = None

            results.append(produto_data)
        
        return Response(results)
    except Exception as e:
        print(f"Erro na busca de produtos: {str(e)}")
        return Response({'error': str(e)}, status=400)