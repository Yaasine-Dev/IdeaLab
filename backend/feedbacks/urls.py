from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='feedbacks_index'),
]
