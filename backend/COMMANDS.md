# ═══════════════════════════════════════════════════════════════════════════════
# IDEALAB — COMMANDES À EXÉCUTER (SPRINTS 4, 5, 6)
# ═══════════════════════════════════════════════════════════════════════════════

# ── 1. MIGRATIONS ──────────────────────────────────────────────────────────────

# Créer les migrations pour les nouvelles apps
python manage.py makemigrations comments
python manage.py makemigrations votes
python manage.py makemigrations bookmarks

# Appliquer toutes les migrations
python manage.py migrate

# ── 2. VÉRIFICATION ────────────────────────────────────────────────────────────

# Vérifier que toutes les apps sont bien installées
python manage.py check

# Lister les migrations
python manage.py showmigrations

# ── 3. CRÉER UN SUPERUTILISATEUR (si pas déjà fait) ────────────────────────────

python manage.py createsuperuser

# ── 4. LANCER REDIS ────────────────────────────────────────────────────────────

# Redis doit être actif dans Laragon
# Vérifier dans l'interface Laragon que Redis est démarré

# ── 5. LANCER CELERY (dans un terminal séparé) ────────────────────────────────

# Terminal 1 : Celery Worker
celery -A config worker -l info

# ── 6. LANCER LE SERVEUR DJANGO ────────────────────────────────────────────────

# Terminal 2 : Django
python manage.py runserver

# ── 7. TESTER LES ENDPOINTS ────────────────────────────────────────────────────

# Ouvrir un navigateur et tester :
# - Admin : http://localhost:8000/admin/
# - API Root : http://localhost:8000/api/
# - Comments : http://localhost:8000/api/comments/
# - Votes : http://localhost:8000/api/votes/
# - Bookmarks : http://localhost:8000/api/bookmarks/
# - Analytics : http://localhost:8000/api/analytics/entrepreneur/
# - Export : http://localhost:8000/api/export/csv/<idea_id>/
# - Search : http://localhost:8000/api/search/?q=test

# ── 8. LANCER LES TESTS ────────────────────────────────────────────────────────

# Tests unitaires
pytest

# Tests avec couverture
pytest --cov=. --cov-report=html

# Tests d'une app spécifique
pytest comments/tests.py
pytest votes/tests.py
pytest bookmarks/tests.py

# ── 9. CRÉER DES DONNÉES DE TEST ───────────────────────────────────────────────

python manage.py shell

# Dans le shell Python :
"""
from accounts.models import User
from ideas.models import Idea
from feedbacks.models import Feedback
from comments.models import Comment
from votes.models import Vote
from bookmarks.models import Bookmark

# Créer un entrepreneur
entrepreneur = User.objects.create_user(
    username='entrepreneur1',
    email='entrepreneur@test.com',
    password='test123',
    role='entrepreneur'
)

# Créer un reviewer
reviewer = User.objects.create_user(
    username='reviewer1',
    email='reviewer@test.com',
    password='test123',
    role='reviewer'
)

# Créer une idée
idea = Idea.objects.create(
    owner=entrepreneur,
    title='Application de covoiturage écologique',
    description='Une app pour partager des trajets en réduisant l\'empreinte carbone',
    sector='Transport',
    problem='Trop de voitures individuelles sur les routes',
    solution='Plateforme de mise en relation pour covoiturage',
    target='Étudiants et travailleurs urbains',
    status='submitted'
)

# Créer un feedback
feedback = Feedback.objects.create(
    idea=idea,
    reviewer=reviewer,
    market_score=20,
    innovation_score=22,
    feasibility_score=18,
    roi_score=19,
    comment='Excellent projet avec un fort potentiel de marché. La solution est innovante et répond à un vrai besoin.'
)

# Créer un commentaire
comment = Comment.objects.create(
    idea=idea,
    author=entrepreneur,
    content='Merci pour ce feedback constructif !'
)

# Créer un vote
vote = Vote.objects.create(
    user=entrepreneur,
    target_type='idea',
    target_id=idea.id,
    value=1
)

# Créer un bookmark
bookmark = Bookmark.objects.create(
    user=reviewer,
    idea=idea
)

print("✅ Données de test créées avec succès !")
"""

# ── 10. COLLECTER LES FICHIERS STATIQUES (pour production) ────────────────────

python manage.py collectstatic --noinput

# ── 11. DÉPLOIEMENT DOCKER (optionnel) ─────────────────────────────────────────

# Construire les images
docker-compose build

# Lancer les conteneurs
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les conteneurs
docker-compose down

# ═══════════════════════════════════════════════════════════════════════════════
# RÉSUMÉ DES NOUVEAUTÉS (SPRINTS 4, 5, 6)
# ═══════════════════════════════════════════════════════════════════════════════

# ✅ SPRINT 4 — Comments + Votes + Bookmarks
# - Comments : Commentaires imbriqués avec soft delete
# - Votes : Système de vote polymorphique (ideas, feedbacks, comments)
# - Bookmarks : Favoris avec toggle

# ✅ SPRINT 5 — Analytics + Export + Search
# - Analytics : Dashboard entrepreneur et admin avec graphiques
# - Export : CSV, JSON, PDF asynchrone (Celery)
# - Search : Recherche globale full-text

# ✅ SPRINT 6 — Tests + Documentation + Déploiement
# - Tests : pytest avec couverture
# - Documentation : README, API, Installation
# - Déploiement : Docker + Nginx + Gunicorn

# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS DISPONIBLES
# ═══════════════════════════════════════════════════════════════════════════════

# Authentification
# POST   /api/accounts/register/
# POST   /api/accounts/login/
# POST   /api/accounts/token/refresh/

# Idées
# GET    /api/ideas/
# POST   /api/ideas/
# GET    /api/ideas/<uuid>/
# PATCH  /api/ideas/<uuid>/
# DELETE /api/ideas/<uuid>/

# Feedbacks
# GET    /api/feedbacks/
# POST   /api/feedbacks/
# PATCH  /api/feedbacks/<uuid>/

# Comments
# GET    /api/comments/?idea_id=<uuid>
# POST   /api/comments/
# PATCH  /api/comments/<uuid>/
# DELETE /api/comments/<uuid>/

# Votes
# POST   /api/votes/
# GET    /api/votes/stats/?target_type=idea&target_id=<uuid>

# Bookmarks
# GET    /api/bookmarks/
# POST   /api/bookmarks/
# GET    /api/bookmarks/check/?idea_id=<uuid>

# Analytics
# GET    /api/analytics/entrepreneur/
# GET    /api/analytics/admin/

# Export
# POST   /api/export/csv/<uuid>/
# POST   /api/export/json/<uuid>/
# POST   /api/export/pdf/<uuid>/
# GET    /api/export/status/<task_id>/

# Search
# GET    /api/search/?q=<query>&filter=<type>

# Notifications
# GET    /api/notifications/
# PATCH  /api/notifications/<uuid>/mark-read/
# POST   /api/notifications/mark-all-read/

# ═══════════════════════════════════════════════════════════════════════════════
