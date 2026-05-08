import uuid
from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPE_CHOICES = (
        ('new_feedback',  'Nouveau feedback'),
        ('new_comment',   'Nouveau commentaire'),
        ('new_reply',     'Nouvelle réponse'),
        ('idea_promoted', 'Idée prometteuse'),
        ('feedback_voted','Feedback voté'),
        ('status_changed','Statut modifié'),
    )

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notif_type   = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message      = models.TextField()
    related_id   = models.CharField(max_length=100, null=True, blank=True)
    is_read      = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)

    notif_type = models.CharField(
    max_length=20, 
    choices=TYPE_CHOICES, 
    default='new_feedback'  # ← ajoute cette ligne
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.notif_type}] → {self.user.username}"