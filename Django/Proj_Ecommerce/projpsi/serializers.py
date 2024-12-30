from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



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
    class Meta:
        model = ProdutoImagem
        fields = ['imagem']  


class ProdutoSerializer(serializers.ModelSerializer):
    lojista = LojistaSerializer(read_only=True)
    imagens = ProdutoImagemSerializer(source='imagem', many=True, required=False)
    categoria = serializers.CharField(required=False)

    class Meta:
        model = Produto
        fields = ['lojista', 'nome', 'preco', 'descricao', 'stock', 'imagens','categoria']
    def create(self, validated_data):
        imagens_data = validated_data.pop('imagens', [])
        produto = Produto.objects.create(**validated_data)
        for image_data in imagens_data:
            ProdutoImagem.objects.create(produto=produto, **image_data)
        return produto

        fields = ['lojista', 'nome', 'preco', 'descricao', 'stock', 'imagens']

class FavoritoSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all())  # Usa 'user' ao invés de 'id_cliente'
    produto_id = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all())  # Campo para o produto

    class Meta:
        fields = ['user', 'produto_id']

