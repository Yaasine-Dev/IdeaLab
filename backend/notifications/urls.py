from django.urls import path
from . import views

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification_list'),
    path('<int:pk>/', views.mark_read, name='mark_read'),
    path('read/', views.mark_all_read, name='mark_all_read'),
]
