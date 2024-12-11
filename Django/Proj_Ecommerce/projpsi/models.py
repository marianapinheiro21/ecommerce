# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from dirtyfields import DirtyFieldsMixin


class ClienteManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O email é obrigatório para a criação de conta')
        email=self.normalize_email(email)
        user=self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('is_superuser tem que ser True')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Só o staff pode ter conta de superuser')
        
        return self.create_user(email, password, **extra_fields)
class Cliente(DirtyFieldsMixin, AbstractBaseUser, models.Model):
    id = models.AutoField(primary_key=True)
    nif = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nome = models.CharField(max_length=50)
    mail = models.CharField(unique=True, max_length=50)
    ntelefone = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    morada = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True) #Campos django
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = ClienteManager()
    
    USERNAME_FIELD = 'mail'
    REQUIRED_FIELDS = ['nome']
    
    def __str__(self):
        return self.nome
    
    def save(self, *args, **kwargs):
        if 'password' in self.get_dirty_fields():
            #Cifra palavra pass
            self.set_password(self.password)
        super().save(*args, **kwargs)
    
    class Meta:
        managed = False
        db_table = 'cliente'


class LogistaManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O email é obrigatório para a criação de conta')
        email=self.normalize_email(email)
        user=self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('is_superuser tem que ser True')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Só o staff pode ter conta de superuser')
        
        return self.create_user(email, password, **extra_fields)
    
class Logista(DirtyFieldsMixin, AbstractBaseUser, models.Model):
    id = models.AutoField(primary_key=True)
    nif = models.DecimalField(max_digits=9, decimal_places=0)
    nome = models.CharField(max_length=50)
    mail = models.CharField(max_length=50)
    ntelefone = models.DecimalField(max_digits=9, decimal_places=0)
    morada = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True) #Campos django
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = ClienteManager()
    
    USERNAME_FIELD = 'mail'
    REQUIRED_FIELDS = ['nif', 'nome', 'ntelefone', 'morada']
    
    class Meta:
        managed = False
        db_table = 'logista'
        
    def save(self, *args, **kwargs):
        if 'password' in self.get_dirty_fields():
            #Cifra palavra pass
            self.set_password(self.password)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.title

class Produto(models.Model):
    idproduto = models.AutoField(primary_key=True)
    stock = models.DecimalField(max_digits=65535, decimal_places=65535)
    nome = models.CharField(max_length=50)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.CharField(max_length=50, blank=True, null=True)
    categoria = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'produto'


class LogistaProduto(models.Model):
    addp_id = models.AutoField(primary_key=True)
    logista_nif = models.ForeignKey(Logista, models.DO_NOTHING, db_column='logista_nif')
    produto = models.ForeignKey('Produto', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'logista_produto'
        

class Carrinho(models.Model):
    carrinho_id = models.AutoField(primary_key=True)
    nif_cliente = models.ForeignKey('Cliente', models.DO_NOTHING, db_column='nif_cliente')
    total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'carrinho'


class CarrinhoProduto(models.Model):
    id_c_p = models.AutoField(primary_key=True)
    carrinho = models.ForeignKey(Carrinho, models.DO_NOTHING, blank=True, null=True)
    venda_id = models.IntegerField(blank=True, null=True)
    produto = models.ForeignKey('Produto', models.DO_NOTHING, blank=True, null=True)
    quantidade = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'carrinho_produto'
   
        
class Favorito(models.Model):
    fav_id = models.AutoField(primary_key=True)
    nif_cliente = models.ForeignKey(Cliente, models.DO_NOTHING, db_column='nif_cliente')
    produto = models.ForeignKey('Produto', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'favorito'
                

class Venda(models.Model):
    venda_id = models.AutoField(primary_key=True)
    carrinho = models.ForeignKey(Carrinho, models.DO_NOTHING, blank=True, null=True)
    data_venda = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'venda'
