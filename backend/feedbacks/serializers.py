from rest_framework import serializers
from .models import Feedback
from accounts.serializers import UserSerializer
from ideas.serializers import IdeaSerializer


class FeedbackSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    idea = IdeaSerializer(read_only=True)

    class Meta:
        model = Feedback
        fields = ('id', 'idea', 'reviewer', 'market_score', 'innovation_score', 'feasibility_score', 'roi_score', 'comment', 'weighted_score', 'created_at')
        read_only_fields = ('id', 'reviewer', 'weighted_score', 'created_at')

    def create(self, validated_data):
        validated_data['reviewer'] = self.context['request'].user
        # Calculate weighted score
        scores = [
            validated_data.get('market_score', 0),
            validated_data.get('innovation_score', 0),
            validated_data.get('feasibility_score', 0),
            validated_data.get('roi_score', 0),
        ]
        validated_data['weighted_score'] = sum(scores) / len(scores) if scores else 0
        return super().create(validated_data)
