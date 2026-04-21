# IdeaLab

Full-stack idea management platform with Django backend and React frontend.

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- MySQL Server
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/Yaasine-Dev/IdeaLab.git
cd IdeaLab

# Backend setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Create MySQL database: 'idealab'
# Update config/settings.py with your MySQL credentials if needed

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional

# Frontend setup
cd ../frontend/idealab
npm install
```

### Run Development Servers

```bash
# Terminal 1: Backend
cd backend
venv\Scripts\activate
python manage.py runserver

# Terminal 2: Frontend
cd frontend/idealab
npm run dev
```

### Access

- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:8000
- API Docs: http://127.0.0.1:8000/api/schema/swagger-ui/

## Tech Stack

- **Backend**: Django 5.2, DRF, MySQL, JWT
- **Frontend**: React 19, Vite, Tailwind CSS
- **Features**: Authentication, Ideas, Feedback, Bookmarks, Analytics, Notifications

## Database Config

Update `backend/config/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'idealab',
        'USER': 'root',  # Change if needed
        'PASSWORD': '',  # Add password if set
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```

## Production Build

```bash
# Frontend
cd frontend/idealab
npm run build

# Backend
cd backend
python manage.py collectstatic
```

## Troubleshooting

- **MySQL connection**: Ensure MySQL is running and database exists
- **CORS errors**: Check if both servers are running on correct ports
- **Dependencies**: Delete node_modules/venv and reinstall if issues persist
