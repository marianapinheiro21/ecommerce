from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


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