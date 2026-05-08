from rest_framework import serializers
from .models import Vote


class VoteSerializer(serializers.ModelSerializer):
    """
    Serializer pour les votes.
    Validation :
    - target_type doit être valide (idea/feedback/comment)
    - value doit être +1 ou -1
    """
    
    class Meta:
        model = Vote
        fields = ['id', 'target_type', 'target_id', 'value', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_value(self, value):
        """Validation : value doit être +1 ou -1."""
        if value not in [1, -1]:
            raise serializers.ValidationError("La valeur du vote doit être +1 (upvote) ou -1 (downvote).")
        return value

    def validate(self, data):
        """Validation : vérifier que la cible existe."""
        target_type = data.get('target_type')
        target_id = data.get('target_id')

        # Vérifier que la cible existe
        if target_type == 'idea':
            from ideas.models import Idea
            if not Idea.objects.filter(id=target_id).exists():
                raise serializers.ValidationError("L'idée spécifiée n'existe pas.")
        elif target_type == 'feedback':
            from feedbacks.models import Feedback
            if not Feedback.objects.filter(id=target_id).exists():
                raise serializers.ValidationError("Le feedback spécifié n'existe pas.")
        elif target_type == 'comment':
            from comments.models import Comment
            if not Comment.objects.filter(id=target_id).exists():
                raise serializers.ValidationError("Le commentaire spécifié n'existe pas.")

        return data


class VoteStatsSerializer(serializers.Serializer):
    """Serializer pour les statistiques de votes."""
    upvotes = serializers.IntegerField()
    downvotes = serializers.IntegerField()
    total = serializers.IntegerField()
    user_vote = serializers.IntegerField(allow_null=True)
