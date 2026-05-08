import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from ideas.models import Idea
from comments.models import Comment

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123',
        role='entrepreneur'
    )


@pytest.fixture
def idea(db, user):
    return Idea.objects.create(
        owner=user,
        title='Test Idea',
        description='Test description',
        sector='Tech',
        problem='Test problem',
        solution='Test solution',
        target='Test target',
        status='submitted'
    )


@pytest.mark.django_db
class TestComments:
    """Tests pour les commentaires."""
    
    def test_create_comment(self, api_client, user, idea):
        """Test création d'un commentaire."""
        api_client.force_authenticate(user=user)
        
        data = {
            'idea': str(idea.id),
            'content': 'Excellent commentaire de test'
        }
        
        response = api_client.post('/api/comments/', data)
        assert response.status_code == 201
        assert Comment.objects.count() == 1
        assert Comment.objects.first().author == user
    
    def test_create_reply(self, api_client, user, idea):
        """Test création d'une réponse à un commentaire."""
        api_client.force_authenticate(user=user)
        
        # Créer un commentaire parent
        parent = Comment.objects.create(
            idea=idea,
            author=user,
            content='Commentaire parent'
        )
        
        # Créer une réponse
        data = {
            'idea': str(idea.id),
            'content': 'Réponse au commentaire',
            'parent': str(parent.id)
        }
        
        response = api_client.post('/api/comments/', data)
        assert response.status_code == 201
        assert Comment.objects.count() == 2
        assert Comment.objects.last().parent == parent
    
    def test_soft_delete_comment(self, api_client, user, idea):
        """Test soft delete d'un commentaire."""
        api_client.force_authenticate(user=user)
        
        comment = Comment.objects.create(
            idea=idea,
            author=user,
            content='Commentaire à supprimer'
        )
        
        response = api_client.delete(f'/api/comments/{comment.id}/')
        assert response.status_code == 204
        
        comment.refresh_from_db()
        assert comment.is_deleted is True
        assert comment.content == '[Commentaire supprimé]'
    
    def test_list_comments_by_idea(self, api_client, user, idea):
        """Test récupération des commentaires d'une idée."""
        Comment.objects.create(idea=idea, author=user, content='Comment 1')
        Comment.objects.create(idea=idea, author=user, content='Comment 2')
        
        response = api_client.get(f'/api/comments/?idea_id={idea.id}')
        assert response.status_code == 200
        assert len(response.data['results']) == 2
