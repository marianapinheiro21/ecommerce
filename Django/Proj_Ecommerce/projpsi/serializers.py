from rest_framework import serializers
from .models import *


class UtilizadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilizador
        fields = ['nome', 'nif', 'email']


class LogistaSerializer(serializers.ModelSerializer):
    user = UtilizadorSerializer(read_only=True)
    class Meta:
        model = Logista
        fields = ['user']
        
        
class ProdutoImagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoImagem
        fields = ['imagem']  


class ProdutoSerializer(serializers.ModelSerializer):
    logista = LogistaSerializer(read_only=True)
    imagens = ProdutoImagemSerializer(source='imagem', many=True)
    
    class Meta:
        model = Produto
        fields = ['logista', 'nome', 'preco', 'descricao', 'stock', 'imagens']