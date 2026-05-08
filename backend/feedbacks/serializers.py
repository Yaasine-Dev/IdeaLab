from rest_framework import serializers
from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.CharField(source='reviewer.username', read_only=True)
    reviewer_level    = serializers.CharField(source='reviewer.profile.level', read_only=True)
    raw_score         = serializers.IntegerField(read_only=True)
    can_edit          = serializers.SerializerMethodField()

    class Meta:
        model  = Feedback
        fields = [
            'id', 'idea', 'reviewer_username', 'reviewer_level',
            'market_score', 'innovation_score', 'feasibility_score', 'roi_score',
            'raw_score', 'weighted_score', 'comment',
            'is_helpful', 'can_edit',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'reviewer_username', 'reviewer_level',
            'raw_score', 'weighted_score', 'is_helpful',
            'created_at', 'updated_at',
        ]

    def get_can_edit(self, obj):
        return obj.can_edit()

    def validate_comment(self, value):
        """Commentaire obligatoire de minimum 50 caractères."""
        if len(value.strip()) < 50:
            raise serializers.ValidationError(
                "Le commentaire doit contenir au moins 50 caractères."
            )
        return value

    def validate(self, attrs):
        """
        Vérifications globales :
        1. Unicité (reviewer, idea) — déjà en BDD mais on valide avant
        2. Fenêtre de modification de 24h
        """
        request = self.context.get('request')

        # Vérification unicité lors de la création
        if self.instance is None:
            idea     = attrs.get('idea')
            reviewer = request.user if request else None
            if reviewer and Feedback.objects.filter(idea=idea, reviewer=reviewer).exists():
                raise serializers.ValidationError(
                    "Vous avez déjà soumis un feedback pour cette idée."
                )

        # Vérification fenêtre 24h lors de la modification
        if self.instance is not None and not self.instance.can_edit():
            raise serializers.ValidationError(
                "Le délai de modification de 24h est dépassé."
            )

        return attrs

    def create(self, validated_data):
        reviewer = self.context['request'].user
        feedback = Feedback.objects.create(reviewer=reviewer, **validated_data)
        feedback.calculate_weighted_score()

        # Déclencher le recalcul SGV via Celery
        from .tasks import recalculate_sgv_task, send_feedback_notification_task
        recalculate_sgv_task.delay(str(feedback.idea_id))
        send_feedback_notification_task.delay(str(feedback.id))

        # Récompenser le reviewer (+2 pts réputation)
        try:
            reviewer.profile.add_reputation(2)
            from accounts.models import ReputationLog
            ReputationLog.objects.create(
                user=reviewer,
                points=2,
                reason="Feedback soumis sur une idée",
            )
        except Exception:
            pass

        return feedback

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        instance.calculate_weighted_score()

        # Recalcul SGV
        from .tasks import recalculate_sgv_task
        recalculate_sgv_task.delay(str(instance.idea_id))

        return instance