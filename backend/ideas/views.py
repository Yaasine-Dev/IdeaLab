from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Idea, Category, IdeaVersion
from .serializers import IdeaSerializer, CategorySerializer, IdeaVersionSerializer


class CategoryListView(generics.ListCreateAPIView):
    """List all categories or create new category"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update or delete a category"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class IdeaListView(generics.ListCreateAPIView):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Idea.objects.exclude(status='draft')
        status_filter = self.request.query_params.get('status')
        owner = self.request.query_params.get('owner')
        search = self.request.query_params.get('search')
        ordering = self.request.query_params.get('ordering', '-created_at')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        elif not owner:  # when browsing explore, exclude drafts
            queryset = queryset.exclude(status='draft')
        if owner:
            # owner's own ideas — show all statuses
            queryset = Idea.objects.filter(owner__username=owner)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(description__icontains=search)

        allowed_orderings = ('created_at', '-created_at', 'global_score', '-global_score')
        if ordering not in allowed_orderings:
            ordering = '-created_at'
        return queryset.order_by(ordering)


class IdeaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        idea = self.get_object()
        if idea.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You can only update your own ideas')
        if idea.status not in ('draft', 'rejected'):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only draft or rejected ideas can be edited')
        updated = serializer.save()
        # +50 pts if idea just got validated
        if updated.status == 'validated' and idea.status != 'validated':
            from accounts.reputation import add_reputation
            from notifications.utils import notify
            add_reputation(idea.owner, 50, f'Idea "{idea.title}" was validated')
            notify(idea.owner, 'status', f'Your idea "{idea.title}" has been validated! +50 reputation points.', related_id=idea.id)

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You can only delete your own ideas')
        if instance.status != 'draft':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only draft ideas can be deleted')
        instance.delete()


@api_view(['GET'])
@permission_classes([AllowAny])
def trending_ideas(request):
    ideas = Idea.objects.filter(status='validated').order_by('-global_score', '-created_at')[:10]
    return Response(IdeaSerializer(ideas, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_ideas(request):
    ideas = Idea.objects.filter(status='validated').exclude(owner=request.user).order_by('-global_score')[:10]
    return Response(IdeaSerializer(ideas, many=True).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_idea_status(request, pk):
    """Reviewer or admin can validate/reject a submitted idea."""
    from rest_framework.exceptions import PermissionDenied
    if request.user.role not in ('reviewer', 'admin'):
        raise PermissionDenied('Only reviewers or admins can change idea status')
    try:
        idea = Idea.objects.get(id=pk)
    except Idea.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    allowed = ('review', 'validated', 'rejected')
    if new_status not in allowed:
        return Response({'detail': f'Status must be one of {allowed}'}, status=status.HTTP_400_BAD_REQUEST)

    old_status = idea.status
    idea.status = new_status
    idea.save()

    from notifications.utils import notify
    from accounts.reputation import add_reputation

    label = {'review': 'moved to review', 'validated': 'validated ✓', 'rejected': 'rejected'}
    notify(
        idea.owner, 'status',
        f'Your idea "{idea.title}" has been {label[new_status]} by {request.user.username}.',
        related_id=idea.id,
    )
    if new_status == 'validated' and old_status != 'validated':
        add_reputation(idea.owner, 50, f'Idea "{idea.title}" was validated')

    return Response(IdeaSerializer(idea).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_ideas(request):
    ideas = Idea.objects.filter(owner=request.user).order_by('-created_at')
    return Response(IdeaSerializer(ideas, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_idea(request):
    """Submit idea for review"""
    idea_id = request.data.get('idea_id')
    try:
        idea = Idea.objects.get(id=idea_id, owner=request.user)
        idea.status = 'submitted'
        idea.save()
        return Response({
            'message': 'Idea submitted successfully',
            'idea': IdeaSerializer(idea).data
        })
    except Idea.DoesNotExist:
        return Response(
            {'error': 'Idea not found or unauthorized'},
            status=status.HTTP_404_NOT_FOUND
        )


class IdeaVersionListView(generics.ListCreateAPIView):
    """List versions of an idea"""
    serializer_class = IdeaVersionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        idea_id = self.kwargs.get('idea_id')
        return IdeaVersion.objects.filter(idea_id=idea_id).order_by('-version_number')

    def perform_create(self, serializer):
        """Create new version"""
        idea_id = self.kwargs.get('idea_id')
        idea = get_object_or_404(Idea, id=idea_id, owner=self.request.user)
        
        latest_version = IdeaVersion.objects.filter(idea=idea).order_by('-version_number').first()
        version_number = (latest_version.version_number + 1) if latest_version else 1
        
        serializer.save(idea=idea, version_number=version_number)

