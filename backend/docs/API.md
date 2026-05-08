# 📡 Documentation API IdeaLab

## 🔐 Authentification

Tous les endpoints protégés nécessitent un token JWT dans le header :
```
Authorization: Bearer <access_token>
```

### Inscription

**Endpoint :** `POST /api/accounts/register/`

**Body :**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "entrepreneur"
}
```

**Rôles disponibles :** `entrepreneur`, `reviewer`, `admin`

**Response (201) :**
```json
{
  "id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "entrepreneur",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Connexion

**Endpoint :** `POST /api/accounts/login/`

**Body :**
```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response (200) :**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "entrepreneur"
  }
}
```

### Refresh Token

**Endpoint :** `POST /api/accounts/token/refresh/`

**Body :**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 💡 Idées

### Créer une idée

**Endpoint :** `POST /api/ideas/`  
**Auth :** Required (Entrepreneur)

**Body :**
```json
{
  "title": "Mon idée innovante",
  "description": "Description détaillée de l'idée",
  "sector": "Tech",
  "problem": "Problème identifié",
  "solution": "Solution proposée",
  "target": "Cible visée"
}
```

### Lister les idées

**Endpoint :** `GET /api/ideas/`

**Query params :**
- `status` : `draft`, `submitted`, `review`, `validated`, `rejected`
- `sector` : Filtrer par secteur
- `page` : Numéro de page (défaut: 1)
- `page_size` : Taille de page (défaut: 12)

### Détails d'une idée

**Endpoint :** `GET /api/ideas/<uuid>/`

### Modifier une idée

**Endpoint :** `PATCH /api/ideas/<uuid>/`  
**Auth :** Required (Propriétaire)

### Supprimer une idée

**Endpoint :** `DELETE /api/ideas/<uuid>/`  
**Auth :** Required (Propriétaire ou Admin)

---

## 📊 Feedbacks

### Créer un feedback

**Endpoint :** `POST /api/feedbacks/`  
**Auth :** Required (Reviewer)

**Body :**
```json
{
  "idea": "uuid",
  "market_score": 20,
  "innovation_score": 22,
  "feasibility_score": 18,
  "roi_score": 19,
  "comment": "Excellent projet avec un fort potentiel de marché..."
}
```

**Règles :**
- Chaque score : 0-25
- Commentaire : minimum 50 caractères
- 1 seul feedback par reviewer/idée
- Modifiable dans les 24h

### Lister les feedbacks d'une idée

**Endpoint :** `GET /api/feedbacks/?idea_id=<uuid>`

### Modifier un feedback

**Endpoint :** `PATCH /api/feedbacks/<uuid>/`  
**Auth :** Required (Auteur, dans les 24h)

---

## 💬 Commentaires

### Créer un commentaire

**Endpoint :** `POST /api/comments/`  
**Auth :** Required

**Body :**
```json
{
  "idea": "uuid",
  "content": "Très intéressant comme approche !"
}
```

### Répondre à un commentaire

**Endpoint :** `POST /api/comments/`  
**Auth :** Required

**Body :**
```json
{
  "idea": "uuid",
  "content": "Je suis d'accord avec vous",
  "parent": "uuid"
}
```

### Lister les commentaires d'une idée

**Endpoint :** `GET /api/comments/?idea_id=<uuid>`

**Response :**
```json
{
  "count": 10,
  "results": [
    {
      "id": "uuid",
      "author_name": "john_doe",
      "content": "Commentaire...",
      "replies": [
        {
          "id": "uuid",
          "author_name": "jane_doe",
          "content": "Réponse...",
          "replies": []
        }
      ],
      "created_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### Modifier un commentaire

**Endpoint :** `PATCH /api/comments/<uuid>/`  
**Auth :** Required (Auteur, dans les 24h)

### Supprimer un commentaire (soft delete)

**Endpoint :** `DELETE /api/comments/<uuid>/`  
**Auth :** Required (Auteur)

---

## 👍 Votes

### Voter (toggle)

**Endpoint :** `POST /api/votes/`  
**Auth :** Required

**Body :**
```json
{
  "target_type": "idea",
  "target_id": "uuid",
  "value": 1
}
```

**Valeurs :**
- `1` : Upvote
- `-1` : Downvote

**Comportement toggle :**
- Voter la même valeur → Supprime le vote
- Voter une valeur différente → Modifie le vote

**Target types :** `idea`, `feedback`, `comment`

### Statistiques de votes

**Endpoint :** `GET /api/votes/stats/?target_type=idea&target_id=<uuid>`

**Response :**
```json
{
  "upvotes": 15,
  "downvotes": 3,
  "total": 12,
  "user_vote": 1
}
```

---

## ⭐ Bookmarks

### Toggle bookmark

**Endpoint :** `POST /api/bookmarks/`  
**Auth :** Required

**Body :**
```json
{
  "idea": "uuid"
}
```

**Response :**
```json
{
  "detail": "Bookmark créé.",
  "action": "created"
}
```

### Mes bookmarks

**Endpoint :** `GET /api/bookmarks/`  
**Auth :** Required

### Vérifier si une idée est bookmarkée

**Endpoint :** `GET /api/bookmarks/check/?idea_id=<uuid>`  
**Auth :** Required

**Response :**
```json
{
  "is_bookmarked": true
}
```

---

## 📈 Analytics

### Dashboard Entrepreneur

**Endpoint :** `GET /api/analytics/entrepreneur/`  
**Auth :** Required (Entrepreneur)

**Response :**
```json
{
  "stats": {
    "total_ideas": 5,
    "total_feedbacks": 12,
    "avg_sgv": 78.5,
    "best_sgv": 92.3
  },
  "sgv_evolution": [
    {
      "idea_id": "uuid",
      "idea_title": "Mon idée",
      "score": 85.2,
      "feedbacks_count": 3
    }
  ],
  "dimensions_radar": [
    {"dimension": "Marché", "score": 20.5},
    {"dimension": "Innovation", "score": 22.0},
    {"dimension": "Faisabilité", "score": 18.5},
    {"dimension": "ROI", "score": 19.0}
  ],
  "recent_feedbacks": [...]
}
```

### Dashboard Admin

**Endpoint :** `GET /api/analytics/admin/`  
**Auth :** Required (Admin)

**Response :**
```json
{
  "stats": {
    "total_users": 150,
    "total_ideas": 45,
    "total_feedbacks": 120,
    "global_avg_sgv": 75.8
  },
  "ideas_by_status": [
    {"name": "submitted", "count": 12},
    {"name": "validated", "count": 20}
  ],
  "signups_30_days": [...],
  "feedbacks_30_days": [...]
}
```

---

## 📥 Export

### Export CSV

**Endpoint :** `POST /api/export/csv/<idea_uuid>/`  
**Auth :** Required (Propriétaire ou Admin)

**Response (202) :**
```json
{
  "detail": "Export CSV en cours de génération.",
  "task_id": "celery-task-id",
  "status": "processing"
}
```

### Export JSON

**Endpoint :** `POST /api/export/json/<idea_uuid>/`  
**Auth :** Required (Propriétaire ou Admin)

### Export PDF

**Endpoint :** `POST /api/export/pdf/<idea_uuid>/`  
**Auth :** Required (Propriétaire ou Admin)

### Vérifier le statut d'export

**Endpoint :** `GET /api/export/status/<task_id>/`  
**Auth :** Required

**Response (success) :**
```json
{
  "status": "success",
  "detail": "Export terminé.",
  "download_url": "/media/exports/export_idea_uuid.pdf"
}
```

---

## 🔍 Recherche

### Recherche globale

**Endpoint :** `GET /api/search/?q=innovation&filter=ideas`

**Query params :**
- `q` : Terme de recherche (requis)
- `filter` : `ideas`, `users`, `feedbacks`, `all` (défaut: `all`)

**Response :**
```json
{
  "query": "innovation",
  "filter": "ideas",
  "total": 15,
  "ideas": [...],
  "users": [...],
  "feedbacks": [...]
}
```

---

## 🔔 Notifications

### Mes notifications

**Endpoint :** `GET /api/notifications/`  
**Auth :** Required

### Marquer comme lu

**Endpoint :** `PATCH /api/notifications/<uuid>/mark-read/`  
**Auth :** Required

### Marquer toutes comme lues

**Endpoint :** `POST /api/notifications/mark-all-read/`  
**Auth :** Required

---

## 📊 Codes de statut HTTP

- `200 OK` : Succès
- `201 Created` : Ressource créée
- `202 Accepted` : Requête acceptée (traitement asynchrone)
- `204 No Content` : Succès sans contenu
- `400 Bad Request` : Données invalides
- `401 Unauthorized` : Non authentifié
- `403 Forbidden` : Non autorisé
- `404 Not Found` : Ressource introuvable
- `500 Internal Server Error` : Erreur serveur

---

## 🧪 Exemples avec cURL

### Inscription
```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123","role":"entrepreneur"}'
```

### Créer une idée
```bash
curl -X POST http://localhost:8000/api/ideas/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mon idée","description":"Description","sector":"Tech","problem":"Problème","solution":"Solution","target":"Cible"}'
```

### Voter
```bash
curl -X POST http://localhost:8000/api/votes/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"target_type":"idea","target_id":"uuid","value":1}'
```
