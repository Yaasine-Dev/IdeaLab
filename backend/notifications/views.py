from rest_framework import generics, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = ['id', 'notif_type', 'message', 'related_id', 'is_read', 'created_at']
        read_only_fields = ['id', 'notif_type', 'message', 'related_id', 'created_at']


class NotificationListView(generics.ListAPIView):
    """GET /notifications/ — Notifications de l'utilisateur connecté."""
    serializer_class   = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Notification.objects.filter(user=self.request.user)
        unread = self.request.query_params.get('unread')
        if unread:
            qs = qs.filter(is_read=False)
        return qs


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_read(request):
    """POST /notifications/read-all/ — Tout marquer comme lu."""
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'message': 'Toutes les notifications marquées comme lues.'})


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def mark_one_read(request, pk):
    """PATCH /notifications/<id>/read/ — Marquer une notif comme lue."""
    try:
        notif = Notification.objects.get(pk=pk, user=request.user)
        notif.is_read = True
        notif.save()
        return Response({'message': 'Notification marquée comme lue.'})
    except Notification.DoesNotExist:
        return Response({'error': 'Introuvable.'}, status=404)