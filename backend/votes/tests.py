import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from ideas.models import Idea
from votes.models import Vote

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
class TestVotes:
    """Tests pour le système de votes."""
    
    def test_create_upvote(self, api_client, user, idea):
        """Test création d'un upvote."""
        api_client.force_authenticate(user=user)
        
        data = {
            'target_type': 'idea',
            'target_id': str(idea.id),
            'value': 1
        }
        
        response = api_client.post('/api/votes/', data)
        assert response.status_code == 201
        assert Vote.objects.count() == 1
        assert Vote.objects.first().value == 1
    
    def test_toggle_vote_remove(self, api_client, user, idea):
        """Test toggle : voter deux fois la même valeur = supprimer."""
        api_client.force_authenticate(user=user)
        
        # Premier vote
        Vote.objects.create(
            user=user,
            target_type='idea',
            target_id=idea.id,
            value=1
        )
        
        # Voter à nouveau avec la même valeur
        data = {
            'target_type': 'idea',
            'target_id': str(idea.id),
            'value': 1
        }
        
        response = api_client.post('/api/votes/', data)
        assert response.status_code == 200
        assert response.data['action'] == 'removed'
        assert Vote.objects.count() == 0
    
    def test_toggle_vote_update(self, api_client, user, idea):
        """Test toggle : voter avec une valeur différente = modifier."""
        api_client.force_authenticate(user=user)
        
        # Premier vote (upvote)
        Vote.objects.create(
            user=user,
            target_type='idea',
            target_id=idea.id,
            value=1
        )
        
        # Voter avec une valeur différente (downvote)
        data = {
            'target_type': 'idea',
            'target_id': str(idea.id),
            'value': -1
        }
        
        response = api_client.post('/api/votes/', data)
        assert response.status_code == 200
        assert response.data['action'] == 'updated'
        assert Vote.objects.first().value == -1
    
    def test_get_vote_stats(self, api_client, user, idea):
        """Test récupération des statistiques de votes."""
        # Créer plusieurs votes
        user2 = User.objects.create_user(username='user2', email='user2@test.com', password='pass')
        Vote.objects.create(user=user, target_type='idea', target_id=idea.id, value=1)
        Vote.objects.create(user=user2, target_type='idea', target_id=idea.id, value=1)
        
        response = api_client.get(f'/api/votes/stats/?target_type=idea&target_id={idea.id}')
        assert response.status_code == 200
        assert response.data['upvotes'] == 2
        assert response.data['downvotes'] == 0
        assert response.data['total'] == 2
