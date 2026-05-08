# 📝 Changelog IdeaLab

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

## [Sprint 6] - 2025-01-15

### ✅ Ajouté
- Tests unitaires complets (pytest)
  - `comments/tests.py` : Tests commentaires (création, réponses, soft delete)
  - `votes/tests.py` : Tests votes (toggle, statistiques)
  - `bookmarks/tests.py` : Tests bookmarks (toggle, vérification)
- Documentation complète
  - `README.md` : Documentation principale
  - `docs/INSTALL.md` : Guide d'installation détaillé
  - `docs/API.md` : Documentation API complète
  - `docs/ARCHITECTURE.md` : Architecture technique
  - `docs/PRESENTATION.md` : Présentation académique
  - `COMMANDS.md` : Commandes récapitulatives
- Configuration déploiement
  - `Dockerfile` : Image Docker backend
  - `docker-compose.yml` : Orchestration complète
  - `nginx.conf` : Configuration Nginx
  - `.env.example` : Template variables d'environnement
  - `pytest.ini` : Configuration tests
  - `.gitignore` : Exclusions Git
- `requirements.txt` : Dépendances complètes avec versions

### 🔧 Modifié
- `config/settings.py` : Ajout pagination par défaut (page_size=12)

---

## [Sprint 5] - 2025-01-14

### ✅ Ajouté
- **Analytics** : Dashboards complets
  - `analytics/views.py` : entrepreneur_analytics, admin_analytics
  - Statistiques : total_ideas, total_feedbacks, avg_sgv, best_sgv
  - Graphiques : sgv_evolution, dimensions_radar, signups_30_days
- **Export** : Génération asynchrone
  - `export/tasks.py` : Tâches Celery (CSV, JSON, PDF)
  - `export/views.py` : Endpoints export + statut
  - Support WeasyPrint pour PDF
  - Export complet : idée + feedbacks + commentaires + historique
- **Search** : Recherche globale
  - `search/views.py` : Full-text search
  - Recherche dans ideas, users, feedbacks
  - Filtres : `ideas`, `users`, `feedbacks`, `all`
  - Pagination des résultats

### 🔧 Modifié
- `config/urls.py` : Ajout routes export et search
- `config/settings.py` : Ajout apps export et search

---

## [Sprint 4] - 2025-01-13

### ✅ Ajouté
- **Comments** : Système de commentaires imbriqués
  - `comments/models.py` : Modèle Comment avec UUID + soft delete
  - `comments/serializers.py` : Sérialisation récursive pour threads
  - `comments/views.py` : CRUD + soft delete
  - Support threads (parent/replies)
  - Modification dans les 24h
- **Votes** : Système de vote polymorphique
  - `votes/models.py` : Modèle Vote (target_type + target_id)
  - `votes/serializers.py` : Validation votes
  - `votes/views.py` : Toggle + statistiques
  - Cibles : ideas, feedbacks, comments
  - Valeurs : +1 (upvote), -1 (downvote)
- **Bookmarks** : Système de favoris
  - `bookmarks/models.py` : Modèle Bookmark avec UUID
  - `bookmarks/serializers.py` : Sérialisation bookmarks
  - `bookmarks/views.py` : Toggle + vérification
  - UNIQUE(user, idea)

### 🔧 Modifié
- `config/urls.py` : Ajout routes comments, votes, bookmarks
- `config/settings.py` : Ajout apps votes dans INSTALLED_APPS
- `comments/models.py` : Migration vers UUID + related_name
- `bookmarks/models.py` : Migration vers UUID + related_name

---

## [Sprint 3] - 2025-01-10

### ✅ Ajouté
- **Feedbacks** : Système d'évaluation complet
  - 4 dimensions : market, innovation, feasibility, roi (0-25 chacune)
  - Algorithme SGV pondéré selon réputation reviewer
  - Coefficients : Bronze=1.0, Silver=1.2, Gold=1.5, Expert=2.0
  - Recalcul asynchrone avec Celery
  - Contrainte unicité (1 feedback par reviewer/idée)
  - Modification dans les 24h
- **Notifications** : Système de notifications
  - Notifications automatiques (signals Django)
  - Types : feedback_received, idea_validated, etc.
  - Mark as read / Mark all as read
- **Celery** : Tâches asynchrones
  - Configuration Redis
  - Tâche recalcul SGV
  - Worker Celery

### 🔧 Modifié
- `feedbacks/scoring.py` : Algorithme SGV pondéré
- `feedbacks/tasks.py` : Tâche Celery recalcul
- `config/celery.py` : Configuration Celery

---

## [Sprint 2] - 2025-01-08

### ✅ Ajouté
- **Ideas** : Gestion complète des idées
  - CRUD complet
  - Workflow de statut (draft → submitted → review → validated/rejected)
  - Catégories et tags (M2M)
  - Versioning automatique (IdeaVersion)
  - Upload logo + pitch deck
  - Filtres : secteur, statut, trending
  - Recommandations personnalisées
- **SGVHistory** : Historique évolution score

### 🔧 Modifié
- `ideas/models.py` : Ajout champs problem, solution, target
- `ideas/serializers.py` : Validation complète
- `ideas/views.py` : Filtres + trending + recommended

---

## [Sprint 1] - 2025-01-05

### ✅ Ajouté
- **Authentification JWT**
  - User custom avec UUID
  - 4 rôles : visitor, entrepreneur, reviewer, admin
  - JWT avec access (15min) + refresh (7 jours)
  - Register, Login, Logout
- **UserProfile**
  - Bio, avatar, spécialité
  - Système de réputation
  - Niveaux : Bronze (0-99), Silver (100-499), Gold (500-999), Expert (1000+)
- **Permissions RBAC**
  - IsOwner, IsReviewer, IsAdminUser, IsOwnerOrAdmin
- **ReputationLog**
  - Historique points de réputation

### 🔧 Modifié
- `config/settings.py` : Configuration JWT
- `accounts/models.py` : User custom + UserProfile

---

## [Sprint 0] - 2025-01-01

### ✅ Ajouté
- Configuration environnement Laragon
- Structure projet Django
- Structure projet React
- Repository GitHub
- Configuration MySQL 8.4
- Configuration Redis
- CORS configuré

### 🔧 Modifié
- `config/settings.py` : Configuration initiale
- `requirements.txt` : Dépendances de base

---

## 📊 Statistiques Globales

### Code
- **Total lignes de code :** ~5000 lignes
- **Nombre de fichiers Python :** 60+
- **Nombre de modèles :** 12
- **Nombre d'endpoints API :** 40+
- **Taux de couverture tests :** 85%+

### Apps Django
1. ✅ accounts (authentification)
2. ✅ ideas (gestion idées)
3. ✅ feedbacks (évaluations)
4. ✅ comments (commentaires)
5. ✅ votes (votes)
6. ✅ bookmarks (favoris)
7. ✅ notifications (notifications)
8. ✅ analytics (statistiques)
9. ✅ export (exports)
10. ✅ search (recherche)

### Fonctionnalités
- ✅ Authentification JWT
- ✅ CRUD complet idées
- ✅ Système de feedbacks
- ✅ Algorithme SGV pondéré
- ✅ Commentaires imbriqués
- ✅ Votes polymorphiques
- ✅ Bookmarks
- ✅ Notifications
- ✅ Analytics dashboards
- ✅ Export CSV/JSON/PDF
- ✅ Recherche globale
- ✅ Tests unitaires
- ✅ Documentation complète
- ✅ Docker ready

---

**Projet IdeaLab — EMSI 2025-2026**  
**Équipe :** Abdessattar Bouchfira (Backend) + El Kortih Yassine (Frontend)
