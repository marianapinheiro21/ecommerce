from django import forms
from .models import *

class ClienteRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, min_length=8)
    confirm_password = forms.CharField(widget=forms.PasswordInput, min_length=8)
    nif = forms.DecimalField(required=False, max_digits=9, decimal_places=0, help_text="O NIF deve ter exatamente 9 dígitos se fornecido")
    ntelefone = forms.DecimalField(required=False, max_digits=9, decimal_places=0, help_text="O número de telefone deve ter exatamente 9 dígitos se fornecido")
    morada = forms.CharField(required=False, max_length=255, help_text="O campo de morada é opcional")


    class Meta:
        model = Cliente
        fields = ['nif', 'nome', 'mail', 'password', 'confirm_password', 'ntelefone', 'morada']    
    
    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data["password"]
        if password:
            user.set_password(password)
        if commit:
            user.save()
        return user     
       
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        
        if password != confirm_password:
            raise forms.ValidationError("As passwords não são iguais")
        
        return cleaned_data
    
    def clean_nif(self):
        nif = self.cleaned_data.get('nif')
        if nif and len(str(nif)) != 9:
            raise forms.ValidationError("O NIF deve ter exatamente 9 dígitos.")
        return nif
    
    def clean_ntelefone(self):
        ntelefone = self.cleaned_data.get('ntelefone')
        if ntelefone and len(str(ntelefone)) != 9:
            raise forms.ValidationError("O número de telefone deve ter exatamente 9 dígitos.")
        return ntelefone
    

    
    
class LogistaRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, min_length=8)
    confirm_password = forms.CharField(widget=forms.PasswordInput, min_length=8)

    class Meta:
        model = Logista
        fields = ['nif', 'nome', 'mail', 'password', 'confirm_password', 'ntelefone', 'morada']    
        
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        
        if password != confirm_password:
            raise forms.ValidationError("As passwords não são iguais")
        
        return cleaned_data
    
    def clean_nif(self):
        nif = self.cleaned_data.get('nif')
        if len(str(nif)) != 9:
            raise forms.ValidationError("O NIF deve ter exatamente 9 dígitos.")
        return nif
    
    def clean_ntelefone(self):
        ntelefone = self.cleaned_data.get('ntelefone')
        if len(str(ntelefone)) != 9:
            raise forms.ValidationError("O número de telefone deve ter exatamente 9 dígitos.")
        return ntelefone
    
    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data["password"]
        if password:
            user.set_password(password)
        if commit:
            user.save()
        return user     
        