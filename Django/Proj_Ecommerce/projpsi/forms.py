from django import forms
from .models import *

class ClienteRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, min_length=8)
    confirm_password = forms.CharField(widget=forms.PasswordInput, min_length=8)

    class Meta:
        model = Cliente
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
        