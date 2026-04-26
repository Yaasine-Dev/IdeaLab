from django.urls import path
from . import views

urlpatterns = [
    # Feedbacks for an idea
    path('idea/<int:idea_id>/', views.FeedbackListCreateView.as_view(), name='feedback_list_create'),
    path('<int:pk>/', views.FeedbackDetailView.as_view(), name='feedback_detail'),
    
    # Analytics
    path('idea/<int:idea_id>/average/', views.idea_average_score, name='idea_average_score'),
    path('my-reviews/', views.user_feedback_reviews, name='my_reviews'),
]
