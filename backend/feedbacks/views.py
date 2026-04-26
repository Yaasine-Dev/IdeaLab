from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Feedback
from .serializers import FeedbackSerializer
from ideas.models import Idea
from notifications.utils import notify
from accounts.reputation import add_reputation


class FeedbackListCreateView(generics.ListCreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Feedback.objects.filter(idea_id=self.kwargs['idea_id']).order_by('-created_at')

    def perform_create(self, serializer):
        idea_id = self.kwargs['idea_id']
        feedback = serializer.save(idea_id=idea_id)
        try:
            idea = Idea.objects.get(id=idea_id)
            if idea.owner != self.request.user:
                notify(
                    idea.owner, 'feedback',
                    f'{self.request.user.username} reviewed your idea "{idea.title}" — score: {round(feedback.weighted_score, 1)}/10.',
                    related_id=idea.id,
                )
                # +10 pts for receiving a feedback
                add_reputation(idea.owner, 10, f'Received feedback on "{idea.title}"')
                # +5 bonus if high score
                if feedback.weighted_score >= 7:
                    add_reputation(idea.owner, 5, f'High score feedback on "{idea.title}"')
        except Idea.DoesNotExist:
            pass


class FeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        feedback = self.get_object()
        if feedback.reviewer != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only update your own feedback")
        updated = serializer.save()
        try:
            idea = feedback.idea
            if idea.owner != self.request.user:
                notify(
                    idea.owner, 'feedback',
                    f'{self.request.user.username} updated their review on "{idea.title}" — new score: {round(updated.weighted_score, 1)}/10.',
                    related_id=idea.id,
                )
        except Exception:
            pass

    def perform_destroy(self, instance):
        if instance.reviewer != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own feedback")
        instance.delete()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def idea_average_score(request, idea_id):
    feedbacks = Feedback.objects.filter(idea_id=idea_id)
    if not feedbacks.exists():
        return Response({'idea_id': idea_id, 'average_score': 0, 'feedback_count': 0})
    avg = sum(f.weighted_score for f in feedbacks) / feedbacks.count()
    return Response({
        'idea_id': idea_id,
        'average_score': round(avg, 2),
        'feedback_count': feedbacks.count(),
        'scores': {
            'market':      round(sum(f.market_score for f in feedbacks) / feedbacks.count(), 2),
            'innovation':  round(sum(f.innovation_score for f in feedbacks) / feedbacks.count(), 2),
            'feasibility': round(sum(f.feasibility_score for f in feedbacks) / feedbacks.count(), 2),
            'roi':         round(sum(f.roi_score for f in feedbacks) / feedbacks.count(), 2),
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_feedback_reviews(request):
    feedbacks = Feedback.objects.filter(reviewer=request.user).order_by('-created_at')
    return Response(FeedbackSerializer(feedbacks, many=True).data)
