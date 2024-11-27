# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

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


class Cliente(models.Model):
    nif = models.DecimalField(primary_key=True, max_digits=9, decimal_places=0)
    nome = models.CharField(max_length=50)
    mail = models.CharField(unique=True, max_length=50)
    pass_field = models.CharField(db_column='pass', max_length=50, blank=True, null=True)  # Field renamed because it was a Python reserved word.
    ntelefone = models.DecimalField(max_digits=9, decimal_places=0)
    morada = models.CharField(max_length=50)

    
    def __str__(self):
        return self.nome
    
    class Meta:
        managed = False
        db_table = 'cliente'


class Favorito(models.Model):
    fav_id = models.AutoField(primary_key=True)
    nif_cliente = models.ForeignKey(Cliente, models.DO_NOTHING, db_column='nif_cliente')
    produto = models.ForeignKey('Produto', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'favorito'


class Logista(models.Model):
    nif = models.DecimalField(primary_key=True, max_digits=9, decimal_places=0)
    nome = models.CharField(max_length=50)
    mail = models.CharField(max_length=50)
    pass_field = models.CharField(db_column='pass', max_length=50, blank=True, null=True)  # Field renamed because it was a Python reserved word.
    ntelefone = models.DecimalField(max_digits=9, decimal_places=0)
    morada = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'logista'


class LogistaProduto(models.Model):
    addp_id = models.AutoField(primary_key=True)
    logista_nif = models.ForeignKey(Logista, models.DO_NOTHING, db_column='logista_nif')
    produto = models.ForeignKey('Produto', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'logista_produto'


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


class Venda(models.Model):
    venda_id = models.AutoField(primary_key=True)
    carrinho = models.ForeignKey(Carrinho, models.DO_NOTHING, blank=True, null=True)
    data_venda = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'venda'
