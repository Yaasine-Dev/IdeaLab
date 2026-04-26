from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from .models import Comment
from .serializers import CommentSerializer
from ideas.models import Idea
from notifications.utils import notify
from accounts.reputation import add_reputation


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(idea_id=self.kwargs['idea_id'], parent__isnull=True).order_by('-created_at')

    def perform_create(self, serializer):
        idea_id = self.kwargs['idea_id']
        comment = serializer.save(idea_id=idea_id)
        try:
            idea = Idea.objects.get(id=idea_id)
            if idea.owner != self.request.user:
                notify(
                    idea.owner, 'comment',
                    f'{self.request.user.username} commented on your idea "{idea.title}".',
                    related_id=idea.id,
                )
                # +2 pts for receiving a comment
                add_reputation(idea.owner, 2, f'Received comment on "{idea.title}"')
        except Idea.DoesNotExist:
            pass


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if self.get_object().author != self.request.user:
            raise PermissionDenied("You can only update your own comments")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied("You can only delete your own comments")
        instance.delete()


class CommentRepliesView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(parent_id=self.kwargs['comment_id']).order_by('-created_at')

    def perform_create(self, serializer):
        comment_id = self.kwargs['comment_id']
        parent = Comment.objects.get(id=comment_id)
        comment = serializer.save(idea=parent.idea, parent_id=comment_id)
        # Notify parent comment author (if not self)
        if parent.author != self.request.user:
            notify(
                parent.author, 'comment',
                f'{self.request.user.username} replied to your comment on "{parent.idea.title}".',
                related_id=parent.idea.id,
            )
        # Also notify idea owner if different from both
        if parent.idea.owner != self.request.user and parent.idea.owner != parent.author:
            notify(
                parent.idea.owner, 'comment',
                f'{self.request.user.username} replied to a comment on your idea "{parent.idea.title}".',
                related_id=parent.idea.id,
            )
