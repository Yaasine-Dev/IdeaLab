# 🔧 Guide HeidiSQL — Correction Table votes_vote

## ❌ Erreur Actuelle

```
Erreur SQL (1146) : Table 'mysql.django_migrations' doesn't exist
```

**Cause :** Vous êtes connecté à la base `mysql` au lieu de `idealab_db`

---

## ✅ Solution Pas à Pas

### Étape 1 : Ouvrir HeidiSQL depuis Laragon

1. Ouvrir **Laragon**
2. Cliquer sur **Database** → **HeidiSQL**
3. HeidiSQL s'ouvre automatiquement

### Étape 2 : Sélectionner la bonne base de données

Dans HeidiSQL, vous verrez une liste de bases de données à gauche :

```
📁 localhost
  ├── 📁 information_schema
  ├── 📁 mysql
  ├── 📁 performance_schema
  ├── 📁 idealab_db          ← CLIQUER ICI !
  └── ...
```

**👉 Cliquer sur `idealab_db` pour la sélectionner**

### Étape 3 : Ouvrir l'onglet Query

1. En haut de HeidiSQL, cliquer sur **Query** (ou appuyer sur F9)
2. Une zone de texte s'ouvre pour écrire du SQL

### Étape 4 : Copier-coller le script SQL

Copier ce code SQL complet :

```sql
-- Sélectionner la base de données
USE `idealab_db`;

-- Supprimer la table votes_vote
DROP TABLE IF EXISTS `votes_vote`;

-- Supprimer l'entrée de migration
DELETE FROM `django_migrations` 
WHERE `app` = 'votes' AND `name` = '0001_initial';

-- Vérifier
SELECT '✅ Script exécuté avec succès !' AS Message;
```

### Étape 5 : Exécuter le script

1. Cliquer sur le bouton **Execute** (icône ▶️ bleue)
2. Ou appuyer sur **F9**

### Étape 6 : Vérifier le résultat

Vous devriez voir dans l'onglet "Messages" :

```
✅ Query OK, 0 rows affected
✅ Query OK, 1 row affected
✅ Script exécuté avec succès !
```

---

## 🚀 Étape Suivante : Appliquer les Migrations

Retourner dans le terminal PowerShell :

```bash
cd c:\Users\najoua\Desktop\pythonidealab\IdeaLab\backend
python manage.py migrate
```

Vous devriez voir :

```
Operations to perform:
  Apply all migrations: accounts, admin, auth, bookmarks, comments, contenttypes, feedbacks, ideas, notifications, sessions, token_blacklist, votes
Running migrations:
  Applying votes.0001_initial... OK
```

---

## ✅ Vérification Finale

```bash
# Vérifier qu'il n'y a pas d'erreurs
python manage.py check

# Lancer le serveur
python manage.py runserver
```

Ouvrir le navigateur : **http://localhost:8000/api/**

Vous devriez voir la liste des endpoints disponibles !

---

## 🆘 Si Ça Ne Marche Toujours Pas

### Option 1 : Vérifier la connexion à la base

Dans HeidiSQL, exécuter :

```sql
SELECT DATABASE();
```

Résultat attendu : `idealab_db`

Si vous voyez `mysql` ou autre chose, c'est que vous n'êtes pas dans la bonne base.

### Option 2 : Vérifier que la table existe

```sql
USE idealab_db;
SHOW TABLES LIKE 'votes_vote';
```

Si la table existe, elle s'affichera. Sinon, rien ne s'affiche.

### Option 3 : Supprimer manuellement via l'interface

1. Dans HeidiSQL, sélectionner `idealab_db`
2. Chercher la table `votes_vote` dans la liste
3. Clic droit → **Drop**
4. Confirmer

Puis dans l'onglet Query :

```sql
DELETE FROM `django_migrations` 
WHERE `app` = 'votes' AND `name` = '0001_initial';
```

---

## 📋 Checklist

- [ ] HeidiSQL ouvert depuis Laragon
- [ ] Base de données `idealab_db` sélectionnée (pas `mysql`)
- [ ] Script SQL copié dans l'onglet Query
- [ ] Script exécuté avec succès (F9)
- [ ] Message de confirmation affiché
- [ ] Migrations appliquées (`python manage.py migrate`)
- [ ] Serveur lancé (`python manage.py runserver`)
- [ ] API accessible (http://localhost:8000/api/)

---

## 🎯 Résumé Visuel

```
┌─────────────────────────────────────────┐
│ HeidiSQL                                │
├─────────────────────────────────────────┤
│ Fichier  Édition  Outils  Query  Aide  │
├──────────┬──────────────────────────────┤
│ 📁 mysql │ USE `idealab_db`;            │
│ 📁 idealab_db ← CLIQUER ICI             │
│   ├─ accounts_user                      │
│   ├─ ideas_idea                         │
│   ├─ votes_vote  ← À SUPPRIMER          │
│   └─ ...                                │
│                                         │
│ [▶️ Execute (F9)]                       │
└─────────────────────────────────────────┘
```

---

## ✅ Après la Correction

Une fois les migrations appliquées, vous aurez accès à tous les nouveaux endpoints :

- ✅ `/api/comments/` - Commentaires imbriqués
- ✅ `/api/votes/` - Votes polymorphiques
- ✅ `/api/bookmarks/` - Favoris
- ✅ `/api/analytics/entrepreneur/` - Dashboard
- ✅ `/api/export/csv/<id>/` - Export CSV
- ✅ `/api/search/?q=test` - Recherche globale

**Consultez `API_TESTS.md` pour tester tous les endpoints ! 🚀**
