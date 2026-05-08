# 📖 Guide d'Installation IdeaLab

Ce guide vous accompagne pas à pas dans l'installation et la configuration d'IdeaLab.

## 📋 Prérequis

### Logiciels requis

- **Python 3.10+** : [Télécharger Python](https://www.python.org/downloads/)
- **Laragon** : [Télécharger Laragon](https://laragon.org/download/)
- **Node.js 18+** : [Télécharger Node.js](https://nodejs.org/)
- **Git** : [Télécharger Git](https://git-scm.com/downloads/)

### Vérification des installations

```bash
python --version  # Python 3.10+
node --version    # Node 18+
git --version     # Git 2.x+
```

## 🚀 Installation Backend (Django)

### 1. Cloner le repository

```bash
git clone https://github.com/Yaasine-Dev/IdeaLab.git
cd IdeaLab/backend
```

### 2. Créer un environnement virtuel

**Windows :**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac :**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Installer les dépendances

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configuration Laragon

1. Démarrer Laragon
2. Cliquer sur **Start All**
3. Vérifier que MySQL et Redis sont actifs

### 5. Créer la base de données

Ouvrir **HeidiSQL** (inclus dans Laragon) :

1. Se connecter à MySQL (root, sans mot de passe)
2. Exécuter :

```sql
CREATE DATABASE idealab_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6. Configuration du fichier .env

Copier `.env.example` en `.env` :

```bash
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac
```

Modifier `.env` selon votre configuration :

```env
SECRET_KEY=idealab-secret-key-change-in-prod
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=idealab_db
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3307  # Port MySQL de Laragon

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 7. Migrations de la base de données

```bash
python manage.py makemigrations
python manage.py migrate
```

### 8. Créer un superutilisateur

```bash
python manage.py createsuperuser
```

Remplir les informations :
- Username : `admin`
- Email : `admin@idealab.com`
- Password : `admin123` (ou votre choix)
- Role : `admin`

### 9. Lancer Redis

Redis est déjà inclus dans Laragon. Vérifier qu'il est actif dans l'interface Laragon.

### 10. Lancer Celery

**Ouvrir un nouveau terminal** et activer l'environnement virtuel :

```bash
cd IdeaLab/backend
venv\Scripts\activate
celery -A config worker -l info
```

### 11. Lancer le serveur Django

**Dans le terminal principal** :

```bash
python manage.py runserver
```

✅ **Backend accessible sur** : `http://localhost:8000`

### 12. Tester l'API

Ouvrir un navigateur et accéder à :
- Admin : `http://localhost:8000/admin/`
- API Root : `http://localhost:8000/api/`

## 🎨 Installation Frontend (React)

### 1. Naviguer vers le dossier frontend

```bash
cd ../frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Créer un fichier `.env` :

```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

✅ **Frontend accessible sur** : `http://localhost:5173`

## 🧪 Tests

### Tests Backend

```bash
cd backend
pytest
```

### Tests avec couverture

```bash
pytest --cov=. --cov-report=html
```

Le rapport sera généré dans `htmlcov/index.html`

## 📊 Données de test

### Créer des données de test

```bash
python manage.py shell
```

```python
from accounts.models import User, UserProfile
from ideas.models import Idea

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

print("✅ Données de test créées avec succès !")
```

## 🔧 Dépannage

### Erreur : "No module named 'MySQLdb'"

```bash
pip install mysqlclient
```

Si l'installation échoue, installer les outils de build :
- Windows : [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

### Erreur : "Redis connection refused"

Vérifier que Redis est actif dans Laragon. Sinon, le démarrer manuellement.

### Erreur : "Port 8000 already in use"

Tuer le processus utilisant le port :

**Windows :**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Linux/Mac :**
```bash
lsof -ti:8000 | xargs kill -9
```

### Erreur : "Access denied for user 'root'@'localhost'"

Vérifier les identifiants MySQL dans `.env` et s'assurer que MySQL est actif dans Laragon.

## 📚 Ressources

- [Documentation Django](https://docs.djangoproject.com/)
- [Documentation DRF](https://www.django-rest-framework.org/)
- [Documentation React](https://react.dev/)
- [Documentation Vite](https://vitejs.dev/)

## 🆘 Support

En cas de problème :
1. Vérifier les logs dans le terminal
2. Consulter la documentation
3. Ouvrir une issue sur [GitHub](https://github.com/Yaasine-Dev/IdeaLab/issues)

## ✅ Checklist d'installation

- [ ] Python 3.10+ installé
- [ ] Laragon installé et démarré
- [ ] Repository cloné
- [ ] Environnement virtuel créé et activé
- [ ] Dépendances installées
- [ ] Base de données créée
- [ ] Fichier .env configuré
- [ ] Migrations effectuées
- [ ] Superutilisateur créé
- [ ] Redis actif
- [ ] Celery lancé
- [ ] Serveur Django lancé
- [ ] Frontend installé et lancé
- [ ] Tests passés avec succès

🎉 **Félicitations ! IdeaLab est maintenant opérationnel !**
