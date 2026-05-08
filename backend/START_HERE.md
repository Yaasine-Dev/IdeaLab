# 🚀 GUIDE FINAL — Installation et Démarrage IdeaLab

## ⚠️ PROBLÈME ACTUEL

Vous avez une erreur de migration pour la table `votes_vote` car elle existe déjà avec une structure incompatible.

## ✅ SOLUTION RAPIDE (3 étapes)

### 1️⃣ Démarrer MySQL dans Laragon

1. Ouvrir **Laragon**
2. Cliquer sur **Start All**
3. Attendre que MySQL démarre (icône verte)

### 2️⃣ Supprimer la table votes_vote

**Méthode recommandée : HeidiSQL**

1. Dans Laragon, cliquer sur **Database** → **HeidiSQL**
2. Se connecter (root, sans mot de passe)
3. Sélectionner la base `idealab_db`
4. Cliquer sur **Query** (onglet en haut)
5. Copier-coller ce code SQL :

```sql
DROP TABLE IF EXISTS `votes_vote`;
DELETE FROM `django_migrations` WHERE `app` = 'votes' AND `name` = '0001_initial';
```

6. Cliquer sur **Execute** (F9)
7. Vérifier le message : "Query OK"

### 3️⃣ Appliquer les migrations

Retourner dans le terminal PowerShell :

```bash
python manage.py migrate
```

Vous devriez voir :
```
Operations to perform:
  Apply all migrations: ...
Running migrations:
  Applying votes.0001_initial... OK
```

## ✅ VÉRIFICATION

```bash
# Vérifier qu'il n'y a pas d'erreurs
python manage.py check

# Lancer le serveur
python manage.py runserver
```

Ouvrir le navigateur : http://localhost:8000/api/

Vous devriez voir la liste des endpoints disponibles.

## 🧪 TESTER LES NOUVEAUX ENDPOINTS

### 1. Comments
```bash
# Lister les commentaires
GET http://localhost:8000/api/comments/

# Créer un commentaire (nécessite authentification)
POST http://localhost:8000/api/comments/
{
  "idea": "<idea_uuid>",
  "content": "Super idée !"
}
```

### 2. Votes
```bash
# Voter (toggle)
POST http://localhost:8000/api/votes/
{
  "target_type": "idea",
  "target_id": "<idea_uuid>",
  "value": 1
}

# Statistiques de votes
GET http://localhost:8000/api/votes/stats/?target_type=idea&target_id=<uuid>
```

### 3. Bookmarks
```bash
# Toggle bookmark
POST http://localhost:8000/api/bookmarks/
{
  "idea": "<idea_uuid>"
}

# Mes bookmarks
GET http://localhost:8000/api/bookmarks/
```

### 4. Analytics
```bash
# Dashboard entrepreneur
GET http://localhost:8000/api/analytics/entrepreneur/

# Dashboard admin
GET http://localhost:8000/api/analytics/admin/
```

### 5. Export
```bash
# Export CSV
POST http://localhost:8000/api/export/csv/<idea_uuid>/

# Vérifier le statut
GET http://localhost:8000/api/export/status/<task_id>/
```

### 6. Search
```bash
# Recherche globale
GET http://localhost:8000/api/search/?q=innovation&filter=ideas
```

## 🧪 LANCER LES TESTS

```bash
# Tous les tests
pytest

# Tests avec couverture
pytest --cov=. --cov-report=html

# Tests d'une app spécifique
pytest comments/tests.py
pytest votes/tests.py
pytest bookmarks/tests.py
```

## 📊 CRÉER DES DONNÉES DE TEST

```bash
python manage.py shell
```

Puis dans le shell Python :

```python
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
print(f"Idée ID : {idea.id}")
print(f"Feedback ID : {feedback.id}")
print(f"Comment ID : {comment.id}")
```

## 🎯 CELERY (Tâches Asynchrones)

Pour que les exports fonctionnent, vous devez lancer Celery :

**Terminal 1 : Redis** (déjà dans Laragon)

**Terminal 2 : Celery Worker**
```bash
cd c:\Users\najoua\Desktop\pythonidealab\IdeaLab\backend
venv\Scripts\activate
celery -A config worker -l info
```

**Terminal 3 : Django**
```bash
cd c:\Users\najoua\Desktop\pythonidealab\IdeaLab\backend
venv\Scripts\activate
python manage.py runserver
```

## 📚 DOCUMENTATION DISPONIBLE

- 📖 `README.md` : Vue d'ensemble
- 🔧 `docs/INSTALL.md` : Installation détaillée
- 📡 `docs/API.md` : Documentation API
- 🏗️ `docs/ARCHITECTURE.md` : Architecture
- 🎓 `docs/PRESENTATION.md` : Présentation académique
- ⚡ `COMMANDS.md` : Commandes récapitulatives
- 📝 `CHANGELOG.md` : Historique

## ✅ CHECKLIST FINALE

- [ ] MySQL démarré dans Laragon
- [ ] Table votes_vote supprimée
- [ ] Migrations appliquées avec succès
- [ ] Serveur Django lancé
- [ ] Endpoints testés
- [ ] Données de test créées
- [ ] Celery lancé (pour exports)
- [ ] Tests passés

## 🆘 EN CAS DE PROBLÈME

### Erreur : "Can't connect to MySQL"
→ Vérifier que MySQL est démarré dans Laragon

### Erreur : "Table already exists"
→ Supprimer la table via HeidiSQL (voir étape 2)

### Erreur : "No module named..."
→ Installer les dépendances : `pip install -r requirements.txt`

### Erreur : "Port 8000 already in use"
→ Tuer le processus : `netstat -ano | findstr :8000` puis `taskkill /PID <PID> /F`

## 🎉 FÉLICITATIONS !

Une fois toutes les étapes complétées, votre projet IdeaLab est **100% opérationnel** avec :

✅ 10 apps Django fonctionnelles
✅ 40+ endpoints API
✅ Commentaires imbriqués
✅ Votes polymorphiques
✅ Bookmarks
✅ Analytics dashboards
✅ Export CSV/JSON/PDF
✅ Recherche globale
✅ Tests unitaires
✅ Documentation complète

**Prochaine étape :** Développer le frontend React ! 🚀
