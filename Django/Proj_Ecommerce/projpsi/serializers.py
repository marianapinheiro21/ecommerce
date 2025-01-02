from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.db import transaction


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
        fields = ['nome', 'nif', 'email']


class LojistaSerializer(serializers.ModelSerializer):
    user = UtilizadorSerializer(read_only=True)
    class Meta:
        model = Lojista
        fields = ['user']


class ClienteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Utilizador.objects.all())

    class Meta:
        model = Cliente
        fields = ['user', 'nif', 'ntelefone', 'morada']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        instance.nif = validated_data.get('nif', instance.nif)
        instance.ntelefone = validated_data.get('ntelefone', instance.ntelefone)
        instance.morada = validated_data.get('morada', instance.morada)
        instance.save()
        return instance

        
        
class ProdutoImagemSerializer(serializers.ModelSerializer):
    #produto = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all(), write_only=True)
    #imagem = serializers.ImageField()
    
    class Meta:
        model = ProdutoImagem
        #fields = ['produto', 'imagem']  
        fields = ['imagem']  


class ProdutoSerializer(serializers.ModelSerializer):

    imagens = ProdutoImagemSerializer(many=True, read_only=True)
    lojista = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Produto
        fields = ['lojista', 'nome', 'preco', 'descricao', 'stock', 'categoria', 'imagens']
        
    def create(self, validated_data):
        print("Full Validated Data:", validated_data)
        #imagens_data = validated_data.pop('imagens', [])
        lojista = self.context['request'].user.lojista
        
        produto = Produto.objects.create(**validated_data, lojista=lojista)
        image_files=self.context['request'].FILES
        for image_data in image_files.values():
            ProdutoImagem.objects.create(produto=produto, imagem=image_data)
        return produto

class FavoritoSerializer(serializers.Serializer):
    produto_id = serializers.PrimaryKeyRelatedField(source='produto', queryset=Produto.objects.all())
   # quantidade = serializers.IntegerField(default=1)user = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all())  # Usa 'user' ao invés de 'id_cliente'
    produto_id = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all())  # Campo para o produto

    class Meta:
        fields = ['user', 'produto_id']

class CarrinhoProdutoSerializer(serializers.ModelSerializer):
    produto = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all())
    quantidade = serializers.IntegerField(default=1)
    class Meta:
        model = CarrinhoProduto
        fields = ['carrinho', 'produto', 'quantidade']
        
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
        carrinho=Carrinho.objects.filter(cliente=cliente).exclude(id__in=Venda.objects.values_list('carrinho_id', flat=True)
        ).first()
        if not carrinho:
            raise serializers.ValidationError("Este cliente não tem carrinhos")
        if Venda.objects.filter(carrinho=carrinho).exists():
            raise serializers.ValidationError("A sale has already been completed for this cart. No further modifications are allowed.")
        attrs['carrinho']=carrinho
        return attrs
    
    def validate_quantidade(self, value):
        request = self.context.get('request')
        produto_id = request.data.get('produto') #if request else None
    
        if produto_id:
            produto = Produto.objects.get(id=produto_id)
            if produto.stock < value:
                raise serializers.ValidationError("Insufficient stock available.")
            return value
        raise serializers.ValidationError("Produto must be provided.")
            
            
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
        carrinho=Carrinho.objects.filter(cliente=cliente).exclude(id__in=Venda.objects.values_list('carrinho_id', flat=True)
        ).first()
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
