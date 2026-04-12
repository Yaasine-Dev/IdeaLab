from django.db import models
from accounts.models import User
from ideas.models import Idea

class Comment(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()

    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)