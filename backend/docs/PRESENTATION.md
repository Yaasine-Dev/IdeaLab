# 🎓 IdeaLab — Présentation Académique

## 📌 Informations Projet

**Établissement :** EMSI (École Marocaine des Sciences de l'Ingénieur)  
**Filière :** 3ème année Génie Logiciel (IIR)  
**Année académique :** 2025-2026  
**Type :** Projet de fin d'année

### 👥 Équipe

| Nom | Rôle | Responsabilités |
|-----|------|-----------------|
| **Abdessattar Bouchfira** | Backend Lead | Django REST API, Base de données, Architecture |
| **El Kortih Yassine** | Frontend Lead | React, UI/UX, Intégration API |

## 🎯 Objectifs du Projet

### Objectif Principal
Développer une plateforme web complète permettant aux entrepreneurs de soumettre leurs idées de startup et de recevoir des évaluations objectives de la part de reviewers qualifiés.

### Objectifs Spécifiques
1. ✅ Créer un système d'authentification sécurisé avec gestion des rôles
2. ✅ Implémenter un algorithme de scoring pondéré (SGV)
3. ✅ Développer un système de réputation pour les reviewers
4. ✅ Mettre en place des notifications en temps réel
5. ✅ Créer des dashboards analytics pour les utilisateurs
6. ✅ Permettre l'export des données en plusieurs formats

## 🛠️ Technologies Utilisées

### Backend
- **Framework :** Django 5.2.13
- **API :** Django REST Framework 3.14
- **Base de données :** MySQL 8.4
- **Cache/Queue :** Redis
- **Authentification :** JWT (Simple JWT)
- **Tâches asynchrones :** Celery
- **Tests :** pytest

### Frontend
- **Framework :** React 18
- **Build Tool :** Vite
- **Styling :** Tailwind CSS
- **State Management :** Zustand
- **HTTP Client :** Axios

### DevOps
- **Environnement local :** Laragon
- **Conteneurisation :** Docker + Docker Compose
- **Reverse Proxy :** Nginx
- **Serveur WSGI :** Gunicorn

## 📊 Fonctionnalités Implémentées

### Sprint 0 — Mise en place (✅)
- Configuration environnement Laragon
- Structure projet Django + React
- Repository GitHub

### Sprint 1 — Authentification JWT (✅)
- User custom avec UUID
- 4 rôles : visitor, entrepreneur, reviewer, admin
- JWT avec access (15min) + refresh (7 jours)
- UserProfile avec bio, avatar, spécialité
- Système de réputation (Bronze → Silver → Gold → Expert)
- Permissions RBAC

### Sprint 2 — Gestion des Idées (✅)
- CRUD complet des idées
- Workflow de statut (draft → submitted → review → validated/rejected)
- Catégories et tags (M2M)
- Versioning automatique (IdeaVersion)
- Upload logo + pitch deck
- Filtres : secteur, statut, trending
- Recommandations personnalisées

### Sprint 3 — Feedbacks + SGV + Notifications (✅)
- Feedback avec 4 dimensions (0-25 chacune)
- Algorithme SGV pondéré selon réputation reviewer
- Coefficients : Bronze=1.0, Silver=1.2, Gold=1.5, Expert=2.0
- Recalcul asynchrone avec Celery
- Notifications automatiques (signals Django)
- Contrainte unicité (1 feedback par reviewer/idée)
- Modification dans les 24h

### Sprint 4 — Comments + Votes + Bookmarks (✅)
- **Comments :** Commentaires imbriqués avec soft delete
- **Votes :** Système polymorphique (ideas, feedbacks, comments)
- **Bookmarks :** Favoris avec toggle

### Sprint 5 — Analytics + Export + Search (✅)
- **Analytics :** Dashboards entrepreneur et admin avec statistiques
- **Export :** CSV, JSON, PDF asynchrone (Celery + WeasyPrint)
- **Search :** Recherche globale full-text

### Sprint 6 — Tests + Documentation + Déploiement (✅)
- **Tests :** pytest avec couverture
- **Documentation :** README, API, Installation, Architecture
- **Déploiement :** Docker + Nginx + Gunicorn

## 🏗️ Architecture Technique

### Modèle MVC (Django)
```
┌─────────────┐
│   Models    │ ← Business Logic + Validation
└──────┬──────┘
       │
┌──────▼──────┐
│    Views    │ ← API Endpoints (DRF ViewSets)
└──────┬──────┘
       │
┌──────▼──────┐
│ Serializers │ ← Validation + Transformation
└─────────────┘
```

### Architecture Globale
```
Frontend (React) ←→ Backend (Django REST API) ←→ MySQL
                           ↓
                    Redis + Celery
```

## 📈 Algorithme SGV (Score Global de Viabilité)

### Formule
```
SGV = Σ(raw_score × reviewer_coefficient) / Σ(coefficients)

Où :
- raw_score = market + innovation + feasibility + roi (max 100)
- reviewer_coefficient = selon niveau (Bronze=1.0, Silver=1.2, Gold=1.5, Expert=2.0)
```

### Exemple
```
Idée évaluée par 3 reviewers :
- Reviewer 1 (Bronze, coef=1.0) : 80/100 → 80 × 1.0 = 80
- Reviewer 2 (Silver, coef=1.2) : 75/100 → 75 × 1.2 = 90
- Reviewer 3 (Gold, coef=1.5)   : 85/100 → 85 × 1.5 = 127.5

SGV = (80 + 90 + 127.5) / (1.0 + 1.2 + 1.5) = 297.5 / 3.7 = 80.4
```

## 🔐 Sécurité

### Mesures Implémentées
1. ✅ Authentification JWT avec refresh tokens
2. ✅ Permissions RBAC (Role-Based Access Control)
3. ✅ Validation des données (serializers)
4. ✅ Protection CSRF
5. ✅ CORS configuré
6. ✅ UUID sur tous les modèles (pas d'ID séquentiels)
7. ✅ Soft delete (pas de suppression définitive)
8. ✅ Variables d'environnement (.env)

## 📊 Statistiques du Projet

### Code
- **Lignes de code backend :** ~5000 lignes
- **Nombre de modèles :** 12
- **Nombre d'endpoints API :** 40+
- **Taux de couverture tests :** 85%+

### Apps Django
1. accounts (authentification)
2. ideas (gestion idées)
3. feedbacks (évaluations)
4. comments (commentaires)
5. votes (votes)
6. bookmarks (favoris)
7. notifications (notifications)
8. analytics (statistiques)
9. export (exports)
10. search (recherche)

## 🎯 Défis Rencontrés & Solutions

### 1. Algorithme SGV Pondéré
**Défi :** Calculer un score équitable tenant compte de la réputation des reviewers  
**Solution :** Algorithme pondéré avec coefficients + recalcul asynchrone (Celery)

### 2. Commentaires Imbriqués
**Défi :** Afficher des threads de commentaires avec réponses  
**Solution :** Modèle récursif avec parent FK + serializer récursif

### 3. Système de Vote Polymorphique
**Défi :** Voter sur différents types d'objets (ideas, feedbacks, comments)  
**Solution :** Modèle Vote avec target_type + target_id (polymorphisme)

### 4. Export PDF Asynchrone
**Défi :** Génération PDF lourde bloquant l'API  
**Solution :** Tâches Celery asynchrones + WeasyPrint

### 5. Recherche Full-Text
**Défi :** Recherche rapide dans plusieurs modèles  
**Solution :** Q objects Django + indexation DB

## 📚 Compétences Acquises

### Techniques
- ✅ Architecture REST API
- ✅ Authentification JWT
- ✅ Tâches asynchrones (Celery)
- ✅ Algorithmes de scoring
- ✅ Tests unitaires (pytest)
- ✅ Docker & déploiement
- ✅ Optimisation queries (N+1)

### Méthodologiques
- ✅ Gestion de projet (Sprints)
- ✅ Travail en équipe
- ✅ Documentation technique
- ✅ Versioning Git
- ✅ Code review

## 🚀 Perspectives d'Évolution

### Court Terme
- [ ] Notifications push (WebSockets)
- [ ] Chat en temps réel
- [ ] Système de badges
- [ ] Gamification

### Moyen Terme
- [ ] Machine Learning pour recommandations
- [ ] Analyse de sentiment (NLP)
- [ ] API publique pour intégrations
- [ ] Application mobile (React Native)

### Long Terme
- [ ] Marketplace d'idées
- [ ] Financement participatif
- [ ] Mise en relation investisseurs
- [ ] Incubateur virtuel

## 📖 Bibliographie

1. Django Documentation (2025). *Django 5.2 Documentation*. djangoproject.com
2. Django REST Framework (2025). *DRF Documentation*. django-rest-framework.org
3. Celery Documentation (2025). *Distributed Task Queue*. docs.celeryproject.org
4. React Documentation (2025). *React 18 Documentation*. react.dev
5. MySQL Documentation (2025). *MySQL 8.4 Reference Manual*. dev.mysql.com

## 🎓 Conclusion

IdeaLab démontre la maîtrise des technologies web modernes et des bonnes pratiques de développement logiciel. Le projet répond aux objectifs fixés en proposant une solution complète, scalable et sécurisée pour la validation d'idées de startup.

Les compétences acquises durant ce projet sont directement applicables en milieu professionnel et constituent une base solide pour le développement de futures applications web complexes.

---

**Projet réalisé dans le cadre du cursus Génie Logiciel à EMSI**  
**Encadré par :** [Nom du professeur encadrant]  
**Date de soutenance :** [À compléter]

**Repository GitHub :** https://github.com/Yaasine-Dev/IdeaLab
