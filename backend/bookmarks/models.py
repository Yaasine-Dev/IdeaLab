from django.db import models
from accounts.models import User
from ideas.models import Idea

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)