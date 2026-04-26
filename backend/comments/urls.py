from django.urls import path
from . import views

urlpatterns = [
    # Comments for an idea
    path('idea/<int:idea_id>/', views.CommentListCreateView.as_view(), name='comment_list_create'),
    path('<int:pk>/', views.CommentDetailView.as_view(), name='comment_detail'),
    
    # Replies to a comment
    path('<int:comment_id>/replies/', views.CommentRepliesView.as_view(), name='comment_replies'),
]
