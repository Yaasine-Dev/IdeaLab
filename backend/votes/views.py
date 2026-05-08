from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from .models import Vote
from .serializers import VoteSerializer, VoteStatsSerializer


class VoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des votes.
    
    Endpoints :
    - POST /api/votes/         → toggle vote (créer/modifier/supprimer)
    - GET  /api/votes/stats/   → statistiques de votes pour une cible
    
    Règles :
    - Toggle : voter la même valeur = supprimer le vote
    - Voter une valeur différente = modifier le vote
    """
    permission_classes = [IsAuthenticated]
    serializer_class = VoteSerializer
    http_method_names = ['post', 'get']

    def get_queryset(self):
        """Retourne les votes de l'utilisateur connecté."""
        return Vote.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        """
        Toggle vote :
        - Si vote existe avec même valeur → supprimer
        - Si vote existe avec valeur différente → modifier
        - Si vote n'existe pas → créer
        """
        target_type = request.data.get('target_type')
        target_id = request.data.get('target_id')
        value = request.data.get('value')

        # Validation
        if not all([target_type, target_id, value]):
            return Response(
                {'detail': 'target_type, target_id et value sont requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            value = int(value)
            if value not in [1, -1]:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {'detail': 'value doit être +1 ou -1.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier si un vote existe déjà
        try:
            existing_vote = Vote.objects.get(
                user=request.user,
                target_type=target_type,
                target_id=target_id
            )

            # Toggle : même valeur = supprimer
            if existing_vote.value == value:
                existing_vote.delete()
                return Response(
                    {'detail': 'Vote supprimé.', 'action': 'removed'},
                    status=status.HTTP_200_OK
                )
            
            # Valeur différente = modifier
            existing_vote.value = value
            existing_vote.save()
            serializer = self.get_serializer(existing_vote)
            return Response(
                {'detail': 'Vote modifié.', 'action': 'updated', 'vote': serializer.data},
                status=status.HTTP_200_OK
            )

        except Vote.DoesNotExist:
            # Créer un nouveau vote
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            
            return Response(
                {'detail': 'Vote créé.', 'action': 'created', 'vote': serializer.data},
                status=status.HTTP_201_CREATED
            )

    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        """
        Retourne les statistiques de votes pour une cible.
        Query params : target_type, target_id
        """
        target_type = request.query_params.get('target_type')
        target_id = request.query_params.get('target_id')

        if not target_type or not target_id:
            return Response(
                {'detail': 'target_type et target_id sont requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Récupérer les statistiques
        stats = Vote.get_vote_counts(target_type, target_id)
        
        # Ajouter le vote de l'utilisateur si authentifié
        if request.user.is_authenticated:
            stats['user_vote'] = Vote.get_user_vote(request.user, target_type, target_id)
        else:
            stats['user_vote'] = None

        serializer = VoteStatsSerializer(stats)
        return Response(serializer.data)
