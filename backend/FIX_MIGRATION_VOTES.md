# 🔧 Guide de Résolution - Problème Migration Votes

## ❌ Problème
La table `votes_vote` existe déjà dans la base de données avec une structure incompatible (UUID au lieu de BigAutoField).

## ✅ Solution

### Étape 1 : Démarrer MySQL dans Laragon
1. Ouvrir **Laragon**
2. Cliquer sur **Start All**
3. Vérifier que MySQL est bien démarré (icône verte)

### Étape 2 : Supprimer la table votes_vote

**Option A : Via HeidiSQL (inclus dans Laragon)**
1. Ouvrir HeidiSQL depuis Laragon
2. Se connecter à la base de données `idealab_db`
3. Exécuter cette requête SQL :

```sql
DROP TABLE IF EXISTS votes_vote;
DELETE FROM django_migrations WHERE app='votes' AND name='0001_initial';
```

**Option B : Via le script Python**
```bash
python fix_votes_table.py
```

### Étape 3 : Appliquer les migrations
```bash
python manage.py migrate
```

### Étape 4 : Vérifier que tout fonctionne
```bash
python manage.py check
python manage.py runserver
```

## 📝 Explication du Problème

Le modèle `Vote` a été créé initialement avec un UUID comme clé primaire :
```python
id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
```

Mais le modèle `User` utilise un `BigAutoField` (entier) comme clé primaire par défaut.

Quand on essaie de créer une ForeignKey de Vote vers User, MySQL refuse car les types sont incompatibles :
- `user_id` dans Vote → devrait être BIGINT
- `id` dans User → est BIGINT

La solution a été de supprimer l'UUID de Vote et d'utiliser l'AutoField par défaut de Django.

## ✅ Après la Résolution

Une fois les migrations appliquées avec succès, vous pourrez :

1. **Tester les endpoints :**
   - http://localhost:8000/api/votes/
   - http://localhost:8000/api/comments/
   - http://localhost:8000/api/bookmarks/

2. **Lancer les tests :**
   ```bash
   pytest
   ```

3. **Créer des données de test :**
   ```bash
   python manage.py shell
   ```

## 🆘 Si le Problème Persiste

Si vous rencontrez toujours des erreurs :

1. Vérifier que MySQL est bien démarré dans Laragon
2. Vérifier les identifiants dans `.env` :
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3307
   DB_USER=root
   DB_PASSWORD=
   ```
3. Supprimer manuellement la table via HeidiSQL
4. Réessayer les migrations

## 📞 Contact

En cas de problème persistant, ouvrir une issue sur GitHub avec :
- Le message d'erreur complet
- La version de MySQL
- Le contenu du fichier `.env`
