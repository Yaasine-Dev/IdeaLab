import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Vote(models.Model):
    """
    Système de vote polymorphique pour ideas, feedbacks et comments.
    
    Règles :
    - value : +1 (upvote) ou -1 (downvote)
    - Toggle : voter la même valeur = supprimer le vote
    - UNIQUE(user, target_type, target_id)
    """
    TARGET_CHOICES = [
        ('idea', 'Idea'),
        ('feedback', 'Feedback'),
        ('comment', 'Comment'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='votes')
    
    # Polymorphisme : type + id de la cible
    target_type = models.CharField(max_length=20, choices=TARGET_CHOICES)
    target_id = models.CharField(max_length=36)  # CharField pour compatibilité UUID
    
    # Valeur du vote : +1 ou -1
    value = models.SmallIntegerField(
        validators=[MinValueValidator(-1), MaxValueValidator(1)],
        help_text="1 pour upvote, -1 pour downvote"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'target_type', 'target_id')
        indexes = [
            models.Index(fields=['target_type', 'target_id']),
            models.Index(fields=['user', 'target_type']),
        ]

    def __str__(self):
        vote_type = "upvote" if self.value == 1 else "downvote"
        return f"{self.user.username} {vote_type} on {self.target_type}:{self.target_id}"

    @classmethod
    def get_vote_counts(cls, target_type, target_id):
        """
        Retourne le nombre d'upvotes et downvotes pour une cible.
        Returns: {'upvotes': int, 'downvotes': int, 'total': int}
        """
        votes = cls.objects.filter(target_type=target_type, target_id=target_id)
        upvotes = votes.filter(value=1).count()
        downvotes = votes.filter(value=-1).count()
        return {
            'upvotes': upvotes,
            'downvotes': downvotes,
            'total': upvotes - downvotes
        }

    @classmethod
    def get_user_vote(cls, user, target_type, target_id):
        """
        Retourne le vote de l'utilisateur pour une cible (None si pas de vote).
        """
        try:
            vote = cls.objects.get(user=user, target_type=target_type, target_id=target_id)
            return vote.value
        except cls.DoesNotExist:
            return None
