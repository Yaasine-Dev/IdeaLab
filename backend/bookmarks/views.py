from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Bookmark
from .serializers import BookmarkSerializer


class BookmarkListView(ListAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user).order_by('-saved_at')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_bookmark(request):
    idea_id = request.data.get('idea_id')
    if not idea_id:
        return Response({'error': 'idea_id required'}, status=status.HTTP_400_BAD_REQUEST)
    bookmark = Bookmark.objects.filter(user=request.user, idea_id=idea_id).first()
    if bookmark:
        bookmark.delete()
        return Response({'bookmarked': False})
    bookmark = Bookmark.objects.create(user=request.user, idea_id=idea_id)
    return Response({'bookmarked': True, 'bookmark': BookmarkSerializer(bookmark).data}, status=status.HTTP_201_CREATED)
