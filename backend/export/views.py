from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ideas.models import Idea
from .tasks import export_idea_csv, export_idea_json, export_idea_pdf


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_csv(request, idea_id):
    """
    Génère un export CSV d'une idée de manière asynchrone.
    Seul le propriétaire de l'idée peut exporter.
    """
    idea = get_object_or_404(Idea, id=idea_id)
    
    # Vérification : propriétaire uniquement
    if idea.owner != request.user and request.user.role != 'admin':
        return Response(
            {'detail': 'Vous ne pouvez exporter que vos propres idées.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Lancer la tâche Celery
    task = export_idea_csv.delay(str(idea_id))
    
    return Response({
        'detail': 'Export CSV en cours de génération.',
        'task_id': task.id,
        'status': 'processing'
    }, status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_json(request, idea_id):
    """
    Génère un export JSON d'une idée de manière asynchrone.
    Seul le propriétaire de l'idée peut exporter.
    """
    idea = get_object_or_404(Idea, id=idea_id)
    
    # Vérification : propriétaire uniquement
    if idea.owner != request.user and request.user.role != 'admin':
        return Response(
            {'detail': 'Vous ne pouvez exporter que vos propres idées.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Lancer la tâche Celery
    task = export_idea_json.delay(str(idea_id))
    
    return Response({
        'detail': 'Export JSON en cours de génération.',
        'task_id': task.id,
        'status': 'processing'
    }, status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_pdf(request, idea_id):
    """
    Génère un export PDF d'une idée de manière asynchrone.
    Seul le propriétaire de l'idée peut exporter.
    """
    idea = get_object_or_404(Idea, id=idea_id)
    
    # Vérification : propriétaire uniquement
    if idea.owner != request.user and request.user.role != 'admin':
        return Response(
            {'detail': 'Vous ne pouvez exporter que vos propres idées.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Lancer la tâche Celery
    task = export_idea_pdf.delay(str(idea_id))
    
    return Response({
        'detail': 'Export PDF en cours de génération.',
        'task_id': task.id,
        'status': 'processing'
    }, status=status.HTTP_202_ACCEPTED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_status(request, task_id):
    """
    Vérifie le statut d'une tâche d'export.
    Retourne le lien de téléchargement si terminé.
    """
    from celery.result import AsyncResult
    
    task = AsyncResult(task_id)
    
    if task.state == 'PENDING':
        response = {
            'status': 'pending',
            'detail': 'Export en attente...'
        }
    elif task.state == 'SUCCESS':
        result = task.result
        if result.get('success'):
            response = {
                'status': 'success',
                'detail': 'Export terminé.',
                'download_url': f'/media/exports/{result["filename"]}'
            }
        else:
            response = {
                'status': 'error',
                'detail': result.get('error', 'Erreur inconnue')
            }
    elif task.state == 'FAILURE':
        response = {
            'status': 'error',
            'detail': str(task.info)
        }
    else:
        response = {
            'status': task.state.lower(),
            'detail': f'Export en cours... ({task.state})'
        }
    
    return Response(response)
