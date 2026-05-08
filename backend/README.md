# 🚀 IdeaLab — Startup Idea Validation Platform

[![Django](https://img.shields.io/badge/Django-5.2.13-green.svg)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.14-red.svg)](https://www.django-rest-framework.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.4-blue.svg)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-Latest-red.svg)](https://redis.io/)

## 📋 Description

IdeaLab est une plateforme de validation d'idées de startup développée comme projet académique à **EMSI** (École Marocaine des Sciences de l'Ingénieur), 3ème année Génie Logiciel (IIR), 2025-2026.

### 👥 Équipe

- **Abdessattar Bouchfira** → Backend Lead (Django REST API)
- **El Kortih Yassine** → Frontend Lead (React + Vite)

## 🛠️ Stack Technique

### Backend
- **Framework** : Django 5.2.13 + Django REST Framework
- **Base de données** : MySQL 8.4 (Laragon)
- **Cache/Queue** : Redis
- **Authentification** : JWT (Simple JWT)
- **Tâches asynchrones** : Celery
- **Export PDF** : WeasyPrint

### Frontend
- **Framework** : React 18
- **Build Tool** : Vite
- **Styling** : Tailwind CSS
- **State Management** : Zustand

## 📦 Installation

### Prérequis

- Python 3.10+
- MySQL 8.4 (via Laragon)
- Redis
- Node.js 18+ (pour le frontend)

### 1. Cloner le repository

```bash
git clone https://github.com/Yaasine-Dev/IdeaLab.git
cd IdeaLab/backend
```

### 2. Créer un environnement virtuel

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Configuration de la base de données

Créer une base de données MySQL :

```sql
CREATE DATABASE idealab_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configurer le fichier `.env` :

```env
SECRET_KEY=idealab-secret-key-change-in-prod
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=idealab_db
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3307

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 5. Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Créer un superutilisateur

```bash
python manage.py createsuperuser
```

### 7. Lancer Redis

```bash
redis-server
```

### 8. Lancer Celery (dans un terminal séparé)

```bash
celery -A config worker -l info
```

### 9. Lancer le serveur

```bash
python manage.py runserver
```

L'API sera accessible sur : `http://localhost:8000`

## 📚 Documentation API

### Authentification

#### Inscription
```http
POST /api/accounts/register/
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "entrepreneur"
}
```

#### Connexion
```http
POST /api/accounts/login/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

### Idées

#### Créer une idée
```http
POST /api/ideas/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Mon idée innovante",
  "description": "Description détaillée",
  "sector": "Tech",
  "problem": "Problème identifié",
  "solution": "Solution proposée",
  "target": "Cible visée"
}
```

#### Lister les idées
```http
GET /api/ideas/
```

### Feedbacks

#### Créer un feedback
```http
POST /api/feedbacks/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "idea": "<idea_uuid>",
  "market_score": 20,
  "innovation_score": 22,
  "feasibility_score": 18,
  "roi_score": 19,
  "comment": "Excellent projet avec un fort potentiel..."
}
```

### Comments

#### Créer un commentaire
```http
POST /api/comments/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "idea": "<idea_uuid>",
  "content": "Très intéressant comme approche !"
}
```

#### Répondre à un commentaire
```http
POST /api/comments/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "idea": "<idea_uuid>",
  "content": "Je suis d'accord avec vous",
  "parent": "<comment_uuid>"
}
```

### Votes

#### Voter (toggle)
```http
POST /api/votes/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "target_type": "idea",
  "target_id": "<idea_uuid>",
  "value": 1
}
```

#### Statistiques de votes
```http
GET /api/votes/stats/?target_type=idea&target_id=<idea_uuid>
```

### Bookmarks

#### Toggle bookmark
```http
POST /api/bookmarks/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "idea": "<idea_uuid>"
}
```

#### Mes bookmarks
```http
GET /api/bookmarks/
Authorization: Bearer <access_token>
```

### Analytics

#### Dashboard entrepreneur
```http
GET /api/analytics/entrepreneur/
Authorization: Bearer <access_token>
```

#### Dashboard admin
```http
GET /api/analytics/admin/
Authorization: Bearer <access_token>
```

### Export

#### Export CSV
```http
POST /api/export/csv/<idea_uuid>/
Authorization: Bearer <access_token>
```

#### Export JSON
```http
POST /api/export/json/<idea_uuid>/
Authorization: Bearer <access_token>
```

#### Export PDF
```http
POST /api/export/pdf/<idea_uuid>/
Authorization: Bearer <access_token>
```

#### Vérifier le statut d'export
```http
GET /api/export/status/<task_id>/
Authorization: Bearer <access_token>
```

### Search

#### Recherche globale
```http
GET /api/search/?q=innovation&filter=ideas
```

Filtres disponibles : `ideas`, `users`, `feedbacks`, `all`

## 🧪 Tests

Lancer les tests unitaires :

```bash
pytest
```

Lancer les tests avec couverture :

```bash
pytest --cov=.
```

## 🏗️ Architecture

### Modèles principaux

- **User** : Utilisateur avec 4 rôles (visitor, entrepreneur, reviewer, admin)
- **UserProfile** : Profil utilisateur (bio, avatar, réputation, niveau)
- **Idea** : Idée de startup avec workflow de validation
- **Feedback** : Évaluation d'une idée (4 dimensions : market, innovation, feasibility, roi)
- **Comment** : Commentaire imbriqué avec soft delete
- **Vote** : Système de vote polymorphique
- **Bookmark** : Favoris

### Algorithme SGV (Score Global de Viabilité)

Le SGV est calculé selon la formule :

```
SGV = Σ(raw_score × reviewer_coefficient) / Σ(coefficients)
```

Coefficients par niveau :
- Bronze : 1.0
- Silver : 1.2
- Gold : 1.5
- Expert : 2.0

### Système de réputation

- Bronze : 0-99 points
- Silver : 100-499 points
- Gold : 500-999 points
- Expert : 1000+ points

## 📁 Structure du projet

```
backend/
├── accounts/          # Authentification, utilisateurs, profils
├── ideas/             # Gestion des idées
├── feedbacks/         # Feedbacks et SGV
├── comments/          # Commentaires imbriqués
├── votes/             # Système de votes
├── bookmarks/         # Favoris
├── notifications/     # Notifications
├── analytics/         # Statistiques et analytics
├── export/            # Export CSV/JSON/PDF
├── search/            # Recherche globale
├── config/            # Configuration Django
├── media/             # Fichiers uploadés
└── requirements.txt   # Dépendances Python
```

## 🔒 Sécurité

- Authentification JWT avec refresh tokens
- Permissions RBAC (Role-Based Access Control)
- Validation des données avec DRF serializers
- Protection CSRF
- CORS configuré

## 🚀 Déploiement

### Variables d'environnement production

```env
SECRET_KEY=<générer-une-clé-sécurisée>
DEBUG=False
ALLOWED_HOSTS=votre-domaine.com
DATABASE_URL=mysql://user:pass@host:port/db
REDIS_URL=redis://host:port/0
```

### Docker (optionnel)

```bash
docker-compose up -d
```

## 📝 Licence

Projet académique - EMSI 2025-2026

## 👨‍💻 Contributeurs

- Abdessattar Bouchfira - Backend
- El Kortih Yassine - Frontend

## 📧 Contact

Pour toute question : [GitHub Issues](https://github.com/Yaasine-Dev/IdeaLab/issues)
