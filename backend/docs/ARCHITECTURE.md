# 🏗️ Architecture IdeaLab

## 📊 Vue d'ensemble

IdeaLab est une plateforme de validation d'idées de startup construite avec une architecture moderne et scalable.

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│              React 18 + Vite + Tailwind                     │
│                   http://localhost:5173                     │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API (JSON)
                     │
┌────────────────────▼────────────────────────────────────────┐
│                        BACKEND                              │
│              Django 5.2.13 + DRF + JWT                      │
│                   http://localhost:8000                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Accounts │  │  Ideas   │  │Feedbacks │  │ Comments │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Votes   │  │Bookmarks │  │Analytics │  │  Export  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼────┐ ┌─────▼─────┐
│    MySQL     │ │ Redis │ │  Celery   │
│     8.4      │ │       │ │  Worker   │
└──────────────┘ └───────┘ └───────────┘
```

## 🗂️ Structure des Apps Django

### 1. **accounts** — Authentification & Utilisateurs
```
accounts/
├── models.py          # User, UserProfile, ReputationLog
├── serializers.py     # Sérialisation des utilisateurs
├── views.py           # Register, Login, Profile
├── permissions.py     # RBAC (IsOwner, IsReviewer, IsAdmin)
└── reputation.py      # Système de réputation
```

**Modèles :**
- `User` : Utilisateur custom avec 4 rôles
- `UserProfile` : Profil (bio, avatar, réputation, niveau)
- `ReputationLog` : Historique des points de réputation

**Rôles :**
- `visitor` : Lecture seule
- `entrepreneur` : Créer des idées
- `reviewer` : Évaluer des idées
- `admin` : Administration complète

### 2. **ideas** — Gestion des Idées
```
ideas/
├── models.py          # Idea, Category, Tag, IdeaVersion
├── serializers.py     # Sérialisation des idées
├── views.py           # CRUD + Filtres + Trending
└── urls.py
```

**Workflow de statut :**
```
draft → submitted → review → validated/rejected
```

**Fonctionnalités :**
- Versioning automatique (IdeaVersion)
- Upload logo + pitch deck
- Filtres : secteur, statut, trending
- Recommandations personnalisées

### 3. **feedbacks** — Évaluations & SGV
```
feedbacks/
├── models.py          # Feedback
├── serializers.py     # Validation des scores
├── views.py           # CRUD + Permissions
├── scoring.py         # Algorithme SGV
└── tasks.py           # Recalcul async (Celery)
```

**Algorithme SGV :**
```python
SGV = Σ(raw_score × reviewer_coefficient) / Σ(coefficients)

Coefficients :
- Bronze : 1.0
- Silver : 1.2
- Gold   : 1.5
- Expert : 2.0
```

**4 Dimensions (0-25 chacune) :**
- Marché (market_score)
- Innovation (innovation_score)
- Faisabilité (feasibility_score)
- ROI (roi_score)

### 4. **comments** — Commentaires Imbriqués
```
comments/
├── models.py          # Comment (avec parent pour threads)
├── serializers.py     # Sérialisation récursive
├── views.py           # CRUD + Soft delete
└── urls.py
```

**Fonctionnalités :**
- Threads imbriqués (parent/replies)
- Soft delete (is_deleted=True)
- Modification dans les 24h

### 5. **votes** — Système de Vote Polymorphique
```
votes/
├── models.py          # Vote (target_type + target_id)
├── serializers.py     # Validation
├── views.py           # Toggle + Stats
└── urls.py
```

**Cibles :** `idea`, `feedback`, `comment`

**Comportement toggle :**
- Voter la même valeur → Supprime le vote
- Voter une valeur différente → Modifie le vote

### 6. **bookmarks** — Favoris
```
bookmarks/
├── models.py          # Bookmark (user + idea)
├── serializers.py
├── views.py           # Toggle + Liste
└── urls.py
```

### 7. **analytics** — Statistiques & Dashboards
```
analytics/
├── views.py           # entrepreneur_analytics, admin_analytics
└── urls.py
```

**Dashboard Entrepreneur :**
- Total idées, feedbacks, SGV moyen
- Évolution SGV (chart line)
- Radar 4 dimensions
- Derniers feedbacks

**Dashboard Admin :**
- Total users, idées, feedbacks
- Répartition par statut (chart pie)
- Inscriptions 30 jours
- Feedbacks 30 jours

### 8. **export** — Export Asynchrone
```
export/
├── tasks.py           # Celery tasks (CSV, JSON, PDF)
├── views.py           # Déclenchement + Statut
└── urls.py
```

**Formats :**
- CSV : Tableau Excel
- JSON : Données structurées
- PDF : Document formaté (WeasyPrint)

### 9. **search** — Recherche Globale
```
search/
├── views.py           # Full-text search
└── urls.py
```

**Recherche dans :**
- Ideas : title, description, problem, solution
- Users : username, email, name
- Feedbacks : comment

### 10. **notifications** — Notifications
```
notifications/
├── models.py          # Notification
├── serializers.py
├── views.py           # Liste + Mark as read
├── utils.py           # Création de notifications
└── signals.py         # Déclencheurs automatiques
```

## 🔐 Sécurité & Permissions

### Authentification JWT
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

### Permissions RBAC
```python
# accounts/permissions.py
- IsOwner           # Propriétaire de la ressource
- IsReviewer        # Rôle reviewer
- IsAdminUser       # Rôle admin
- IsOwnerOrAdmin    # Propriétaire ou admin
```

### Validation des données
- Serializers DRF pour validation
- Contraintes DB (unique_together, validators)
- Business logic dans models/services

## 📊 Base de données

### Schéma relationnel

```
User ──┬─── UserProfile
       ├─── Idea ──┬─── Feedback ──┬─── Vote
       │           ├─── Comment ────┤
       │           ├─── Bookmark    │
       │           └─── IdeaVersion │
       ├─── Vote                    │
       ├─── Comment ────────────────┘
       ├─── Bookmark
       └─── ReputationLog
```

### Optimisations
- UUID sur tous les modèles (sécurité)
- Indexes sur les FK et champs fréquents
- select_related + prefetch_related (éviter N+1)
- Pagination par défaut (page_size=12)

## ⚡ Tâches Asynchrones (Celery)

### Configuration
```python
# config/celery.py
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
```

### Tâches
```python
# feedbacks/tasks.py
@shared_task
def recalculate_sgv(idea_id)

# export/tasks.py
@shared_task
def export_idea_csv(idea_id)
def export_idea_json(idea_id)
def export_idea_pdf(idea_id)
```

## 🧪 Tests

### Structure
```
app/
├── tests.py           # Tests unitaires
└── tests/
    ├── test_models.py
    ├── test_views.py
    └── test_serializers.py
```

### Commandes
```bash
pytest                          # Tous les tests
pytest --cov=.                  # Avec couverture
pytest comments/tests.py        # App spécifique
```

## 🚀 Déploiement

### Docker
```yaml
services:
  - db (MySQL 8.4)
  - redis
  - backend (Django + Gunicorn)
  - celery (Worker)
  - nginx (Reverse proxy)
```

### Production
```python
DEBUG = False
ALLOWED_HOSTS = ['votre-domaine.com']
STATIC_ROOT = '/app/staticfiles'
MEDIA_ROOT = '/app/media'
```

## 📈 Scalabilité

### Horizontal
- Load balancer (Nginx)
- Plusieurs instances Django
- Redis cluster
- Celery workers multiples

### Vertical
- Optimisation queries (select_related)
- Cache Redis
- CDN pour static/media
- DB indexing

## 🔄 Workflow Complet

```
1. Entrepreneur crée une idée (status=draft)
2. Entrepreneur soumet l'idée (status=submitted)
3. Reviewers évaluent l'idée (Feedback)
4. SGV calculé automatiquement (Celery)
5. Notification envoyée à l'entrepreneur
6. Réputation du reviewer mise à jour
7. Idée validée/rejetée (status=validated/rejected)
8. Entrepreneur peut exporter les résultats (CSV/JSON/PDF)
```

## 📚 Ressources

- [Django Docs](https://docs.djangoproject.com/)
- [DRF Docs](https://www.django-rest-framework.org/)
- [Celery Docs](https://docs.celeryproject.org/)
- [Redis Docs](https://redis.io/docs/)

## 🎯 Bonnes Pratiques Appliquées

✅ UUID sur tous les modèles  
✅ related_name sur tous les FK/M2M  
✅ select_related + prefetch_related  
✅ Pagination par défaut  
✅ Business logic dans models/services  
✅ Validation dans serializers  
✅ Tâches lourdes en async (Celery)  
✅ Soft delete (comments)  
✅ Tests unitaires (pytest)  
✅ Documentation complète  
✅ Docker ready  

---

**Projet académique EMSI 2025-2026**  
**Équipe :** Abdessattar Bouchfira (Backend) + El Kortih Yassine (Frontend)
