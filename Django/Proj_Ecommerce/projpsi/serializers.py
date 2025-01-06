from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.db import transaction
 


class TokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class BaseRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilizador
        fields = ['email', 'nome', 'nif', 'ntelefone', 'morada', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True},
            'nome': {'required': True},
        }

    def validate_nif(self, value):
        if value and len(str(value)) != 9:
            raise serializers.ValidationError("O NIF deve conter exatamente 9 dígitos.")
        return value

    def validate_ntelefone(self, value):
        if value and len(str(value)) != 9:
            raise serializers.ValidationError("O número de telefone deve conter exatamente 9 dígitos.")
        return value
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class ClienteRegistrationSerializer(BaseRegistrationSerializer):
    class Meta(BaseRegistrationSerializer.Meta):
        extra_kwargs = {
            **BaseRegistrationSerializer.Meta.extra_kwargs,
            'nif': {'required': False},
            'ntelefone': {'required': False},
            'morada': {'required': False}
        }

    def create(self, validated_data):
        user = super().create(validated_data)
        cliente=Cliente.objects.create(user=user)
        Carrinho.objects.create(cliente=cliente, total=0.0)
        return user

class LojistaRegistrationSerializer(BaseRegistrationSerializer):
    class Meta(BaseRegistrationSerializer.Meta):
        extra_kwargs = {
            **BaseRegistrationSerializer.Meta.extra_kwargs,
            'nif': {'required': True},
            'ntelefone': {'required': True},
            'morada': {'required': True}
        }

    def create(self, validated_data):
        user = super().create(validated_data)
        Lojista.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    user_type = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if user and user.is_active:
            if (data['user_type'] == 'cliente' and hasattr(user, 'cliente')) or (data['user_type'] == 'lojista' and hasattr(user, 'lojista')):
                refresh = RefreshToken.for_user(user)
                return {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': user
                }
            else:
                raise serializers.ValidationError(f"This user is not registered as a {data['user_type']}.")
        raise serializers.ValidationError("Incorrect Credentials")


class UtilizadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilizador
        fields =['email', 'nome', 'nif', 'ntelefone', 'morada']


class LojistaSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Utilizador.objects.all())
    total_ganho = serializers.SerializerMethodField()
    nome = serializers.SerializerMethodField(source='user.nome')
    email = serializers.SerializerMethodField(source='user.email')
    nif = serializers.SerializerMethodField(source='user.nif')
    ntelefone = serializers.SerializerMethodField(source='user.ntelefone')
    morada = serializers.SerializerMethodField(source='user.morada')

    class Meta:
        model = Lojista
        fields = ['user', 'nome', 'email', 'nif', 'ntelefone', 'morada', 'total_ganho']

    def validate_email(self, value):
        """
        Valida se o email já está em uso.
        """
        lojista_atual = self.instance
        if Utilizador.objects.filter(email=value).exclude(pk=lojista_atual.pk).exists():
            raise serializers.ValidationError("Este email já está em uso por outro lojista.")
        return value

    def validate_nif(self, value):
        """
        Valida o NIF.
        """
        if len(str(value)) != 9 or not str(value).isdigit():
            raise serializers.ValidationError("O NIF deve ter exatamente 9 dígitos numéricos.")
        lojista_atual = self.instance
        if Lojista.objects.filter(user__nif=value).exclude(pk=lojista_atual.pk).exists():
            raise serializers.ValidationError("Este NIF já está em uso por outro lojista.")
        return value

    def update(self, instance, validated_data):
        """
        Atualiza os dados do lojista.
        """
        user_data = validated_data.pop('user', {})
        
        # Atualiza os dados do utilizador associado
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        # Atualiza os próprios dados do lojista
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance
    

class PublicLojistaSerializer(serializers.ModelSerializer):
    """
    Serializer para exibir apenas dados básicos dos lojistas (público).
    """
    id = serializers.IntegerField(source='user.id')  
    nome = serializers.CharField(source='user.nome')
    nif = serializers.DecimalField(source='user.nif', max_digits=9, decimal_places=0)
    email = serializers.EmailField(source='user.email')
    ntelefone = serializers.DecimalField(source='user.ntelefone', max_digits=9, decimal_places=0)
    morada = serializers.CharField(source='user.morada')

    class Meta:
        model = Lojista
        fields = ['id', 'nome','email', 'nif', 'ntelefone', 'morada']

    def get_nome(self, obj):
        return obj.user.nome
    
class PrivateLojistaSerializer(serializers.ModelSerializer):
    """
    Serializer para exibir os dados completos do lojista autenticado.
    """
    id = serializers.IntegerField(source='user.id')
    total_ganho = serializers.SerializerMethodField()
    nome = serializers.SerializerMethodField(source='user.nome')
    email = serializers.SerializerMethodField(source='user,email')
    nif = serializers.SerializerMethodField(source='user.nif')
    ntelefone = serializers.SerializerMethodField(source='user.ntelefone')
    morada = serializers.SerializerMethodField(source='user.morada')

    class Meta:
        model = Lojista
        fields = ['user', 'nome', 'email', 'nif', 'ntelefone', 'morada', 'total_ganho']

    def get_nome(self, obj):
        return obj.user.nome

    def get_email(self, obj):
        return obj.user.email

    def get_nif(self, obj):
        return obj.user.nif

    def get_ntelefone(self, obj):
        return obj.user.ntelefone

    def get_morada(self, obj):
        return obj.user.morada

    def get_total_ganho(self, obj):
        from .models import Produto
        total_ganho = Produto.objects.filter(lojista=obj).aggregate(total=models.Sum('preco'))['total'] or 0
        return total_ganho


class ClienteSerializer(serializers.ModelSerializer):

    user = serializers.PrimaryKeyRelatedField(read_only=True)

    
    email = serializers.EmailField(source='user.email', required=True)
    nome = serializers.CharField(source='user.nome', required=True)
    nif = serializers.DecimalField(source='user.nif', max_digits=9, decimal_places=0, required=False)
    ntelefone = serializers.DecimalField(source='user.ntelefone', max_digits=9, decimal_places=0, required=False)
    morada = serializers.CharField(source='user.morada', required=False)

    class Meta:
        model = Cliente
        fields = ['user', 'nome', 'email', 'nif', 'ntelefone', 'morada']

    def validate_nif(self, value):
        """
        Valida se o NIF está correto e não duplicado.
        """
        if len(str(value)) != 9 or not str(value).isdigit():
            raise serializers.ValidationError("O NIF deve ter exatamente 9 dígitos.")

        cliente_atual = self.instance
        if Utilizador.objects.filter(nif=value).exclude(pk=cliente_atual.user.pk).exists():
            raise serializers.ValidationError("Este NIF já está em uso por outro cliente.")

        return value

    def update(self, instance, validated_data):
        """
        Atualiza os dados do cliente autenticado.
        """
        user_data = validated_data.pop('user', {}) if 'user' in validated_data else {}

        # Atualiza os dados do utilizador associado
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        # Atualiza os próprios dados do cliente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
        
class ProdutoImagemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ProdutoImagem
        fields = ['imagem']  


class ProdutoSerializer(serializers.ModelSerializer):

    imagens = ProdutoImagemSerializer(many=True, read_only=True)
    lojista = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Produto
        fields = ['id', 'lojista', 'nome', 'preco', 'descricao', 'stock', 'categoria', 'imagens']
        
    def create(self, validated_data):
        print("Full Validated Data:", validated_data)
        #imagens_data = validated_data.pop('imagens', [])
        lojista = self.context['request'].user.lojista
        
        produto = Produto.objects.create(**validated_data, lojista=lojista)
        image_files=self.context['request'].FILES
        for image_data in image_files.values():
            ProdutoImagem.objects.create(produto=produto, imagem=image_data)
        return produto


class FavoritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorito
        fields = ['id_cliente', 'produto_id'] 
    
    def create(self, validated_data):
        favorito = Favorito.objects.create(**validated_data)
        return favorito


class CarrinhoProdutoSerializer(serializers.ModelSerializer):
    produto = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all())
    quantidade = serializers.IntegerField(default=1)
    #preco_produto = serializers.SerializerMethodField() 
    total_carrinho = serializers.ReadOnlyField(source='carrinho.total')

    class Meta:
        model = CarrinhoProduto
        fields = ['carrinho', 'produto', 'quantidade', 'total_carrinho']
        

    def create(self, validated_data):
        carrinho=validated_data.get('carrinho')
        produto=validated_data['produto']
        quantidade=validated_data.get('quantidade', 1)

        carrinhoproduto, created = CarrinhoProduto.objects.get_or_create(
            carrinho=carrinho, 
            produto=produto,
            defaults={'quantidade': quantidade}    
        )
        if not created:
            carrinhoproduto.quantidade+=quantidade
            
        else:
            carrinhoproduto.quantidade=quantidade
            
        carrinhoproduto.save()
        
        carrinho.total=sum(item.quantidade * item.produto.preco for item in CarrinhoProduto.objects.filter(carrinho=carrinho))
        carrinho.save()
        
        return carrinhoproduto
    
    def validate_carrinho(self, attrs):
        cliente=self.context['request'].user.cliente
        carrinho=Carrinho.objects.filter(cliente=cliente, venda__isnull=True).first()
        if not carrinho:
            raise serializers.ValidationError("Este cliente não tem carrinhos")
        if Venda.objects.filter(carrinho=carrinho).exists():
            raise serializers.ValidationError("A sale has already been completed for this cart. No further modifications are allowed.")
        
        attrs.carrinho=carrinho
        return attrs
    
    def validate_quantidade(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        
        request = self.context.get('request')
        produto_id = request.data.get('produto') #if request else None
    
        if produto_id:
            produto = Produto.objects.get(id=produto_id)
            if produto.stock < value:
                raise serializers.ValidationError("Insufficient stock available.")
            
            return value
        raise serializers.ValidationError("Produto must be provided.")
    
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['produto'] = ProdutoSerializer(instance.produto).data
        return response
            
            
class VendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venda
        fields = ['id', 'data_venda']

    def create(self, validated_data):
        cliente=self.context['request'].user.cliente
        carrinho= Carrinho.objects.filter(cliente=cliente).exclude(carrinhoproduto__venda__isnull=False).first()

        if not carrinho:
            raise serializers.ValidationError("No active cart available for this client that hasn't been turned into a sale.")
        
        with transaction.atomic():
            venda = Venda.objects.create(carrinho=carrinho, **validated_data)

            carrinho_produtos = CarrinhoProduto.objects.filter(carrinho=carrinho)
            for item in carrinho_produtos:
                if item.produto.stock < item.quantidade:
                    raise serializers.ValidationError(f"Insufficient stock for product {item.produto.id}.")
                item.produto.stock -= item.quantidade
                item.produto.save()

                item.venda = venda
                item.save()
            
            novo_carrinho=Carrinho.objects.create(cliente=cliente, total=0.00)
        return venda       
    
    def validate_carrinho(self, attrs):
        cliente=self.context['request'].user.cliente
        carrinho = Carrinho.objects.filter(cliente=cliente, venda__isnull=True).first()
        if not carrinho:
            raise serializers.ValidationError("Este cliente não tem carrinhos")
        if Venda.objects.filter(carrinho=carrinho).exists():
            raise serializers.ValidationError("A sale has already been completed for this cart. No further modifications are allowed.")
        if not CarrinhoProduto.objects.filter(carrinho=carrinho).exists():
            raise serializers.ValidationError("There are no products in your Carrinho")
        attrs['carrinho']=carrinho
        return attrs
    
    def validate_quantidade(self, value):
        cliente=self.context['request'].user.cliente
        carrinho=Carrinho.objects.filter(cliente=cliente).exclude(id__in=Venda.objects.values_list('carrinho_id', flat=True)
        ).first()
        
        if not carrinho:
            raise serializers.ValidationError("Este cliente não tem carrinhos válidos disponíveis.")

        produto_id = self.initial_data.get('produto_id')  # Adjust depending on how produto_id is being passed
        if not produto_id:
            raise serializers.ValidationError("Produto must be provided.")

        try:
            produto = Produto.objects.get(id=produto_id)
            if produto.stock < value:
                raise serializers.ValidationError("Insufficient stock available.")
            return value
        except Produto.DoesNotExist:
            raise serializers.ValidationError("The specified produto does not exist.")
        


class GetVendaSerializerLojista(serializers.ModelSerializer):
    produtos = serializers.SerializerMethodField()
    valor_total = serializers.SerializerMethodField() 

    class Meta:
        model = Venda
        fields = ['id', 'data_venda', 'produtos', 'valor_total']

    def get_produtos(self, obj):
        produtos = CarrinhoProduto.objects.filter(venda=obj)
        return [{'produto_id': CarrinhoProduto.produto.id, 'quantidade': CarrinhoProduto.quantidade} for CarrinhoProduto in produtos]

    def get_valor_total(self, obj):
        produtos = CarrinhoProduto.objects.filter(venda=obj)
        total = sum(CarrinhoProduto.quantidade * CarrinhoProduto.produto.preco for CarrinhoProduto in produtos)  
        return total
