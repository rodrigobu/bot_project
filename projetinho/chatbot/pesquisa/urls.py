from django.urls import path

from pesquisa import views

urlpatterns = [
    path('', views.index, name='index'),
]
