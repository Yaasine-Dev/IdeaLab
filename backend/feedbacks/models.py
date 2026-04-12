from django.db import models
from accounts.models import User
from ideas.models import Idea

class Feedback(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)

    market_score = models.IntegerField()
    innovation_score = models.IntegerField()
    feasibility_score = models.IntegerField()
    roi_score = models.IntegerField()

    comment = models.TextField()
    weighted_score = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('idea', 'reviewer')  # 1 feedback per reviewer per idea