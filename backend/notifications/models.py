from django.db import models
from accounts.models import User

class Notification(models.Model):
    TYPE_CHOICES = (
        ('feedback', 'Feedback'),
        ('comment', 'Comment'),
        ('status', 'Status Change'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message = models.TextField()

    is_read = models.BooleanField(default=False)
    related_id = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)