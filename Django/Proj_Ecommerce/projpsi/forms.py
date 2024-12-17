from django import forms
from .models import *
from django.db import transaction, connection
from django.utils import timezone
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.hashers import make_password
from django.forms import modelformset_factory
from django.forms.widgets import PasswordInput, TextInput

class ClienteRegistrationForm(UserCreationForm):
    
    nome=forms.CharField(widget=forms.TextInput(attrs={
        'placeholder':'Nome'
    }))
    email=forms.EmailField(widget=forms.EmailInput(attrs={
        'placeholder':'Email'
    }))
    nif=forms.DecimalField(required=False, widget=forms.NumberInput(attrs={
        'placeholder':'NIF'
    }))
    ntelefone=forms.DecimalField(required=False, widget=forms.NumberInput(attrs={
        'placeholder':'Número Telefone'
    }))
    morada = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'placeholder':'Morada'
    }))
        
        
    class Meta:
        model = Utilizador
        fields = ['nome', 'email', 'nif', 'ntelefone', 'morada', 'password1', 'password2']    

    
    def clean_nif(self):
        nif = self.cleaned_data.get('nif')
        if nif and len(str(nif)) != 9:
            raise forms.ValidationError("NIF tem que ter 9 números")
        return nif

    def clean_ntelefone(self):
        ntelefone = self.cleaned_data.get('ntelefone')
        if ntelefone and len(str(int(ntelefone))) != 9:  
            raise forms.ValidationError("Número Telefone tem que ter 9 números")
        return ntelefone


    def save(self, commit=True):
        cleaned_data = self.cleaned_data
        hashed_password = make_password(cleaned_data['password1'])

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO utilizador (nome, email, password, nif, ntelefone, morada, is_active, date_joined) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
                    """, [
                        cleaned_data['nome'],
                        cleaned_data['email'],
                        hashed_password,
                        cleaned_data.get('nif'),
                        cleaned_data.get('ntelefone'),
                        cleaned_data.get('morada'),
                        True,  # is_active
                        timezone.now(),
                    ])
                    user_id = cursor.fetchone()[0]  # Get the generated user_id

                with connection.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO cliente (user_id) VALUES (%s)
                    """, [user_id])

                with connection.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO carrinho (id_cliente, total) VALUES (%s, %s)
                    """, [user_id, 0.0])
                
                user = Utilizador(id=user_id, nome=cleaned_data['nome'], email=cleaned_data['email'])
                return user  

        except Exception as e:
            raise forms.ValidationError(f"Error while creating Cliente: {e}")


    
    
class LogistaRegistrationForm(UserCreationForm):
    
    nome=forms.CharField(widget=forms.TextInput(attrs={
        'placeholder':'Nome'
    }))
     
    email=forms.EmailField(widget=forms.EmailInput(attrs={
        'placeholder':'Email'
    }))
    nif=forms.DecimalField(widget=forms.NumberInput(attrs={
        'placeholder':'NIF'
    }))
    ntelefone=forms.DecimalField(widget=forms.NumberInput(attrs={
        'placeholder':'Número Telefone'
    }))
    morada = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder':'Morada'
    }))
        
        
    class Meta:
        model = Utilizador
        fields = ['nome', 'email', 'nif', 'ntelefone', 'morada', 'password1', 'password2']    

    
    def clean_nif(self):
        nif = self.cleaned_data.get('nif')
        if nif and len(str(nif)) != 9:
            raise forms.ValidationError("NIF tem que ter 9 números")
        return nif

    def clean_ntelefone(self):
        ntelefone = self.cleaned_data.get('ntelefone')
        if ntelefone and len(str(int(ntelefone))) != 9:  
            raise forms.ValidationError("Número Telefone tem que ter 9 números")
        return ntelefone


    def save(self, commit=True):
        cleaned_data = self.cleaned_data
        hashed_password = make_password(cleaned_data['password1'])

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO utilizador (nome, email, password, nif, ntelefone, morada, is_active, date_joined) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
                    """, [
                        cleaned_data['nome'],
                        cleaned_data['email'],
                        hashed_password,
                        cleaned_data.get('nif'),
                        cleaned_data.get('ntelefone'),
                        cleaned_data.get('morada'),
                        True,  # is_active
                        timezone.now(),
                    ])
                    user_id = cursor.fetchone()[0]  # Get the generated user_id

                with connection.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO logista (user_id) VALUES (%s)
                    """, [user_id])
                
                user = Utilizador(id=user_id, nome=cleaned_data['nome'], email=cleaned_data['email'])
                return user  # Return the Utilizador object

        except Exception as e:
            raise forms.ValidationError(f"Error while creating Cliente: {e}")
   
User=get_user_model()
class CustomLoginForm(forms.Form):
    
    email = forms.EmailField(
        widget=TextInput(attrs={
            'class':'form-control', 
            'placeholder':'Email', 
            'autofocus': True
        }), 
        label="email"
    )
    
    password = forms.CharField(
        widget=PasswordInput(attrs={
            'class':'form-control', 
            'placeholder':'password'
        }),
        label="password"
    )
    
    def clean(self):
        #cleaned_data=super().clean()
        email=self.cleaned_data.get('email')
        password=self.cleaned_data.get('password')
        #print(f"Email x entered: {email}")
        #print(f"Password x entered: {password}")
    #    
        User=get_user_model()
    #    
        if not User.objects.filter(email=email).exists():
            #print(f"Email {email} não existe na Base de Dados")
            raise forms.ValidationError("Email não encontrado no Sistema")
        passe= User.objects.get(email=email).password
        #print(f"A palavra passe é: {passe}")   
        #print(f"Email {email} existe na Base de Dados")
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                #print(f"Authentication failed for email: {email} with password: {password}")
                raise forms.ValidationError("Email ou senha incorretos")
         
            if not user.is_active:
                raise forms.ValidationError("Esta conta não está ativa")
    #    
            self.cleaned_data['user']=user
        else:
            raise forms.ValidationError("Preencha todos os campos")    
        return self.cleaned_data
        
class ProdutoForm(forms.ModelForm): 
    class Meta:
        model = Produto
        fields = ['nome', 'preco', 'descricao', 'categoria','stock']
        widgets = {
            'descricao': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        }
                
        def __init__(self, *args, **kwargs):
            super(ProdutoForm, self).__init__(*args, **kwargs)
            self.fields['categoria'].widget = forms.Select(choices=Produto.CATEGORY_CHOICES)
                        
        def clean_stock(self):
            stock = self.cleaned_data.get('stock')
            if stock < 0:
                raise forms.ValidationError("O stock não pode ser negativo.")
            return stock
        
        def clean_preco(self):
            preco = self.cleaned_data.get('preco')
            if preco <= 0:
                raise forms.ValidationError("O preço deve ser maior que 0.")
            return preco
        
ProdutoImagemFormSet = modelformset_factory(
    ProdutoImagem,
    fields=('imagem', ),
    extra=3,  # Permite 3 imagens de cada vez
    max_num=10  # Com um máximo de 10 imagens
)
