from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ideas.models import Idea
from feedbacks.models import Feedback
from accounts.models import User
from ideas.serializers import IdeaSerializer
from feedbacks.serializers import FeedbackSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    ideas = Idea.objects.filter(owner=user).order_by('-created_at')
    feedbacks = Feedback.objects.filter(idea__owner=user).order_by('-created_at')

    total_ideas = ideas.count()
    total_feedbacks = feedbacks.count()
    scores = [f.weighted_score for f in feedbacks]
    avg_sgv = round(sum(scores) / len(scores), 2) if scores else 0
    best_sgv = round(max(scores), 2) if scores else 0

    # dimension averages
    dim_avg = {}
    if feedbacks.exists():
        count = feedbacks.count()
        dim_avg = {
            'market':      round(sum(f.market_score for f in feedbacks) / count, 2),
            'innovation':  round(sum(f.innovation_score for f in feedbacks) / count, 2),
            'feasibility': round(sum(f.feasibility_score for f in feedbacks) / count, 2),
            'roi':         round(sum(f.roi_score for f in feedbacks) / count, 2),
        }

    # sgv history per idea
    sgv_history = []
    for idea in ideas:
        idea_fbs = feedbacks.filter(idea=idea)
        if idea_fbs.exists():
            sgv_history.append({
                'idea': idea.title[:30],
                'score': round(sum(f.weighted_score for f in idea_fbs) / idea_fbs.count(), 2),
            })

    # enrich ideas with feedback count
    ideas_data = []
    for idea in ideas:
        d = IdeaSerializer(idea).data
        d['feedbacks_count'] = feedbacks.filter(idea=idea).count()
        d['sgv_score'] = round(
            sum(f.weighted_score for f in feedbacks.filter(idea=idea)) / feedbacks.filter(idea=idea).count(), 2
        ) if feedbacks.filter(idea=idea).exists() else 0
        ideas_data.append(d)

    recent_feedbacks = []
    for f in feedbacks[:10]:
        d = FeedbackSerializer(f).data
        d['idea_title'] = f.idea.title
        d['total_score'] = f.weighted_score
        recent_feedbacks.append(d)

    return Response({
        'stats': {
            'total_ideas': total_ideas,
            'total_feedbacks': total_feedbacks,
            'average_sgv': avg_sgv,
            'best_sgv': best_sgv,
        },
        'ideas': ideas_data,
        'recent_feedbacks': recent_feedbacks,
        'sgv_history': sgv_history,
        'dimension_averages': dim_avg,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reviewer_stats(request):
    feedbacks = Feedback.objects.filter(reviewer=request.user).order_by('-created_at')
    ideas_reviewed = feedbacks.values('idea').distinct().count()
    scores = [f.weighted_score for f in feedbacks]
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0

    evaluated_ideas = []
    for f in feedbacks:
        evaluated_ideas.append({
            'id':         f.id,
            'idea_id':    f.idea.id,
            'idea_title': f.idea.title,
            'my_score':   round(f.weighted_score, 2),
            'market_score':      f.market_score,
            'innovation_score':  f.innovation_score,
            'feasibility_score': f.feasibility_score,
            'roi_score':         f.roi_score,
            'comment':    f.comment,
            'created_at': f.created_at,
        })

    pending_ideas = Idea.objects.filter(status='submitted').exclude(
        id__in=feedbacks.values_list('idea_id', flat=True)
    ).order_by('-created_at')

    profile = getattr(request.user, 'userprofile', None)
    rep_points = profile.reputation_score if profile else 0

    return Response({
        'stats': {
            'total_feedbacks':  feedbacks.count(),
            'ideas_reviewed':   ideas_reviewed,
            'average_score':    avg_score,
            'pending_count':    pending_ideas.count(),
            'reputation_points': rep_points,
            'feedbacks_given':  feedbacks.count(),
            'avg_score_given':  avg_score,
        },
        'evaluated_ideas': evaluated_ideas,
        'scores': scores,
        'pending_ideas': IdeaSerializer(pending_ideas[:10], many=True).data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    if request.user.role != 'admin':
        from rest_framework import status
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    from django.db.models import Count
    ideas_by_status = dict(Idea.objects.values_list('status').annotate(c=Count('id')).values_list('status', 'c'))

    return Response({
        'total_users':     User.objects.count(),
        'total_ideas':     Idea.objects.count(),
        'total_feedbacks': Feedback.objects.count(),
        'pending_ideas':   Idea.objects.filter(status='submitted').count(),
        'ideas_by_status': [{'name': k, 'count': v} for k, v in ideas_by_status.items()],
        'recent_ideas':    IdeaSerializer(Idea.objects.order_by('-created_at')[:10], many=True).data,
        'recent_users':    list(User.objects.order_by('-date_joined')[:10].values('id', 'username', 'email', 'role', 'is_active', 'date_joined')),
    })
