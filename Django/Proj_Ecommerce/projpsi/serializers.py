from rest_framework import serializers
from .models import *


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
    class Meta:
        model = ProdutoImagem
        fields = ['imagem']  


class ProdutoSerializer(serializers.ModelSerializer):
    lojista = LojistaSerializer(read_only=True)
    imagens = ProdutoImagemSerializer(source='imagem', many=True)
    
    class Meta:
        model = Produto
        fields = ['lojista', 'nome', 'preco', 'descricao', 'stock', 'imagens']