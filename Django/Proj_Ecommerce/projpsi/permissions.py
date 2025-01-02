from rest_framework import permissions

class IsCliente(permissions.BasePermission):

    def has_permission(self, request, view):
        return hasattr(request.user, 'cliente')
    

class IsLojista(permissions.BasePermission):

    def has_permission(self, request, view):
        return hasattr(request.user, 'lojista')