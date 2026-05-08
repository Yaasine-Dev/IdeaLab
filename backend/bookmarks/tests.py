import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from ideas.models import Idea
from bookmarks.models import Bookmark

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
        target='Test target'
    )


@pytest.mark.django_db
class TestBookmarks:
    """Tests pour les bookmarks."""
    
    def test_create_bookmark(self, api_client, user, idea):
        """Test création d'un bookmark."""
        api_client.force_authenticate(user=user)
        
        data = {'idea': str(idea.id)}
        response = api_client.post('/api/bookmarks/', data)
        
        assert response.status_code == 201
        assert Bookmark.objects.count() == 1
        assert Bookmark.objects.first().user == user
    
    def test_toggle_bookmark_remove(self, api_client, user, idea):
        """Test toggle : bookmarker deux fois = supprimer."""
        api_client.force_authenticate(user=user)
        
        # Premier bookmark
        Bookmark.objects.create(user=user, idea=idea)
        
        # Bookmarker à nouveau
        data = {'idea': str(idea.id)}
        response = api_client.post('/api/bookmarks/', data)
        
        assert response.status_code == 200
        assert response.data['action'] == 'removed'
        assert Bookmark.objects.count() == 0
    
    def test_list_user_bookmarks(self, api_client, user, idea):
        """Test récupération des bookmarks d'un utilisateur."""
        api_client.force_authenticate(user=user)
        
        Bookmark.objects.create(user=user, idea=idea)
        
        response = api_client.get('/api/bookmarks/')
        assert response.status_code == 200
        assert len(response.data['results']) == 1
    
    def test_check_bookmark(self, api_client, user, idea):
        """Test vérification si une idée est bookmarkée."""
        api_client.force_authenticate(user=user)
        
        Bookmark.objects.create(user=user, idea=idea)
        
        response = api_client.get(f'/api/bookmarks/check/?idea_id={idea.id}')
        assert response.status_code == 200
        assert response.data['is_bookmarked'] is True
