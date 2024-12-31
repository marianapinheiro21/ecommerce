# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model  has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.views.generic import TemplateView
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from dirtyfields import DirtyFieldsMixin
from django.shortcuts import render


class UtilizadorManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O email é obrigatório")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Utilizador(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    nome = models.CharField(max_length=50)
    nif = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    ntelefone = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    morada = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(
        Group,
        related_name='utilizador_set',  # Avoids clash with auth.User
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='utilizador_permissions_set',  # Avoids clash with auth.User
        blank=True,
    )
    
    objects = UtilizadorManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome']

    def __str__(self):
        return self.nome
    
    class Meta:
        managed = False
        db_table = 'utilizador'

class Cliente(models.Model):
    user = models.OneToOneField(Utilizador, on_delete=models.CASCADE, related_name='cliente', primary_key=True)
   
    def __str__(self):
        return f"Cliente: {self.user.nome}"
    
    class Meta:
        db_table = 'cliente'
        managed = False

class Lojista(models.Model):
    user = models.OneToOneField(Utilizador, on_delete=models.CASCADE, related_name='lojista', primary_key=True)
    
    def __str__(self):
        return f"Lojista: {self.user.nome}"
    
    class Meta:
        managed = False
        db_table = 'lojista'
 
    #def lojista_dados(request):
    #   return render(request, 'projpsi/lojista_dados.html')


class Produto(models.Model):
    campos= [
        ('computador fixo', 'Computador Fixo'),
        ('computador portátil', 'Computador Portátil'),
        ('periférico', 'Periférico'),
        ('acessório', 'Acessório'),
    ]
    
    id = models.AutoField(primary_key=True)
    lojista = models.ForeignKey(Lojista, models.DO_NOTHING, db_column='id_lojista')
    stock = models.IntegerField()
    nome = models.CharField(max_length=50)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.CharField(max_length=255, blank=True, null=True)
    categoria = models.CharField(max_length=50, choices=campos, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'produto'

class ProdutoImagem(models.Model):
    id = models.AutoField(primary_key=True)
    produto = models.ForeignKey(Produto, related_name='imagens', on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='produtos_imagens/')
    
    class Meta:
        managed = False
        db_table = 'produtoimagem'
        

class Carrinho(models.Model):
    id = models.AutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, models.DO_NOTHING, db_column='id_cliente')
    total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'carrinho'
   
        
class Favorito(models.Model):
    id = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(Cliente, models.DO_NOTHING, db_column='id_cliente')
    produto_id = models.ForeignKey(Produto, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'favorito'


class Venda(models.Model):
    id = models.AutoField(primary_key=True)
    carrinho = models.ForeignKey(Carrinho, models.DO_NOTHING, db_column='carrinho_id', blank=True, null=True)
    data_venda = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'venda'
        
        
class CarrinhoProduto(models.Model):
    id = models.AutoField(primary_key=True)
    carrinho = models.ForeignKey(Carrinho, models.DO_NOTHING, db_column='carrinho_id', blank=True, null=True)
    venda = models.ForeignKey(Venda, models.DO_NOTHING, db_column='venda_id', blank=True, null=True)
    produto = models.ForeignKey(Produto, models.DO_NOTHING, db_column='produto_id', blank=True, null=True)
    quantidade = models.IntegerField(default=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'carrinho_produto'
