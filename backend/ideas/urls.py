from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='ideas_index'),
]
