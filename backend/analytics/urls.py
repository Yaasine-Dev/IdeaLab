from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='analytics_dashboard'),
    path('reviewer/', views.reviewer_stats, name='analytics_reviewer'),
    path('admin/', views.admin_stats, name='analytics_admin'),
]
