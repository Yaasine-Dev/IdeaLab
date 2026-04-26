from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookmarkListView.as_view(), name='bookmark_list'),
    path('toggle/', views.toggle_bookmark, name='toggle_bookmark'),
]
