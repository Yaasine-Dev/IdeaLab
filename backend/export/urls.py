from django.urls import path
from . import views

urlpatterns = [
    path('csv/<uuid:idea_id>/', views.export_csv, name='export-csv'),
    path('json/<uuid:idea_id>/', views.export_json, name='export-json'),
    path('pdf/<uuid:idea_id>/', views.export_pdf, name='export-pdf'),
    path('status/<str:task_id>/', views.export_status, name='export-status'),
]
