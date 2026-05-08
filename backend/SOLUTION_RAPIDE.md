# ⚡ SOLUTION RAPIDE — 5 Étapes

## 🎯 Objectif
Corriger l'erreur de migration et démarrer IdeaLab

---

## 📝 Les 5 Étapes

### 1️⃣ Démarrer MySQL
- Ouvrir **Laragon**
- Cliquer **Start All**
- Attendre que tout soit vert ✅

### 2️⃣ Ouvrir HeidiSQL
- Dans Laragon : **Database** → **HeidiSQL**
- Dans la liste à gauche, cliquer sur **`idealab_db`** (PAS mysql !)

### 3️⃣ Exécuter le Script SQL
- Cliquer sur **Query** (en haut)
- Copier-coller ce code :

```sql
USE `idealab_db`;
DROP TABLE IF EXISTS `votes_vote`;
DELETE FROM `django_migrations` WHERE `app` = 'votes';
```

- Appuyer sur **F9** (ou cliquer ▶️)
- Vérifier le message : "Query OK"

### 4️⃣ Appliquer les Migrations
Dans le terminal PowerShell :

```bash
python manage.py migrate
```

Attendre le message : "Applying votes.0001_initial... OK"

### 5️⃣ Lancer le Serveur
```bash
python manage.py runserver
```

Ouvrir : **http://localhost:8000/api/**

---

## ✅ C'est Tout !

Si vous voyez la liste des endpoints API, **c'est gagné ! 🎉**

---

## 🆘 En Cas de Problème

### Erreur : "Can't connect to MySQL"
→ MySQL n'est pas démarré dans Laragon

### Erreur : "Table 'mysql.django_migrations' doesn't exist"
→ Vous n'avez pas sélectionné `idealab_db` dans HeidiSQL

### Erreur : "Table already exists"
→ Recommencer l'étape 3 (supprimer la table)

---

## 📚 Guides Détaillés

- **`GUIDE_HEIDISQL.md`** : Guide HeidiSQL avec captures
- **`START_HERE.md`** : Guide complet étape par étape
- **`API_TESTS.md`** : Tester tous les endpoints

---

## 🚀 Après le Démarrage

1. **Créer des données de test** (voir `START_HERE.md`)
2. **Tester les endpoints** (voir `API_TESTS.md`)
3. **Lancer Celery** pour les exports
4. **Lancer les tests** : `pytest`

---

**Bon courage ! 💪**
