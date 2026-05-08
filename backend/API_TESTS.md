# 🧪 Collection de Tests API — IdeaLab

Cette collection contient toutes les requêtes pour tester l'API IdeaLab avec Thunder Client ou Postman.

## 🔐 Variables d'Environnement

Créer ces variables dans Thunder Client :

```
BASE_URL = http://localhost:8000
ACCESS_TOKEN = <votre_token_après_login>
IDEA_ID = <uuid_d'une_idée>
FEEDBACK_ID = <uuid_d'un_feedback>
COMMENT_ID = <uuid_d'un_commentaire>
```

---

## 1️⃣ AUTHENTIFICATION

### 1.1 Inscription
```http
POST {{BASE_URL}}/api/accounts/register/
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123456",
  "role": "entrepreneur"
}
```

### 1.2 Connexion
```http
POST {{BASE_URL}}/api/accounts/login/
Content-Type: application/json

{
  "username": "testuser",
  "password": "test123456"
}
```

**→ Copier le `access` token dans ACCESS_TOKEN**

### 1.3 Refresh Token
```http
POST {{BASE_URL}}/api/accounts/token/refresh/
Content-Type: application/json

{
  "refresh": "<votre_refresh_token>"
}
```

---

## 2️⃣ IDÉES

### 2.1 Créer une idée
```http
POST {{BASE_URL}}/api/ideas/
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "title": "Application de covoiturage écologique",
  "description": "Une plateforme pour partager des trajets et réduire l'empreinte carbone",
  "sector": "Transport",
  "problem": "Trop de voitures individuelles sur les routes",
  "solution": "Mise en relation pour covoiturage",
  "target": "Étudiants et travailleurs urbains"
}
```

**→ Copier l'`id` dans IDEA_ID**

### 2.2 Lister les idées
```http
GET {{BASE_URL}}/api/ideas/
```

### 2.3 Détails d'une idée
```http
GET {{BASE_URL}}/api/ideas/{{IDEA_ID}}/
```

### 2.4 Modifier une idée
```http
PATCH {{BASE_URL}}/api/ideas/{{IDEA_ID}}/
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "title": "Application de covoiturage écologique V2"
}
```

---

## 3️⃣ FEEDBACKS

### 3.1 Créer un feedback
```http
POST {{BASE_URL}}/api/feedbacks/
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "idea": "{{IDEA_ID}}",
  "market_score": 20,
  "innovation_score": 22,
  "feasibility_score": 18,
  "roi_score": 19,
  "comment": "Excellent projet avec un fort potentiel de marché. La solution est innovante et répond à un vrai besoin. Je recommande de développer un MVP rapidement."
}
```

### 3.2 Lister les feedbacks d'une idée
```http
GET {{BASE_URL}}/api/feedbacks/?idea_id={{IDEA_ID}}
```

---

## 4️⃣ COMMENTS

### 4.1 Créer un commentaire
```http
POST {{BASE_URL}}/api/comments/
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "idea": "{{IDEA_ID}}",
  "content": "Très intéressant comme approche ! J'aimerais en savoir plus sur le modèle économique."
}
```

**→ Copier l'`id` dans COMMENT_ID**

### 4.2 Répondre à un commentaire
```http
POST {{BASE_URL}}/api/comments/
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "idea": "{{IDEA_ID}}",
  "content": "Merci pour votre intérêt ! Le modèle économique est basé sur une commission de 10% par trajet.",
  "parent": "{{COMMENT_ID}}"
}
```

### 4.3 Lister les commentaires d'une idée
```http
GET {{BASE_URL}}/api/comments/?idea_id={{IDEA_ID}}
```

### 4.4 Modifier un commentaire
```http
PATCH {{BASE_URL}}/api/comments/{{COMMENT_ID}}/
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "content": "Très intéressant comme approche ! J'aimerais en savoir plus sur le modèle économique et la stratégie de croissance."
}
```

### 4.5 Supprimer un commentaire (soft delete)
```http
DELETE {{BASE_URL}}/api/comments/{{COMMENT_ID}}/
Authorization: Bearer {{ACCESS_TOKEN}}
```

---

## 5️⃣ VOTES

### 5.1 Upvote une idée
```http
POST {{BASE_URL}}/api/votes/
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "target_type": "idea",
  "target_id": "{{IDEA_ID}}",
  "value": 1
}
```

### 5.2 Downvote une idée
```http
POST {{BASE_URL}}/api/votes/
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "target_type": "idea",
  "target_id": "{{IDEA_ID}}",
  "value": -1
}
```

### 5.3 Supprimer un vote (toggle)
```http
POST {{BASE_URL}}/api/votes/
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "target_type": "idea",
  "target_id": "{{IDEA_ID}}",
  "value": 1
}
```

### 5.4 Statistiques de votes
```http
GET {{BASE_URL}}/api/votes/stats/?target_type=idea&target_id={{IDEA_ID}}
```

---

## 6️⃣ BOOKMARKS

### 6.1 Toggle bookmark
```http
POST {{BASE_URL}}/api/bookmarks/
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "idea": "{{IDEA_ID}}"
}
```

### 6.2 Mes bookmarks
```http
GET {{BASE_URL}}/api/bookmarks/
Authorization: Bearer {{ACCESS_TOKEN}}
```

### 6.3 Vérifier si une idée est bookmarkée
```http
GET {{BASE_URL}}/api/bookmarks/check/?idea_id={{IDEA_ID}}
Authorization: Bearer {{ACCESS_TOKEN}}
```

---

## 7️⃣ ANALYTICS

### 7.1 Dashboard Entrepreneur
```http
GET {{BASE_URL}}/api/analytics/entrepreneur/
Authorization: Bearer {{ACCESS_TOKEN}}
```

### 7.2 Dashboard Admin
```http
GET {{BASE_URL}}/api/analytics/admin/
Authorization: Bearer {{ACCESS_TOKEN}}
```

---

## 8️⃣ EXPORT

### 8.1 Export CSV
```http
POST {{BASE_URL}}/api/export/csv/{{IDEA_ID}}/
Authorization: Bearer {{ACCESS_TOKEN}}
```

**→ Copier le `task_id` de la réponse**

### 8.2 Export JSON
```http
POST {{BASE_URL}}/api/export/json/{{IDEA_ID}}/
Authorization: Bearer {{ACCESS_TOKEN}}
```

### 8.3 Export PDF
```http
POST {{BASE_URL}}/api/export/pdf/{{IDEA_ID}}/
Authorization: Bearer {{ACCESS_TOKEN}}
```

### 8.4 Vérifier le statut d'export
```http
GET {{BASE_URL}}/api/export/status/<task_id>/
Authorization: Bearer {{ACCESS_TOKEN}}
```

---

## 9️⃣ SEARCH

### 9.1 Recherche globale (tous types)
```http
GET {{BASE_URL}}/api/search/?q=innovation
```

### 9.2 Recherche dans les idées
```http
GET {{BASE_URL}}/api/search/?q=covoiturage&filter=ideas
```

### 9.3 Recherche dans les utilisateurs
```http
GET {{BASE_URL}}/api/search/?q=test&filter=users
```

### 9.4 Recherche dans les feedbacks
```http
GET {{BASE_URL}}/api/search/?q=excellent&filter=feedbacks
```

---

## 🔟 NOTIFICATIONS

### 10.1 Mes notifications
```http
GET {{BASE_URL}}/api/notifications/
Authorization: Bearer {{ACCESS_TOKEN}}
```

### 10.2 Marquer comme lu
```http
PATCH {{BASE_URL}}/api/notifications/<notification_id>/mark-read/
Authorization: Bearer {{ACCESS_TOKEN}}
```

### 10.3 Marquer toutes comme lues
```http
POST {{BASE_URL}}/api/notifications/mark-all-read/
Authorization: Bearer {{ACCESS_TOKEN}}
```

---

## 📊 SCÉNARIO DE TEST COMPLET

### Étape 1 : Créer 2 utilisateurs
1. Inscription entrepreneur (testuser1)
2. Inscription reviewer (testuser2)

### Étape 2 : Créer une idée
1. Login entrepreneur
2. Créer une idée
3. Soumettre l'idée (status=submitted)

### Étape 3 : Évaluer l'idée
1. Login reviewer
2. Créer un feedback
3. Vérifier le SGV calculé

### Étape 4 : Interactions
1. Commenter l'idée
2. Voter sur l'idée
3. Bookmarker l'idée

### Étape 5 : Analytics
1. Consulter dashboard entrepreneur
2. Consulter dashboard admin

### Étape 6 : Export
1. Exporter en CSV
2. Vérifier le statut
3. Télécharger le fichier

### Étape 7 : Recherche
1. Rechercher "innovation"
2. Filtrer par type

---

## ✅ CODES DE STATUT ATTENDUS

- `200 OK` : Succès (GET, PATCH)
- `201 Created` : Ressource créée (POST)
- `202 Accepted` : Traitement asynchrone (Export)
- `204 No Content` : Suppression réussie (DELETE)
- `400 Bad Request` : Données invalides
- `401 Unauthorized` : Non authentifié
- `403 Forbidden` : Non autorisé
- `404 Not Found` : Ressource introuvable

---

## 🎯 TIPS

1. **Toujours copier le token** après login dans ACCESS_TOKEN
2. **Copier les IDs** des ressources créées pour les tests suivants
3. **Vérifier les réponses** pour s'assurer que les données sont correctes
4. **Tester les erreurs** en envoyant des données invalides
5. **Vérifier les permissions** en essayant d'accéder aux ressources d'autres users

---

**Bon test ! 🚀**
